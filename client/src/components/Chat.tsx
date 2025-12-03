import { useState, useRef, useEffect } from 'react';
import {
  Send,
  User,
  Bot,
  Loader2,
  ChevronDown,
  ChevronUp,
  Wrench,
  Brain,
  Star,
} from 'lucide-react';
import axios from 'axios';
import { VITE_SERVER_API_URL } from '../constants';
import { ChatMessage } from '../types';

interface ChatProps {
  documentReady: boolean;
}

export const Chat = ({ documentReady }: ChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTraces, setExpandedTraces] = useState<Set<number>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleTrace = (index: number) => {
    const newExpanded = new Set(expandedTraces);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedTraces(newExpanded);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !documentReady) return;

    const userMessage: ChatMessage = {
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${VITE_SERVER_API_URL}/chat`, {
        message: inputValue,
      });

      const botMessage: ChatMessage = {
        text: response.data.answer,
        sender: 'bot',
        timestamp: new Date(),
        toolsUsed: response.data.toolsUsed,
        source: response.data.source,
        evaluation: response.data.evaluation,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        text: 'Sorry, something went wrong. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-xl">
      {/* Chat Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-card-foreground">
          Chat with your document
        </h2>
        {!documentReady && (
          <p className="text-sm text-muted-foreground mt-1">
            Upload a PDF or audio file and start asking questions
          </p>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && documentReady && (
          <div className="text-center text-muted-foreground py-8">
            <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Ask me anything about your document!</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-sm'
                  : 'bg-muted text-muted-foreground rounded-tl-sm'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.text}
              </p>
              <p className="text-xs opacity-60 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </p>

              {/* Agent Trace */}
              {message.sender === 'bot' && message.evaluation && (
                <div className="mt-3 space-y-2">
                  <button
                    onClick={() => toggleTrace(index)}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Brain className="w-3 h-3" />
                    <span>Agent Info</span>
                    {expandedTraces.has(index) ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>

                  {expandedTraces.has(index) && (
                    <div className="bg-background/50 rounded-lg p-3 space-y-2 text-xs">
                      {/* Tools Used */}
                      {message.toolsUsed && (
                        <div className="flex items-center gap-2">
                          <Wrench className="w-3 h-3" />
                          <span className="font-medium">Tools:</span>
                          <span>{message.toolsUsed.join(', ')}</span>
                        </div>
                      )}

                      {/* Source */}
                      {message.source && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Source:</span>
                          <span className="px-2 py-0.5 bg-primary/10 rounded">
                            {message.source}
                          </span>
                        </div>
                      )}

                      {/* Evaluation */}
                      {message.evaluation && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Star className="w-3 h-3" />
                            <span className="font-medium">Quality Scores:</span>
                          </div>
                          <div className="pl-5 space-y-1">
                            <div>
                              Relevance: {message.evaluation.relevance}/5
                            </div>
                            <div>Clarity: {message.evaluation.clarity}/5</div>
                            <div>
                              Tool Use: {message.evaluation.toolEffectiveness}
                              /5
                            </div>
                            {message.evaluation.feedback && (
                              <div className="mt-2 pt-2 border-t border-border/50">
                                <span className="font-medium">Feedback: </span>
                                <span className="text-muted-foreground">
                                  {message.evaluation.feedback}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {message.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Thinking...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              documentReady
                ? 'Ask a question...'
                : 'Upload a PDF or audio file first...'
            }
            disabled={isLoading || !documentReady}
            className="flex-1 px-4 py-3 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !documentReady || !inputValue.trim()}
            className="px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
