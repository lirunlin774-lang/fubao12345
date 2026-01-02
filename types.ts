
export interface KnowledgeEntry {
  id: string;
  title: string;
  content: string; 
  isActive: boolean;
  type: 'product' | 'policy' | 'ecosystem' | 'file' | 'other';
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  uploadDate: string;
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  BENCHMARK = 'benchmark',
  EVALUATION = 'evaluation', // 新增：险企评价板块
  STRATEGY = 'strategy',
  OBJECTION = 'objection',
  THEORY = 'theory',
  CONTEXT = 'context',
  MEME = 'meme',
  COMEDY = 'comedy'
}
