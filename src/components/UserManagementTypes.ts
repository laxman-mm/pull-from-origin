
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface UserFormData {
  email: string;
  fullName: string;
  role: 'admin' | 'user';
  password: string;
}

export interface UserManagementProps {
  onStatsUpdate: () => void;
}
