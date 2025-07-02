
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/context/LanguageContext";
import { useRecipes } from "@/hooks/useRecipes";
import { Clock } from "lucide-react";

// Fallback image for recipes without images
const getFallbackImage = (index: number) => {
  const fallbackImages = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  ];
  return fallbackImages[index % fallbackImages.length];
};

const Categories = () => {
  const { t } = useLanguage();
  const { recipes, categories, loading, error } = useRecipes();
  const [activeCategory, setActiveCategory] = useState<string>("");
  
  // Set initial category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].slug);
    }
  }, [categories, activeCategory]);
  
  // Get recipes by category
  const getRecipesByCategory = (categorySlug: string) => {
    return recipes.filter(recipe => 
      recipe.categories?.some(cat => cat.slug === categorySlug)
    );
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Loading categories...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-red-600">Error loading categories: {error}</p>
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
                {t("categories")}
              </h1>
              <p className="text-sm md:text-base opacity-90">
                Browse recipes by category
              </p>
            </div>
          </div>
        </section>
        
        {/* Categories Content */}
        <div className="container mx-auto px-4 py-12">
          {categories.length > 0 ? (
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <TabsList className="w-full overflow-x-auto flex flex-nowrap justify-start mb-8 pb-2">
                {categories.map(category => (
                  <TabsTrigger 
                    key={category.slug} 
                    value={category.slug}
                    className="px-6 py-2 whitespace-nowrap"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map(category => (
                <TabsContent key={category.slug} value={category.slug}>
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-6">
                      {category.name} Recipes
                    </h2>
                    <p className="text-muted-foreground mb-8">
                      {category.description || 'Browse recipes in this category'}
                    </p>
                    
                    <Separator className="mb-8" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {getRecipesByCategory(category.slug).map((recipe, index) => (
                        <div key={recipe.id} className="recipe-card group">
                          <div className="recipe-card-image-container">
                            <img 
                              src={recipe.image_url || getFallbackImage(index)} 
                              alt={recipe.title} 
                              className="recipe-card-image"
                            />
                          </div>
                          <div className="p-5">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                                {recipe.categories?.[0]?.name || 'Recipe'}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {(recipe.prep_time_in_min || 0) + (recipe.cook_time_in_min || 0)} {t("minutes")}
                              </span>
                            </div>
                            <h3 className="font-playfair font-semibold text-lg mb-2">
                              <Link to={`/recipes/${recipe.slug}`} className="hover:text-primary transition-colors">
                                {recipe.title}
                              </Link>
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{recipe.excerpt || recipe.description}</p>
                            <div className="flex items-center">
                              <img 
                                src={recipe.author?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                                alt={recipe.author?.name || "Chef"} 
                                className="w-8 h-8 rounded-full object-cover mr-2" 
                              />
                              <div>
                                <span className="text-xs">{recipe.author?.name || "Chef"}</span>
                                <time className="text-xs text-muted-foreground block" dateTime={recipe.published_at || ''}>
                                  {formatDate(recipe.published_at)}
                                </time>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {getRecipesByCategory(category.slug).length === 0 && (
                      <div className="text-center py-12">
                        <h3 className="text-xl font-playfair font-semibold mb-2">No recipes found</h3>
                        <p className="text-muted-foreground">
                          There are no recipes in this category yet.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-playfair font-semibold mb-2">No categories found</h3>
              <p className="text-muted-foreground">
                Categories will appear here once they are added.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Categories;
