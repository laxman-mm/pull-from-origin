
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NewsletterSubscription } from "./NewsletterSubscription";

export function Footer() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([]);

  useEffect(() => {
    async function fetchCategoriesWithRecipes() {
      // Fetch all published categories with id, name, slug
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("id, name, slug")
        .not("published_at", "is", null)
        .order("name");
      if (categoriesError || !categoriesData) {
        setCategories([]);
        return;
      }
      // Fetch all category links that have at least one recipe
      const { data: linksData, error: linksError } = await supabase
        .from("receipes_categories_lnk")
        .select("category_id")
        .not("category_id", "is", null)
        .not("receipe_id", "is", null);
      if (linksError || !linksData) {
        setCategories([]);
        return;
      }
      // Get unique category IDs that have at least one recipe
      const categoryIdsWithRecipes = Array.from(new Set(linksData.map(link => link.category_id)));
      // Filter categories to only those with at least one recipe
      const filteredCategories = categoriesData.filter(cat => categoryIdsWithRecipes.includes(cat.id));
      setCategories(filteredCategories);
    }
    fetchCategoriesWithRecipes();
  }, []);
  
  return (
    <footer className="border-t border-border bg-secondary mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="inline-block">
              <h3 className="text-xl font-playfair font-bold italic mb-4">
                Sikkolu Ruchulu
              </h3>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              {t("discover_recipes")}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">{t("quick_links")}</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm hover:text-primary transition-colors">{t("home")}</Link></li>
              <li><Link to="/recipes" className="text-sm hover:text-primary transition-colors">{t("recipes")}</Link></li>
              <li><Link to="/categories" className="text-sm hover:text-primary transition-colors">{t("categories")}</Link></li>
              <li><Link to="/about" className="text-sm hover:text-primary transition-colors">{t("about")}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">{t("categories")}</h4>
            <ul className="space-y-2">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link to={`/categories?category=${encodeURIComponent(cat.slug)}`} className="text-sm hover:text-primary transition-colors">
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground text-sm">No categories found.</li>
              )}
            </ul>
          </div>
          
          <div>
            <NewsletterSubscription
              title={t("subscribe")}
              description={t("subscribe_text")}
              source="footer"
              variant="footer"
            />
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Sikkolu Ruchulu. {t("all_rights_reserved")}</p>
          
          {/* Google Translate attribution - required by their ToS */}
          <p className="mt-2 text-xs">
            Translations powered by <a href="https://translate.google.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Translate</a>
          </p>
        </div>
      </div>
      
      {/* Improved Google Translate widget customization */}
      <style>{`
        /* Google Translate widget customization */
        .google-translate-container {
          display: inline-block;
        }
        
        /* Hide Google Translate attribution */
        .goog-logo-link, .goog-te-gadget span, .goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame, div#goog-gt- {
          display: none !important;
        }
        
        /* Hide the top banner completely */
        .skiptranslate.goog-te-banner-frame {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
        
        .goog-te-gadget {
          font-size: 0 !important;
        }
        
        .goog-te-menu-value {
          color: inherit !important;
          border: none !important;
          background: transparent !important;
          display: flex !important;
          align-items: center !important;
          font-family: inherit !important;
          font-size: 0.875rem !important;
        }
        
        .goog-te-menu-value span {
          display: inline-block !important;
          font-size: 0.875rem !important;
          color: inherit !important;
          text-transform: capitalize;
        }
        
        .goog-te-gadget select {
          border: 1px solid #ccc !important;
          padding: 0.3rem !important;
          border-radius: 0.25rem !important;
          background-color: transparent !important;
          color: inherit !important;
          font-family: inherit !important;
          font-size: 0.875rem !important;
        }
        
        /* Fix dark mode */
        html.dark .goog-te-menu-value span {
          color: white !important;
        }
        
        /* Fix for the iframe that Google injects */
        iframe.goog-te-menu-frame {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
          border-radius: 0.375rem !important;
        }
      `}</style>
    </footer>
  );
}
