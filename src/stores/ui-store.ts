import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIStore {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  currentBranchId: string | null;
  language: string;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setCurrentBranch: (id: string | null) => void;
  setLanguage: (lang: string) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'system',
      currentBranchId: null,
      language: 'id',
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
      setCurrentBranch: (id) => set({ currentBranchId: id }),
      setLanguage: (lang) => set({ language: lang }),
    }),
    { name: 'petora-ui' }
  )
);
