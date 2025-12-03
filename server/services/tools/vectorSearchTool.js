import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

export function createVectorSearchTool(vectorStore) {
  return new DynamicStructuredTool({
    name: 'vector_search',
    description:
      'Search through uploaded documents to find relevant information. Use this when the user asks about their uploaded PDFs or audio files.',
    schema: z.object({
      query: z.string().describe('The search query to find in documents'),
    }),
    func: async ({ query }) => {
      try {
        const results = await vectorStore.similaritySearch(query, 3);

        if (results.length === 0) {
          return JSON.stringify({
            found: false,
            message: 'No relevant documents found',
          });
        }

        return JSON.stringify({
          found: true,
          results: results.map((doc) => doc.pageContent),
          source: 'documents',
        });
      } catch (error) {
        return JSON.stringify({
          found: false,
          message: `Error searching documents: ${error.message}`,
        });
      }
    },
  });
}
