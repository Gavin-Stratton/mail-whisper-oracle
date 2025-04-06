
export interface EmailSource {
  id: string;
  path: string;
  type: 'pst' | 'olm' | 'mbox' | 'other';
  name: string;
  size: number;
}

export interface FolderSource {
  id: string;
  path: string;
  name: string;
}

export interface ModelFile {
  id: string;
  path: string;
  name: string;
  size: number;
}

export interface TrainingStatus {
  status: 'idle' | 'preparing' | 'training' | 'completed' | 'failed';
  progress: number;
  message: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}
