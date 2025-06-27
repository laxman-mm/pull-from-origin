import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { Separator } from "@/components/ui/separator";
import { blogPosts, BlogPost } from "@/data/blogPosts";
import { Clock, User, Tag, Calendar } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { useLanguage } from "@/context/LanguageContext";

const BlogPostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  
  // Re-fetch data when component mounts
  useEffect(() => {
    // Simulate API fetch
    setIsLoading(true);
    setTimeout(() => {
      const foundPost = blogPosts.find((p) => p.slug === slug);
      setPost(foundPost || null);
      setIsLoading(false);
    }, 500);
  }, [slug]);
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      // Fallback to basic format if locale is not supported
      return new Date(dateString).toLocaleDateString();
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-6 w-40 bg-muted rounded mb-4"></div>
            <div className="h-12 w-64 bg-muted rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-playfair font-bold mb-4">Article not found</h1>
            <p className="text-muted-foreground">The article you're looking for doesn't exist or has been removed.</p>
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
        <section className="relative h-[400px] md:h-[500px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${post?.coverImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
          
          <div className="container mx-auto px-4 h-full flex items-end pb-12 md:pb-20 relative z-10">
            <div className="max-w-3xl text-white">
              <div className="mb-4">
                {post?.category && (
                  <span className="uppercase text-xs tracking-wider font-medium bg-primary text-primary-foreground px-3 py-1 rounded-full inline-block">
                    {post.category}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-playfair font-bold mb-4">
                {post?.title}
              </h1>
            </div>
          </div>
        </section>
        
        {/* Blog Post Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-card p-6 md:p-8 rounded-md border border-border mb-8">
                {/* Post meta info */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{post?.readTime} {t("read_time")}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{post ? formatDate(post.publishedAt) : ""}</span>
                  </div>
                </div>
                
                {/* Author info */}
                <div className="flex items-center mb-8">
                  <img 
                    src={post?.author.avatar} 
                    alt={post?.author.name}
                    className="w-10 h-10 rounded-full object-cover mr-3" 
                  />
                  <div>
                    <p className="text-sm font-medium">{post?.author.name}</p>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                {/* Blog content */}
                <div className="prose prose-sm sm:prose max-w-none dark:prose-invert">
                  <div dangerouslySetInnerHTML={{ __html: post?.content || "" }} />
                </div>
                
                {/* Ad Banner */}
                <div className="my-8">
                  <AdBanner adSlot="article_detail" adFormat="rectangle" className="mx-auto max-w-md" />
                </div>
                
                {/* Tags */}
                <div className="mt-8">
                  <h3 className="text-sm font-medium mb-2">{t("tags")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {post?.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="bg-secondary hover:bg-secondary/70 transition-colors text-xs px-3 py-1 rounded-full inline-flex items-center"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Comments Section */}
              <div className="bg-card p-6 md:p-8 rounded-md border border-border">
                <h2 className="font-playfair text-2xl font-semibold mb-6">{t("comments")}</h2>
                
                {/* Comment form */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">{t("leave_comment")}</h3>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium block">{t("name_required")}</label>
                        <input 
                          id="name"
                          type="text" 
                          className="w-full p-2 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium block">{t("email_required")}</label>
                        <input 
                          id="email"
                          type="email" 
                          className="w-full p-2 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="comment" className="text-sm font-medium block">{t("comment_required")}</label>
                      <textarea 
                        id="comment"
                        className="w-full p-2 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary min-h-[120px]"
                        required
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md"
                    >
                      {t("post_comment")}
                    </button>
                  </form>
                </div>
                
                {/* Sample comments */}
                <div className="space-y-8">
                  <article className="border-b border-border pb-6">
                    <div className="flex items-center mb-4">
                      <img 
                        src="https://i.pravatar.cc/150?img=11" 
                        alt="Emily Johnson"
                        className="w-10 h-10 rounded-full object-cover mr-3" 
                      />
                      <div>
                        <h4 className="text-sm font-medium">Emily Johnson</h4>
                        <time className="text-xs text-muted-foreground">
                          May 18, 2024
                        </time>
                      </div>
                    </div>
                    <p className="text-sm">
                      This article was so informative! I've been cooking for years but never really understood how to properly use spices. Looking forward to trying some of these techniques.
                    </p>
                  </article>
                  
                  <article>
                    <div className="flex items-center mb-4">
                      <img 
                        src="https://i.pravatar.cc/150?img=12" 
                        alt="David Chen"
                        className="w-10 h-10 rounded-full object-cover mr-3" 
                      />
                      <div>
                        <h4 className="text-sm font-medium">David Chen</h4>
                        <time className="text-xs text-muted-foreground">
                          May 16, 2024
                        </time>
                      </div>
                    </div>
                    <p className="text-sm">
                      Great read! I would add that investing in a good spice grinder really changed my cooking game. Fresh ground spices have so much more flavor than pre-ground.
                    </p>
                  </article>
                </div>
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

export default BlogPostDetail;
