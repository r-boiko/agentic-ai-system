import express from 'express';
import cors from 'cors';
import { chatRouter } from './routes/chat.js';
import { uploadPdfRouter } from './routes/upload-pdf.js';
import { uploadAudioRouter } from './routes/upload-audio.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(chatRouter);
app.use(uploadPdfRouter);
app.use(uploadAudioRouter);

const PORT = process.env.PORT || 5175;

app.get('/', (req, res) => {
  res.send('GET request to the homepage');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
