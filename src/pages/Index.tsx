
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Clock, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useRecipes } from "@/hooks/useRecipes";

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

const Index = () => {
  const { t } = useLanguage();
  const { recipes, loading, error, refetchRecipes } = useRecipes();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleTagFilter = (tagName: string) => {
    if (activeTag === tagName) {
      setActiveTag(null);
      refetchRecipes(); // Clear search
    } else {
      setActiveTag(tagName);
      refetchRecipes(undefined, undefined, tagName); // Search by tag
    }
  };

  const clearTagFilter = () => {
    setActiveTag(null);
    refetchRecipes();
  };

  // Filter recipes by search query
  const filteredRecipes = searchQuery.trim() === ""
    ? recipes
    : recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (recipe.description && recipe.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (recipe.excerpt && recipe.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  const featuredRecipes = filteredRecipes.filter(recipe => recipe.featured);
  const trendingRecipes = filteredRecipes.filter(recipe => recipe.trending);
  const editorsPickRecipes = filteredRecipes.filter(recipe => recipe.editors_pick);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
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
            <p className="text-lg">Loading recipes...</p>
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
            <p className="text-lg text-red-600 mb-4">Error loading recipes: {error}</p>
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
        {featuredRecipes[0] && (
          <section className="relative h-[500px] md:h-[600px] overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: `url('${featuredRecipes[0].image_url || getFallbackImage(0)}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
            
            <div className="container mx-auto px-4 h-full flex items-end pb-12 md:pb-20 relative z-10">
              <div className="max-w-3xl text-white">
                <span className="uppercase text-xs tracking-wider font-medium bg-primary text-primary-foreground px-3 py-1 rounded-full inline-block mb-4">
                  {t("featured_recipe")}
                </span>
                <h1 className="text-3xl md:text-5xl font-playfair font-bold mb-4">
                  {featuredRecipes[0].title}
                </h1>
                <p className="text-sm md:text-base opacity-90 mb-6">
                  {featuredRecipes[0].excerpt || featuredRecipes[0].description}
                </p>
                <div className="flex items-center text-sm mb-6">
                  <div className="flex items-center mr-4">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{(featuredRecipes[0].prep_time_in_min || 0) + (featuredRecipes[0].cook_time_in_min || 0)} {t("minutes")}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{t("by")} {featuredRecipes[0].author?.name || "Chef"}</span>
                  </div>
                </div>
                <Link 
                  to={`/recipes/${featuredRecipes[0].slug}`} 
                  className="btn-primary inline-block"
                >
                  {t("view_recipe")}
                </Link>
              </div>
            </div>
          </section>
        )}
        
        {/* Content Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Active Tag Filter Display */}
              {activeTag && (
                <div className="mb-8 p-4 bg-primary/10 rounded-md border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      Showing recipes filtered by: <strong>{activeTag}</strong>
                    </span>
                    <button
                      onClick={clearTagFilter}
                      className="text-primary text-sm hover:underline"
                    >
                      Clear filter
                    </button>
                  </div>
                </div>
              )}

              {/* Recent Recipes */}
              <section className="mb-16">
                <div className="flex items-baseline justify-between mb-8">
                  <h2 className="text-2xl md:text-3xl font-playfair font-bold">{t("recent_recipes")}</h2>
                  <Link to="/recipes" className="text-primary hover:text-primary/80 text-sm font-medium">
                    {t("view_all")}
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredRecipes.slice(0, 4).map((recipe, index) => (
                    <div key={recipe.id} className="recipe-card group">
                      <div className="recipe-card-image-container">
                        <img 
                          src={recipe.image_url || getFallbackImage(index)} 
                          alt={recipe.title} 
                          className="recipe-card-image"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-background/90 backdrop-blur-sm text-xs px-2 py-1 rounded font-medium">
                            {recipe.categories?.[0]?.name || 'Recipe'}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <time dateTime={recipe.published_at || ''}>{formatDate(recipe.published_at)}</time>
                          <span>{(recipe.prep_time_in_min || 0) + (recipe.cook_time_in_min || 0)} {t("minutes")}</span>
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
                            <span className="text-xs">{t("by")} {recipe.author?.name || "Chef"}</span>
                          </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              
              {/* Trending Now */}
              {trendingRecipes.length > 0 && (
                <section className="mb-16">
                  <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-8">
                    {t("trending_now")}
                  </h2>
                  
                  <div className="space-y-6">
                    {trendingRecipes.slice(0, 3).map((recipe, index) => (
                      <div key={recipe.id} className="flex flex-col md:flex-row gap-5 recipe-card p-0">
                        <div className="md:w-1/3 recipe-card-image-container rounded-t-md md:rounded-l-md md:rounded-tr-none">
                          <img 
                            src={recipe.image_url || getFallbackImage(index)} 
                            alt={recipe.title}
                            className="recipe-card-image" 
                          />
                        </div>
                        <div className="md:w-2/3 p-5">
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
                          <p className="text-sm text-muted-foreground mb-4">{recipe.excerpt || recipe.description}</p>
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
                    ))}
                  </div>
                </section>
              )}
              
              {/* Editor's Picks */}
              {editorsPickRecipes.length > 0 && (
                <section>
                  <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-8">
                    {t("editors_picks")}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {editorsPickRecipes.slice(0, 3).map((recipe, index) => (
                      <div key={recipe.id} className="recipe-card">
                        <div className="recipe-card-image-container">
                          <img 
                            src={recipe.image_url || getFallbackImage(index)} 
                            alt={recipe.title} 
                            className="recipe-card-image"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-playfair font-semibold text-base mb-2 line-clamp-2">
                            <Link to={`/recipes/${recipe.slug}`} className="hover:text-primary transition-colors">
                              {recipe.title}
                            </Link>
                          </h3>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{recipe.difficulty || 'Medium'}</span>
                            <span>{(recipe.prep_time_in_min || 0) + (recipe.cook_time_in_min || 0)} {t("minutes")}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar 
                onTagFilter={handleTagFilter} 
                activeTag={activeTag} 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                recentRecipes={filteredRecipes
                  .slice()
                  .sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime())
                  .slice(0, 5)
                }
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
