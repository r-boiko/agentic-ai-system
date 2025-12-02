import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

export class TextSplitterService {
  async split(text) {
    if (!text) {
      console.log('Text splitter error. Text is empty.');
      return null;
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });

    try {
      const docOutput = await splitter.splitDocuments([
        new Document({ pageContent: text }),
      ]);

      return docOutput;
    } catch (e) {
      console.log('Text splitter catch error', e);
    }
  }
}
