import OpenAI from 'openai';

export class AudioTranscriberService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async transcribe(buffer, filename) {
    if (!buffer) {
      console.log('Audio transcriber error. Buffer is empty.');
      return null;
    }

    try {
      const file = new File([buffer], filename, { type: this.getMimeType(filename) });
      
      const transcription = await this.openai.audio.transcriptions.create({
        file: file,
        model: 'whisper-1',
      });

      return transcription.text;
    } catch (e) {
      console.log('Audio transcriber catch error', e);
      return null;
    }
  }

  getMimeType(filename) {
    const ext = filename.toLowerCase().split('.').pop();
    const mimeTypes = {
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      m4a: 'audio/mp4',
      mp4: 'video/mp4',
    };
    return mimeTypes[ext] || 'audio/mpeg';
  }
}