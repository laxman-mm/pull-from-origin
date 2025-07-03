import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Mail, Search, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const recentPosts = [
  { title: "Creamy Garlic Parmesan Pasta", slug: "creamy-garlic-parmesan-pasta" },
  { title: "Blueberry Lemon Pancakes", slug: "blueberry-lemon-pancakes" },
  { title: "Roasted Vegetable Quinoa Bowl", slug: "roasted-vegetable-quinoa-bowl" },
  { title: "Chocolate Chip Cookie Skillet", slug: "chocolate-chip-cookie-skillet" }
];

// Fallback tags in case database fetch fails
const fallbackTags = [
  "Breakfast", "Lunch", "Dinner", "Vegan", "Vegetarian", 
  "Dessert", "Quick Meals", "Healthy", "Comfort Food"
];

interface SidebarProps {
  onTagFilter?: (tagName: string) => void;
  activeTag?: string | null;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  recentRecipes?: Array<{
    id: number;
    title: string;
    slug: string;
  }>;
  recipeSpecificTags?: Array<{
    id: number;
    name: string;
  }>;
  showOnlyRecipeTags?: boolean;
}

export function Sidebar({ 
  onTagFilter, 
  activeTag, 
  searchQuery = "", 
  setSearchQuery, 
  recentRecipes = [],
  recipeSpecificTags = [],
  showOnlyRecipeTags = false 
}: SidebarProps) {
  const [email, setEmail] = useState("");
  const [popularTags, setPopularTags] = useState<string[]>(fallbackTags);
  
  useEffect(() => {
    const fetchTags = async () => {
      try {
        console.log('Attempting to fetch tags from database...');
        
        // If we should show only recipe-specific tags, use those
        if (showOnlyRecipeTags && recipeSpecificTags.length > 0) {
          const tagNames = recipeSpecificTags.map(tag => tag.name);
          setPopularTags(tagNames);
          return;
        }
        
        // Otherwise fetch all popular tags that are actually used in recipes
        const { data, error } = await supabase
          .from('tags')
          .select(`
            id,
            name,
            receipes_tags_lnk!inner(
              receipe_id
            )
          `)
          .not('name', 'is', null)
          .not('published_at', 'is', null)
          .limit(15);
        
        if (error) {
          console.error('Error fetching tags:', error);
          setPopularTags(fallbackTags);
        } else if (data && data.length > 0) {
          console.log('Successfully fetched tags:', data);
          // Get unique tag names from tags that are actually used in recipes
          const tagNames = data
            .map(tag => tag.name)
            .filter(Boolean) as string[];
          setPopularTags(tagNames.length > 0 ? tagNames : fallbackTags);
        } else {
          console.log('No tags found in database, using fallback');
          setPopularTags(fallbackTags);
        }
      } catch (error) {
        console.error('Unexpected error fetching tags:', error);
        setPopularTags(fallbackTags);
      }
    };

    fetchTags();
  }, [showOnlyRecipeTags, recipeSpecificTags]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // No navigation, just prevent default
  };
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribe email:", email);
    setEmail("");
    // Show toast notification (in a real implementation)
  };

  const handleTagClick = (tagName: string) => {
    if (onTagFilter) {
      onTagFilter(tagName);
    }
  };
  
  return (
    <aside className="space-y-8">
      {/* Search */}
      <div className="bg-card p-6 rounded-md border border-border">
        <h3 className="font-playfair text-lg font-medium mb-4">Search</h3>
        <form onSubmit={handleSearch} className="flex">
          <Input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className="rounded-r-none"
          />
          <Button 
            type="submit" 
            className="rounded-l-none"
            size="icon"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>
      
      {/* Recent Recipes */}
      <div className="bg-card p-6 rounded-md border border-border">
        <h3 className="font-playfair text-lg font-medium mb-4">Recent Recipes</h3>
        <ul className="space-y-3">
          {recentRecipes && recentRecipes.length > 0 ? (
            recentRecipes.map((recipe) => (
              <li key={recipe.slug}>
                <Link to={`/recipes/${recipe.slug}`} className="block hover:text-primary transition-colors text-sm">
                  {recipe.title}
                </Link>
                <Separator className="mt-3" />
              </li>
            ))
          ) : (
            <li className="text-muted-foreground text-sm">No recent recipes found.</li>
          )}
        </ul>
      </div>
      
      {/* Popular Tags - Now works as filters and shows recipe-specific tags when needed */}
      <div className="bg-card p-6 rounded-md border border-border">
        <h3 className="font-playfair text-lg font-medium mb-4">
          {showOnlyRecipeTags ? "Recipe Tags" : "Popular Tags"}
        </h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <button 
              key={tag} 
              onClick={() => handleTagClick(tag)}
              className={`text-xs px-3 py-1 rounded-full inline-flex items-center transition-colors ${
                activeTag === tag 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary hover:bg-primary hover:text-primary-foreground'
              }`}
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </button>
          ))}
        </div>
      </div>
      
      {/* Newsletter */}
      <div className="bg-primary/10 p-6 rounded-md border border-primary/20">
        <h3 className="font-playfair text-lg font-medium mb-2">Newsletter</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Subscribe to get our latest recipes and cooking tips straight to your inbox.
        </p>
        <form onSubmit={handleSubscribe} className="space-y-3">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/80 flex items-center justify-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Subscribe
          </Button>
        </form>
      </div>
    </aside>
  );
}
