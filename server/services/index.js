import { QdrantVectorStoreService } from './qdrantVectorStore.js';
import { RagChainService } from './ragChain.js';
import { PdfLoaderService } from './pdfLoader.js';
import { TextSplitterService } from './textSplitter.js';
import { AudioTranscriberService } from './audioTranscriber.js';
import { AgentService } from './agentService.js';
import { EvaluationService } from './evaluationService.js';

const qdrantService = await QdrantVectorStoreService.create();
const ragService = new RagChainService();
const pdfService = new PdfLoaderService();
const textSplitterService = new TextSplitterService();
const audioService = new AudioTranscriberService();
const agentService = new AgentService(qdrantService.vectorStore);
const evaluationService = new EvaluationService();

export const services = {
  qdrantService,
  ragService,
  pdfService,
  textSplitterService,
  audioService,
  agentService,
  evaluationService,
};
