export interface AgentTrace {
  action: string;
  input: any;
  output: string;
}

export interface Evaluation {
  relevance: number;
  clarity: number;
  toolEffectiveness: number;
  feedback: string;
}

export interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  reasoning?: AgentTrace[];
  toolsUsed?: string[];
  source?: string;
  evaluation?: Evaluation;
}

export interface DocumentInfo {
  name: string;
  size: number;
  uploadedAt: Date;
  status: 'processing' | 'ready' | 'error';
}