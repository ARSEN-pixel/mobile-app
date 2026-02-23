// SpendWise Premium - Global State Management with Zustand

import { create } from 'zustand';
import type { User, Category, Expense, Budget, ExpenseFilters, SyncStatus, UserSettings } from '../types';

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isGuestMode: boolean;
  
  // Data
  categories: Category[];
  expenses: Expense[];
  budgets: Budget[];
  
  // Filters
  filters: ExpenseFilters;
  
  // UI State
  theme: 'light' | 'dark' | 'system';
  isLoading: boolean;
  syncStatus: SyncStatus;
  
  // Actions - User
  setUser: (user: User | null) => void;
  setGuestMode: (isGuest: boolean) => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  logout: () => void;
  
  // Actions - Categories
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Actions - Expenses
  setExpenses: (expenses: Expense[]) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  // Actions - Budgets
  setBudgets: (budgets: Budget[]) => void;
  addBudget: (budget: Budget) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  
  // Actions - Filters
  setFilters: (filters: ExpenseFilters) => void;
  clearFilters: () => void;
  
  // Actions - UI
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLoading: (isLoading: boolean) => void;
  setSyncStatus: (status: Partial<SyncStatus>) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isGuestMode: false,
  
  categories: [],
  expenses: [],
  budgets: [],
  
  filters: {},
  
  theme: 'system',
  isLoading: false,
  syncStatus: {
    last_sync: null,
    pending_changes: 0,
    is_syncing: false,
  },
  
  // User actions
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user && !get().isGuestMode,
    theme: user?.settings?.theme || 'system',
  }),
  
  setGuestMode: (isGuest) => set({ 
    isGuestMode: isGuest,
    isAuthenticated: !isGuest && !!get().user,
  }),
  
  updateUserSettings: (settings) => set((state) => ({
    user: state.user ? {
      ...state.user,
      settings: { ...state.user.settings, ...settings },
    } : null,
    theme: settings.theme || state.theme,
  })),
  
  logout: () => set({
    user: null,
    isAuthenticated: false,
    isGuestMode: false,
    categories: [],
    expenses: [],
    budgets: [],
    filters: {},
    syncStatus: {
      last_sync: null,
      pending_changes: 0,
      is_syncing: false,
    },
  }),
  
  // Category actions
  setCategories: (categories) => set({ categories }),
  
  addCategory: (category) => set((state) => ({
    categories: [...state.categories, category],
  })),
  
  updateCategory: (id, updates) => set((state) => ({
    categories: state.categories.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    ),
  })),
  
  deleteCategory: (id) => set((state) => ({
    categories: state.categories.filter((c) => c.id !== id),
  })),
  
  // Expense actions
  setExpenses: (expenses) => set({ expenses }),
  
  addExpense: (expense) => set((state) => ({
    expenses: [expense, ...state.expenses],
  })),
  
  updateExpense: (id, updates) => set((state) => ({
    expenses: state.expenses.map((e) =>
      e.id === id ? { ...e, ...updates } : e
    ),
  })),
  
  deleteExpense: (id) => set((state) => ({
    expenses: state.expenses.filter((e) => e.id !== id),
  })),
  
  // Budget actions
  setBudgets: (budgets) => set({ budgets }),
  
  addBudget: (budget) => set((state) => ({
    budgets: [...state.budgets, budget],
  })),
  
  updateBudget: (id, updates) => set((state) => ({
    budgets: state.budgets.map((b) =>
      b.id === id ? { ...b, ...updates } : b
    ),
  })),
  
  // Filter actions
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),
  
  // UI actions
  setTheme: (theme) => set({ theme }),
  setLoading: (isLoading) => set({ isLoading }),
  setSyncStatus: (status) => set((state) => ({
    syncStatus: { ...state.syncStatus, ...status },
  })),
}));
