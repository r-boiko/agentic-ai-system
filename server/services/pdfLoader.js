import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';

export class PdfLoaderService {
  async load(buffer) {
    if (!buffer) {
      console.log('Pdf loader error. Buffer is empty.');
      return null;
    }

    const loader = new PDFLoader(new Blob([buffer], { type: 'application/pdf' }), { splitPages: false });

    try {
      const singleDoc = await loader.load();
      return singleDoc[0].pageContent;
    } catch (e) {
      console.log('Pdf loader catch error', e);
    }
  }
}
