import { ChatOpenAI } from '@langchain/openai';
import { OPENAI_API_KEY } from '../constants.js';

export class EvaluationService {
  constructor() {
    this.llm = new ChatOpenAI({
      apiKey: OPENAI_API_KEY,
      model: 'gpt-3.5-turbo',
      temperature: 0,
    });
  }

  async evaluateResponse(question, answer, toolsUsed) {
    const prompt = `
      Evaluate the following AI response on a scale of 1-5 for each criterion:
      
      Question: ${question}
      Answer: ${answer}
      Tools Used: ${toolsUsed.join(', ')}
      
      Provide scores (1-5) for:
      1. Relevance: How relevant is the answer to the question?
      2. Clarity: How clear and understandable is the answer?
      3. Tool Effectiveness: Were the right tools used?
      
      Respond in JSON format:
      {
        "relevance": <score>,
        "clarity": <score>,
        "toolEffectiveness": <score>,
        "feedback": "<brief explanation>"
      }
    `;

    const response = await this.llm.invoke(prompt);

    try {
      return JSON.parse(response.content);
    } catch {
      return {
        relevance: 3,
        clarity: 3,
        toolEffectiveness: 3,
        feedback: 'Unable to parse evaluation',
      };
    }
  }
}
