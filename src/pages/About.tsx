
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/context/LanguageContext";
import { Link } from "react-router-dom";
import { Instagram, Mail, Home } from "lucide-react";

const About = () => {
  const { t } = useLanguage();
  const [key, setKey] = useState(0); // Force re-render key
  
  // Listen for language changes and force re-render
  useEffect(() => {
    const handleLanguageChange = () => {
      setKey(prevKey => prevKey + 1);
    };
    
    window.addEventListener('languagechange', handleLanguageChange);
    return () => {
      window.removeEventListener('languagechange', handleLanguageChange);
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col" key={key}>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[400px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1505935428862-770b6f24f629?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
          
          <div className="container mx-auto px-4 h-full flex items-end pb-12 md:pb-20 relative z-10">
            <div className="max-w-3xl text-white">
              <h1 className="text-3xl md:text-5xl font-playfair font-bold mb-4">
                <Home className="inline-block mr-2 mb-1" /> {t("about_sikkolu")}
              </h1>
              <p className="text-sm md:text-base opacity-90">
                Authentic Flavors from Coastal Andhra
              </p>
            </div>
          </div>
        </section>
        
        {/* About Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-6">{t("our_story")}</h2>
              <p className="text-muted-foreground mb-4">
                Welcome to Sikkolu Ruchulu, a labor of love created to bring the timeless recipes of Srikakulam and the greater coastal Andhra region to kitchens around the world.
              </p>
              <p className="text-muted-foreground mb-4">
                Founded by Sridevi Baratam, a passionate home cook and storyteller, Sikkolu Ruchulu was born from a deep desire to preserve and celebrate the culinary traditions of her hometown. With every reel and every recipe, she takes you on a journey through flavors that have been passed down for generations—unchanged, unfiltered, and unforgettable.
              </p>
              <p className="text-muted-foreground">
                Whether it's a bowl of comforting Perugu Vada Senagalu Kura or the crunch of spicy Yendu Royyala Pakodi, every dish you see is a slice of our culture—served with love.
              </p>
            </section>
            
            <Separator className="my-8" />
            
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-6">🎯 {t("our_mission")}</h2>
              <p className="text-muted-foreground mb-4">
                To document, preserve, and share authentic Sikkolu-style recipes, one dish at a time. We believe food is not just nourishment—it's a connection to roots, stories, and identity.
              </p>
              <p className="text-muted-foreground mb-4">
                We're here to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Preserve regional culinary heritage that often gets overshadowed.</li>
                <li>Share easy-to-follow videos to inspire young home cooks and food lovers.</li>
                <li>Build a community of foodies who appreciate tradition with taste.</li>
              </ul>
            </section>
            
            <Separator className="my-8" />
            
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-6">👩‍🍳 {t("meet_the_team")}</h2>
              
              <div className="grid grid-cols-1 gap-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <img 
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                    alt="Sridevi Baratam"
                    className="w-40 h-40 object-cover rounded-full" 
                  />
                  <div>
                    <h3 className="text-xl font-playfair font-semibold mb-2 text-center md:text-left">Sridevi Baratam</h3>
                    <p className="text-primary mb-3 text-center md:text-left">Founder & Home Chef</p>
                    <p className="text-muted-foreground">
                      Sridevi Baratam is a mother, home chef, and the heart of Sikkolu Ruchulu. With no formal training but years of experience feeding family, neighbors, and now over 60,000+ followers online, she shares recipes exactly how they were taught to her—measured in memories, not metrics.
                    </p>
                    <p className="text-muted-foreground mt-4">
                      Her kitchen? A space of joy, storytelling, and spices.<br />Her style? Simple, soulful, and seasoned to perfection.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            <Separator className="my-8" />
            
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-6">🤝 Powered by Melody Mocktail</h2>
              <p className="text-muted-foreground mb-4">
                This project is proudly powered by Melody Mocktail, a platform committed to promoting Indian talent, culture, and creativity. Together, we aim to spotlight hidden gems from rural and regional India, bringing them to a global audience.
              </p>
            </section>
            
            <Separator className="my-8" />
            
            <section>
              <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-6">📲 {t("contact_us")}</h2>
              <p className="text-muted-foreground mb-6">
                Let's bring our grandmother's kitchen back into conversation.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Instagram className="h-5 w-5 text-primary mr-3" />
                  <p>Follow us on Instagram <a href="https://instagram.com/sikkolu.ruchulu" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@sikkolu.ruchulu</a></p>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-primary mr-3" />
                  <p>Got a recipe memory to share or want to collaborate? Reach out to us at <a href="mailto:register@edumocktail.com" className="text-primary hover:underline">register@edumocktail.com</a></p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
