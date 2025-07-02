
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function AdminSetup() {
  const { toast } = useToast();
  const [checking, setChecking] = useState(false);
  const [adminStatus, setAdminStatus] = useState<{
    userExists: boolean;
    profileExists: boolean;
    isAdmin: boolean;
    emailConfirmed: boolean;
    userId?: string;
  } | null>(null);
  
  const adminEmail = 'srikanth@melodymocktail.com';
  const adminPassword = 'Yolo@9010';
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Command copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the command manually",
        variant: "destructive",
      });
    }
  };

  const checkAdminStatus = async () => {
    setChecking(true);
    try {
      // Check if user exists in auth.users and get their details
      const { data: session } = await supabase.auth.getSession();
      const currentUser = session?.session?.user;
      
      // Check profiles table
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', adminEmail);

      if (profileError) {
        console.error('Error checking profiles:', profileError);
      }

      const profileExists = profiles && profiles.length > 0;
      const isAdmin = profileExists && profiles[0]?.role === 'admin';
      const userExists = currentUser?.email === adminEmail;

      setAdminStatus({
        userExists,
        profileExists,
        isAdmin,
        emailConfirmed: userExists,
        userId: currentUser?.id,
      });

      if (userExists && profileExists && isAdmin) {
        toast({
          title: "Success!",
          description: "Admin user is properly configured. Try logging in now.",
        });
      } else {
        let message = "Setup incomplete: ";
        if (!userExists) message += "User not signed up. ";
        if (!profileExists) message += "Profile missing. ";
        if (profileExists && !isAdmin) message += "User is not admin. ";
        
        toast({
          title: "Setup Required",
          description: message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to check admin status",
        variant: "destructive",
      });
    } finally {
      setChecking(false);
    }
  };

  const handleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
        options: {
          data: {
            full_name: 'Admin User'
          },
          emailRedirectTo: `${window.location.origin}/admin`
        }
      });

      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign Up Successful",
          description: "Please check your email to confirm your account, then check status again.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign up",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Admin Setup Required</CardTitle>
          <CardDescription>
            Follow these steps to set up your admin account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* Step 1: Sign Up */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                <span className="mr-2">1.</span>
                Sign Up with Admin Credentials
                {adminStatus?.userExists && <CheckCircle className="h-4 w-4 text-green-600 ml-2" />}
              </h3>
              <div className="space-y-2">
                <p className="text-blue-700 text-sm">
                  Email: <strong>{adminEmail}</strong>
                </p>
                <p className="text-blue-700 text-sm">
                  Password: <strong>{adminPassword}</strong>
                </p>
                <Button onClick={handleSignUp} size="sm" className="mt-2">
                  Sign Up Now
                </Button>
              </div>
            </div>

            {/* Step 2: Create Profile */}
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-900 mb-2 flex items-center">
                <span className="mr-2">2.</span>
                Create Admin Profile
                {adminStatus?.isAdmin && <CheckCircle className="h-4 w-4 text-green-600 ml-2" />}
              </h3>
              <p className="text-orange-700 text-sm mb-3">
                After signing up, run these SQL commands in your Supabase SQL Editor:
              </p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">First, get the user ID:</p>
                  <div className="bg-gray-900 text-green-300 p-3 rounded font-mono text-sm flex items-center justify-between">
                    <code>SELECT id, email FROM auth.users WHERE email = '{adminEmail}';</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(`SELECT id, email FROM auth.users WHERE email = '${adminEmail}';`)}
                      className="text-green-300 hover:text-green-200 hover:bg-gray-800"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Then, create the profile (replace &lt;USER_ID&gt; with the actual ID):</p>
                  <div className="bg-gray-900 text-green-300 p-3 rounded font-mono text-sm flex items-center justify-between">
                    <code>INSERT INTO profiles (id, email, full_name, role) VALUES ('&lt;USER_ID&gt;', '{adminEmail}', 'Admin User', 'admin');</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(`INSERT INTO profiles (id, email, full_name, role) VALUES ('<USER_ID>', '${adminEmail}', 'Admin User', 'admin');`)}
                      className="text-green-300 hover:text-green-200 hover:bg-gray-800"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Alternative: Use the helper function:</p>
                  <div className="bg-gray-900 text-green-300 p-3 rounded font-mono text-sm flex items-center justify-between">
                    <code>SELECT set_user_as_admin('{adminEmail}');</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(`SELECT set_user_as_admin('${adminEmail}');`)}
                      className="text-green-300 hover:text-green-200 hover:bg-gray-800"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Login */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                <span className="mr-2">3.</span>
                Login as Admin
              </h3>
              <p className="text-green-700 text-sm">
                After completing steps 1 & 2, refresh this page and you'll be able to login with admin privileges.
              </p>
            </div>

            {/* Status Display */}
            {adminStatus && (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-3">Current Status:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    {adminStatus.userExists ? (
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                    )}
                    <span>User signed up: {adminStatus.userExists ? 'Yes' : 'No'}</span>
                    {adminStatus.userId && (
                      <span className="ml-2 text-xs text-gray-500">ID: {adminStatus.userId}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    {adminStatus.profileExists ? (
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                    )}
                    <span>Profile exists: {adminStatus.profileExists ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex items-center">
                    {adminStatus.isAdmin ? (
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                    )}
                    <span>Has admin role: {adminStatus.isAdmin ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Supabase Dashboard
            </Button>
            <Button
              onClick={checkAdminStatus}
              variant="outline"
              className="flex-1"
              disabled={checking}
            >
              {checking ? 'Checking...' : 'Check Status'}
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex-1"
            >
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
