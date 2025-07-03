
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { Separator } from "@/components/ui/separator";
import { Clock, User, Users, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Comments } from "@/components/Comments";

interface Recipe {
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
  image_url?: string;
  author?: { id: number; name: string; email: string; avatar_url?: string };
  tags?: { id: number; name: string }[];
}

// Fallback image for recipes without images
const getFallbackImage = () => {
  return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
};

const RecipeDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Helper function to extract text from structured content
  const extractTextFromContent = (content: any[]): string[] => {
    if (!content || !Array.isArray(content)) return [];
    
    return content.map(item => {
      if (item.children && Array.isArray(item.children)) {
        return item.children.map((child: any) => child.text || '').join('');
      }
      return item.text || '';
    }).filter(text => text.trim() !== '');
  };
  
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!slug) {
        setError("Recipe slug not found");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('Fetching recipe with slug:', slug);
        
        // Use the search_recipes function to get recipe with tags
        const { data, error } = await supabase
          .rpc('search_recipes', {
            search_query: '',
            category_filter: null,
            difficulty_filter: null,
            tag_filter: null,
            limit_count: 50,
            offset_count: 0
          });

        if (error) {
          console.error('Error fetching recipes:', error);
          setError(error.message);
          return;
        }

        // Find the recipe with matching slug
        const foundRecipe = data?.find((r: any) => r.slug === slug);
        
        if (!foundRecipe) {
          setError("Recipe not found");
          return;
        }

        console.log('Found recipe:', foundRecipe);

        // Transform the data to match our Recipe interface
        const transformedRecipe = {
          ...foundRecipe,
          categories: Array.isArray(foundRecipe.categories) ? foundRecipe.categories : [],
          tags: Array.isArray(foundRecipe.tags) ? foundRecipe.tags : [],
          image_url: foundRecipe.image_url ? (
            foundRecipe.image_url.startsWith('http') 
              ? foundRecipe.image_url 
              : `https://fbtiogcqxtgzefbdrwqm.supabase.co/storage/v1/object/public/supabase/${foundRecipe.image_url}`
          ) : null,
          author: foundRecipe.author && Object.keys(foundRecipe.author).length > 0 ? {
            ...foundRecipe.author,
            avatar_url: foundRecipe.author.avatar_url ? (
              foundRecipe.author.avatar_url.startsWith('http')
                ? foundRecipe.author.avatar_url
                : `https://fbtiogcqxtgzefbdrwqm.supabase.co/storage/v1/object/public/supabase/${foundRecipe.author.avatar_url}`
            ) : null
          } : null
        };

        setRecipe(transformedRecipe);
        setError(null);
      } catch (err) {
        console.error('Unexpected error fetching recipe:', err);
        setError('Failed to fetch recipe');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [slug]);
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-6 w-40 bg-muted rounded mb-4"></div>
            <div className="h-12 w-64 bg-muted rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !recipe) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-playfair font-bold mb-4">Recipe not found</h1>
            <p className="text-muted-foreground">
              {error || "The recipe you're looking for doesn't exist or has been removed."}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Extract ingredients and instructions text
  const ingredientsList = extractTextFromContent(recipe.ingredients);
  const instructionsList = extractTextFromContent(recipe.instructions);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[400px] md:h-[500px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url('${recipe.image_url || getFallbackImage()}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
          
          <div className="container mx-auto px-4 h-full flex items-end pb-12 md:pb-20 relative z-10">
            <div className="max-w-3xl text-white">
              <div className="mb-4">
                {recipe.categories && recipe.categories.length > 0 && (
                  <span className="uppercase text-xs tracking-wider font-medium bg-primary text-primary-foreground px-3 py-1 rounded-full inline-block">
                    {recipe.categories[0].name}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-playfair font-bold mb-4">
                {recipe.title}
              </h1>
            </div>
          </div>
        </section>
        
        {/* Recipe Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-card p-6 md:p-8 rounded-md border border-border mb-8">
                {/* Recipe meta info */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      <strong>Prep:</strong> {recipe.prep_time_in_min || 0} mins
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      <strong>Cook:</strong> {recipe.cook_time_in_min || 0} mins
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      <strong>Total:</strong> {(recipe.prep_time_in_min || 0) + (recipe.cook_time_in_min || 0)} mins
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      <strong>Serves:</strong> {recipe.servings || 1}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      <strong>Difficulty:</strong> {recipe.difficulty || 'Medium'}
                    </span>
                  </div>
                </div>
                
                {/* Author info */}
                <div className="flex items-center mb-8">
                  <img 
                    src={recipe.author?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                    alt={recipe.author?.name || "Chef"}
                    className="w-10 h-10 rounded-full object-cover mr-3" 
                  />
                  <div>
                    <p className="text-sm font-medium">{recipe.author?.name || "Chef"}</p>
                    <time className="text-xs text-muted-foreground" dateTime={recipe.published_at || ''}>
                      {formatDate(recipe.published_at)}
                    </time>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                {/* Description */}
                <div className="mb-8">
                  <p className="text-base leading-relaxed">{recipe.description}</p>
                </div>
                
                {/* Ingredients */}
                <div className="mb-8">
                  <h2 className="font-playfair text-2xl font-semibold mb-4">Ingredients</h2>
                  <ul className="space-y-2">
                    {ingredientsList.length > 0 ? (
                      ingredientsList.map((ingredient: string, index: number) => (
                        <li key={index} className="flex items-baseline">
                          <span className="w-2 h-2 rounded-full bg-primary mr-3 mt-1.5"></span>
                          <span>{ingredient}</span>
                        </li>
                      ))
                    ) : (
                      <li className="flex items-baseline">
                        <span className="w-2 h-2 rounded-full bg-primary mr-3 mt-1.5"></span>
                        <span>Ingredients not available</span>
                      </li>
                    )}
                  </ul>
                </div>
                
                {/* Instructions */}
                <div className="mb-8">
                  <h2 className="font-playfair text-2xl font-semibold mb-4">Instructions</h2>
                  <ol className="space-y-6">
                    {instructionsList.length > 0 ? (
                      instructionsList.map((instruction: string, index: number) => (
                        <li key={index} className="flex">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium mr-4">
                            {index + 1}
                          </span>
                          <span className="pt-1">{instruction}</span>
                        </li>
                      ))
                    ) : (
                      <li className="flex">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium mr-4">
                          1
                        </span>
                        <span className="pt-1">Instructions not available</span>
                      </li>
                    )}
                  </ol>
                </div>
                
                {/* Nutrition Facts */}
                <div className="mb-8">
                  <h2 className="font-playfair text-2xl font-semibold mb-4">Nutrition Facts</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-secondary p-4 rounded-md text-center">
                      <p className="text-lg font-semibold">{recipe.nutrition_calories || 0}</p>
                      <p className="text-xs text-muted-foreground uppercase">Calories</p>
                    </div>
                    <div className="bg-secondary p-4 rounded-md text-center">
                      <p className="text-lg font-semibold">{recipe.nutrition_protein_in_g || 0}g</p>
                      <p className="text-xs text-muted-foreground uppercase">Protein</p>
                    </div>
                    <div className="bg-secondary p-4 rounded-md text-center">
                      <p className="text-lg font-semibold">{recipe.nutrition_carbs_in_g || 0}g</p>
                      <p className="text-xs text-muted-foreground uppercase">Carbs</p>
                    </div>
                    <div className="bg-secondary p-4 rounded-md text-center">
                      <p className="text-lg font-semibold">{recipe.nutrition_fat_in_g || 0}g</p>
                      <p className="text-xs text-muted-foreground uppercase">Fat</p>
                    </div>
                  </div>
                </div>
                
                {/* Recipe Tags - Only show actual tags from the recipe */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Recipe Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags && recipe.tags.length > 0 ? (
                      recipe.tags.map((tag) => (
                        <span 
                          key={tag.id} 
                          className="bg-secondary hover:bg-secondary/70 transition-colors text-xs px-3 py-1 rounded-full inline-flex items-center"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">No tags assigned</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Comments Section */}
              <div className="bg-card p-6 md:p-8 rounded-md border border-border">
                <Comments recipeId={recipe.id} />
              </div>
            </div>
            
            {/* Sidebar - Show only recipe-specific tags */}
            <div className="lg:col-span-1">
              <Sidebar 
                recipeSpecificTags={recipe.tags || []}
                showOnlyRecipeTags={true}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipeDetail;
