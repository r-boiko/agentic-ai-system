# Agentic AI System - Project Context

## Architecture
- **Frontend**: React + TypeScript + Vite + TailwindCSS (port 5173)
- **Backend**: Node.js + Express (port 5175)
- **AI Stack**: LangChain + OpenAI (GPT-3.5-turbo, Whisper, text-embedding-3-large)
- **Vector DB**: Qdrant (collection: 'rag-chatbot-db')

## Core Services (Singleton Pattern)
1. `PdfLoaderService` - PDF text extraction via LangChain PDFLoader
2. `AudioTranscriberService` - Audio → text via OpenAI Whisper (25MB limit)
3. `TextSplitterService` - RecursiveCharacterTextSplitter (chunk: 500, overlap: 50)
4. `QdrantVectorStoreService` - Vector storage with OpenAI embeddings
5. `RagChainService` - Retrieval chain (k=3, temperature: 0.7)

## API Endpoints
- `POST /upload-pdf` - Upload & process PDF documents
- `POST /upload-audio` - Upload & transcribe audio (MP3, WAV, M4A, MP4)
- `POST /chat` - RAG-based chat with uploaded content

## Frontend Components
- `FileUploader.tsx` - Drag-drop file upload with status tracking
- `DocumentInfo.tsx` - Document metadata & status display
- `Chat.tsx` - Chat interface with message history

## Document Flow
1. Upload → 2. Extract/Transcribe → 3. Chunk text → 4. Vectorize → 5. Store in Qdrant → 6. Chat with RAG retrieval

## Environment Variables
- Server: `OPENAI_API_KEY`, `QDRANT_URL`, `QDRANT_API_KEY`
- Client: `VITE_SERVER_API_URL`
