import { QdrantVectorStoreService } from './qdrantVectorStore.js';
import { RagChainService } from './ragChain.js';
import { PdfLoaderService } from './pdfLoader.js';
import { TextSplitterService } from './textSplitter.js';
import { AudioTranscriberService } from './audioTranscriber.js';

const qdrantService = await QdrantVectorStoreService.create();
const ragService = new RagChainService();
const pdfService = new PdfLoaderService();
const textSplitterService = new TextSplitterService();
const audioService = new AudioTranscriberService();

export const services = {
  qdrantService,
  ragService,
  pdfService,
  textSplitterService,
  audioService,
};
