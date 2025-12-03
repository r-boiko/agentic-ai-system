import { DynamicStructuredTool } from '@langchain/core/tools';
import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import { OPENAI_API_KEY } from '../../constants.js';

export function createGeneralKnowledgeTool() {
  const llm = new ChatOpenAI({
    apiKey: OPENAI_API_KEY,
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
  });

  return new DynamicStructuredTool({
    name: 'general_knowledge',
    description: 'Answer questions using AI general knowledge. Use this when documents do not contain the answer or for general questions.',
    schema: z.object({
      question: z.string().describe('The question to answer using general knowledge'),
    }),
    func: async ({ question }) => {
      const response = await llm.invoke(question);
      return JSON.stringify({
        answer: response.content,
        source: 'AI knowledge'
      });
    },
  });
}
