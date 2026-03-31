import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  subscriptionStatus: string;
  image?: string | null;
}

interface AppState {
  user: User | null;
  isLoading: boolean;
  searchQuery: string;
  filters: {
    jobType: string[];
    workModel: string[];
    experienceLevel: string[];
    salaryMin: number | null;
    salaryMax: number | null;
    city: string;
    industry: string;
  };
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<AppState['filters']>) => void;
  resetFilters: () => void;
}

const defaultFilters = {
  jobType: [],
  workModel: [],
  experienceLevel: [],
  salaryMin: null,
  salaryMax: null,
  city: '',
  industry: '',
};

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isLoading: true,
  searchQuery: '',
  filters: defaultFilters,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: defaultFilters }),
}));
