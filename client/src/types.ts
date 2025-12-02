export interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface DocumentInfo {
  name: string;
  size: number;
  uploadedAt: Date;
  status: 'processing' | 'ready' | 'error';
}