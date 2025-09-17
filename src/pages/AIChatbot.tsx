import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Variants } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Target, BarChart3, Lightbulb, Zap, Plus, Paperclip, Maximize2, Clock, ZapOff, MessageSquare, History, Settings, User, Menu, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { WobbleCards } from '@/components/wobble-card';
import { AIFeatureCard } from '@/components/ai-feature-card';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut' as const
    }
  }),
  hover: {
    y: -5,
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
};

const FeatureCard: React.FC<FeatureCardProps & { index: number }> = ({ icon, title, description, onClick, index }) => (
  <motion.div
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    whileHover="hover"
    custom={index}
    className="h-full"
  >
    <Card 
      className="group relative overflow-hidden h-full bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10 flex flex-col items-center p-6 text-center h-full">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-border/20 mb-4 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors duration-300">
          {React.isValidElement<{ className?: string }>(icon) ? (
            React.cloneElement(icon, { 
              className: cn('w-6 h-6', icon.props.className) 
            })
          ) : (
            <div className="w-6 h-6 flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>
        <CardHeader className="p-0 mb-3">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <CardDescription className="text-sm text-muted-foreground/80">
            {description}
          </CardDescription>
        </CardContent>
      </div>
    </Card>
  </motion.div>
);

const TypingIndicator = () => (
  <div className="flex space-x-1 items-center">
    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
  </div>
);

const CHAT_HISTORY = [
  {
    id: '1',
    title: 'Q4 Sales Analysis',
    preview: 'Can you analyze our Q4 sales performance and identify key trends?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2', 
    title: 'Marketing Campaign ROI',
    preview: 'Help me calculate the ROI for our recent digital marketing campaigns',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

export default function AIChatbot() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [recentPrompts, setRecentPrompts] = useState([
    'Show me sales trends for Q3',
    'Analyze customer feedback',
    'Generate marketing report'
  ]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    // Navigate to conversation page with the message
    navigate(`/conversation?message=${encodeURIComponent(inputValue)}`);
  };

  const features = [
    {
      id: 'insights',
      title: 'AI Insights',
      description: 'Unlock hidden patterns and actionable intelligence from your data.',
      icon: <Sparkles className="text-primary" />,
    },
    {
      id: 'tasks',
      title: 'Task Creation',
      description: 'Automate routine work and simplify complex task flows.',
      icon: <Plus className="text-blue-500" />,
    },
    {
      id: 'forecasting',
      title: 'Predictive Forecasting',
      description: 'Anticipate trends and outcomes with advanced AI predictions.',
      icon: <BarChart3 className="text-purple-500" />,
    },
    {
      id: 'strategy',
      title: 'AI for Strategy',
      description: 'Craft winning strategies with AI-powered recommendations.',
      icon: <Target className="text-green-500" />,
    },
    {
      id: 'trends',
      title: 'Trend Discovery',
      description: 'Spot emerging opportunities before anyone else.',
      icon: <Lightbulb className="text-yellow-500" />,
    },
    {
      id: 'expand',
      title: 'Coming Soon',
      description: 'More exciting features on the way!',
      icon: <Zap className="text-muted-foreground/60" />,
    },
  ];

  const handleFeatureClick = (id: string, title: string) => {
    if (id === 'insights') {
      // Navigate to AI Insights chat
      window.location.href = '/ai-insights';
    } else {
      setActiveFeature(title);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <MessageSquare className="h-6 w-6 text-primary mr-2" />
              <span className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                AI Assistant
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Button>
                <Plus className="h-4 w-4" />
                <span>New Chat</span>
              </Button>
              <Button variant="outline" onClick={() => setIsHistoryOpen(!isHistoryOpen)}>
                <History className="h-4 w-4" />
                <span>History</span>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-foreground/70 hover:text-foreground focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
              <Button>
                  <Plus className="h-5 w-5 mr-2" />
                  New Chat
                </Button>
                <Button variant="outline" onClick={() => setIsHistoryOpen(!isHistoryOpen)}>
                  <History className="h-5 w-5 mr-2" />
                  History
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div className="relative flex">
        {/* Main Content */}
        <div className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          isHistoryOpen ? "mr-80" : "mr-0"
        )}>
          <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Assistant
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            What will you make today?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Leverage AI to assist your work with insights, forecasts, and strategies instantly.
          </p>
        </motion.div>

        <motion.div 
          className="relative mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="relative">
            <div className="absolute inset-0.5 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-grid-white/[0.02]" />
              <div className="relative z-10">
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask AI to help with anything..."
                  className="w-full pl-14 pr-36 py-6 text-base bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground/60"
                />
                <Button 
                  type="submit"
                  size="lg"
                  disabled={isTyping || !inputValue.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                >
                  {isTyping ? <TypingIndicator /> : 'Generate'}
                </Button>
              </div>
            </div>
          </form>
          
          {recentPrompts.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {recentPrompts.map((prompt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setInputValue(prompt)}
                  className="text-xs px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <Clock className="w-3 h-3 mr-1.5 opacity-70" />
                  {prompt.length > 30 ? `${prompt.substring(0, 30)}...` : prompt}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
          <div className="flex flex-col gap-4 pl-20 pr-20">
            <AIFeatureCard />
          </div>

          </div>
        </div>

        {/* History Sidebar */}
        <motion.div
          className={cn(
            "fixed top-0 right-0 h-full w-80 bg-background border-l shadow-lg z-50 overflow-y-auto",
            "transition-transform duration-300 ease-in-out"
          )}
          initial={false}
          animate={{
            x: isHistoryOpen ? 0 : '100%'
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Chat History</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsHistoryOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {CHAT_HISTORY.map((chat) => (
                <motion.button
                  key={chat.id}
                  className={cn(
                    "w-full text-left p-4 rounded-lg border transition-all duration-200",
                    "hover:bg-muted/50 hover:border-primary/30",
                    activeChat === chat.id && "bg-muted border-primary"
                  )}
                  onClick={() => {
                    setActiveChat(chat.id);
                    // Navigate to chat page logic here
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-medium text-sm mb-2">{chat.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {chat.preview}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(chat.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Mobile History Toggle */}
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "fixed bottom-6 right-6 rounded-full w-12 h-12 shadow-lg z-40 md:hidden"
          )}
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
        >
          <History className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
