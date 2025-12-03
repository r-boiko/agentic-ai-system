import { ChatOpenAI } from '@langchain/openai';
import { AgentExecutor, createReactAgent } from 'langchain/agents';
import { ChatPromptTemplate } from '@langchain/core/prompts';
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
    // Create tools
    const tools = [
      createVectorSearchTool(this.vectorStore),
      createGeneralKnowledgeTool(),
    ];

    // Create ReAct prompt
    const prompt = ChatPromptTemplate.fromTemplate(`
      You are a helpful AI assistant with access to tools.
      
      Answer the user's question using the available tools.
      First, try to search uploaded documents. If no relevant information is found, use general knowledge.
      
      TOOLS:
      {tools}
      
      TOOL NAMES: {tool_names}
      
      Question: {input}
      
      Thought: {agent_scratchpad}
    `);

    // Create agent
    const agent = await createReactAgent({
      llm: this.llm,
      tools,
      prompt,
    });

    // Create executor
    const executor = new AgentExecutor({
      agent,
      tools,
      verbose: true,
      returnIntermediateSteps: true,
    });

    // Execute
    const result = await executor.invoke({ input: message });

    // Extract reasoning and tools used
    const reasoning = result.intermediateSteps.map((step) => ({
      action: step.action.tool,
      input: step.action.toolInput,
      output: step.observation,
    }));

    const toolsUsed = [...new Set(reasoning.map((r) => r.action))];

    return {
      answer: result.output,
      reasoning,
      toolsUsed,
      source: this.determineSource(reasoning),
    };
  }

  determineSource(reasoning) {
    const lastStep = reasoning[reasoning.length - 1];
    if (!lastStep) return 'unknown';

    try {
      const output = JSON.parse(lastStep.output);
      return output.source || 'unknown';
    } catch {
      return 'unknown';
    }
  }
}
