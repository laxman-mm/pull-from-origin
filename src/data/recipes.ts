
export interface Recipe {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  image: string;
  category: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string[];
  nutritionFacts: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  tags: string[];
  featured: boolean;
  trending: boolean;
  editorsPick: boolean;
  publishedAt: string;
  author: {
    name: string;
    avatar: string;
  };
}

export const recipes: Recipe[] = [
  {
    id: "1",
    title: "Roasted Vegetable & Quinoa Bowl",
    slug: "roasted-vegetable-quinoa-bowl",
    excerpt: "A nutrient-packed bowl featuring colorful roasted vegetables and protein-rich quinoa with a zesty lemon tahini dressing.",
    description: "This hearty and nutritious bowl combines the nutty flavor of quinoa with sweet roasted vegetables, all tied together with a creamy tahini dressing. Perfect for meal prep and packed with plant-based protein, it's a satisfying dish that will keep you energized throughout the day.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
    category: "Main Course",
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "1 cup quinoa, rinsed",
      "2 cups vegetable broth",
      "1 medium sweet potato, diced",
      "1 red bell pepper, chopped",
      "1 zucchini, sliced",
      "1 red onion, cut into wedges",
      "2 tbsp olive oil",
      "1 tsp smoked paprika",
      "1 tsp cumin",
      "½ tsp salt",
      "¼ tsp black pepper",
      "2 cups baby spinach",
      "¼ cup tahini",
      "2 tbsp lemon juice",
      "1 garlic clove, minced",
      "3-4 tbsp water",
      "¼ cup pumpkin seeds"
    ],
    instructions: [
      "Preheat oven to 425°F (220°C). Line a baking sheet with parchment paper.",
      "In a medium saucepan, combine quinoa and vegetable broth. Bring to a boil, then reduce heat and simmer covered for 15-18 minutes until liquid is absorbed. Remove from heat and let stand covered for 5 minutes, then fluff with a fork.",
      "Toss sweet potato, bell pepper, zucchini, and red onion with olive oil, smoked paprika, cumin, salt, and pepper on the prepared baking sheet.",
      "Roast vegetables for 25-30 minutes, stirring halfway through, until tender and caramelized.",
      "While vegetables are roasting, prepare the dressing by whisking together tahini, lemon juice, garlic, and water until smooth. Add more water if needed to reach desired consistency.",
      "To assemble bowls, place a portion of quinoa in each bowl, top with roasted vegetables and a handful of fresh spinach.",
      "Drizzle with tahini dressing and sprinkle with pumpkin seeds before serving."
    ],
    nutritionFacts: {
      calories: 380,
      protein: 12,
      carbs: 48,
      fat: 18
    },
    tags: ["Vegan", "Healthy", "Meal Prep", "Gluten-Free"],
    featured: true,
    trending: true,
    editorsPick: false,
    publishedAt: "2024-05-01T09:00:00Z",
    author: {
      name: "Sophia Chen",
      avatar: "https://i.pravatar.cc/150?img=1"
    }
  },
  {
    id: "2",
    title: "Creamy Mushroom Risotto",
    slug: "creamy-mushroom-risotto",
    excerpt: "A comforting Italian classic with creamy arborio rice and earthy wild mushrooms.",
    description: "This creamy mushroom risotto is the epitome of comfort food with a touch of elegance. The slow cooking process allows the arborio rice to release its starch, creating that signature creamy texture, while the combination of dried and fresh mushrooms delivers deep umami flavor. Finished with a sprinkle of Parmesan and fresh herbs, it's a restaurant-quality dish you can master at home.",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371",
    category: "Main Course",
    prepTime: 15,
    cookTime: 35,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      "1½ cups arborio rice",
      "1 oz dried porcini mushrooms",
      "8 oz fresh cremini mushrooms, sliced",
      "1 small onion, finely diced",
      "2 cloves garlic, minced",
      "½ cup dry white wine",
      "4-5 cups hot vegetable or chicken stock",
      "2 tbsp butter",
      "2 tbsp olive oil",
      "½ cup grated Parmesan cheese",
      "2 tbsp fresh parsley, chopped",
      "1 sprig fresh thyme",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Soak dried porcini mushrooms in 1 cup of hot water for 20 minutes. Strain through a fine sieve, reserving the soaking liquid. Chop the rehydrated mushrooms.",
      "In a large heavy-bottomed pan or Dutch oven, heat 1 tablespoon olive oil and 1 tablespoon butter over medium heat. Add the fresh mushrooms and sauté until golden brown, about 5-7 minutes. Remove and set aside.",
      "In the same pan, add remaining oil and butter. Add onion and sauté until translucent, about 3-4 minutes. Add garlic and cook for 30 seconds until fragrant.",
      "Add the rice and stir for 1-2 minutes until the grains are coated and slightly translucent at the edges.",
      "Pour in the wine and stir until completely absorbed.",
      "Add the chopped porcini mushrooms and reserved mushroom liquid (being careful to leave any grit behind). Stir until absorbed.",
      "Begin adding hot stock, one ladle at a time, stirring frequently and waiting until each addition is almost fully absorbed before adding more.",
      "Continue adding stock and stirring for about 18-20 minutes, until rice is creamy but still has a slight bite to it.",
      "Stir in the sautéed fresh mushrooms, Parmesan cheese, and 1 tablespoon butter. Remove from heat and let rest covered for 2 minutes.",
      "Season with salt and pepper to taste. Serve immediately garnished with chopped parsley and additional Parmesan if desired."
    ],
    nutritionFacts: {
      calories: 420,
      protein: 10,
      carbs: 58,
      fat: 16
    },
    tags: ["Italian", "Comfort Food", "Vegetarian"],
    featured: false,
    trending: true,
    editorsPick: true,
    publishedAt: "2024-04-25T10:30:00Z",
    author: {
      name: "Marco Rossi",
      avatar: "https://i.pravatar.cc/150?img=2"
    }
  },
  {
    id: "3",
    title: "Lemon Blueberry Pancakes",
    slug: "lemon-blueberry-pancakes",
    excerpt: "Fluffy pancakes with bursts of juicy blueberries and refreshing lemon zest.",
    description: "Start your morning with a stack of these delightful lemon blueberry pancakes. The bright citrus notes from fresh lemon zest complement the sweet bursts of blueberries, while the buttermilk ensures these pancakes are tender and fluffy. Drizzled with pure maple syrup and topped with more fresh berries, this breakfast will bring a touch of weekend indulgence to any day of the week.",
    image: "https://images.unsplash.com/photo-1614961233913-a5113a4a34ed",
    category: "Breakfast",
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "2 cups all-purpose flour",
      "2 tbsp granulated sugar",
      "2 tsp baking powder",
      "½ tsp baking soda",
      "¼ tsp salt",
      "2 cups buttermilk",
      "2 large eggs",
      "¼ cup unsalted butter, melted and cooled",
      "1 tbsp vanilla extract",
      "Zest of 2 lemons",
      "1 tbsp fresh lemon juice",
      "1½ cups fresh blueberries, plus more for serving",
      "Maple syrup for serving",
      "Powdered sugar for dusting (optional)"
    ],
    instructions: [
      "In a large bowl, whisk together the flour, sugar, baking powder, baking soda, and salt.",
      "In a separate bowl, whisk the buttermilk, eggs, melted butter, vanilla extract, lemon zest, and lemon juice until well combined.",
      "Pour the wet ingredients into the dry ingredients and stir just until combined. Be careful not to overmix; a few lumps are fine.",
      "Gently fold in the blueberries.",
      "Let the batter rest for 5 minutes while you heat a non-stick skillet or griddle over medium heat. Lightly grease with butter or cooking spray.",
      "For each pancake, pour about ¼ cup of batter onto the hot skillet. Cook until bubbles form on the surface and the edges look set, about 2-3 minutes.",
      "Flip and cook until the other side is golden brown, about 1-2 minutes more.",
      "Transfer to a warm plate and cover while you cook the remaining pancakes.",
      "Serve warm with maple syrup, additional fresh blueberries, and a light dusting of powdered sugar if desired."
    ],
    nutritionFacts: {
      calories: 320,
      protein: 9,
      carbs: 45,
      fat: 12
    },
    tags: ["Breakfast", "Sweet", "Kid-friendly"],
    featured: true,
    trending: false,
    editorsPick: true,
    publishedAt: "2024-04-28T08:15:00Z",
    author: {
      name: "Emma Taylor",
      avatar: "https://i.pravatar.cc/150?img=3"
    }
  },
  {
    id: "4",
    title: "Spicy Chickpea Curry",
    slug: "spicy-chickpea-curry",
    excerpt: "A warming and aromatic curry packed with protein-rich chickpeas and vibrant spices.",
    description: "This hearty chickpea curry brings together the warmth of Indian spices with the comfort of a home-cooked stew. Protein-rich chickpeas simmer in a fragrant tomato and coconut sauce, creating a satisfying dish that's both nourishing and bursting with flavor. Serve with fluffy basmati rice or warm naan bread for a complete meal that's ready in under 40 minutes.",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641",
    category: "Main Course",
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "2 (15 oz) cans chickpeas, drained and rinsed",
      "1 large onion, finely chopped",
      "3 cloves garlic, minced",
      "1-inch piece ginger, grated",
      "2 tbsp vegetable oil",
      "1 (14 oz) can diced tomatoes",
      "1 (14 oz) can coconut milk",
      "2 tbsp tomato paste",
      "2 tsp garam masala",
      "1 tsp ground cumin",
      "1 tsp ground coriander",
      "½ tsp ground turmeric",
      "¼ tsp red chili flakes (adjust to taste)",
      "1 cinnamon stick",
      "Salt to taste",
      "Fresh cilantro for garnish",
      "1 lime, cut into wedges for serving",
      "Cooked basmati rice or naan bread for serving"
    ],
    instructions: [
      "Heat oil in a large saucepan over medium heat. Add onion and cook until softened, about 5 minutes.",
      "Add garlic and ginger and sauté for another minute until fragrant.",
      "Stir in the garam masala, cumin, coriander, turmeric, and chili flakes. Cook for 30 seconds until spices are fragrant.",
      "Add the tomato paste and cook for another minute, stirring constantly.",
      "Pour in the diced tomatoes with their juice, then add the chickpeas and cinnamon stick. Stir well to combine.",
      "Add the coconut milk and bring to a gentle simmer. Reduce heat to low-medium and cook uncovered for about 20 minutes, stirring occasionally, until the sauce has thickened slightly.",
      "Season with salt to taste. If you prefer a thicker curry, you can mash some of the chickpeas with the back of a spoon.",
      "Remove the cinnamon stick before serving.",
      "Serve hot over basmati rice or with naan bread, garnished with fresh cilantro and lime wedges on the side."
    ],
    nutritionFacts: {
      calories: 410,
      protein: 15,
      carbs: 46,
      fat: 22
    },
    tags: ["Vegetarian", "Vegan", "Gluten-Free", "Indian"],
    featured: false,
    trending: true,
    editorsPick: false,
    publishedAt: "2024-04-22T12:45:00Z",
    author: {
      name: "Priya Sharma",
      avatar: "https://i.pravatar.cc/150?img=4"
    }
  },
  {
    id: "5",
    title: "Classic Chocolate Chip Cookies",
    slug: "classic-chocolate-chip-cookies",
    excerpt: "The perfect balance of chewy centers and crispy edges, packed with chocolate chips.",
    description: "There's nothing quite like homemade chocolate chip cookies fresh from the oven. This classic recipe delivers cookies with a perfect texture balance: slightly crisp around the edges with soft, chewy centers. The generous amount of chocolate chips ensures every bite is packed with melty chocolate goodness. These timeless treats are guaranteed to disappear quickly from your cookie jar!",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e",
    category: "Dessert",
    prepTime: 15,
    cookTime: 12,
    servings: 24,
    difficulty: "Easy",
    ingredients: [
      "1 cup (2 sticks) unsalted butter, softened",
      "¾ cup granulated sugar",
      "¾ cup packed brown sugar",
      "2 large eggs",
      "2 tsp vanilla extract",
      "2¼ cups all-purpose flour",
      "1 tsp baking soda",
      "½ tsp salt",
      "2 cups semi-sweet chocolate chips",
      "1 cup chopped walnuts or pecans (optional)"
    ],
    instructions: [
      "Preheat oven to 375°F (190°C). Line baking sheets with parchment paper.",
      "In a large bowl, cream together the butter, granulated sugar, and brown sugar until light and fluffy, about 2-3 minutes.",
      "Beat in eggs one at a time, then stir in vanilla.",
      "In a separate bowl, whisk together flour, baking soda, and salt.",
      "Gradually add the dry ingredients to the wet ingredients, mixing just until incorporated.",
      "Fold in chocolate chips and nuts (if using) by hand.",
      "Drop rounded tablespoons of dough onto the prepared baking sheets, spacing them about 2 inches apart.",
      "Bake for 9-11 minutes or until edges are golden but centers still look slightly underdone.",
      "Allow cookies to cool on baking sheet for 5 minutes before transferring to wire racks to cool completely.",
      "Store in an airtight container for up to 5 days."
    ],
    nutritionFacts: {
      calories: 220,
      protein: 3,
      carbs: 28,
      fat: 12
    },
    tags: ["Dessert", "Baking", "Kid-friendly", "Cookies"],
    featured: true,
    trending: true,
    editorsPick: true,
    publishedAt: "2024-04-30T16:20:00Z",
    author: {
      name: "James Wilson",
      avatar: "https://i.pravatar.cc/150?img=5"
    }
  },
  {
    id: "6",
    title: "Mediterranean Grilled Salmon",
    slug: "mediterranean-grilled-salmon",
    excerpt: "Succulent salmon fillets marinated in Mediterranean herbs and grilled to perfection.",
    description: "Transport your taste buds to the Mediterranean coast with this flavorful grilled salmon. The marinade of lemon, olive oil, and fresh herbs infuses the fish with bright, aromatic flavors while keeping it moist and tender during cooking. Paired with a refreshing cucumber and tomato salad, this dish is a perfect light dinner option that doesn't compromise on taste or satisfaction.",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
    category: "Main Course",
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      "4 salmon fillets (6 oz each), skin on",
      "3 tbsp olive oil, plus more for grilling",
      "2 lemons (1 zested and juiced, 1 cut into wedges for serving)",
      "3 cloves garlic, minced",
      "2 tbsp fresh dill, chopped",
      "2 tbsp fresh parsley, chopped",
      "1 tbsp fresh oregano, chopped (or 1 tsp dried)",
      "1 tsp sea salt",
      "½ tsp black pepper",
      "½ tsp red pepper flakes (optional)",
      "For the cucumber tomato salad:",
      "2 medium tomatoes, diced",
      "1 English cucumber, diced",
      "½ red onion, thinly sliced",
      "½ cup kalamata olives, pitted and halved",
      "¼ cup feta cheese, crumbled",
      "2 tbsp olive oil",
      "1 tbsp red wine vinegar",
      "Salt and pepper to taste"
    ],
    instructions: [
      "In a shallow dish, combine olive oil, lemon zest, lemon juice, garlic, dill, parsley, oregano, salt, pepper, and red pepper flakes if using.",
      "Place salmon fillets in the dish, turning to coat. Cover and refrigerate for at least 30 minutes, or up to 2 hours.",
      "Meanwhile, prepare the cucumber tomato salad: In a medium bowl, combine tomatoes, cucumber, red onion, and olives. In a small bowl, whisk together olive oil and red wine vinegar. Pour over vegetables and toss to coat. Season with salt and pepper. Refrigerate until ready to serve.",
      "Preheat grill to medium-high heat (about 400°F/200°C). Oil the grill grates well to prevent sticking.",
      "Remove salmon from marinade and pat dry with paper towels. Brush with a little additional olive oil.",
      "Place salmon on the grill skin-side down. Cook without moving for 4-5 minutes until the skin is crispy and releases easily from the grates.",
      "Carefully flip and cook for another 3-4 minutes for medium doneness, or to your preferred level of doneness.",
      "Just before serving, fold feta cheese into the salad. Serve salmon with the cucumber tomato salad and lemon wedges on the side."
    ],
    nutritionFacts: {
      calories: 380,
      protein: 34,
      carbs: 8,
      fat: 24
    },
    tags: ["Seafood", "Mediterranean", "Healthy", "Gluten-Free"],
    featured: true,
    trending: false,
    editorsPick: true,
    publishedAt: "2024-04-27T19:10:00Z",
    author: {
      name: "Olivia Martinez",
      avatar: "https://i.pravatar.cc/150?img=6"
    }
  }
];
