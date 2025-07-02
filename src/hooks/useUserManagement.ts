
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, UserFormData } from "@/components/UserManagementTypes";

export function useUserManagement(onStatsUpdate: () => void) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    fullName: "",
    role: "user",
    password: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Use the new backend function to get all users
      const { data, error } = await supabase.rpc('get_all_users_for_admin');

      if (error) {
        console.error("Error loading users:", error);
        toast({
          title: "Error",
          description: "Failed to load users. Please check your admin permissions.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setUsers(data.map((user: any) => ({
          id: user.id,
          email: user.email || '',
          full_name: user.full_name || '',
          role: user.role || 'user',
          created_at: user.created_at,
        })));
      }
    } catch (error) {
      console.error("Error in loadUsers:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      if (!formData.email || !formData.password) {
        toast({
          title: "Validation Error",
          description: "Email and password are required.",
          variant: "destructive",
        });
        return;
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        user_metadata: {
          full_name: formData.fullName,
        },
        email_confirm: true, // Auto-confirm email for admin-created users
      });

      if (authError) {
        console.error("Auth error:", authError);
        toast({
          title: "Error",
          description: `Failed to create user: ${authError.message}`,
          variant: "destructive",
        });
        return;
      }

      if (authData.user) {
        // Create profile entry
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: formData.email,
            full_name: formData.fullName,
            role: formData.role,
          });

        if (profileError) {
          console.error("Profile creation error:", profileError);
          toast({
            title: "Warning",
            description: "User created but profile setup failed. Please refresh and try updating the user.",
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Success",
        description: "User created successfully.",
      });

      resetForm();
      loadUsers();
      onStatsUpdate();
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      // Use the backend function to update user role
      const { error } = await supabase.rpc('update_user_role', {
        user_id: editingUser.id,
        new_role: formData.role,
      });

      if (error) {
        console.error("Error updating user:", error);
        toast({
          title: "Error",
          description: `Failed to update user: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      // Also update full_name if changed
      if (formData.fullName !== editingUser.full_name) {
        const { error: nameError } = await supabase
          .from('profiles')
          .update({ full_name: formData.fullName })
          .eq('id', editingUser.id);

        if (nameError) {
          console.error("Error updating name:", nameError);
        }
      }

      toast({
        title: "Success",
        description: "User updated successfully.",
      });

      resetForm();
      loadUsers();
      onStatsUpdate();
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Delete from auth (this will cascade to profiles due to foreign key)
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        console.error("Error deleting user:", error);
        toast({
          title: "Error",
          description: `Failed to delete user: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "User deleted successfully.",
      });

      loadUsers();
      onStatsUpdate();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      fullName: "",
      role: "user",
      password: "",
    });
    setEditingUser(null);
    setDialogOpen(false);
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      password: "",
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  return {
    users,
    loading,
    dialogOpen,
    setDialogOpen,
    editingUser,
    formData,
    setFormData,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    resetForm,
    openEditDialog,
    openCreateDialog,
  };
}
