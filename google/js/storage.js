/**
 * @file Centralized module for handling all localStorage interactions.
 * It also provides functions to get the most current application data, falling back to defaults if needed.
 * This helps in managing data keys, parsing, and stringifying in one place.
 */

/**
 * Retrieves an item from localStorage and parses it as JSON.
 * @param {string} key The key of the item to retrieve.
 * @param {any} [defaultValue=null] The default value to return if the key doesn't exist.
 * @returns {any} The parsed data or the default value.
 */
export function getStorageItem(key, defaultValue = null) {
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
 * @param {string} key The key under which to save the item.
 * @param {any} value The value to save.
 */
export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item "${key}" in localStorage:`, error);
  }
}

/**
 * Removes an item from localStorage.
 * @param {string} key The key of the item to remove.
 */
export function removeStorageItem(key) {
  localStorage.removeItem(key);
}

/**
 * --- NEW: Centralized Data Access Functions ---
 * These functions ensure that the application always uses the most up-to-date
 * data from localStorage, falling back to the initial hardcoded data if
 * nothing is in storage. This prevents inconsistencies across features like
 * search and profile editing.
 */

/**
 * Gets the current list of student profiles.
 * @returns {Array} The array of student profiles.
 */
export function getStudentData() {
  // The 'studentsData' variable comes from the global data.js file
  return getStorageItem('userProfiles_students', typeof studentsData !== 'undefined' ? studentsData : []);
}

/**
 * Gets the current list of faculty profiles.
 * @returns {Array} The array of faculty profiles.
 */
export function getFacultyData() {
  return getStorageItem('userProfiles_faculty', typeof facultyData !== 'undefined' ? facultyData : []);
}

/**
 * Gets the current list of alumni profiles.
 * @returns {Array} The array of alumni profiles.
 */
export function getAlumniData() {
  return getStorageItem('userProfiles_alumni', typeof alumniData !== 'undefined' ? alumniData : []);
}

/**
 * Gets the current list of campus events.
 * @returns {Array} The array of events.
 */
export function getEventData() {
  return getStorageItem('campus_events', typeof eventsData !== 'undefined' ? eventsData : []);
}