// SpendWise Premium - API Service

import axios from 'axios';
import type { User, Category, Expense, Budget, ExpenseFilters, ApiResponse, PaginatedResponse, InsightData } from '../types';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Auth token interceptor
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Error handler
const handleError = (error: any): never => {
  console.error('API Error:', error);
  if (error.response) {
    throw new Error(error.response.data?.detail || error.response.data?.message || 'Server error');
  } else if (error.request) {
    throw new Error('Network error - please check your connection');
  } else {
    throw new Error(error.message || 'An error occurred');
  }
};

// User API
export const userApi = {
  getOrCreate: async (userData: Partial<User>): Promise<User> => {
    try {
      const response = await api.post<User>('/users', userData);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
  
  getMe: async (): Promise<User> => {
    try {
      const response = await api.get<User>('/users/me');
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
  
  update: async (userId: string, data: Partial<User>): Promise<User> => {
    try {
      const response = await api.put<User>(`/users/${userId}`, data);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
  
  delete: async (userId: string): Promise<void> => {
    try {
      await api.delete(`/users/${userId}`);
    } catch (error) {
      return handleError(error);
    }
  },
  
  exportData: async (userId: string): Promise<{ url: string }> => {
    try {
      const response = await api.get(`/users/${userId}/export`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
};

// Categories API
export const categoriesApi = {
  getAll: async (userId: string): Promise<Category[]> => {
    try {
      const response = await api.get<Category[]>(`/categories?user_id=${userId}`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
  
  create: async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> => {
    try {
      const response = await api.post<Category>('/categories', category);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
  
  update: async (categoryId: string, data: Partial<Category>): Promise<Category> => {
    try {
      const response = await api.put<Category>(`/categories/${categoryId}`, data);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
  
  delete: async (categoryId: string): Promise<void> => {
    try {
      await api.delete(`/categories/${categoryId}`);
    } catch (error) {
      return handleError(error);
    }
  },
  
  reorder: async (categoryIds: string[]): Promise<void> => {
    try {
      await api.post('/categories/reorder', { category_ids: categoryIds });
    } catch (error) {
      return handleError(error);
    }
  },
};

// Expenses API
export const expensesApi = {
  getAll: async (userId: string, filters?: ExpenseFilters): Promise<Expense[]> => {
    try {
      const params = new URLSearchParams();
      params.append('user_id', userId);
      if (filters) {
        if (filters.start_date) params.append('start_date', filters.start_date);
        if (filters.end_date) params.append('end_date', filters.end_date);
        if (filters.category_ids?.length) params.append('category_ids', filters.category_ids.join(','));
        if (filters.payment_methods?.length) params.append('payment_methods', filters.payment_methods.join(','));
        if (filters.min_amount !== undefined) params.append('min_amount', String(filters.min_amount));
        if (filters.max_amount !== undefined) params.append('max_amount', String(filters.max_amount));
        if (filters.search) params.append('search', filters.search);
      }
      const response = await api.get<Expense[]>(`/expenses?${params.toString()}`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
  
  create: async (expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<Expense> => {
    try {
      const response = await api.post<Expense>('/expenses', expense);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
  
  update: async (expenseId: string, data: Partial<Expense>): Promise<Expense> => {
    try {
      const response = await api.put<Expense>(`/expenses/${expenseId}`, data);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
  
  delete: async (expenseId: string): Promise<void> => {
    try {
      await api.delete(`/expenses/${expenseId}`);
    } catch (error) {
      return handleError(error);
    }
  },
  
  bulkDelete: async (expenseIds: string[]): Promise<void> => {
    try {
      await api.post('/expenses/bulk-delete', { expense_ids: expenseIds });
    } catch (error) {
      return handleError(error);
    }
  },
  
  bulkUpdateCategory: async (expenseIds: string[], categoryId: string): Promise<void> => {
    try {
      await api.post('/expenses/bulk-update-category', { 
        expense_ids: expenseIds, 
        category_id: categoryId 
      });
    } catch (error) {
      return handleError(error);
    }
  },
};

// Budgets API
export const budgetsApi = {
  getAll: async (userId: string): Promise<Budget[]> => {
    try {
      const response = await api.get<Budget[]>(`/budgets?user_id=${userId}`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
  
  getByMonth: async (userId: string, month: string): Promise<Budget | null> => {
    try {
      const response = await api.get<Budget>(`/budgets/${userId}/${month}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      return handleError(error);
    }
  },
  
  create: async (budget: Omit<Budget, 'id' | 'created_at' | 'updated_at'>): Promise<Budget> => {
    try {
      const response = await api.post<Budget>('/budgets', budget);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
  
  update: async (budgetId: string, data: Partial<Budget>): Promise<Budget> => {
    try {
      const response = await api.put<Budget>(`/budgets/${budgetId}`, data);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
};

// Insights API
export const insightsApi = {
  get: async (userId: string, startDate: string, endDate: string): Promise<InsightData> => {
    try {
      const response = await api.get<InsightData>(
        `/insights?user_id=${userId}&start_date=${startDate}&end_date=${endDate}`
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
  
  exportCSV: async (userId: string, startDate: string, endDate: string): Promise<string> => {
    try {
      const response = await api.get(
        `/insights/export/csv?user_id=${userId}&start_date=${startDate}&end_date=${endDate}`,
        { responseType: 'text' }
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
  
  exportPDF: async (userId: string, startDate: string, endDate: string): Promise<string> => {
    try {
      const response = await api.get(
        `/insights/export/pdf?user_id=${userId}&start_date=${startDate}&end_date=${endDate}`,
        { responseType: 'arraybuffer' }
      );
      // Return base64 encoded PDF
      const base64 = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte), ''
        )
      );
      return `data:application/pdf;base64,${base64}`;
    } catch (error) {
      return handleError(error);
    }
  },
};

// Sync API
export const syncApi = {
  sync: async (userId: string, data: {
    expenses: Expense[];
    categories: Category[];
    budgets: Budget[];
    last_sync: string | null;
  }): Promise<{
    expenses: Expense[];
    categories: Category[];
    budgets: Budget[];
    last_sync: string;
  }> => {
    try {
      const response = await api.post(`/sync`, { user_id: userId, ...data });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
};

export default api;
