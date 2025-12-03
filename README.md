# Agentic AI System

An autonomous AI-Agentic system with reasoning, tool-calling, and self-evaluation capabilities. Built with Node.js and Express, it allows users to upload PDF documents and audio files, then intelligently chat with their content using OpenAI's GPT models and LangChain agents.

## Features

- **Multi-Format Upload**: Upload PDF documents and audio files (MP3, WAV, M4A, MP4) to build a knowledge base
- **Document Processing**: Automatic text extraction and chunking from PDFs
- **Audio Transcription**: Speech-to-text conversion using OpenAI's Whisper API
- **Document Status Tracking**: Real-time status updates (processing, ready, error)
- **Document Information Panel**: View uploaded document details and status
- **Vector Storage**: Documents stored in Qdrant vector database for efficient retrieval
- **AI Chat**: Chat with your documents using OpenAI's GPT-4o-mini
- **Context-Aware Responses**: Retrieves relevant document chunks to provide accurate answers
- **Modern UI**: Clean, responsive interface built with TailwindCSS and TypeScript

## Agentic AI Features

This chatbot uses an autonomous AI-Agentic system with:

### Reasoning & Tool-Calling
- **ReAct Agent**: Uses Chain-of-Thought reasoning to decide which tools to use
- **Vector Search Tool**: Searches uploaded documents for relevant information
- **General Knowledge Tool**: Falls back to AI's built-in knowledge when documents don't have answers

### Reflection & Evaluation
- **Self-Evaluation**: Automatically scores responses on relevance, clarity, and tool effectiveness
- **Quality Metrics**: Provides 1-5 scores for each response dimension
- **Source Attribution**: Shows whether answer came from documents or AI knowledge

### Agent Decision Flow
1. User asks a question
2. Agent analyzes intent and selects appropriate tool
3. Tries Vector Search first (uploaded documents)
4. Falls back to General Knowledge if needed
5. Evaluates its own response quality
6. Returns answer with tool usage, source attribution, and quality scores

### Technologies
- **LangChain ReAct Agent**: Autonomous reasoning and tool selection
- **OpenAI GPT-4o-mini**: Agent reasoning, response generation, and evaluation
- **Qdrant Vector Store**: Document retrieval
- **Zod**: Tool schema validation

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS, Lucide React Icons
- **Backend**: Node.js, Express.js
- **AI/ML**: LangChain, LangChain Agents, OpenAI GPT-4o-mini, OpenAI Embeddings, OpenAI Whisper
- **Vector Database**: Qdrant
- **Document Processing**: PDF-parse, RecursiveCharacterTextSplitter
- **Audio Processing**: OpenAI Whisper API for speech-to-text
- **File Upload**: Multer
- **HTTP Client**: Axios
- **Development**: Prettier, ESLint, Nodemon

## Prerequisites

- Node.js (v18 or higher)
- Qdrant vector database instance
- OpenAI API key

## Environment Variables

Copy the example files and update with your values:

```bash
# Server environment
cp server/.env.example server/.env
# Edit server/.env with your API keys

# Client environment
cp client/.env.example client/.env
# Edit client/.env if needed (default should work)
```

Server `.env` variables:
- `OPENAI_API_KEY`: Your OpenAI API key
- `QDRANT_URL`: Your Qdrant database URL
- `QDRANT_API_KEY`: Your Qdrant API key

Client `.env` variables:
- `VITE_SERVER_API_URL`: Backend server URL (default: http://localhost:5175)

## Installation & Running

1. Clone the repository:
```bash
git clone <repository-url>
cd agentic-ai-system
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

4. Set up environment variables (see above)

5. Run both client and server from root:
```bash
npm run dev
```

This will start:
- Server on `http://localhost:5175`
- Client on `http://localhost:5173`

### Alternative: Run separately

- Start only server: `npm run start:server`
- Start only client: `npm run start:client`

## Usage

1. Open your browser and go to `http://localhost:5173`
2. Upload a PDF document or audio file (MP3, WAV, M4A, MP4) using the file uploader
3. Wait for the document to be processed (PDFs are parsed, audio files are transcribed)
4. Start chatting with your document using the chat interface

## API Endpoints

### Upload PDF
```
POST /upload-pdf
Content-Type: multipart/form-data

Body: pdf file
```

### Upload Audio
```
POST /upload-audio
Content-Type: multipart/form-data

Body: audio file (MP3, WAV, M4A, MP4 - max 25MB)
```

### Chat
```
POST /chat
Content-Type: application/json

Body: {
  "message": "Your question about the uploaded documents"
}
```

## Architecture

The application follows a service-oriented architecture with:

- **Services**: Modular services for PDF loading, text splitting, vector storage, and RAG chain
- **Routes**: Express routes for handling API endpoints
- **Middleware**: CORS and JSON parsing
- **Singleton Pattern**: Service instances are created once and reused

### Service Classes

- `PdfLoaderService`: Extracts text from PDF files
- `AudioTranscriberService`: Transcribes audio files to text using OpenAI Whisper
- `TextSplitterService`: Splits text into chunks for better retrieval
- `QdrantVectorStoreService`: Manages vector database operations
- `AgentService`: Orchestrates ReAct agent with tool selection and execution
- `EvaluationService`: Self-evaluates agent responses for quality metrics
- `RagChainService`: Handles AI chat with document context (legacy)

## How It Works

1. **File Upload**: User uploads a PDF document or audio file
2. **Content Processing**: 
   - PDF files: Text extracted using LangChain's PDFLoader
   - Audio files: Transcribed to text using OpenAI Whisper API
3. **Text Chunking**: Content is split into smaller chunks for better retrieval
4. **Vectorization**: Text chunks are converted to embeddings and stored in Qdrant
5. **Chat Query**: User asks a question about the uploaded content
6. **Agent Reasoning**: ReAct agent decides which tool to use (vector search or general knowledge)
7. **Tool Execution**: Selected tool executes and returns results
8. **Response Generation**: Agent synthesizes final answer from tool results
9. **Self-Evaluation**: Response is automatically evaluated for quality
10. **Display**: Answer shown with tool usage, source, and quality scores

## Development

The codebase uses ES6 modules and follows modern JavaScript practices:

- Class-based services with singleton pattern
- Async/await for asynchronous operations
- Modular architecture for maintainability
- Error handling and logging

## License

MIT License