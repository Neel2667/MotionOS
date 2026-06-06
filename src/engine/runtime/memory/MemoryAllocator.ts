import { MemoryArena, MemoryHandle } from './MemoryArena';

export class MemoryStatistics {
  public totalAllocated: number = 0;
  public totalUsed: number = 0;
  public allocationCount: number = 0;
}

export class MemorySnapshot {
  public timestamp: number = Date.now();
  public stats: MemoryStatistics = new MemoryStatistics();
}

export class MemoryPage {
  public id: number;
  public arena: MemoryArena;
  public isActive: boolean = false;
  
  constructor(id: number, size: number) {
    this.id = id;
    this.arena = new MemoryArena(size);
  }
}

export class MemoryPool {
  public pages: MemoryPage[] = [];
  public pageSize: number;

  constructor(pageSize: number) {
    this.pageSize = pageSize;
  }

  allocatePage(): MemoryPage {
    const page = new MemoryPage(this.pages.length, this.pageSize);
    this.pages.push(page);
    return page;
  }

  reset() {
    for (const page of this.pages) {
      page.arena.reset();
      page.isActive = false;
    }
  }
}

export class MemoryDebugger {
  dump(stats: MemoryStatistics) {
    console.log(`[Memory] Allocated: ${stats.totalAllocated}B, Used: ${stats.totalUsed}B, Count: ${stats.allocationCount}`);
  }
}

export class MemoryAllocator {
  public pool: MemoryPool;
  public activePage: MemoryPage;
  public stats: MemoryStatistics = new MemoryStatistics();
  public debugger: MemoryDebugger = new MemoryDebugger();

  constructor(pageSize: number = 1024 * 1024) {
    this.pool = new MemoryPool(pageSize);
    this.activePage = this.pool.allocatePage();
    this.activePage.isActive = true;
    this.stats.totalAllocated += pageSize * 4;
  }

  allocate(size: number): MemoryHandle {
    let handle = this.activePage.arena.allocate(size);
    if (!handle) {
      // Allocate new page
      this.activePage = this.pool.allocatePage();
      this.activePage.isActive = true;
      this.stats.totalAllocated += this.pool.pageSize * 4;
      handle = this.activePage.arena.allocate(size);
      if (!handle) throw new Error("Out of Memory in Page");
    }
    
    this.stats.totalUsed += size * 4;
    this.stats.allocationCount++;
    return handle;
  }
  
  snapshot(): MemorySnapshot {
    const snap = new MemorySnapshot();
    snap.stats = { ...this.stats };
    return snap;
  }
}
