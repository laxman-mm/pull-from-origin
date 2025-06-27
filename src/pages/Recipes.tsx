
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { recipes } from "@/data/recipes";
import { Clock, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Recipes = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<string | null>(null);
  
  // Get all categories and difficulties
  const allCategories = Array.from(new Set(recipes.map(recipe => recipe.category)));
  const allDifficulties = Array.from(new Set(recipes.map(recipe => recipe.difficulty)));
  
  // Filter recipes based on search, category and difficulty
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = searchQuery === "" || 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = !activeCategory || recipe.category === activeCategory;
    const matchesDifficulty = !activeDifficulty || recipe.difficulty === activeDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };
  
  const handleCategoryClick = (category: string) => {
    setActiveCategory(prev => prev === category ? null : category);
  };
  
  const handleDifficultyClick = (difficulty: string) => {
    setActiveDifficulty(prev => prev === difficulty ? null : difficulty);
  };
  
  // Ensure the Google Translate is applied to dynamically loaded content
  useEffect(() => {
    // If Google Translate exists and has been applied
    if (document.body.classList.contains('translated-ltr') || document.body.classList.contains('translated-rtl')) {
      // Trigger a resize event to help Google Translate re-process the page
      window.dispatchEvent(new Event('resize'));
      
      // Force translate the current page again
      try {
        const googleFrame = document.querySelector('iframe.goog-te-menu-frame') as HTMLIFrameElement;
        if (googleFrame && googleFrame.contentDocument) {
          const translateElements = googleFrame.contentDocument.querySelectorAll('.goog-te-menu2-item');
          if (translateElements.length) {
            (translateElements[0] as HTMLElement).click();
          }
        }
      } catch (e) {
        console.error('Error re-translating page:', e);
      }
    }
  }, [filteredRecipes.length]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
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
                {t("recipes")}
              </h1>
              <p className="text-sm md:text-base opacity-90">
                {t("browse_recipes")}
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
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 pr-10 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                </div>
              </div>
              
              {/* Filters - Mobile Only */}
              <div className="lg:hidden mb-8">
                <div className="mb-4">
                  <h3 className="font-medium mb-2">{t("categories")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {allCategories.map(category => (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className={`text-xs px-3 py-1 rounded-full ${
                          activeCategory === category 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary hover:bg-secondary/70'
                        }`}
                      >
                        {category}
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
                  {t("showing")} {filteredRecipes.length} {t("recipes")}
                </p>
                
                {(activeCategory || activeDifficulty) && (
                  <button
                    onClick={() => {
                      setActiveCategory(null);
                      setActiveDifficulty(null);
                    }}
                    className="text-primary text-sm hover:underline"
                  >
                    {t("clear_filters")}
                  </button>
                )}
              </div>
              
              {/* Recipe Grid */}
              {filteredRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredRecipes.map((recipe) => (
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
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                            {recipe.category}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {recipe.prepTime + recipe.cookTime} {t("minutes")}
                          </span>
                        </div>
                        <h3 className="font-playfair font-semibold text-lg mb-2">
                          <Link to={`/recipes/${recipe.slug}`} className="hover:text-primary transition-colors">
                            {recipe.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{recipe.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img 
                              src={recipe.author.avatar} 
                              alt={recipe.author.name} 
                              className="w-6 h-6 rounded-full object-cover mr-2" 
                            />
                            <span className="text-xs">{recipe.author.name}</span>
                          </div>
                          <time className="text-xs text-muted-foreground" dateTime={recipe.publishedAt}>
                            {formatDate(recipe.publishedAt)}
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
                    {t("try_adjusting_search")}
                  </p>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-24">
                <div className="bg-card p-6 rounded-md border border-border mb-8">
                  <h3 className="font-medium mb-4">{t("filter_by_category")}</h3>
                  <div className="space-y-2">
                    {allCategories.map(category => (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className={`block w-full text-left px-3 py-2 rounded ${
                          activeCategory === category 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-secondary text-foreground'
                        }`}
                      >
                        {category}
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Recipes;
