import { useState } from 'react';
import { Bookmark, ThumbsUp, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { useToast } from '@/hooks/use-toast';
import type { Insight } from '@/hooks/use-insights';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  insight: Insight;
  isSelected: boolean;
  onSelect: (insightId: string) => void;
  onToggleSaved: (insightId: string) => boolean | undefined;
  onToggleHelpful: (insightId: string) => boolean | undefined;
}

export function InsightCard({
  insight,
  isSelected,
  onSelect,
  onToggleSaved,
  onToggleHelpful,
}: InsightCardProps) {
  // const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState<'saved' | 'helpful' | null>(null);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newSavedState = onToggleSaved(insight.id);
    setIsAnimating('saved');
    setTimeout(() => setIsAnimating(null), 600);
    
    // toast({
    //   title: newSavedState ? "Saved!" : "Removed from saved",
    //   description: newSavedState 
    //     ? "Added to your saved insights" 
    //     : "Removed from saved insights",
    //   duration: 2000,
    // });
  };

  const handleHelpfulClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newHelpfulState = onToggleHelpful(insight.id);
    setIsAnimating('helpful');
    setTimeout(() => setIsAnimating(null), 600);

    // toast({
    //   title: newHelpfulState ? "Marked as helpful!" : "Removed from helpful",
    //   description: newHelpfulState
    //     ? "Added to your helpful insights"
    //     : "Removed from helpful insights",
    //   duration: 2000,
    // });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'trend':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'action':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'forecast':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div
      className={cn(
        'insight-card p-6 cursor-pointer animate-fade-in-up',
        isSelected && 'selected'
      )}
      onClick={() => onSelect(insight.id)}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(insight.id);
        }
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-foreground leading-tight pr-4 flex-1">
          {insight.title}
        </h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 w-8 p-0 hover:bg-muted',
              isAnimating === 'saved' && 'animate-bounce-subtle'
            )}
            onClick={handleSaveClick}
            aria-label={insight.saved ? 'Remove from saved' : 'Save insight'}
          >
            <Bookmark
              className={cn(
                'h-4 w-4 transition-colors',
                insight.saved
                  ? 'fill-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 w-8 p-0 hover:bg-muted',
              isAnimating === 'helpful' && 'animate-bounce-subtle'
            )}
            onClick={handleHelpfulClick}
            aria-label={insight.helpful ? 'Remove from helpful' : 'Mark as helpful'}
          >
            <ThumbsUp
              className={cn(
                'h-4 w-4 transition-colors',
                insight.helpful
                  ? 'fill-success text-success'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            />
          </Button>
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {insight.summary}
      </p>

      {/* Metadata */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(insight.date)}</span>
          </div>
          <div className={cn(
            'px-2 py-1 rounded-md text-xs font-medium',
            getCategoryColor(insight.category)
          )}>
            {insight.category}
          </div>
        </div>
        
        {insight.tags.length > 0 && (
          <div className="flex items-center gap-1">
            <Tag className="h-3 w-3 text-muted-foreground" />
            <div className="flex gap-1">
              {insight.tags.slice(0, 2).map(tag => (
                <span
                  key={tag}
                  className="insight-tag"
                >
                  {tag}
                </span>
              ))}
              {insight.tags.length > 2 && (
                <span className="insight-tag">
                  +{insight.tags.length - 2}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}