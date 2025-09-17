import { useState } from 'react';
import { Bookmark, ThumbsUp, Share2, Calendar, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Insight } from '../../hooks/use-insights';
import { cn } from '@/lib/utils';

interface DetailPanelProps {
  insight: Insight | undefined;
  onToggleSaved: (insightId: string) => boolean | undefined;
  onToggleHelpful: (insightId: string) => boolean | undefined;
  isMobile?: boolean;
  onClose?: () => void;
}

export function DetailPanel({
  insight,
  onToggleSaved,
  onToggleHelpful,
  isMobile = false,
  onClose,
}: DetailPanelProps) {
  const [isAnimating, setIsAnimating] = useState<'saved' | 'helpful' | null>(null);

  if (!insight) {
    return (
      <div className={cn(
        'bg-card border-l p-6 flex items-center justify-center',
        isMobile ? 'fixed inset-0 z-50 bg-background' : 'sticky top-0 h-screen'
      )}>
        <div className="text-center text-muted-foreground">
          <div className="mb-2 text-2xl">📊</div>
          <p>Select an insight to view details</p>
        </div>
      </div>
    );
  }

  const handleSaveClick = () => {
    onToggleSaved(insight.id);
    setIsAnimating('saved');
    setTimeout(() => setIsAnimating(null), 600);
  };

  const handleHelpfulClick = () => {
    const newHelpfulState = onToggleHelpful(insight.id);
    setIsAnimating('helpful');
    setTimeout(() => setIsAnimating(null), 600);

  };

  const handleShare = () => {
    const url = `${window.location.origin}/ai-insights?insight=${insight.id}`;
    navigator.clipboard.writeText(url);
  
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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

  const formatDetailContent = (detail: string) => {
    const sections = detail.split('\n\n');
    return sections.map((section, index) => {
      if (section.startsWith('**') && section.endsWith('**')) {
        // Bold headers
        return (
          <h4 key={index} className="font-semibold text-foreground mb-2 mt-4">
            {section.replace(/\*\*/g, '')}
          </h4>
        );
      } else if (section.includes('•')) {
        // Bullet points
        const lines = section.split('\n');
        const header = lines[0];
        const bullets = lines.slice(1).filter(line => line.trim().startsWith('•'));
        
        return (
          <div key={index} className="mb-4">
            {header && !header.startsWith('•') && (
              <p className="text-sm text-muted-foreground mb-2">{header}</p>
            )}
            <ul className="space-y-1">
              {bullets.map((bullet, bulletIndex) => (
                <li key={bulletIndex} className="text-sm text-foreground flex items-start gap-2">
                  <span className="text-primary mt-1.5 w-1 h-1 bg-current rounded-full flex-shrink-0" />
                  <span>{bullet.replace('•', '').trim()}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      } else {
        // Regular paragraphs
        return (
          <p key={index} className="text-sm text-muted-foreground mb-3 leading-relaxed">
            {section}
          </p>
        );
      }
    });
  };

  return (
    <div className={cn(
      'bg-card border-l animate-slide-in-right',
      isMobile ? 'fixed inset-0 z-50 bg-background' : 'sticky top-0 h-screen'
    )}>
      <ScrollArea className="h-full">
        <div className="p-6">
          {/* Mobile close button */}
          {isMobile && onClose && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10"
              onClick={onClose}
              aria-label="Close details"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground leading-tight mb-4 pr-8">
              {insight.title}
            </h1>
            
            {/* Metadata */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(insight.date)}</span>
              </div>
              <div className={cn(
                'px-3 py-1 rounded-md text-sm font-medium',
                getCategoryColor(insight.category)
              )}>
                {insight.category}
              </div>
            </div>

            {/* Tags */}
            {insight.tags.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-1">
                  {insight.tags.map(tag => (
                    <span
                      key={tag}
                      className="insight-tag"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'gap-2',
                  isAnimating === 'saved' && 'animate-bounce-subtle'
                )}
                onClick={handleSaveClick}
              >
                <Bookmark
                  className={cn(
                    'h-4 w-4',
                    insight.saved && 'fill-current text-primary'
                  )}
                />
                {insight.saved ? 'Saved' : 'Save'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'gap-2',
                  isAnimating === 'helpful' && 'animate-bounce-subtle'
                )}
                onClick={handleHelpfulClick}
              >
                <ThumbsUp
                  className={cn(
                    'h-4 w-4',
                    insight.helpful && 'fill-current text-success'
                  )}
                />
                {insight.helpful ? 'Helpful' : 'Mark helpful'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {formatDetailContent(insight.detail)}
          </div>

          {/* Footer actions */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="flex-1">
                Mark as resolved
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Add note
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}