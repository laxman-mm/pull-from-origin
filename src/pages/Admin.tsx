
import { AdminDashboard } from "@/components/AdminDashboard";
import { useAuth } from "@/context/AuthContext";

const Admin = () => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  // ProtectedRoute already handles auth and admin checks
  // So if we reach here, user is definitely an admin
  return <AdminDashboard onLogout={handleLogout} />;
};

export default Admin;
