import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { Separator } from "@/components/ui/separator";
import { Clock, User, Users, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
}

// Recipe placeholder images based on category/type
const getRecipeImage = (recipe: Recipe) => {
  if (recipe.title.toLowerCase().includes('pasta') || recipe.title.toLowerCase().includes('italian')) {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
  } else if (recipe.title.toLowerCase().includes('pizza')) {
    return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
  } else if (recipe.title.toLowerCase().includes('pancake') || recipe.title.toLowerCase().includes('breakfast')) {
    return 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
  } else if (recipe.title.toLowerCase().includes('salad') || recipe.title.toLowerCase().includes('healthy')) {
    return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
  } else if (recipe.title.toLowerCase().includes('burger') || recipe.title.toLowerCase().includes('sandwich')) {
    return 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
  } else if (recipe.title.toLowerCase().includes('cake') || recipe.title.toLowerCase().includes('dessert') || recipe.title.toLowerCase().includes('cookie')) {
    return 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
  } else if (recipe.title.toLowerCase().includes('soup')) {
    return 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
  } else if (recipe.title.toLowerCase().includes('steak') || recipe.title.toLowerCase().includes('meat') || recipe.title.toLowerCase().includes('beef')) {
    return 'https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
  } else if (recipe.title.toLowerCase().includes('sushi') || recipe.title.toLowerCase().includes('asian')) {
    return 'https://images.unsplash.com/photo-1563379091339-03246963d321?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
  } else if (recipe.title.toLowerCase().includes('taco') || recipe.title.toLowerCase().includes('mexican')) {
    return 'https://images.unsplash.com/photo-1572441713132-51c75654db73?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
  } else {
    // Default food image
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
  }
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
        
        const { data, error } = await supabase
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
          .eq('slug', slug)
          .not('published_at', 'is', null)
          .single();

        if (error) {
          console.error('Error fetching recipe:', error);
          setError(error.message);
          return;
        }

        console.log('Fetched recipe data:', data);

        // Transform the data to match our Recipe interface
        const transformedRecipe = {
          ...data,
          categories: data.receipes_categories_lnk?.map((link: any) => link.categories) || []
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
            style={{ backgroundImage: `url('${getRecipeImage(recipe)}')` }}
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
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                    alt="Chef"
                    className="w-10 h-10 rounded-full object-cover mr-3" 
                  />
                  <div>
                    <p className="text-sm font-medium">Chef</p>
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
                
                {/* Categories as Tags */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.categories && recipe.categories.length > 0 ? (
                      recipe.categories.map((category) => (
                        <span 
                          key={category.id} 
                          className="bg-secondary hover:bg-secondary/70 transition-colors text-xs px-3 py-1 rounded-full inline-flex items-center"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {category.name}
                        </span>
                      ))
                    ) : (
                      <span className="bg-secondary text-xs px-3 py-1 rounded-full inline-flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        Uncategorized
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Comments Section */}
              <div className="bg-card p-6 md:p-8 rounded-md border border-border">
                <h2 className="font-playfair text-2xl font-semibold mb-6">Comments</h2>
                
                {/* Comment form */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Leave a comment</h3>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium block">Name*</label>
                        <input 
                          id="name"
                          type="text" 
                          className="w-full p-2 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium block">Email* (will not be published)</label>
                        <input 
                          id="email"
                          type="email" 
                          className="w-full p-2 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="comment" className="text-sm font-medium block">Comment*</label>
                      <textarea 
                        id="comment"
                        className="w-full p-2 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary min-h-[120px]"
                        required
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      className="btn-primary"
                    >
                      Post Comment
                    </button>
                  </form>
                </div>
                
                {/* Sample comments */}
                <div className="space-y-8">
                  <article className="border-b border-border pb-6">
                    <div className="flex items-center mb-4">
                      <img 
                        src="https://i.pravatar.cc/150?img=7" 
                        alt="Sarah Johnson"
                        className="w-10 h-10 rounded-full object-cover mr-3" 
                      />
                      <div>
                        <h4 className="text-sm font-medium">Sarah Johnson</h4>
                        <time className="text-xs text-muted-foreground">
                          April 18, 2024
                        </time>
                      </div>
                    </div>
                    <p className="text-sm">
                      I made this recipe last weekend and it was absolutely delicious! The flavors were perfectly balanced and my whole family loved it. Will definitely be making this again soon!
                    </p>
                  </article>
                  
                  <article>
                    <div className="flex items-center mb-4">
                      <img 
                        src="https://i.pravatar.cc/150?img=8" 
                        alt="Michael Thompson"
                        className="w-10 h-10 rounded-full object-cover mr-3" 
                      />
                      <div>
                        <h4 className="text-sm font-medium">Michael Thompson</h4>
                        <time className="text-xs text-muted-foreground">
                          April 15, 2024
                        </time>
                      </div>
                    </div>
                    <p className="text-sm">
                      Great recipe! I added a little more garlic than called for and it turned out amazing. The instructions were clear and easy to follow. Thanks for sharing!
                    </p>
                  </article>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipeDetail;
