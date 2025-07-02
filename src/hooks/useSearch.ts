
import { useState, useCallback } from 'react';
import { useRecipes, Recipe } from '@/hooks/useRecipes';
import { useNavigate } from 'react-router-dom';

export const useSearchFunctionality = () => {
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const { refetchRecipes } = useRecipes();
  const navigate = useNavigate();

  const performSearch = useCallback(async (query: string, navigateToResults = false) => {
    if (!query.trim()) return [];

    try {
      // Use the existing refetchRecipes function with search
      if (refetchRecipes) {
        await refetchRecipes(undefined, undefined, query);
      }
      
      // Navigate to results page if requested
      if (navigateToResults) {
        navigate(`/recipes?search=${encodeURIComponent(query)}`);
      }
      
      return [];
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }, [refetchRecipes, navigate]);

  const handleSearchInput = useCallback((query: string, debounce = true) => {
    setLocalSearchQuery(query);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    if (debounce) {
      const timeout = setTimeout(() => {
        performSearch(query);
      }, 500);
      
      setSearchTimeout(timeout);
    } else {
      performSearch(query);
    }
  }, [performSearch, searchTimeout]);

  const handleSearchSubmit = useCallback((query: string) => {
    performSearch(query, true);
  }, [performSearch]);

  return {
    searchQuery: localSearchQuery,
    setSearchQuery: setLocalSearchQuery,
    handleSearchInput,
    handleSearchSubmit,
    performSearch,
  };
};
