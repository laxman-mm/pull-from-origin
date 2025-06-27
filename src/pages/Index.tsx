
import { useState } from "react";
import { Link } from "react-router-dom";
import { recipes } from "@/data/recipes";
import { Sidebar } from "@/components/Sidebar";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Clock, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
  
  // Get featured, trending and editor's picks recipes
  const featuredRecipes = recipes.filter(recipe => recipe.featured);
  const trendingRecipes = recipes.filter(recipe => recipe.trending);
  const editorsPickRecipes = recipes.filter(recipe => recipe.editorsPick);

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
        {featuredRecipes[0] && (
          <section className="relative h-[500px] md:h-[600px] overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: `url(${featuredRecipes[0].image})` }}
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
                  {featuredRecipes[0].excerpt}
                </p>
                <div className="flex items-center text-sm mb-6">
                  <div className="flex items-center mr-4">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{featuredRecipes[0].prepTime + featuredRecipes[0].cookTime} {t("minutes")}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{t("by")} {featuredRecipes[0].author.name}</span>
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
              {/* Recent Recipes */}
              <section className="mb-16">
                <div className="flex items-baseline justify-between mb-8">
                  <h2 className="text-2xl md:text-3xl font-playfair font-bold">{t("recent_recipes")}</h2>
                  <Link to="/recipes" className="text-primary hover:text-primary/80 text-sm font-medium">
                    {t("view_all")}
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recipes.slice(0, 4).map((recipe) => (
                    <div key={recipe.id} className="recipe-card group">
                      <div className="recipe-card-image-container">
                        <img 
                          src={recipe.image} 
                          alt={recipe.title} 
                          className="recipe-card-image"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-background/90 backdrop-blur-sm text-xs px-2 py-1 rounded font-medium">
                            {recipe.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <time dateTime={recipe.publishedAt}>{formatDate(recipe.publishedAt)}</time>
                          <span>{recipe.prepTime + recipe.cookTime} {t("minutes")}</span>
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
                          <span className="text-xs">{t("by")} {recipe.author.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              
              {/* Trending Now */}
              <section className="mb-16">
                <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-8">
                  {t("trending_now")}
                </h2>
                
                <div className="space-y-6">
                  {trendingRecipes.slice(0, 3).map((recipe) => (
                    <div key={recipe.id} className="flex flex-col md:flex-row gap-5 recipe-card p-0">
                      <div className="md:w-1/3 recipe-card-image-container rounded-t-md md:rounded-l-md md:rounded-tr-none">
                        <img 
                          src={recipe.image} 
                          alt={recipe.title}
                          className="recipe-card-image" 
                        />
                      </div>
                      <div className="md:w-2/3 p-5">
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
                        <p className="text-sm text-muted-foreground mb-4">{recipe.excerpt}</p>
                        <div className="flex items-center">
                          <img 
                            src={recipe.author.avatar} 
                            alt={recipe.author.name} 
                            className="w-6 h-6 rounded-full object-cover mr-2" 
                          />
                          <span className="text-xs">{recipe.author.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              
              {/* Editor's Picks */}
              <section>
                <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-8">
                  {t("editors_picks")}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {editorsPickRecipes.slice(0, 3).map((recipe) => (
                    <div key={recipe.id} className="recipe-card">
                      <div className="recipe-card-image-container">
                        <img 
                          src={recipe.image} 
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
                          <span>{recipe.difficulty}</span>
                          <span>{recipe.prepTime + recipe.cookTime} {t("minutes")}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
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

export default Index;
