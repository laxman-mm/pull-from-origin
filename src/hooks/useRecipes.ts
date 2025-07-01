
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

  const fetchRecipes = async (categoryFilter?: string, difficultyFilter?: string) => {
    try {
      setLoading(true);
      
      // Build the query
      let query = supabase
        .from('receipes')
        .select(`
          id,
          title,
          slug,
          description,
          excerpt,
          difficulty,
          prep_time_in_min,
          cook_time_in_min,
          servings,
          featured,
          trending,
          created_at,
          updated_at,
          published_at,
          ingredients,
          instructions,
          nutrition_calories,
          nutrition_protein_in_g,
          nutrition_carbs_in_g,
          nutrition_fat_in_g,
          receipes_categories_lnk!inner(
            categories!inner(
              id,
              name,
              slug
            )
          )
        `)
        .not('published_at', 'is', null);

      // Apply category filter if provided
      if (categoryFilter) {
        query = query.eq('receipes_categories_lnk.categories.slug', categoryFilter);
      }

      // Apply difficulty filter if provided
      if (difficultyFilter) {
        query = query.eq('difficulty', difficultyFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching recipes:', error);
        setError(error.message);
        return;
      }

      // Transform the data to match our Recipe interface
      const transformedRecipes = data?.map((recipe: any) => ({
        ...recipe,
        categories: recipe.receipes_categories_lnk?.map((link: any) => link.categories) || []
      })) || [];

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
