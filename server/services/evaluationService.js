import { ChatOpenAI } from '@langchain/openai';
import { OPENAI_API_KEY } from '../constants.js';

export class EvaluationService {
  constructor() {
    this.llm = new ChatOpenAI({
      apiKey: OPENAI_API_KEY,
      model: 'gpt-4o-mini',
      temperature: 0,
    });
  }

  async evaluateResponse(question, answer, toolsUsed) {
    const prompt = `
      You are an AI evaluation assistant. Rate the answer using ONLY the criteria below.
      Return valid raw JSON only (no backticks, no markdown).
      
      Question: ${question}
      Answer: ${answer}
      Tools Used: ${toolsUsed.join(', ')}
      
      Rate on the following (1 = poor, 5 = excellent):
      1. relevance — Is the answer related to the question?
      2. clarity — Is the answer easy to read & understand?
      3. toolEffectiveness — Were the correct tools used?
      
      Respond ONLY in this JSON structure:
      {
        "relevance": <1-5>,
        "clarity": <1-5>,
        "toolEffectiveness": <1-5>,
        "feedback": "<brief explanation>"
      }
    `;

    const response = await this.llm.invoke(prompt);

    try {
      const parsed = JSON.parse(response.content);
      return {
        relevance: this.sanitizeScore(parsed.relevance),
        clarity: this.sanitizeScore(parsed.clarity),
        toolEffectiveness: this.sanitizeScore(parsed.toolEffectiveness),
        feedback: parsed.feedback || 'No feedback provided',
      };
    } catch (err) {
      console.warn('Evaluation parsing failed:', err);
      return {
        relevance: 3,
        clarity: 3,
        toolEffectiveness: 3,
        feedback: 'Unable to parse evaluation JSON.',
      };
    }
  }

  sanitizeScore(value) {
    const num = Number(value);
    if (isNaN(num)) return 3;
    return Math.min(5, Math.max(1, num));
  }
}
