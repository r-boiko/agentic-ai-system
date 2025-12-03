import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { OPENAI_API_KEY } from '../constants.js';
import { createVectorSearchTool } from './tools/vectorSearchTool.js';
import { createGeneralKnowledgeTool } from './tools/generalKnowledgeTool.js';

export class AgentService {
  constructor(vectorStore) {
    this.vectorStore = vectorStore;
    this.llm = new ChatOpenAI({
      apiKey: OPENAI_API_KEY,
      model: 'gpt-4o-mini',
      temperature: 0,
    });
  }

  async processQuery(message) {
    const tools = [
      createVectorSearchTool(this.vectorStore),
      createGeneralKnowledgeTool(),
    ];

    const systemPrompt = `
      You are a helpful AI assistant. You MUST use the available tools to answer questions.

      RULES:
      1. ALWAYS call vector_search first to inspect uploaded documents.
      2. If vector_search returns { found: false }, then call general_knowledge.
      3. NEVER answer directly without calling a tool.
      4. Base your final answer ONLY on tool results.
    `;

    const agent = await createReactAgent({
      llm: this.llm,
      tools,
      prompt: systemPrompt,
    });

    const result = await agent.invoke({
      messages: [{ role: 'user', content: message }],
    });

    const { toolsUsed, source } = this.extractAgentTrace(result.messages);

    return {
      answer: result.messages.at(-1)?.content ?? 'No response',
      toolsUsed,
      source,
    };
  }

  extractAgentTrace(messages) {
    const toolsUsed = [
      ...new Set(
        messages
          .filter((m) => m.tool_calls?.length)
          .flatMap((m) => m.tool_calls.map((tc) => tc.name)),
      ),
    ];

    return {
      toolsUsed,
      source: toolsUsed.includes('vector_search')
        ? 'documents'
        : 'AI knowledge',
    };
  }
}
