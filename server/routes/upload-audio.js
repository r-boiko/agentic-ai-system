import express from 'express';
import multer from 'multer';
import { services } from '../services/index.js';

const upload = multer();

export const uploadAudioRouter = express.Router();

uploadAudioRouter.post('/upload-audio', upload.single('audio'), async (req, res) => {
  try {
    const { file } = req;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    
    const maxSize = 25 * 1024 * 1024; // 25MB limit
    if (file.size > maxSize) {
      return res.status(400).json({ error: 'File too large. Maximum size is 25MB.' });
    }

    const text = await services.audioService.transcribe(file.buffer, file.originalname);
    if (!text) return res.status(500).json({ error: 'Failed to transcribe audio' });

    const documents = await services.textSplitterService.split(text);
    await services.qdrantService.vectorStore.addDocuments(documents);

    res.json({
      status: 'success',
      message: 'Audio processed and added to knowledge base',
    });
  } catch (error) {
    console.error('Audio upload processing error:', error);
    res.status(500).json({ error: 'Failed to process audio' });
  }
});