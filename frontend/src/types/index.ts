// SpendWise Premium - Type Definitions

export interface User {
  id: string;
  firebase_uid?: string;
  email?: string;
  display_name?: string;
  photo_url?: string;
  provider?: 'google' | 'apple' | 'facebook' | 'guest';
  settings: UserSettings;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  currency: string;
  theme: 'light' | 'dark' | 'system';
  language: 'ro' | 'en';
  notifications_enabled: boolean;
  budget_alerts: boolean;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  is_default: boolean;
  is_favorite: boolean;
  order: number;
  auto_suggest_keywords: string[];
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category_id: string;
  category?: Category;
  title: string;
  date: string;
  payment_method: 'cash' | 'card' | 'transfer' | 'other';
  notes?: string;
  tags: string[];
  is_recurring: boolean;
  receipt_photo?: string; // base64
  created_at: string;
  updated_at: string;
  deleted_at?: string; // tombstone for sync
  sync_status: 'synced' | 'pending' | 'local';
}

export interface Budget {
  id: string;
  user_id: string;
  month: string; // YYYY-MM format
  total_budget: number;
  category_budgets: CategoryBudget[];
  created_at: string;
  updated_at: string;
}

export interface CategoryBudget {
  category_id: string;
  amount: number;
}

export interface ExpenseFilters {
  start_date?: string;
  end_date?: string;
  category_ids?: string[];
  payment_methods?: string[];
  min_amount?: number;
  max_amount?: number;
  tags?: string[];
  search?: string;
}

export interface DashboardStats {
  total_spent: number;
  budget_total: number;
  budget_remaining: number;
  budget_percentage: number;
  category_totals: { category_id: string; total: number }[];
}

export interface InsightData {
  total_spent: number;
  monthly_average: number;
  highest_month: { month: string; amount: number };
  biggest_category: { category_id: string; amount: number };
  weekday_total: number;
  weekend_total: number;
  monthly_trend: { month: string; amount: number }[];
  category_breakdown: { category_id: string; amount: number; percentage: number }[];
  comparison_to_last_month: number; // percentage change
}

export interface SyncStatus {
  last_sync: string | null;
  pending_changes: number;
  is_syncing: boolean;
  error?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
