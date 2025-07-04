import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Calendar, 
  Settings, 
  Heart, 
  MessageSquare, 
  ChefHat,
  Edit,
  Save,
  X,
  Shield,
  Clock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserStats {
  favoriteRecipes: number;
  commentsPosted: number;
  recipesSubmitted: number;
  accountAge: string;
}

interface RecentActivity {
  id: string;
  type: 'comment' | 'recipe' | 'favorite';
  title: string;
  date: string;
  slug?: string;
}

export default function Profile() {
  const { user, profile, updateProfile, isAdmin } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    favoriteRecipes: 0,
    commentsPosted: 0,
    recipesSubmitted: 0,
    accountAge: ''
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || ''
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name || '',
        email: profile.email || ''
      });
      loadUserData();
    }
  }, [profile]);

  const loadUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Calculate account age
      const accountCreated = new Date(profile?.created_at || user.created_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - accountCreated.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let accountAge = '';
      if (diffDays < 30) {
        accountAge = `${diffDays} day${diffDays === 1 ? '' : 's'}`;
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        accountAge = `${months} month${months === 1 ? '' : 's'}`;
      } else {
        const years = Math.floor(diffDays / 365);
        accountAge = `${years} year${years === 1 ? '' : 's'}`;
      }

      // Get comments count
      const { count: commentsCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // For now, set placeholder values for other stats
      // In a real implementation, you'd fetch these from your database
      setStats({
        favoriteRecipes: 0, // Will implement favorites later
        commentsPosted: commentsCount || 0,
        recipesSubmitted: 0, // Will implement user recipes later
        accountAge
      });

      // Load recent activity (placeholder for now)
      setRecentActivity([
        {
          id: '1',
          type: 'comment',
          title: 'Commented on "Spicy Chicken Curry"',
          date: '2 days ago'
        }
      ]);

    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    
    try {
      const result = await updateProfile({
        full_name: editForm.full_name,
        email: editForm.email
      });

      if (result.success) {
        setEditMode(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      full_name: profile?.full_name || '',
      email: profile?.email || ''
    });
    setEditMode(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold">
                        {profile.full_name || 'User'}
                      </h1>
                      {isAdmin && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{profile.email}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      Member for {stats.accountAge}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isAdmin && (
                    <Link to="/admin">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favorite Recipes</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.favoriteRecipes}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comments Posted</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.commentsPosted}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recipes Submitted</CardTitle>
                <ChefHat className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recipesSubmitted}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account Age</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{stats.accountAge}</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="activity" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="settings">Account Settings</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            {/* Recent Activity Tab */}
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your recent interactions on Sikkolu Ruchulu
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-lg border">
                          <div className="flex-shrink-0">
                            {activity.type === 'comment' && <MessageSquare className="h-5 w-5 text-blue-500" />}
                            {activity.type === 'recipe' && <ChefHat className="h-5 w-5 text-green-500" />}
                            {activity.type === 'favorite' && <Heart className="h-5 w-5 text-red-500" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">{activity.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No recent activity to show</p>
                      <p className="text-sm">Start by commenting on recipes or adding favorites!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>
                        Manage your account information
                      </CardDescription>
                    </div>
                    {!editMode && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditMode(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      {editMode ? (
                        <Input
                          id="fullName"
                          value={editForm.full_name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <div className="p-2 bg-muted rounded-md">
                          {profile.full_name || 'Not set'}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      {editMode ? (
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter your email"
                        />
                      ) : (
                        <div className="p-2 bg-muted rounded-md">
                          {profile.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <div className="p-2 bg-muted rounded-md flex items-center gap-2">
                      {isAdmin ? (
                        <>
                          <Shield className="h-4 w-4" />
                          Administrator
                        </>
                      ) : (
                        <>
                          <User className="h-4 w-4" />
                          Standard User
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Member Since</Label>
                    <div className="p-2 bg-muted rounded-md">
                      {formatDate(profile.created_at)}
                    </div>
                  </div>

                  {editMode && (
                    <div className="flex gap-2 pt-4">
                      <Button 
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={saving}
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Customize your experience on Sikkolu Ruchulu
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Newsletter Subscription</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Manage your newsletter subscription preferences
                      </p>
                      <Link to="/unsubscribe">
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 mr-2" />
                          Manage Newsletter
                        </Button>
                      </Link>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium mb-3">Recipe Preferences</h4>
                      <p className="text-sm text-muted-foreground">
                        Recipe-related preferences will be available soon
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
