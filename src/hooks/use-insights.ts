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
      // Try to load from localStorage first
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
        setInsights(parsedData.insights);
        setSelectedInsightId(parsedData.insights[0]?.id || null);
      } else {
        // Load from mockup.json
        const response = await fetch('/mockup.json');
        const data = await response.json();
        setInsights(data.insights);
        setSelectedInsightId(data.insights[0]?.id || null);
        // Cache in localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save data to localStorage whenever insights change
  const saveInsights = (updatedInsights: Insight[]) => {
    const data = { insights: updatedInsights };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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