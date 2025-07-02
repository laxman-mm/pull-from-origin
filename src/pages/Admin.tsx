
import { useState, useEffect } from "react";
import { AdminDashboard } from "@/components/AdminDashboard";
import { AdminLogin } from "@/components/AdminLogin";
import { AdminSetup } from "@/components/AdminSetup";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check current session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await checkAdminStatus(session.user.id);
        } else {
          setNeedsSetup(true);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setNeedsSetup(true);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await checkAdminStatus(session.user.id);
        } else {
          setIsAdmin(false);
          setNeedsSetup(true);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, email, full_name')
        .eq('id', userId)
        .maybeSingle();

      console.log('Profile data:', profile, 'Error:', error);

      if (error) {
        console.error('Error checking admin status:', error);
        toast({
          title: "Database Error",
          description: `Error checking profile: ${error.message}`,
          variant: "destructive",
        });
        setNeedsSetup(true);
        return;
      }

      if (!profile) {
        console.log('No profile found for user');
        toast({
          title: "Profile Missing",
          description: "No profile found. Please complete the setup process.",
          variant: "destructive",
        });
        setNeedsSetup(true);
        return;
      }

      const isUserAdmin = profile.role === 'admin';
      console.log('User role:', profile.role, 'Is admin:', isUserAdmin);
      
      setIsAdmin(isUserAdmin);
      setNeedsSetup(false);

      if (isUserAdmin) {
        toast({
          title: "Welcome Admin!",
          description: `Logged in as ${profile.email}`,
        });
      }
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      toast({
        title: "Setup Error",
        description: "Failed to verify admin status. Please check the setup process.",
        variant: "destructive",
      });
      setNeedsSetup(true);
    }
  };

  const handleLogin = () => {
    // Auth state change will handle the rest
    console.log('Login successful, waiting for auth state change...');
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Logout Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out.",
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Show setup if no user or setup is needed
  if (needsSetup || !user) {
    return <AdminSetup />;
  }

  // Show login form if user exists but isn't logged in properly
  if (!user) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Show access denied if user is logged in but not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have admin privileges. Current user: {user.email}
          </p>
          <div className="space-x-4">
            <button 
              onClick={handleLogout}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Logout
            </button>
            <button 
              onClick={() => setNeedsSetup(true)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Setup Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show admin dashboard if everything is set up correctly
  return <AdminDashboard onLogout={handleLogout} />;
};

export default Admin;
