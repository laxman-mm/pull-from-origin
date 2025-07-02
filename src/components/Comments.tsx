
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { MessageCircle, Send, LogIn } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string;
    email: string;
  } | null;
}

interface CommentsProps {
  recipeId: number;
}

export function Comments({ recipeId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check auth state
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    loadComments();
  }, [recipeId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles!comments_user_id_fkey (
            full_name,
            email
          )
        `)
        .eq('recipe_id', recipeId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading comments:', error);
        toast({
          title: "Error",
          description: "Failed to load comments",
          variant: "destructive",
        });
        return;
      }

      // Handle the data properly, accounting for potential null profiles
      const commentsWithProfiles = (data || []).map(comment => ({
        ...comment,
        profiles: comment.profiles || null
      }));

      setComments(commentsWithProfiles);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to post a comment",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Invalid Comment",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('comments')
        .insert({
          recipe_id: recipeId,
          user_id: user.id,
          content: newComment.trim(),
        });

      if (error) {
        console.error('Error submitting comment:', error);
        toast({
          title: "Error",
          description: "Failed to submit comment. Please make sure you're logged in.",
          variant: "destructive",
        });
        return;
      }

      setNewComment("");
      await loadComments();
      toast({
        title: "Success",
        description: "Comment posted successfully!",
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignIn = () => {
    window.location.href = '/auth';
  };

  if (loading) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        {user ? (
          <div className="space-y-3">
            <Textarea
              placeholder="Share your thoughts about this recipe..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
            />
            <Button 
              onClick={handleSubmitComment} 
              disabled={submitting || !newComment.trim()}
              className="w-full sm:w-auto"
            >
              <Send className="h-4 w-4 mr-2" />
              {submitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        ) : (
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <LogIn className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">
                  Sign in to join the conversation and share your thoughts about this recipe.
                </p>
                <Button onClick={handleSignIn} variant="outline">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In to Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-4 border rounded-lg">
                <Avatar>
                  <AvatarFallback>
                    {comment.profiles?.full_name 
                      ? comment.profiles.full_name.charAt(0).toUpperCase()
                      : comment.profiles?.email?.charAt(0).toUpperCase() || 'U'
                    }
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {comment.profiles?.full_name || comment.profiles?.email || 'Anonymous User'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
