
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

      <UserTable
        users={users}
        onEditUser={openEditDialog}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
}
