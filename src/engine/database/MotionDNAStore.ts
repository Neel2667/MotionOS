import { globalDatabase, DatabaseRecord, MotionDNA } from './Database';

export class MotionDNAStore {
  public getAll(): MotionDNA[] {
    return globalDatabase.getTable<MotionDNA>('motiondna').map(r => r.data);
  }

  public getById(id: string): MotionDNA | null {
    const list = globalDatabase.getTable<MotionDNA>('motiondna');
    const match = list.find(r => r.id === id);
    return match ? match.data : null;
  }

  public saveDNA(dna: Omit<MotionDNA, 'createdAt'>): MotionDNA {
    const records = globalDatabase.getTable<MotionDNA>('motiondna');
    const index = records.findIndex(r => r.id === dna.id);
    
    const now = Date.now();
    const finalData: MotionDNA = {
      ...dna,
      createdAt: index !== -1 ? records[index].data.createdAt : now
    };

    if (index !== -1) {
      records[index].data = finalData;
      records[index].updatedAt = now;
      globalDatabase.saveTable('motiondna', records);
    } else {
      globalDatabase.insert<MotionDNA>('motiondna', dna.id, finalData);
    }
    return finalData;
  }

  public deleteDNA(id: string): boolean {
    return globalDatabase.delete('motiondna', id);
  }

  public queryByStyle(styleArchetype: string): MotionDNA[] {
    const term = styleArchetype.toLowerCase();
    return this.getAll().filter(dna => dna.styleArchetype.toLowerCase() === term);
  }
}

export const globalMotionDNAStore = new MotionDNAStore();
