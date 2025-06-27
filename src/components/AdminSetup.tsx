import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function AdminSetup() {
  const { toast } = useToast();
  const [checking, setChecking] = useState(false);
  const [adminStatus, setAdminStatus] = useState<{
    userExists: boolean;
    isAdmin: boolean;
    emailConfirmed: boolean;
  } | null>(null);
  
  const sqlCommand = `SELECT set_user_as_admin('srikanth@melodymocktail.com');`;
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "SQL command copied to clipboard",
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
      // Check if user exists and their status
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'srikanth@melodymocktail.com');

      if (error) {
        console.error('Error checking admin status:', error);
        toast({
          title: "Error",
          description: "Failed to check admin status",
          variant: "destructive",
        });
        return;
      }

      const userExists = profiles && profiles.length > 0;
      const isAdmin = userExists && profiles[0]?.role === 'admin';

      setAdminStatus({
        userExists,
        isAdmin,
        emailConfirmed: userExists, // If profile exists, email was confirmed
      });

      if (userExists && isAdmin) {
        toast({
          title: "Success!",
          description: "Admin user is properly configured. Try logging in now.",
        });
      } else if (userExists && !isAdmin) {
        toast({
          title: "User exists but not admin",
          description: "Run the SQL command to make the user an admin.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "User not found",
          description: "Please sign up first with the provided credentials.",
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Admin Setup Required</CardTitle>
          <CardDescription>
            Follow these steps to set up your admin account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                <span className="mr-2">1.</span>
                Sign Up with Admin Credentials
                {adminStatus?.userExists && <CheckCircle className="h-4 w-4 text-green-600 ml-2" />}
              </h3>
              <p className="text-blue-700 text-sm">
                Sign up with email: <strong>srikanth@melodymocktail.com</strong>
              </p>
              <p className="text-blue-700 text-sm mt-1">
                Password: <strong>Yolo@9010</strong>
              </p>
              <p className="text-blue-700 text-sm mt-2">
                <strong>Important:</strong> Check your email and confirm your account if required.
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-900 mb-2 flex items-center">
                <span className="mr-2">2.</span>
                Run SQL Command
                {adminStatus?.isAdmin && <CheckCircle className="h-4 w-4 text-green-600 ml-2" />}
              </h3>
              <p className="text-orange-700 text-sm mb-3">
                After signing up, go to your Supabase dashboard → SQL Editor and run this command:
              </p>
              <div className="bg-gray-900 text-green-300 p-3 rounded font-mono text-sm flex items-center justify-between">
                <code>{sqlCommand}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(sqlCommand)}
                  className="text-green-300 hover:text-green-200 hover:bg-gray-800"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                <span className="mr-2">3.</span>
                Login as Admin
              </h3>
              <p className="text-green-700 text-sm">
                After completing steps 1 & 2, refresh this page and you'll be able to login with admin privileges.
              </p>
            </div>

            {adminStatus && (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-2">Current Status:</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2">
                      {adminStatus.userExists ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <span className="h-4 w-4 rounded-full bg-red-500" />
                      )}
                    </span>
                    User exists: {adminStatus.userExists ? 'Yes' : 'No'}
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2">
                      {adminStatus.isAdmin ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <span className="h-4 w-4 rounded-full bg-red-500" />
                      )}
                    </span>
                    Has admin role: {adminStatus.isAdmin ? 'Yes' : 'No'}
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
