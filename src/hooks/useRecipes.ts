
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Recipe {
  id: number;
  title: string;
  slug: string;
  description: string;
  excerpt: string;
  difficulty: string;
  prep_time_in_min: number;
  cook_time_in_min: number;
  servings: number;
  featured: boolean;
  trending: boolean;
  editors_pick: boolean;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  ingredients: any;
  instructions: any;
  nutrition_calories: number;
  nutrition_protein_in_g: number;
  nutrition_carbs_in_g: number;
  nutrition_fat_in_g: number;
  categories?: { id: number; name: string; slug: string }[];
  image_url?: string;
  author?: { id: number; name: string; email: string; avatar_url?: string };
  tags?: { id: number; name: string }[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = async (
    categoryFilter?: string, 
    difficultyFilter?: string,
    searchQuery?: string,
    tagFilter?: string,
    limit = 50,
    offset = 0
  ) => {
    try {
      setLoading(true);
      
      // Use the PostgreSQL function to search recipes with proper tag filtering
      const { data: recipesData, error: recipesError } = await supabase
        .rpc('search_recipes', {
          search_query: searchQuery || '',
          category_filter: categoryFilter || null,
          difficulty_filter: difficultyFilter || null,
          tag_filter: tagFilter || null,
          limit_count: limit,
          offset_count: offset
        });

      if (recipesError) {
        console.error('Error fetching recipes:', recipesError);
        setError(recipesError.message);
        return;
      }

      // Transform the data to match our Recipe interface
      const transformedRecipes = Array.isArray(recipesData) ? recipesData.map((recipe: any) => ({
        ...recipe,
        categories: Array.isArray(recipe.categories) ? recipe.categories : [],
        tags: Array.isArray(recipe.tags) ? recipe.tags : [],
        image_url: recipe.image_url ? (
          recipe.image_url.startsWith('http') 
            ? recipe.image_url 
            : `https://fbtiogcqxtgzefbdrwqm.supabase.co/storage/v1/object/public/supabase/${recipe.image_url}`
        ) : null,
        author: recipe.author && Object.keys(recipe.author).length > 0 ? {
          ...recipe.author,
          avatar_url: recipe.author.avatar_url ? (
            recipe.author.avatar_url.startsWith('http')
              ? recipe.author.avatar_url
              : `https://fbtiogcqxtgzefbdrwqm.supabase.co/storage/v1/object/public/supabase/${recipe.author.avatar_url}`
          ) : null
        } : null
      })) : [];

      setRecipes(transformedRecipes);
      setError(null);
    } catch (err) {
      console.error('Unexpected error fetching recipes:', err);
      setError('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, description')
        .not('published_at', 'is', null);

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      setCategories(data || []);
    } catch (err) {
      console.error('Unexpected error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchRecipes();
  }, []);

  return {
    recipes,
    categories,
    loading,
    error,
    refetchRecipes: fetchRecipes
  };
};
