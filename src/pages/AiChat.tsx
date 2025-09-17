import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Plus, Clock } from "lucide-react";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { WobbleCards } from "@/components/wobble-card";
import { InputField } from "@/components/ai-input";

export default function AiChatPage() {
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

  const [activeChat, setActiveChat] = useState<string | null>(null);

  const handleNewChat = () => {
    setActiveChat(null);
  };

  return (
    <div className="h-screen px-6 py-4">
      <LayoutGroup id="ai-chat-layout">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full">
          {/* Main content */}
          <div className="xl:col-span-9 flex flex-col gap-4 h-full">
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
                    <CardTitle className="text-3xl md:text-4xl font-semibold tracking-tight">
                      {greeting}! <span className="inline-block">👋</span>
                    </CardTitle>
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

          {/* Right Sidebar */}
          <div className="xl:col-span-3 h-full">
            <Card className="h-full flex flex-col">
              <CardHeader className="flex-row items-center justify-between gap-4 pb-3">
                <CardTitle className="text-base">Assistant</CardTitle>
                <Button 
                  onClick={handleNewChat}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" /> New Chat
                </Button>
              </CardHeader>
              <Separator />
              <CardContent className="p-0 flex-1">
                <div className="p-4">
                  <div className="text-sm font-medium mb-2">Recent Chats</div>
                  <div className="space-y-2">
                    {recentChats.map((chat) => (
                      <Button 
                        key={chat.id} 
                        variant="ghost" 
                        className="w-full justify-start text-left font-normal"
                        onClick={() => setActiveChat(chat.id)}
                      >
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" /> 
                        <span className="truncate">{chat.title}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </LayoutGroup>
    </div>
  );
}
