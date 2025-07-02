
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Search, Menu, X, Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useRecipes } from "@/hooks/useRecipes";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { recipes } = useRecipes();

  // Filter recipes for instant search
  const filteredRecipes = searchValue.trim()
    ? recipes.filter(r =>
        r.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(searchValue.toLowerCase())) ||
        (r.excerpt && r.excerpt.toLowerCase().includes(searchValue.toLowerCase()))
      ).slice(0, 8)
    : [];
  
  const navItems = [
    { title: t("home"), path: "/" },
    { title: t("recipes"), path: "/recipes" },
    { title: t("categories"), path: "/categories" },
    { title: t("about"), path: "/about" },
    { title: t("contact"), path: "/contact" },
  ];
  
  return (
    <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-playfair font-bold italic">
              Sikkolu Ruchulu
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-foreground hover:text-primary transition-colors font-medium text-sm"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button 
              className="rounded-full p-2 hover:bg-secondary transition-colors"
              aria-label={t("search")}
              onClick={() => setShowSearch((v) => !v)}
            >
              <Search className="h-5 w-5" />
            </button>
            {showSearch && (
              <div
                className="absolute left-1/2 top-16 -translate-x-1/2 bg-background border border-border rounded-md shadow-lg flex flex-col z-50"
                style={{ minWidth: 300 }}
                tabIndex={-1}
                onBlur={() => setShowSearch(false)}
              >
                <form
                  onSubmit={e => {
                    e.preventDefault();
                  }}
                  className="flex items-center px-2 py-1"
                >
                  <input
                    autoFocus
                    type="text"
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    placeholder={t("search")}
                    className="p-2 bg-transparent outline-none text-sm flex-1"
                  />
                  <button type="submit" className="ml-2 text-primary">
                    <Search className="h-4 w-4" />
                  </button>
                </form>
                {searchValue && (
                  <div className="max-h-80 overflow-y-auto">
                    {filteredRecipes.length > 0 ? (
                      filteredRecipes.map(recipe => (
                        <button
                          key={recipe.id}
                          className="w-full text-left px-4 py-2 hover:bg-secondary border-b border-border last:border-b-0 flex items-center gap-2"
                          onMouseDown={() => {
                            navigate(`/recipes/${recipe.slug}`);
                            setShowSearch(false);
                            setSearchValue("");
                          }}
                        >
                          <img
                            src={recipe.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"}
                            alt={recipe.title}
                            className="w-8 h-8 rounded object-cover mr-2"
                          />
                          <span className="font-medium text-sm line-clamp-1">{recipe.title}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-muted-foreground text-sm">No recipes found.</div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Admin Link */}
            <Link
              to="/admin"
              className="rounded-full p-2 hover:bg-secondary transition-colors"
              aria-label="Admin Panel"
            >
              <Shield className="h-5 w-5" />
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-full p-2 hover:bg-secondary transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-foreground hover:text-primary transition-colors font-medium text-sm py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
              <Link
                to="/admin"
                className="text-foreground hover:text-primary transition-colors font-medium text-sm py-2 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin Panel
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
