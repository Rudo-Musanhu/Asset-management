export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  is_active: boolean;
  created_at: string;
}

export interface Department {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface AssetCategory {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Asset {
  id: string;
  name: string;
  category_id: string | null;
  department_id: string | null;
  date_purchased: string;
  cost: number;
  created_by: string;
  created_at: string;
  category?: AssetCategory;
  department?: Department;
  creator?: User;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: string | null;
  created_at: string;
  user?: User;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}