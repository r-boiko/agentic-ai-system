import express from 'express';
import { services } from '../services/index.js';

export const chatRouter = express.Router();

chatRouter.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // Use agent service instead of RAG
    const agentResult = await services.agentService.processQuery(message);

    // Evaluate the response
    const evaluation = await services.evaluationService.evaluateResponse(
      message,
      agentResult.answer,
      agentResult.toolsUsed,
    );

    res.json({
      answer: agentResult.answer,
      toolsUsed: agentResult.toolsUsed,
      source: agentResult.source,
      evaluation,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});
