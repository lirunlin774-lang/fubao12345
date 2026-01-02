
export interface KnowledgeEntry {
  id: string;
  title: string;
  content: string; // 文本内容或Base64预览
  isActive: boolean;
  type: 'product' | 'policy' | 'ecosystem' | 'file' | 'other';
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  uploadDate: string;
}

export interface NewsItem {
  title: string;
  source: string;
  url: string;
  snippet: string;
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  STRATEGY = 'strategy',
  OBJECTION = 'objection',
  THEORY = 'theory',
  CONTEXT = 'context',
  MEME = 'meme',
  COMEDY = 'comedy'
}
