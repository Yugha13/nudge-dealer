import { useState, useEffect } from 'react';
import { Search, Settings, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useInsights } from '@/hooks/use-insights';
import { useIsMobile } from '@/hooks/use-mobile';
import { InsightCard } from '@/components/ai-insights/InsightCard';
import { DetailPanel } from '@/components/ai-insights/DetailPanel';
import { FilterTabs } from '@/components/ai-insights/FilterTabs';
import { EmptyState } from '@/components/ai-insights/EmptyState';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function AIInsights() {
  const {
    insights,
    selectedInsight,
    selectedInsightId,
    filter,
    searchQuery,
    counts,
    loading,
    setSelectedInsightId,
    setFilter,
    setSearchQuery,
    toggleSaved,
    toggleHelpful,
    resetDemoData,
  } = useInsights();

  const isMobile = useIsMobile();

  const [showDetailModal, setShowDetailModal] = useState(false);

  // Handle URL parameters for deep linking
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const insightId = urlParams.get('insight');
    if (insightId) {
      setSelectedInsightId(insightId);
    }
  }, [setSelectedInsightId]);

  // Mobile: show detail modal when insight is selected
  useEffect(() => {
    if (isMobile && selectedInsightId) {
      setShowDetailModal(true);
    }
  }, [isMobile, selectedInsightId]);

  const handleInsightSelect = (insightId: string) => {
    setSelectedInsightId(insightId);
    if (isMobile) {
      setShowDetailModal(true);
    }
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
  };

  const handleResetDemo = () => {
    resetDemoData();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading AI Insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-foreground">AI Insights</h1>
                <div className="hidden sm:block text-sm text-muted-foreground">
                  Automated insights from your data
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search insights..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64 hidden sm:block"
                  />
                </div>

                {/* Settings menu */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Settings className="h-4 w-4" />
                      <span className="hidden sm:inline">Settings</span>
                    </Button>
                  </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>AI Insights Settings</DialogTitle>
                    <DialogDescription>
                      Manage your AI Insights preferences and demo data.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Demo Data</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Reset all insights to original demo state. This will clear all saved and helpful markings.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={handleResetDemo}
                        className="gap-2"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Reset Demo Data
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Search and filters row */}
          <div className="flex flex-col gap-4">
            {/* Mobile search */}
            <div className="sm:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search insights..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
            </div>

            {/* Filter tabs */}
            <div className="-mx-4 px-4 overflow-x-auto pb-1">
              <FilterTabs
                currentFilter={filter}
                onFilterChange={setFilter}
                counts={counts}
              />
            </div>
          </div>
        </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Cards list */}
          <div className={`${isMobile ? 'flex-1' : 'flex-1 max-w-4xl'}`}>
            {insights.length === 0 ? (
              <EmptyState 
                filter={filter} 
                onFilterChange={setFilter}
                onClearSearch={handleClearSearch}
                hasSearchQuery={!!searchQuery.trim()}
              />
            ) : (
              <ScrollArea className={isMobile ? 'h-[calc(100vh-280px)]' : 'h-[calc(100vh-200px)]'}>
                <div className={`pr-4 ${isMobile ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}`}>
                  {insights.map((insight) => (
                    <InsightCard
                      key={insight.id}
                      insight={insight}
                      isSelected={selectedInsightId === insight.id}
                      onSelect={handleInsightSelect}
                      onToggleSaved={toggleSaved}
                      onToggleHelpful={toggleHelpful}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Desktop detail panel */}
          {!isMobile && (
            <div className="w-96 flex-shrink-0">
              <DetailPanel
                insight={selectedInsight}
                onToggleSaved={toggleSaved}
                onToggleHelpful={toggleHelpful}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile detail modal */}
      {isMobile && (
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="p-0 max-w-full h-full max-h-full">
            <DetailPanel
              insight={selectedInsight}
              onToggleSaved={toggleSaved}
              onToggleHelpful={toggleHelpful}
              isMobile={true}
              onClose={handleCloseDetailModal}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}