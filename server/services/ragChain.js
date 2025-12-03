import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
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
      const docs = await retriever.getRelevantDocuments(message);
      
      const context = docs.map(doc => doc.pageContent).join('\n\n');

      const prompt = ChatPromptTemplate.fromTemplate(`
        Answer the question based on the provided context.
        
        Context: {context}
        
        Question: {input}
      `);

      const chain = prompt.pipe(llm).pipe(new StringOutputParser());
      const response = await chain.invoke({ context, input: message });
      
      return response;
    } catch (e) {
      console.log('RAG catch error', e);
    }
  }
}