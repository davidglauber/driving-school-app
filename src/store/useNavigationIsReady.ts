import { create } from 'zustand';

interface NavigationState {
  isReady: boolean;
  setIsReady: (isReady: boolean) => void;
}

export const useNavigationIsReady = create<NavigationState>((set) => ({
  isReady: false,
  setIsReady: (isReady) => set({ isReady }),
}));