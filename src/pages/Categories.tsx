
import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { recipes } from "@/data/recipes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/context/LanguageContext";

const Categories = () => {
  const { t } = useLanguage();
  
  // Get unique categories
  const allCategories = Array.from(new Set(recipes.map(recipe => recipe.category)));
  
  const [activeCategory, setActiveCategory] = useState<string>(allCategories[0] || "");
  
  // Get recipes by category
  const getRecipesByCategory = (category: string) => {
    return recipes.filter(recipe => recipe.category === category);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[300px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
          
          <div className="container mx-auto px-4 h-full flex items-end pb-12 md:pb-20 relative z-10">
            <div className="max-w-3xl text-white">
              <h1 className="text-3xl md:text-5xl font-playfair font-bold mb-4">
                Recipe Categories
              </h1>
              <p className="text-sm md:text-base opacity-90">
                Browse recipes by category
              </p>
            </div>
          </div>
        </section>
        
        {/* Categories Content */}
        <div className="container mx-auto px-4 py-12">
          <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="w-full overflow-x-auto flex flex-nowrap justify-start mb-8 pb-2">
              {allCategories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="px-6 py-2 whitespace-nowrap"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {allCategories.map(category => (
              <TabsContent key={category} value={category}>
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-6">
                    {category} Recipes
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Browse recipes by category
                  </p>
                  
                  <Separator className="mb-8" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getRecipesByCategory(category).map((recipe) => (
                      <div key={recipe.id} className="recipe-card group">
                        <div className="recipe-card-image-container">
                          <img 
                            src={recipe.image} 
                            alt={recipe.title} 
                            className="recipe-card-image"
                          />
                        </div>
                        <div className="p-5">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                            <time dateTime={recipe.publishedAt}>{formatDate(recipe.publishedAt)}</time>
                            <span>{recipe.prepTime + recipe.cookTime} mins</span>
                          </div>
                          <h3 className="font-playfair font-semibold text-lg mb-2">
                            <Link to={`/recipes/${recipe.slug}`} className="hover:text-primary transition-colors">
                              {recipe.title}
                            </Link>
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{recipe.excerpt}</p>
                          <div className="flex items-center">
                            <img 
                              src={recipe.author.avatar} 
                              alt={recipe.author.name} 
                              className="w-8 h-8 rounded-full object-cover mr-2" 
                            />
                            <span className="text-xs">{recipe.author.name}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Categories;
