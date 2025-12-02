import { QdrantVectorStore } from '@langchain/qdrant';
import { OpenAIEmbeddings } from '@langchain/openai';
import { OPENAI_API_KEY, QDRANT_URL, QDRANT_API_KEY } from '../constants.js';

export class QdrantVectorStoreService {
  constructor(vectorStore) {
    this.vectorStore = vectorStore;
  }

  static async create() {
    const embeddings = new OpenAIEmbeddings({
      model: 'text-embedding-3-large',
      apiKey: OPENAI_API_KEY,
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: QDRANT_URL,
        apiKey: QDRANT_API_KEY,
        collectionName: 'rag-chatbot-db',
      },
    );

    return new QdrantVectorStoreService(vectorStore);
  }
}
