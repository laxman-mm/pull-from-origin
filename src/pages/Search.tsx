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
  const { recipes, loading } = useRecipes();
  const [filtered, setFiltered] = useState(recipes);

  useEffect(() => {
    if (!query) {
      setFiltered([]);
      return;
    }
    const q = query.toLowerCase();
    setFiltered(
      recipes.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          (r.excerpt && r.excerpt.toLowerCase().includes(q)) ||
          (r.author && r.author.name && r.author.name.toLowerCase().includes(q))
      )
    );
  }, [query, recipes]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SearchResults results={filtered} query={query} isLoading={loading} />
          </div>
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
