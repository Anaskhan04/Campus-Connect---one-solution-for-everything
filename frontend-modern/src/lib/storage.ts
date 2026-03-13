import { STORAGE_KEYS } from './config';

/**
 * Retrieves an item from localStorage and parses it as JSON.
 */
export function getStorageItem<T>(key: string, defaultValue: T | null = null): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item "${key}" from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Saves an item to localStorage after stringifying it.
 */
export function setStorageItem(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item "${key}" in localStorage:`, error);
  }
}

/**
 * Removes an item from localStorage.
 */
export function removeStorageItem(key: string): void {
  localStorage.removeItem(key);
}

/**
 * Helper to get the logged in user
 */
export function getLoggedInUser() {
  return getStorageItem<any>(STORAGE_KEYS.LOGGED_IN_USER);
}

/**
 * Helper to get the auth token
 */
export function getAuthToken() {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}
