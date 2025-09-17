import { Button } from '@/components/ui/button';
import type { InsightFilter } from '../../hooks/use-insights';

interface EmptyStateProps {
  filter: InsightFilter;
  onFilterChange: (filter: InsightFilter) => void;
  onClearSearch?: () => void;
  hasSearchQuery?: boolean;
}

export function EmptyState({ filter, onFilterChange, onClearSearch }: EmptyStateProps) {
  const getEmptyStateContent = () => {
    switch (filter) {
      case 'saved':
        return {
          icon: '🔖',
          title: 'No saved insights yet',
          description: 'You haven\'t saved any insights yet. Save important items here to review later.',
          buttonText: 'Explore All Insights',
          action: () => onFilterChange('all'),
        };
      case 'helpful':
        return {
          icon: '👍',
          title: 'No helpful insights yet',
          description: 'No helpful insights yet — mark an insight helpful with the thumbs-up.',
          buttonText: 'View All Insights',
          action: () => onFilterChange('all'),
        };
      default:
        return {
          icon: '🔍',
          title: 'No insights found',
          description: 'No insights match your current search criteria. Try adjusting your search or filters.',
          buttonText: 'Clear Search',
          action: onClearSearch || (() => {}),
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="flex flex-col items-center justify-center h-96 text-center p-8">
      <div className="text-6xl mb-4" role="img" aria-label={content.title}>
        {content.icon}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {content.title}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
        {content.description}
      </p>
      <Button onClick={content.action} className="bg-primary hover:bg-primary/90">
        {content.buttonText}
      </Button>
    </div>
  );
}