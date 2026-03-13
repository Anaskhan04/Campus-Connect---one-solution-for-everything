/**
 * @file API service for communicating with the backend
 */

import { STORAGE_KEYS } from './config';

const getApiBaseUrl = () => {
  // Check if an explicit API URL is provided via environment variables (Vite-style)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  const { hostname, protocol, port } = window.location;
  
  // If running on localhost but not on the backend port, use the default backend dev URL
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // In Vite dev mode, we usually run on 5173 or 3000, backend is on 5001
    if (port === '5001') {
      return `${protocol}//${hostname}:${port}/api`;
    }
    // Default to dev backend port if we're on Vite port
    return 'http://localhost:5001/api';
  }
  
  // In production (served by backend), use relative path
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

class API {
  private token: string | null;

  constructor() {
    this.token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Make an API request
   */
  async request(endpoint: string, options: any = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: any = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    // Handle FormData (file uploads)
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    // Handle JSON body
    else if (options.body && typeof options.body === 'object') {
      config.headers['Content-Type'] = 'application/json';
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        // Only trigger auth error redirect when NOT on the login page
        // (so login failures don't redirect and wipe the error message)
        if (response.status === 401 && !window.location.pathname.includes('/login')) {
          this.handleAuthError();
        }

        const errorMessage = data.error || data.message || response.statusText || 'Request failed';
        const error: any = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new Error('Could not connect to the server. Please check your internet connection.');
      }
      throw error;
    }
  }

  // ============ AUTH METHODS ============

  async signup(username: string, password: string, role: string) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: { username, password, role },
    });
  }

  async login(username: string, password: string, role: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: { username, password, role },
    });
    if (data.token) {
      this.token = data.token;
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
      localStorage.setItem(STORAGE_KEYS.LOGGED_IN_USER, JSON.stringify(data.user));
    }
    return data;
  }

  logout() {
    this.token = null;
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.LOGGED_IN_USER);
  }

  async updateProfileImage(profileImage: string) {
    const data = await this.request('/auth/profile-image', {
      method: 'PUT',
      body: { profileImage },
    });
    if (data.user) {
      localStorage.setItem(STORAGE_KEYS.LOGGED_IN_USER, JSON.stringify(data.user));
    }
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // ============ TODO METHODS ============

  async getTodos() {
    return this.request('/todos');
  }

  async createTodo(text: string) {
    return this.request('/todos', {
      method: 'POST',
      body: { text },
    });
  }

  async updateTodo(id: string, todoData: any) {
    return this.request(`/todos/${id}`, {
      method: 'PUT',
      body: todoData,
    });
  }

  async deleteTodo(id: string) {
    return this.request(`/todos/${id}`, {
      method: 'DELETE',
    });
  }

  // ============ NOTICE METHODS ============

  async getNotices() {
    return this.request('/notices');
  }

  async createNotice(noticeData: any) {
    return this.request('/notices', {
      method: 'POST',
      body: noticeData,
    });
  }

  // ============ ATTENDANCE & SUBJECT METHODS ============

  async getSubjects() {
    return this.request('/subjects');
  }

  async createSubject(name: string, type: string) {
    return this.request('/subjects', {
      method: 'POST',
      body: { name, type },
    });
  }

  async deleteSubject(id: string) {
    return this.request(`/subjects/${id}`, {
      method: 'DELETE',
    });
  }

  async seedSubjects(subjects: any[]) {
    return this.request('/subjects/seed', {
      method: 'POST',
      body: { subjects },
    });
  }

  async getAttendance(username: string) {
    return this.request(`/attendance/${username}`);
  }

  async getAttendanceStats(username: string) {
    return this.request(`/attendance/${username}/stats`);
  }

  async logAttendance(attendanceData: any) {
    return this.request('/attendance', {
      method: 'POST',
      body: attendanceData,
    });
  }

  async deleteAttendance(id: string) {
    return this.request(`/attendance/${id}`, {
      method: 'DELETE',
    });
  }

  // ============ RESOURCE METHODS ============

  async getResources() {
    return this.request('/resources');
  }

  async createResource(resourceData: any) {
    return this.request('/resources', {
      method: 'POST',
      body: resourceData,
    });
  }

  async deleteResource(id: string) {
    return this.request(`/resources/${id}`, {
      method: 'DELETE',
    });
  }

  // ============ UPLOAD METHODS ============

  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  }

  private handleAuthError() {
    this.logout();
    // In React, we'll handle this with a navigate hook or by letting the app re-render
    // For now, we'll just force a reload to the login page which will check auth
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }
}

export const api = new API();
