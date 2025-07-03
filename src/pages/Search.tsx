
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { useRecipes } from "@/hooks/useRecipes";
import { SearchResults } from "@/components/SearchResults";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchPage = () => {
  const query = useQuery().get("q") || "";
  const { recipes, loading, refetchRecipes } = useRecipes();
  const [filtered, setFiltered] = useState(recipes);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setFiltered([]);
      return;
    }
    // Use the search_recipes function instead of client-side filtering
    refetchRecipes(undefined, undefined, query, activeTag || undefined);
  }, [query, activeTag, refetchRecipes]);

  useEffect(() => {
    setFiltered(recipes);
  }, [recipes]);

  const handleTagFilter = (tagName: string) => {
    const newTag = activeTag === tagName ? null : tagName;
    setActiveTag(newTag);
    refetchRecipes(undefined, undefined, query, newTag || undefined);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SearchResults results={filtered} query={query} isLoading={loading} />
          </div>
          <div className="lg:col-span-1">
            <Sidebar 
              onTagFilter={handleTagFilter}
              activeTag={activeTag}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
