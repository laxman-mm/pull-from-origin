
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, Settings } from "lucide-react";

export function ContentManagement() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Content Management</h2>
      
      <Tabs defaultValue="recipes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recipes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Recipe Management
              </CardTitle>
              <CardDescription>
                Manage your recipe content and categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Currently, recipes are managed through the data files. 
                    Future updates will include full CRUD operations for recipes.
                  </p>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="p-4 border rounded-md text-center">
                    <div className="font-semibold">25</div>
                    <div className="text-muted-foreground">Total Recipes</div>
                  </div>
                  <div className="p-4 border rounded-md text-center">
                    <div className="font-semibold">8</div>
                    <div className="text-muted-foreground">Categories</div>
                  </div>
                  <div className="p-4 border rounded-md text-center">
                    <div className="font-semibold">3</div>
                    <div className="text-muted-foreground">Difficulty Levels</div>
                  </div>
                  <div className="p-4 border rounded-md text-center">
                    <div className="font-semibold">1</div>
                    <div className="text-muted-foreground">Authors</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="blog">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Blog Post Management
              </CardTitle>
              <CardDescription>
                Manage your blog content and posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Currently, blog posts are managed through the data files. 
                    Future updates will include full CRUD operations for blog posts.
                  </p>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 border rounded-md text-center">
                    <div className="font-semibold">8</div>
                    <div className="text-muted-foreground">Total Posts</div>
                  </div>
                  <div className="p-4 border rounded-md text-center">
                    <div className="font-semibold">5</div>
                    <div className="text-muted-foreground">Published</div>
                  </div>
                  <div className="p-4 border rounded-md text-center">
                    <div className="font-semibold">3</div>
                    <div className="text-muted-foreground">Draft</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Category Management
              </CardTitle>
              <CardDescription>
                Manage recipe and blog post categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Category management will be available in future updates.
                  </p>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Current Recipe Categories:</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Main Course", "Appetizers", "Desserts", "Snacks", "Beverages", "Side Dishes", "Breakfast", "Traditional"].map((category) => (
                      <Badge key={category} variant="outline">{category}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
