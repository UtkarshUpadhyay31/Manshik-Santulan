/**
 * Guest Mode Utilities
 * Handle data storage and features for users not logged in
 */

// localStorage keys for guest mode data
const GUEST_DATA_KEYS = {
  MOOD_HISTORY: 'guest_mood_history',
  BREATHING_SESSIONS: 'guest_breathing_sessions',
  JOURNAL_ENTRIES: 'guest_journal_entries',
  PREFERENCES: 'guest_preferences',
};

/**
 * Get all guest mood history
 */
export const getGuestMoodHistory = () => {
  try {
    const data = localStorage.getItem(GUEST_DATA_KEYS.MOOD_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading guest mood history:', error);
    return [];
  }
};

/**
 * Save mood entry to guest storage
 */
export const saveGuestMoodEntry = (mood) => {
  try {
    const history = getGuestMoodHistory();
    const entry = {
      ...mood,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      isGuest: true,
    };
    history.push(entry);
    localStorage.setItem(GUEST_DATA_KEYS.MOOD_HISTORY, JSON.stringify(history));
    return entry;
  } catch (error) {
    console.error('Error saving guest mood entry:', error);
    throw error;
  }
};

/**
 * Get guest breathing sessions
 */
export const getGuestBreathingSessions = () => {
  try {
    const data = localStorage.getItem(GUEST_DATA_KEYS.BREATHING_SESSIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading guest breathing sessions:', error);
    return [];
  }
};

/**
 * Save breathing session to guest storage
 */
export const saveGuestBreathingSession = (duration, completedAt) => {
  try {
    const sessions = getGuestBreathingSessions();
    const session = {
      id: Date.now().toString(),
      duration,
      completedAt: completedAt || new Date().toISOString(),
      isGuest: true,
    };
    sessions.push(session);
    localStorage.setItem(GUEST_DATA_KEYS.BREATHING_SESSIONS, JSON.stringify(sessions));
    return session;
  } catch (error) {
    console.error('Error saving guest breathing session:', error);
    throw error;
  }
};

/**
 * Get guest journal entries
 */
export const getGuestJournalEntries = () => {
  try {
    const data = localStorage.getItem(GUEST_DATA_KEYS.JOURNAL_ENTRIES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading guest journal entries:', error);
    return [];
  }
};

/**
 * Save journal entry to guest storage
 */
export const saveGuestJournalEntry = (title, content, tags = []) => {
  try {
    const entries = getGuestJournalEntries();
    const entry = {
      id: Date.now().toString(),
      title,
      content,
      tags,
      createdAt: new Date().toISOString(),
      isGuest: true,
    };
    entries.push(entry);
    localStorage.setItem(GUEST_DATA_KEYS.JOURNAL_ENTRIES, JSON.stringify(entries));
    return entry;
  } catch (error) {
    console.error('Error saving guest journal entry:', error);
    throw error;
  }
};

/**
 * Clear all guest data
 */
export const clearGuestData = () => {
  try {
    Object.values(GUEST_DATA_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing guest data:', error);
    throw error;
  }
};

/**
 * Get guest mode stats
 */
export const getGuestStats = () => {
  return {
    moodEntries: getGuestMoodHistory().length,
    breathingSessions: getGuestBreathingSessions().length,
    journalEntries: getGuestJournalEntries().length,
  };
};

/**
 * Check if user is in guest mode (no auth token)
 */
export const isGuestMode = () => {
  return !localStorage.getItem('token');
};

/**
 * Show banner message for guest mode features
 */
export const showGuestBanner = () => {
  return isGuestMode();
};

export default {
  getGuestMoodHistory,
  saveGuestMoodEntry,
  getGuestBreathingSessions,
  saveGuestBreathingSession,
  getGuestJournalEntries,
  saveGuestJournalEntry,
  clearGuestData,
  getGuestStats,
  isGuestMode,
  showGuestBanner,
};
