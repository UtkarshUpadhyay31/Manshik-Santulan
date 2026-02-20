import create from 'zustand';

export const useMoodStore = create((set) => ({
  todayMood: null,
  moodHistory: [],
  suggestions: [],
  isLoading: false,
  error: null,

  setTodayMood: (mood) => set({ todayMood: mood }),
  setMoodHistory: (history) => set({ moodHistory: history }),
  setSuggestions: (suggestions) => set({ suggestions }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  clearState: () => {
    set({
      todayMood: null,
      moodHistory: [],
      suggestions: [],
      isLoading: false,
      error: null,
    });
  },
}));

// Admin store removed as part of anonymous access refactor

export const useUIStore = create((set) => ({
  isDarkMode: localStorage.getItem('darkMode') === 'true',
  isMobileMenuOpen: false,
  showNotification: false,
  notificationMessage: '',
  activeBreathingId: null, // 'modal', 'help-page', 'crisis'
  isCrisisMode: false,

  toggleDarkMode: () => {
    set((state) => {
      const newValue = !state.isDarkMode;
      localStorage.setItem('darkMode', newValue);
      return { isDarkMode: newValue };
    });
  },

  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  showNotif: (message) => {
    set({ showNotification: true, notificationMessage: message });
    setTimeout(() => {
      set({ showNotification: false });
    }, 3000);
  },

  startBreathing: (id, isCrisis = false) => set({
    activeBreathingId: id,
    isCrisisMode: isCrisis
  }),

  stopBreathing: (id) => set((state) => ({
    activeBreathingId: state.activeBreathingId === id ? null : state.activeBreathingId,
    isCrisisMode: state.activeBreathingId === id ? false : state.isCrisisMode
  })),

  clearCrisisMode: () => set({ isCrisisMode: false, activeBreathingId: null }),
}));
