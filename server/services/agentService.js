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

    const agentExecutor = createReactAgent({
      llm: this.llm,
      tools,
      messageModifier: `You are a helpful AI assistant. You MUST use the available tools to answer questions.
      
      IMPORTANT RULES:
      1. ALWAYS use vector_search tool first to check uploaded documents
      2. If vector_search returns "found: false", then use general_knowledge tool
      3. NEVER answer directly without using tools
      4. Base your answer on the tool results`,
    });

    const reasoning = [];
    const toolsUsed = new Set();
    
    const result = await agentExecutor.invoke({
      messages: [{ role: 'user', content: message }],
    });

    const messages = result.messages || [];
    const lastMessage = messages[messages.length - 1];
    const answer = lastMessage?.content || 'No response generated';

    // Extract tool calls and results
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      
      // Check for tool calls
      if (msg.tool_calls && msg.tool_calls.length > 0) {
        for (const toolCall of msg.tool_calls) {
          toolsUsed.add(toolCall.name);
          
          // Find the corresponding tool result in next messages
          let toolOutput = 'Tool executed';
          if (i + 1 < messages.length && messages[i + 1].content) {
            toolOutput = messages[i + 1].content;
          }
          
          reasoning.push({
            action: toolCall.name,
            input: toolCall.args,
            output: toolOutput,
          });
        }
      }
    }

    return {
      answer,
      reasoning,
      toolsUsed: Array.from(toolsUsed),
      source: this.determineSource(reasoning),
    };
  }

  determineSource(reasoning) {
    if (reasoning.length === 0) return 'unknown';
    
    const lastStep = reasoning[reasoning.length - 1];
    
    // Check if vector_search was used
    if (reasoning.some(step => step.action === 'vector_search')) {
      try {
        const output = JSON.parse(lastStep.output);
        if (output.found) return 'documents';
      } catch {}
    }
    
    // Check if general_knowledge was used
    if (reasoning.some(step => step.action === 'general_knowledge')) {
      return 'AI knowledge';
    }
    
    return 'unknown';
  }
}
