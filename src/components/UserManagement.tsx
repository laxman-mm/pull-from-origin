import React, { useState } from 'react';
import { UserManagementProps } from "./UserManagementTypes";
import { UserManagementDialog } from "./UserManagementDialog";
import { UserTable } from "./UserTable";
import { useUserManagement } from "@/hooks/useUserManagement";

export function UserManagement({ onStatsUpdate }: UserManagementProps) {
  const {
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
  } = useUserManagement(onStatsUpdate);

  const [searchQuery, setSearchQuery] = useState("");
  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.full_name && user.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">User Management</h2>
        <UserManagementDialog
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          editingUser={editingUser}
          formData={formData}
          setFormData={setFormData}
          onCreateUser={handleCreateUser}
          onUpdateUser={handleUpdateUser}
          onResetForm={resetForm}
          onOpenCreateDialog={openCreateDialog}
        />
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search users by email or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-xs p-2 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <UserTable
        users={filteredUsers}
        onEditUser={openEditDialog}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
}
