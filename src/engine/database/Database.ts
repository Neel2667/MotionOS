import { Project } from '../project/Project';
import { LibraryAsset } from '../assets/AssetMetadata';

export interface DatabaseRecord<T> {
  id: string;
  data: T;
  createdAt: number;
  updatedAt: number;
}

export type MotionDNA = {
  id: string;
  name: string;
  styleArchetype: string;
  colors: string[];
  motionModifiers: any;
  font: string;
  createdAt: number;
};

export class Database {
  private static instance: Database | null = null;

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    if (!localStorage.getItem('mos_db_initialized')) {
      // Seed default values
      localStorage.setItem('mos_db_initialized', 'true');
      localStorage.setItem('mos_projects_db', JSON.stringify([]));
      localStorage.setItem('mos_assets_db', JSON.stringify([]));
      localStorage.setItem('mos_motiondna_db', JSON.stringify(this.getSeedMotionDNA()));
      localStorage.setItem('mos_snapshots_db', JSON.stringify([]));
      localStorage.setItem('mos_comments_db', JSON.stringify([]));
      localStorage.setItem('mos_activity_db', JSON.stringify(this.getSeedActivities()));
    }
  }

  public getTable<T>(tableName: string): DatabaseRecord<T>[] {
    const data = localStorage.getItem(`mos_${tableName}_db`);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  public saveTable<T>(tableName: string, records: DatabaseRecord<T>[]): void {
    localStorage.setItem(`mos_${tableName}_db`, JSON.stringify(records));
  }

  public insert<T>(tableName: string, id: string, data: T): DatabaseRecord<T> {
    const records = this.getTable<T>(tableName);
    const now = Date.now();
    const newRecord: DatabaseRecord<T> = {
      id,
      data,
      createdAt: now,
      updatedAt: now,
    };
    records.push(newRecord);
    this.saveTable(tableName, records);
    return newRecord;
  }

  public update<T>(tableName: string, id: string, data: Partial<T>): boolean {
    const records = this.getTable<T>(tableName);
    const index = records.findIndex(r => r.id === id);
    if (index === -1) return false;
    
    records[index].data = { ...records[index].data, ...data };
    records[index].updatedAt = Date.now();
    this.saveTable(tableName, records);
    return true;
  }

  public delete(tableName: string, id: string): boolean {
    const records = this.getTable<any>(tableName);
    const filtered = records.filter(r => r.id !== id);
    if (records.length === filtered.length) return false;
    this.saveTable(tableName, filtered);
    return true;
  }

  private getSeedMotionDNA(): DatabaseRecord<MotionDNA>[] {
    const now = Date.now();
    return [
      {
        id: 'dna_luxury_gold',
        createdAt: now,
        updatedAt: now,
        data: {
          id: 'dna_luxury_gold',
          name: 'Liquid Gold Corporate Signature',
          styleArchetype: 'Luxury',
          colors: ['#FFD700', '#111111', '#FFFFFF', '#AAAAAA', '#D4AF37'],
          motionModifiers: { scaleSpeed: 0.8, cameraZoom: 15, keyframeInterval: 2 },
          font: 'Cinzel',
          createdAt: now,
        },
      },
      {
        id: 'dna_tech_cyber',
        createdAt: now,
        updatedAt: now,
        data: {
          id: 'dna_tech_cyber',
          name: 'Cyberpunk Neon Pulse',
          styleArchetype: 'Technology',
          colors: ['#00FFFF', '#FF00FF', '#121212', '#232323', '#00FF00'],
          motionModifiers: { scaleSpeed: 1.5, cameraZoom: 30, keyframeInterval: 1 },
          font: 'JetBrains Mono',
          createdAt: now - 3600000,
        },
      },
      {
        id: 'dna_sports_bold',
        createdAt: now,
        updatedAt: now,
        data: {
          id: 'dna_sports_bold',
          name: 'Hyperactive Redline Sports',
          styleArchetype: 'Sports',
          colors: ['#FF0000', '#000000', '#F5F5F5', '#E0E0E0', '#FFA500'],
          motionModifiers: { scaleSpeed: 2.2, cameraZoom: 50, keyframeInterval: 0.5 },
          font: 'Oswald',
          createdAt: now - 7200000,
        },
      }
    ];
  }

  private getSeedActivities(): any[] {
    const now = Date.now();
    return [
      {
        id: 'act_1',
        timestamp: now - 1800000,
        userId: 'user_1',
        userName: 'Alexander Wright',
        userRole: 'Owner',
        type: 'PROJECT_CREATE',
        projectName: 'Untitled Motion Deck',
        details: 'Project workspace initialized natively.',
      },
      {
        id: 'act_2',
        timestamp: now - 1200000,
        userId: 'user_2',
        userName: 'Sophia Mercer',
        userRole: 'Editor',
        type: 'ASSET_IMPORT',
        projectName: 'Untitled Motion Deck',
        details: 'Ingested raw SVG asset (Mercedes Logo spec).',
      }
    ];
  }
}

export const globalDatabase = Database.getInstance();
