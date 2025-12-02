import express from 'express';
import { services } from '../services/index.js';

export const chatRouter = express.Router();

chatRouter.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    const answer = await services.ragService.getResponse(
      message,
      services.qdrantService.vectorStore,
    );

    res.json({ answer });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});
