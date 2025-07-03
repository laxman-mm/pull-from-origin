
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Clock, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useRecipes } from "@/hooks/useRecipes";
import { SearchResults } from "@/components/SearchResults";

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

const Recipes = () => {
  const { t } = useLanguage();
  const { recipes, categories, loading, error, refetchRecipes } = useRecipes();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Initialize search from URL parameters
  useEffect(() => {
    const searchFromUrl = searchParams.get('q');
    if (searchFromUrl !== null && searchFromUrl !== searchQuery) {
      setSearchQuery(searchFromUrl);
      refetchRecipes(undefined, undefined, searchFromUrl);
    }
  }, [searchParams, refetchRecipes]);
  
  // Get all unique difficulties from recipes
  const allDifficulties = Array.from(new Set(recipes.map(recipe => recipe.difficulty).filter(Boolean)));
  
  // Handle search with debouncing and URL updates
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Update URL parameters
    if (query) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    const timeout = setTimeout(() => {
      refetchRecipes(activeCategory || undefined, activeDifficulty || undefined, query, activeTag || undefined);
    }, 500);
    setSearchTimeout(timeout);
  };
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };
  
  const handleCategoryClick = (categorySlug: string) => {
    const newCategory = activeCategory === categorySlug ? null : categorySlug;
    setActiveCategory(newCategory);
    refetchRecipes(newCategory || undefined, activeDifficulty || undefined, searchQuery, activeTag || undefined);
  };
  
  const handleDifficultyClick = (difficulty: string) => {
    const newDifficulty = activeDifficulty === difficulty ? null : difficulty;
    setActiveDifficulty(newDifficulty);
    refetchRecipes(activeCategory || undefined, newDifficulty || undefined, searchQuery, activeTag || undefined);
  };

  const handleTagFilter = (tagName: string) => {
    const newTag = activeTag === tagName ? null : tagName;
    setActiveTag(newTag);
    refetchRecipes(activeCategory || undefined, activeDifficulty || undefined, searchQuery, newTag || undefined);
  };

  const clearAllFilters = () => {
    setActiveCategory(null);
    setActiveDifficulty(null);
    setActiveTag(null);
    setSearchQuery("");
    setSearchParams({});
    refetchRecipes();
  };
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

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
            <button 
              onClick={() => refetchRecipes()}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[300px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1607877742570-4ce13142b0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 h-full flex items-end pb-12 md:pb-20 relative z-10">
          <div className="max-w-3xl text-white">
            <h1 className="text-3xl md:text-5xl font-playfair font-bold mb-4">
              {searchQuery ? `Search Results` : t("recipes")}
            </h1>
            <p className="text-sm md:text-base opacity-90">
              {searchQuery ? `Results for "${searchQuery}"` : t("browse_recipes")}
            </p>
          </div>
        </div>
      </section>
      
      {/* Recipes Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("search")}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full p-3 pr-10 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              </div>
            </div>
            
            {/* Show search results or regular recipes */}
            {searchQuery ? (
              <SearchResults 
                results={recipes} 
                query={searchQuery}
                isLoading={loading}
              />
            ) : (
              <>
                {/* Filters - Mobile Only */}
                <div className="lg:hidden mb-8">
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">{t("categories")}</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryClick(category.slug)}
                          className={`text-xs px-3 py-1 rounded-full ${
                            activeCategory === category.slug 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-secondary hover:bg-secondary/70'
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">{t("difficulty")}</h3>
                    <div className="flex flex-wrap gap-2">
                      {allDifficulties.map(difficulty => (
                        <button
                          key={difficulty}
                          onClick={() => handleDifficultyClick(difficulty)}
                          className={`text-xs px-3 py-1 rounded-full ${
                            activeDifficulty === difficulty 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-secondary hover:bg-secondary/70'
                          }`}
                        >
                          {difficulty}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Filter Results */}
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">
                    {t("showing")} {recipes.length} {t("recipes")}
                    {activeTag && ` filtered by tag: ${activeTag}`}
                  </p>
                  
                  {(activeCategory || activeDifficulty || activeTag || searchQuery) && (
                    <button
                      onClick={clearAllFilters}
                      className="text-primary text-sm hover:underline"
                    >
                      {t("clear_filters")}
                    </button>
                  )}
                </div>
                
                {/* Recipe Grid */}
                {recipes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recipes.map((recipe, index) => (
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
                          
                          {/* Display recipe tags */}
                          {recipe.tags && recipe.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {recipe.tags.slice(0, 3).map((tag) => (
                                <span 
                                  key={tag.id} 
                                  className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
                                >
                                  {tag.name}
                                </span>
                              ))}
                              {recipe.tags.length > 3 && (
                                <span className="text-xs text-muted-foreground">+{recipe.tags.length - 3} more</span>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <img 
                                src={recipe.author?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                                alt={recipe.author?.name || "Chef"} 
                                className="w-6 h-6 rounded-full object-cover mr-2" 
                              />
                              <span className="text-xs">{recipe.author?.name || "Chef"}</span>
                            </div>
                            <time className="text-xs text-muted-foreground" dateTime={recipe.published_at || ''}>
                              {formatDate(recipe.published_at)}
                            </time>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-playfair font-semibold mb-2">{t("no_recipes_found")}</h3>
                    <p className="text-muted-foreground">
                      {activeTag ? `No recipes found with tag "${activeTag}"` : t("try_adjusting_search")}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-24">
              <div className="bg-card p-6 rounded-md border border-border mb-8">
                <h3 className="font-medium mb-4">{t("filter_by_category")}</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.slug)}
                      className={`block w-full text-left px-3 py-2 rounded ${
                        activeCategory === category.slug 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-secondary text-foreground'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-card p-6 rounded-md border border-border">
                <h3 className="font-medium mb-4">{t("filter_by_difficulty")}</h3>
                <div className="space-y-2">
                  {allDifficulties.map(difficulty => (
                    <button
                      key={difficulty}
                      onClick={() => handleDifficultyClick(difficulty)}
                      className={`block w-full text-left px-3 py-2 rounded ${
                        activeDifficulty === difficulty 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-secondary text-foreground'
                      }`}
                    >
                      {difficulty}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipes;
