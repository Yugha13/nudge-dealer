import { useState, useEffect, useMemo } from 'react';

export interface Insight {
  id: string;
  title: string;
  summary: string;
  detail: string;
  date: string;
  tags: string[];
  category: string;
  saved: boolean;
  helpful: boolean;
}

export type InsightFilter = 'all' | 'saved' | 'helpful';

const STORAGE_KEY = 'ai-insights-data';

export function useInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInsightId, setSelectedInsightId] = useState<string | null>(null);
  const [filter, setFilter] = useState<InsightFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load initial data
  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      // Always load mockup data
      const mockupData = [
        {
          id: '1',
          title: 'Sales Trend Analysis',
          summary: 'Sales have increased by 15% compared to last month',
          detail: 'Detailed analysis shows that the increase is primarily due to the new product line and improved marketing campaigns.',
          date: new Date().toISOString(),
          tags: ['sales', 'trend', 'analysis'],
          category: 'trend',
          saved: false,
          helpful: false
        },
        {
          id: '2',
          title: 'Inventory Alert',
          summary: 'Low stock detected for 5 popular items',
          detail: 'The following items are running low on stock and may need to be reordered soon: Item A, Item B, Item C, Item D, Item E.',
          date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          tags: ['inventory', 'alert', 'stock'],
          category: 'action',
          saved: true,
          helpful: true
        },
        {
          id: '3',
          title: 'Customer Satisfaction Score',
          summary: 'Customer satisfaction score is at 4.7/5 this month',
          detail: 'The customer satisfaction score has improved by 0.2 points compared to last month. Positive feedback highlights excellent customer service and product quality.',
          date: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
          tags: ['customer', 'feedback', 'satisfaction'],
          category: 'forecast',
          saved: false,
          helpful: true
        }
      ];
      
      setInsights(mockupData);
      setSelectedInsightId(mockupData[0]?.id || null);
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update insights in state only (no persistence to localStorage)
  const saveInsights = (updatedInsights: Insight[]) => {
    setInsights(updatedInsights);
  };

  // Toggle saved state
  const toggleSaved = (insightId: string) => {
    const updatedInsights = insights.map(insight =>
      insight.id === insightId
        ? { ...insight, saved: !insight.saved }
        : insight
    );
    saveInsights(updatedInsights);
    return updatedInsights.find(i => i.id === insightId)?.saved;
  };

  // Toggle helpful state
  const toggleHelpful = (insightId: string) => {
    const updatedInsights = insights.map(insight =>
      insight.id === insightId
        ? { ...insight, helpful: !insight.helpful }
        : insight
    );
    saveInsights(updatedInsights);
    return updatedInsights.find(i => i.id === insightId)?.helpful;
  };

  // Filter and search insights
  const filteredInsights = useMemo(() => {
    let filtered = insights;

    // Apply filter
    switch (filter) {
      case 'saved':
        filtered = insights.filter(insight => insight.saved);
        break;
      case 'helpful':
        filtered = insights.filter(insight => insight.helpful);
        break;
      default:
        filtered = insights;
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(insight =>
        insight.title.toLowerCase().includes(query) ||
        insight.summary.toLowerCase().includes(query) ||
        insight.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [insights, filter, searchQuery]);

  // Get counts for tabs
  const counts = useMemo(() => {
    return {
      all: insights.length,
      saved: insights.filter(i => i.saved).length,
      helpful: insights.filter(i => i.helpful).length,
    };
  }, [insights]);

  // Get selected insight
  const selectedInsight = insights.find(insight => insight.id === selectedInsightId);

  // Reset demo data
  const resetDemoData = async () => {
    localStorage.removeItem(STORAGE_KEY);
    await loadInsights();
  };

  return {
    insights: filteredInsights,
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
  };
}