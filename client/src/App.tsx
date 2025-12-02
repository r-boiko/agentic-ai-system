import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Chat } from './components/Chat';
import { FileUploader } from './components/FileUploader';
import { DocumentInfo } from './components/DocumentInfo';
import { DocumentInfo as DocumentInfoType } from './types';

function App() {
  const [documentInfo, setDocumentInfo] = useState<DocumentInfoType | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">RAG Chatbot</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-4">
        <div className="container mx-auto px-4 h-[calc(100vh-6rem)]">
          <div className="grid lg:grid-cols-[350px,1fr] gap-6 h-full">
            {/* Sidebar */}
            <div className="space-y-6">
              <FileUploader onDocumentUploaded={setDocumentInfo} />
              {documentInfo && <DocumentInfo document={documentInfo} />}
            </div>

            {/* Chat Area */}
            <div className="flex flex-col">
              <Chat documentReady={documentInfo?.status === 'ready'} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;