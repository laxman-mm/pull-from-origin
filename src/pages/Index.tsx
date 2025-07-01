
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Clock, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useRecipes } from "@/hooks/useRecipes";

// Recipe placeholder images based on category/type
const getRecipeImage = (recipe: any, index: number) => {
  const images = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // pasta/italian
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // pizza
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // pancakes/breakfast
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // salad/healthy
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // burger/american
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // dessert/cake
    'https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // soup
    'https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // steak/meat
    'https://images.unsplash.com/photo-1563379091339-03246963d321?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // sushi/asian
    'https://images.unsplash.com/photo-1572441713132-51c75654db73?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // tacos/mexican
  ];
  
  // Use different logic to assign images based on recipe content
  if (recipe.title.toLowerCase().includes('pasta') || recipe.title.toLowerCase().includes('italian')) {
    return images[0];
  } else if (recipe.title.toLowerCase().includes('pizza')) {
    return images[1];
  } else if (recipe.title.toLowerCase().includes('pancake') || recipe.title.toLowerCase().includes('breakfast')) {
    return images[2];
  } else if (recipe.title.toLowerCase().includes('salad') || recipe.title.toLowerCase().includes('healthy')) {
    return images[3];
  } else if (recipe.title.toLowerCase().includes('burger') || recipe.title.toLowerCase().includes('sandwich')) {
    return images[4];
  } else if (recipe.title.toLowerCase().includes('cake') || recipe.title.toLowerCase().includes('dessert') || recipe.title.toLowerCase().includes('cookie')) {
    return images[5];
  } else if (recipe.title.toLowerCase().includes('soup')) {
    return images[6];
  } else if (recipe.title.toLowerCase().includes('steak') || recipe.title.toLowerCase().includes('meat') || recipe.title.toLowerCase().includes('beef')) {
    return images[7];
  } else if (recipe.title.toLowerCase().includes('sushi') || recipe.title.toLowerCase().includes('asian')) {
    return images[8];
  } else if (recipe.title.toLowerCase().includes('taco') || recipe.title.toLowerCase().includes('mexican')) {
    return images[9];
  } else {
    // Fallback to cycling through images based on index
    return images[index % images.length];
  }
};

const Index = () => {
  const { t } = useLanguage();
  const { recipes, loading, error } = useRecipes();
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Update filtered recipes when recipes change or tag filter is applied
  useEffect(() => {
    if (activeTag) {
      const filtered = recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(activeTag.toLowerCase()) ||
        recipe.description.toLowerCase().includes(activeTag.toLowerCase()) ||
        recipe.categories?.some(cat => cat.name.toLowerCase().includes(activeTag.toLowerCase()))
      );
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(recipes);
    }
  }, [recipes, activeTag]);

  const handleTagFilter = (tagName: string) => {
    if (activeTag === tagName) {
      setActiveTag(null);
    } else {
      setActiveTag(tagName);
    }
  };

  const clearTagFilter = () => {
    setActiveTag(null);
  };

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
              style={{ backgroundImage: `url('${getRecipeImage(featuredRecipes[0], 0)}')` }}
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
                    <span>{t("by")} Chef</span>
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
                          src={getRecipeImage(recipe, index)} 
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
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                            alt="Chef" 
                            className="w-8 h-8 rounded-full object-cover mr-2" 
                          />
                          <span className="text-xs">{t("by")} Chef</span>
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
                            src={getRecipeImage(recipe, index)} 
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
                              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                              alt="Chef" 
                              className="w-6 h-6 rounded-full object-cover mr-2" 
                            />
                            <span className="text-xs">Chef</span>
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
                            src={getRecipeImage(recipe, index)} 
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
              <Sidebar onTagFilter={handleTagFilter} activeTag={activeTag} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
