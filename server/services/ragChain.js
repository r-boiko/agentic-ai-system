import { ChatOpenAI } from '@langchain/openai';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { OPENAI_API_KEY } from '../constants.js';

export class RagChainService {
  async getResponse(message, vectorStore) {
    if (!message || !vectorStore) {
      console.log('RAG error. Message or VectorStore is empty.');
      return null;
    }

    try {
      const llm = new ChatOpenAI({
        apiKey: OPENAI_API_KEY,
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
      });

      const retriever = vectorStore.asRetriever({ k: 3 });

      const prompt = ChatPromptTemplate.fromTemplate(`
        Answer the question based on the provided context.
        
        Context: {context}
        
        Question: {input}
      `);

      const documentChain = await createStuffDocumentsChain({
        llm,
        prompt,
      });

      const retrievalChain = await createRetrievalChain({
        combineDocsChain: documentChain,
        retriever,
      });

      const response = await retrievalChain.invoke({ input: message });
      return response.answer;
    } catch (e) {
      console.log('RAG catch error', e);
    }
  }
}