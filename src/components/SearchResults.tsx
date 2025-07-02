
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Recipe } from '@/hooks/useRecipes';

interface SearchResultsProps {
  results: Recipe[];
  query: string;
  isLoading?: boolean;
}

const getFallbackImage = (index: number) => {
  const fallbackImages = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  ];
  return fallbackImages[index % fallbackImages.length];
};

export const SearchResults: React.FC<SearchResultsProps> = ({ results, query, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex space-x-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold mb-2">No results found</h3>
        <p className="text-muted-foreground">
          No recipes found for "{query}". Try adjusting your search terms.
        </p>
      </div>
    );
  }

  return (
    <div>
      {query && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Search Results for "{query}"
          </h2>
          <p className="text-muted-foreground">
            Found {results.length} recipe{results.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((recipe, index) => (
          <div key={recipe.id} className="recipe-card group">
            <div className="recipe-card-image-container">
              <img 
                src={recipe.image_url || getFallbackImage(index)} 
                alt={recipe.title} 
                className="recipe-card-image"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                  {recipe.categories?.[0]?.name || 'Recipe'}
                </span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {(recipe.prep_time_in_min || 0) + (recipe.cook_time_in_min || 0)} min
                </span>
              </div>
              <h3 className="font-playfair font-semibold text-lg mb-2">
                <Link to={`/recipes/${recipe.slug}`} className="hover:text-primary transition-colors">
                  {recipe.title}
                </Link>
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {recipe.excerpt || recipe.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src={recipe.author?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                    alt={recipe.author?.name || "Chef"} 
                    className="w-6 h-6 rounded-full object-cover mr-2" 
                  />
                  <span className="text-xs">{recipe.author?.name || "Chef"}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
