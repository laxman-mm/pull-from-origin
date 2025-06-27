
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Search, Menu, X, Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  
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
            >
              <Search className="h-5 w-5" />
            </button>
            
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
