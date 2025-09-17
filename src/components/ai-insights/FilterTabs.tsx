import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { InsightFilter } from '../../hooks/use-insights';

interface FilterTabsProps {
  currentFilter: InsightFilter;
  onFilterChange: (filter: InsightFilter) => void;
  counts: {
    all: number;
    saved: number;
    helpful: number;
  };
}

export function FilterTabs({ currentFilter, onFilterChange, counts }: FilterTabsProps) {
  return (
    <Tabs value={currentFilter} onValueChange={(value) => onFilterChange(value as InsightFilter)}>
      <TabsList className="grid w-full grid-cols-3 bg-muted/50">
        <TabsTrigger value="all" className="flex items-center gap-2">
          All
          <span className="bg-muted-foreground/20 text-muted-foreground px-1.5 py-0.5 rounded text-xs font-medium">
            {counts.all}
          </span>
        </TabsTrigger>
        <TabsTrigger value="saved" className="flex items-center gap-2">
          Saved
          <span className="bg-muted-foreground/20 text-muted-foreground px-1.5 py-0.5 rounded text-xs font-medium">
            {counts.saved}
          </span>
        </TabsTrigger>
        <TabsTrigger value="helpful" className="flex items-center gap-2">
          Helpful
          <span className="bg-muted-foreground/20 text-muted-foreground px-1.5 py-0.5 rounded text-xs font-medium">
            {counts.helpful}
          </span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}