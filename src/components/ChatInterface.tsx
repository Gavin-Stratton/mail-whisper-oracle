
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useApp } from '@/context/AppContext';
import { Send, RefreshCw, Bot, User } from 'lucide-react';
import { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';

const ChatInterface: React.FC = () => {
  const { chatMessages, addChatMessage, clearChatMessages, trainingStatus } = useApp();
  const [message, setMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const isModelTrained = trainingStatus.status === 'completed';
  
  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    // Add user message
    addChatMessage({
      role: 'user',
      content: message,
    });
    
    setMessage('');
    
    // Simulate assistant response
    setTimeout(() => {
      addChatMessage({
        role: 'assistant',
        content: generateAssistantResponse(message),
      });
    }, 1000);
  };
  
  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [chatMessages]);
  
  // Simulate assistant responses based on user input
  const generateAssistantResponse = (userMessage: string): string => {
    const normalizedMessage = userMessage.toLowerCase();
    
    if (normalizedMessage.includes('email') && normalizedMessage.includes('find')) {
      return "I found several emails matching your criteria. The most relevant ones are from your work inbox, dated March 15-20, 2025, regarding the project timeline.";
    } else if (normalizedMessage.includes('data') && normalizedMessage.includes('summary')) {
      return "Based on the data folders you provided, I can see patterns in your document organization. You have approximately 1,243 documents across 87 folders, with the most frequent topics being project reports, financial statements, and marketing materials.";
    } else if (normalizedMessage.includes('hello') || normalizedMessage.includes('hi')) {
      return "Hello! I'm your personalized assistant trained on your emails and data folders. How can I help you analyze or find information in your data today?";
    } else if (normalizedMessage.includes('search') || normalizedMessage.includes('find')) {
      return "I've searched through your data and found several relevant items. Would you like me to summarize them or show you the most important ones first?";
    } else {
      return "I've analyzed your emails and data folders. Based on the content, I can help you organize information, find specific documents, or analyze patterns in your communications. What specific aspect would you like to explore?";
    }
  };
  
  const MessageItem: React.FC<{ message: ChatMessage }> = ({ message }) => {
    return (
      <div
        className={cn(
          "flex w-full mb-4 last:mb-0",
          message.role === 'user' ? "justify-end" : "justify-start",
          message.role === 'system' && "justify-center"
        )}
      >
        {message.role === 'system' ? (
          <div className="bg-muted px-4 py-2 rounded-lg text-sm text-center max-w-[80%]">
            {message.content}
          </div>
        ) : (
          <div
            className={cn(
              "flex items-start gap-2 max-w-[80%]",
              message.role === 'user' && "flex-row-reverse"
            )}
          >
            <div className={cn(
              "flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full",
              message.role === 'user' ? "bg-primary" : "bg-app-blue"
            )}>
              {message.role === 'user' ? (
                <User className="h-4 w-4 text-primary-foreground" />
              ) : (
                <Bot className="h-4 w-4 text-white" />
              )}
            </div>
            <div
              className={cn(
                "px-4 py-2 rounded-lg",
                message.role === 'user'
                  ? "bg-primary text-primary-foreground"
                  : "bg-app-blue text-white"
              )}
            >
              {message.content}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full h-[500px] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Chat with Your Data</CardTitle>
          {chatMessages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChatMessages}
              className="h-8 px-2"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              <span className="text-xs">Clear</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-[380px] px-4 py-2" ref={scrollAreaRef}>
          {chatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              {isModelTrained ? (
                <>
                  <Bot className="h-12 w-12 mb-4 text-muted" />
                  <p className="text-center max-w-[80%]">
                    Your model is trained and ready. Ask me anything about your emails or data!
                  </p>
                </>
              ) : (
                <>
                  <Bot className="h-12 w-12 mb-4 text-muted opacity-50" />
                  <p className="text-center max-w-[80%]">
                    Your model needs to be trained before you can chat with your data.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {chatMessages.map((msg) => (
                <MessageItem key={msg.id} message={msg} />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder={isModelTrained 
              ? "Ask about your emails and data..." 
              : "Train your model first..."
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (isModelTrained) handleSendMessage();
              }
            }}
            disabled={!isModelTrained}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!isModelTrained || message.trim() === ''}
            onClick={handleSendMessage}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
