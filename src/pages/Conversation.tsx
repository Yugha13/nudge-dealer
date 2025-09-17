import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';


interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  actions?: Array<{
    label: string;
    path: string;
  }>;
}

const AI_RESPONSES = {
  pos: {
    content: "I can help you with Purchase Orders! Here are some quick actions you can take:",
    actions: [
      { label: "Open POs", path: "/open-pos" },
      { label: "Vendors", path: "/vendors" },
      { label: "Platform Comparison", path: "/platform" }
    ],
    followUp: "Want to know about how many open POs are there?"
  },
  vendor: {
    content: "Let me assist you with vendor management. Here are the available options:",
    actions: [
      { label: "Open POs", path: "/open-pos" },
      { label: "Vendors", path: "/vendors" },
      { label: "Platform Comparison", path: "/platform" }
    ],
    followUp: "Would you like to see vendor analytics and performance metrics?"
  },
  default: {
    content: "I'm here to help! Here are some areas I can assist you with:",
    actions: [
      { label: "Open POs", path: "/open-pos" },
      { label: "Vendors", path: "/vendors" },
      { label: "Platform Comparison", path: "/platform" }
    ],
    followUp: "What specific information would you like to explore?"
  }
};

export default function Conversation() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get initial message from URL
    const urlParams = new URLSearchParams(window.location.search);
    const initialMessage = urlParams.get('message');
    
    if (initialMessage) {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: initialMessage,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages([userMessage]);
      
      // Generate AI response
      setTimeout(() => {
        const aiResponse = getAIResponse(initialMessage);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse.content,
          sender: 'ai',
          timestamp: new Date(),
          actions: aiResponse.actions
        };
        
        setMessages(prev => [...prev, aiMessage]);
        
        // Send follow-up
        setTimeout(() => {
          const followUpMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: aiResponse.followUp,
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, followUpMessage]);
        }, 1000);
      }, 1500);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    if (message.includes('po') || message.includes('purchase')) {
      return AI_RESPONSES.pos;
    } else if (message.includes('vendor')) {
      return AI_RESPONSES.vendor;
    }
    return AI_RESPONSES.default;
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = getAIResponse(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.content,
        sender: 'ai',
        timestamp: new Date(),
        actions: aiResponse.actions
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      // Send follow-up message
      setTimeout(() => {
        const followUpMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: aiResponse.followUp,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, followUpMessage]);
      }, 1000);
    }, 1500);
  };

  const handleActionClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b p-4">
        <h1 className="text-xl font-semibold">AI Assistant</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3",
                message.sender === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {message.sender === 'ai' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={cn(
                "max-w-[70%] space-y-2",
                message.sender === 'user' ? "items-end" : "items-start"
              )}>
                <Card className={cn(
                  "p-3",
                  message.sender === 'user' 
                    ? "bg-primary text-primary-foreground ml-auto" 
                    : "bg-muted"
                )}>
                  <p className="text-sm">{message.content}</p>
                </Card>

                {message.actions && (
                  <div className="flex flex-wrap gap-2">
                    {message.actions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleActionClick(action.path)}
                        className="text-xs"
                      >
                        {action.label}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {message.sender === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <Card className="p-3 bg-muted">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </Card>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}