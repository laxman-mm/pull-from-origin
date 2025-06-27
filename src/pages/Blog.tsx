
import React from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { blogPosts } from "@/data/blogPosts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, Tag } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { useLanguage } from "@/context/LanguageContext";

const Blog = () => {
  const { t } = useLanguage();
  
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
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-2 text-center">The Culinary Journal</h1>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Discover the art and science of cooking through our collection of guides, tips, and stories
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Featured Article */}
              {blogPosts.length > 0 && (
                <div className="mb-10">
                  <div className="relative overflow-hidden rounded-xl mb-6">
                    <img 
                      src={blogPosts[0].coverImage}
                      alt={blogPosts[0].title}
                      className="w-full aspect-[16/9] object-cover transition-transform hover:scale-105 duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-primary-foreground text-xs uppercase tracking-wider px-3 py-1 rounded-full font-medium">
                        Featured
                      </span>
                    </div>
                  </div>
                  
                  <Link to={`/blog/${blogPosts[0].slug}`} className="group">
                    <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-3 group-hover:text-primary transition-colors">
                      {blogPosts[0].title}
                    </h2>
                  </Link>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(blogPosts[0].publishedAt)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {blogPosts[0].readTime} min read
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    {blogPosts[0].excerpt}
                  </p>
                  
                  <Link 
                    to={`/blog/${blogPosts[0].slug}`}
                    className="text-primary font-medium hover:underline"
                  >
                    Read more
                  </Link>
                </div>
              )}
              
              {/* Ad Banner */}
              <div className="mb-10">
                <AdBanner adSlot="blog_list" adFormat="horizontal" />
              </div>
              
              {/* Article List */}
              <div className="space-y-8">
                {blogPosts.slice(1).map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/3 h-48 md:h-auto">
                        <img 
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                            {post.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {post.readTime} min read
                          </span>
                        </div>
                        
                        <Link to={`/blog/${post.slug}`} className="group">
                          <h3 className="text-xl font-playfair font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                        </Link>
                        
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center">
                          <img 
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-8 h-8 rounded-full mr-3 object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium">{post.author.name}</p>
                            <time className="text-xs text-muted-foreground">
                              {formatDate(post.publishedAt)}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar />
              <div className="mt-8">
                <AdBanner adSlot="sidebar_blog" adFormat="vertical" className="sticky top-6" />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
