
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  readTime: number;
  tags: string[];
  publishedAt: string;
  author: {
    name: string;
    avatar: string;
  };
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "10 Essential Kitchen Tools Every Home Cook Needs",
    slug: "essential-kitchen-tools",
    excerpt: "Discover the must-have kitchen tools that will elevate your cooking experience and help you create delicious meals with ease.",
    content: `
      <p>Having the right tools in your kitchen can make cooking more enjoyable and efficient. Here are the essential kitchen tools every home cook should have:</p>
      
      <h2>1. Chef's Knife</h2>
      <p>A high-quality chef's knife is perhaps the most important tool in your kitchen. It's the workhorse that handles everything from chopping vegetables to slicing meat. Invest in a good one and learn to keep it sharp.</p>
      
      <h2>2. Cutting Board</h2>
      <p>A sturdy cutting board protects your countertops and provides a safe surface for chopping. Wood or bamboo boards are gentle on knife edges, while plastic boards are dishwasher-safe and good for raw meat.</p>
      
      <h2>3. Cast Iron Skillet</h2>
      <p>A well-seasoned cast iron skillet is versatile enough to sear, sauté, bake, and even deep-fry. It retains heat beautifully and can last for generations with proper care.</p>
      
      <h2>4. Stainless Steel Pots and Pans</h2>
      <p>A good set of stainless steel cookware conducts heat evenly and can handle high temperatures. At minimum, you'll want a saucepan, a stockpot, and a sauté pan.</p>
      
      <h2>5. Measuring Cups and Spoons</h2>
      <p>Precise measurements are essential for successful recipes, especially in baking. Invest in both dry and liquid measuring cups, along with a complete set of measuring spoons.</p>
      
      <h2>6. Mixing Bowls</h2>
      <p>A nest of mixing bowls in various sizes will serve countless purposes in your kitchen, from tossing salads to combining ingredients.</p>
      
      <h2>7. Box Grater</h2>
      <p>A multi-sided box grater handles everything from shredding cheese to zesting citrus. It's far more versatile than you might think.</p>
      
      <h2>8. Instant-Read Thermometer</h2>
      <p>Take the guesswork out of cooking meats by using an instant-read thermometer to ensure food safety and perfect doneness.</p>
      
      <h2>9. Silicone Spatula</h2>
      <p>Heat-resistant silicone spatulas are perfect for scraping every last bit of batter from a bowl or gently folding whipped egg whites into a soufflé.</p>
      
      <h2>10. Kitchen Tongs</h2>
      <p>Good tongs function as an extension of your hand, allowing you to flip, turn, and transfer food with precision.</p>
      
      <p>While there are certainly other tools that might be essential depending on your cooking style, these ten items form the foundation of a well-equipped kitchen. Start with these basics, and you'll be prepared to tackle most recipes with confidence.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1556911261-6bd341186b2f",
    category: "Kitchen Tips",
    readTime: 5,
    tags: ["Kitchen Tools", "Cooking Basics", "Home Cooking"],
    publishedAt: "2024-05-15T10:00:00Z",
    author: {
      name: "James Wilson",
      avatar: "https://i.pravatar.cc/150?img=5"
    }
  },
  {
    id: "2",
    title: "Understanding Spices: A Beginner's Guide to Building Your Spice Collection",
    slug: "understanding-spices-beginners-guide",
    excerpt: "Learn about essential spices, how to use them, and how to build a versatile spice collection that will enhance all your cooking.",
    content: `
      <p>Spices are the foundation of flavor in cuisines around the world. Whether you're just starting to cook or looking to expand your culinary horizons, understanding spices is key to creating delicious dishes.</p>
      
      <h2>Essential Spices for Beginners</h2>
      <p>If you're just building your spice collection, start with these versatile options:</p>
      <ul>
        <li><strong>Black Pepper:</strong> The most common spice in the world, adding warmth and mild heat to any dish.</li>
        <li><strong>Cinnamon:</strong> Perfect for both sweet and savory dishes, with a warming, sweet flavor.</li>
        <li><strong>Cumin:</strong> Essential for Mexican, Indian, and Middle Eastern cooking, with an earthy, nutty profile.</li>
        <li><strong>Paprika:</strong> Adds beautiful color and mild, sweet pepper flavor to dishes.</li>
        <li><strong>Chili Flakes:</strong> For adding heat and dimension to any dish.</li>
        <li><strong>Garlic Powder:</strong> Concentrated garlic flavor that lasts longer than fresh.</li>
        <li><strong>Oregano:</strong> Classic herb for Italian and Mediterranean cooking.</li>
        <li><strong>Coriander:</strong> Citrusy and bright, it complements many dishes across cuisines.</li>
      </ul>
      
      <h2>Storing Your Spices</h2>
      <p>To maintain freshness and flavor, store spices in airtight containers away from direct sunlight, heat, and moisture. Most ground spices keep their potency for about a year, while whole spices can last several years.</p>
      
      <h2>Grinding vs. Pre-Ground</h2>
      <p>Whole spices last longer and offer more intense flavor when freshly ground. Consider investing in a dedicated spice grinder or mortar and pestle for the freshest flavor.</p>
      
      <h2>Building Flavor with Spices</h2>
      <p>Many cuisines begin cooking by blooming spices in hot oil or toasting them in a dry pan to release their flavors. This technique develops deeper, more complex flavors than simply adding spices at the end of cooking.</p>
      
      <h2>Creating Your Own Spice Blends</h2>
      <p>Once you're comfortable with individual spices, try creating your own signature blends. Some classic combinations to experiment with include:</p>
      <ul>
        <li><strong>Italian Blend:</strong> Oregano, basil, thyme, rosemary, and garlic powder</li>
        <li><strong>Curry Powder:</strong> Turmeric, cumin, coriander, cardamom, and cinnamon</li>
        <li><strong>Taco Seasoning:</strong> Cumin, chili powder, garlic powder, oregano, and paprika</li>
      </ul>
      
      <p>Remember that spices are meant to enhance, not overpower, the natural flavors of your ingredients. Start with small amounts and adjust to taste. With practice, you'll develop an intuitive sense of how to use spices to create balanced, flavorful dishes.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1532336414038-cf19250c5757",
    category: "Cooking Guides",
    readTime: 6,
    tags: ["Spices", "Cooking Basics", "Flavor"],
    publishedAt: "2024-05-10T14:30:00Z",
    author: {
      name: "Priya Sharma",
      avatar: "https://i.pravatar.cc/150?img=4"
    }
  }
];
