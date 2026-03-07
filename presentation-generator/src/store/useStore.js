import { create } from 'zustand';

const useStore = create((set) => ({
  isDark: localStorage.getItem('theme') === 'dark',
  setIsDark: (isDark) => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    set({ isDark });
  },

  language: localStorage.getItem('language') || 'en',
  setLanguage: (language) => {
    localStorage.setItem('language', language);
    set({ language });
  },

  location: JSON.parse(localStorage.getItem('location')) || null,
  setLocation: (location) => {
    localStorage.setItem('location', JSON.stringify(location));
    set({ location });
  },

  presentations: JSON.parse(localStorage.getItem('presentations')) || [],
  addPresentation: (presentation) => set((state) => ({
    presentations: [presentation, ...state.presentations],
  })),
  deletePresentation: (id) => set((state) => ({
    presentations: state.presentations.filter((p) => p.id !== id),
  })),

  hasCompletedOnboarding: localStorage.getItem('onboarding') === 'true',
  setOnboardingComplete: () => {
    localStorage.setItem('onboarding', 'true');
    set({ hasCompletedOnboarding: true });
  },
}));

export default useStore;
