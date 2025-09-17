import { useMemo, useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Plus, Clock, ChevronRight, History } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { WobbleCards } from "@/components/wobble-card";
import { InputField } from "@/components/ai-input";
import { cn } from "@/lib/utils";

// Mock chat history data
const MOCK_CHAT_HISTORY = [
  {
    id: "1",
    title: "Sales Q3 Analysis",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    preview: "Can you analyze our Q3 sales data and highlight..."
  },
  {
    id: "2",
    title: "Marketing Strategy",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    preview: "Let's discuss the new marketing campaign for..."
  }
];

interface ChatHistory {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
}

export default function AiChatPage() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>(MOCK_CHAT_HISTORY);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const greeting = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const recentChats = useMemo(() => [
    { id: "1", title: "Sales Q3 Analysis" },
    { id: "2", title: "Marketing Strategy" },
    { id: "3", title: "Product Roadmap" },
  ], []);

  const handleNewChat = () => {
    setActiveChat(null);
    setIsHistoryOpen(false);
  };

  const handleOpenChat = (chatId: string) => {
    setActiveChat(chatId);
    // In a real app, you would load the chat messages here
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="h-screen px-6 py-4 relative">
      <LayoutGroup id="ai-chat-layout">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full">
          {/* Main content */}
          <div className={cn(
            "flex flex-col gap-4 h-full transition-all duration-300",
            isHistoryOpen ? "xl:col-span-8" : "xl:col-span-12"
          )}>
            {/* Top Bar */}
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="p-0">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
                    <Sparkles className="mr-1 h-3 w-3" /> AI-Powered Assistant
                  </Badge>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="flex items-center justify-between w-full">
                      <CardTitle className="text-3xl md:text-4xl font-semibold tracking-tight">
                        {greeting}! <span className="inline-block">👋</span>
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="lg:hidden flex items-center gap-2 text-sm"
                        onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                      >
                        <History className="h-4 w-4" />
                        {isHistoryOpen ? 'Hide History' : 'Show History'}
                      </Button>
                    </div>
                    <CardDescription className="mt-2 text-base">
                      Ready to supercharge your productivity? Choose a feature or start a conversation.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Feature grid */}
            <AnimatePresence initial={false}>
              {!activeChat && <WobbleCards />}
            </AnimatePresence>

            {/* Input */}
            <div className="mx-auto w-full max-w-4xl mt-auto">
              <InputField />
            </div>       
          </div>

          {/* History Sidebar */}
          <motion.div 
            className={cn(
              "fixed inset-y-0 right-0 w-80 bg-background border-l shadow-lg z-40 overflow-y-auto transition-transform duration-300 ease-in-out",
              "xl:relative xl:translate-x-0 xl:shadow-none xl:border-l xl:border-gray-200 dark:xl:border-gray-800",
              isHistoryOpen ? "translate-x-0" : "translate-x-full xl:translate-x-0 xl:w-0 xl:opacity-0 xl:invisible"
            )}
            initial={false}
            animate={{ 
              width: isHistoryOpen ? '20rem' : '0',
              opacity: isHistoryOpen ? 1 : 0,
              visibility: isHistoryOpen ? 'visible' : 'hidden'
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Chat History</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setIsHistoryOpen(false)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {chatHistory.map((chat) => (
                  <button
                    key={chat.id}
                    className={cn(
                      "w-full text-left p-3 rounded-lg transition-colors",
                      "hover:bg-gray-100 dark:hover:bg-gray-800",
                      activeChat === chat.id && "bg-gray-100 dark:bg-gray-800"
                    )}
                    onClick={() => handleOpenChat(chat.id)}
                  >
                    <div className="font-medium text-sm">{chat.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                      {chat.preview}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {formatTimeAgo(chat.timestamp)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </LayoutGroup>

      {/* Toggle History Button for mobile */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "fixed bottom-6 right-6 rounded-full w-12 h-12 shadow-lg z-30 xl:hidden",
          "flex items-center justify-center"
        )}
        onClick={() => setIsHistoryOpen(!isHistoryOpen)}
      >
        <History className="h-5 w-5" />
      </Button>
    </div>
  );
}
