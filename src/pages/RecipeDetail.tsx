
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { Separator } from "@/components/ui/separator";
import { recipes, Recipe } from "@/data/recipes";
import { Clock, User, Users, Tag } from "lucide-react";

const RecipeDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API fetch
    setIsLoading(true);
    setTimeout(() => {
      const foundRecipe = recipes.find((r) => r.slug === slug);
      setRecipe(foundRecipe || null);
      setIsLoading(false);
    }, 500);
  }, [slug]);
  
  // Format date
  const formatDate = (dateString: string) => {
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
  
  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-playfair font-bold mb-4">Recipe not found</h1>
            <p className="text-muted-foreground">The recipe you're looking for doesn't exist or has been removed.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[400px] md:h-[500px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${recipe.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
          
          <div className="container mx-auto px-4 h-full flex items-end pb-12 md:pb-20 relative z-10">
            <div className="max-w-3xl text-white">
              <div className="mb-4">
                {recipe.category && (
                  <span className="uppercase text-xs tracking-wider font-medium bg-primary text-primary-foreground px-3 py-1 rounded-full inline-block">
                    {recipe.category}
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
                      <strong>Prep:</strong> {recipe.prepTime} mins
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      <strong>Cook:</strong> {recipe.cookTime} mins
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      <strong>Total:</strong> {recipe.prepTime + recipe.cookTime} mins
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      <strong>Serves:</strong> {recipe.servings}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      <strong>Difficulty:</strong> {recipe.difficulty}
                    </span>
                  </div>
                </div>
                
                {/* Author info */}
                <div className="flex items-center mb-8">
                  <img 
                    src={recipe.author.avatar} 
                    alt={recipe.author.name}
                    className="w-10 h-10 rounded-full object-cover mr-3" 
                  />
                  <div>
                    <p className="text-sm font-medium">{recipe.author.name}</p>
                    <time className="text-xs text-muted-foreground" dateTime={recipe.publishedAt}>
                      {formatDate(recipe.publishedAt)}
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
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-baseline">
                        <span className="w-2 h-2 rounded-full bg-primary mr-3 mt-1.5"></span>
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Instructions */}
                <div className="mb-8">
                  <h2 className="font-playfair text-2xl font-semibold mb-4">Instructions</h2>
                  <ol className="space-y-6">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium mr-4">
                          {index + 1}
                        </span>
                        <span className="pt-1">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                
                {/* Nutrition Facts */}
                <div className="mb-8">
                  <h2 className="font-playfair text-2xl font-semibold mb-4">Nutrition Facts</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-secondary p-4 rounded-md text-center">
                      <p className="text-lg font-semibold">{recipe.nutritionFacts.calories}</p>
                      <p className="text-xs text-muted-foreground uppercase">Calories</p>
                    </div>
                    <div className="bg-secondary p-4 rounded-md text-center">
                      <p className="text-lg font-semibold">{recipe.nutritionFacts.protein}g</p>
                      <p className="text-xs text-muted-foreground uppercase">Protein</p>
                    </div>
                    <div className="bg-secondary p-4 rounded-md text-center">
                      <p className="text-lg font-semibold">{recipe.nutritionFacts.carbs}g</p>
                      <p className="text-xs text-muted-foreground uppercase">Carbs</p>
                    </div>
                    <div className="bg-secondary p-4 rounded-md text-center">
                      <p className="text-lg font-semibold">{recipe.nutritionFacts.fat}g</p>
                      <p className="text-xs text-muted-foreground uppercase">Fat</p>
                    </div>
                  </div>
                </div>
                
                {/* Tags */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="bg-secondary hover:bg-secondary/70 transition-colors text-xs px-3 py-1 rounded-full inline-flex items-center"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
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
