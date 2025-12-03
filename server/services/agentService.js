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
      model: 'gpt-4',
      temperature: 0,
    });
  }

  async processQuery(message) {
    const tools = [
      createVectorSearchTool(this.vectorStore),
      createGeneralKnowledgeTool(),
    ];

    const agent = await createReactAgent({
      llm: this.llm,
      tools,
      prompt: `You are a helpful AI assistant. You MUST use the available tools to answer questions.
      
      IMPORTANT RULES:
      1. ALWAYS use vector_search tool first to check uploaded documents
      2. If vector_search returns "found: false", then use general_knowledge tool
      3. NEVER answer directly without using tools
      4. Base your answer on the tool results`,
    });

    const result = await agent.invoke({
      messages: [{ role: 'user', content: message }],
    });

    const { reasoning, toolsUsed, source } = this.extractAgentTrace(result.messages);

    return {
      answer: result.messages[result.messages.length - 1]?.content || 'No response',
      reasoning,
      toolsUsed,
      source,
    };
  }

  extractAgentTrace(messages) {
    const reasoning = messages
      .filter((m) => m.tool_calls?.length > 0)
      .flatMap((m) =>
        m.tool_calls.map((tc) => ({
          action: tc.name,
          input: tc.args,
          output: messages[messages.indexOf(m) + 1]?.content || '',
        }))
      );

    const toolsUsed = [...new Set(reasoning.map((r) => r.action))];
    const source = toolsUsed.includes('vector_search') ? 'documents' : 'AI knowledge';

    return { reasoning, toolsUsed, source };
  }
}
