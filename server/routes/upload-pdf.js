import express from 'express';
import multer from 'multer';
import { services } from '../services/index.js';

const upload = multer();

export const uploadPdfRouter = express.Router();

uploadPdfRouter.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    const { file } = req;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const text = await services.pdfService.load(file.buffer);
    const documents = await services.textSplitterService.split(text);
    await services.qdrantService.vectorStore.addDocuments(documents);

    res.json({
      status: 'success',
      message: 'PDF processed and added to knowledge base',
    });
  } catch (error) {
    console.error('Upload processing error:', error);
    res.status(500).json({ error: 'Failed to process PDF' });
  }
});
