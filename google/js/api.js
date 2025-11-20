/**
 * @file API service for communicating with the backend
 * Replaces localStorage functionality with API calls
 */

// API Base URL - Update this to your backend URL when deployed
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

class API {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  /**
   * Make an API request
   * @param {string} endpoint - API endpoint
   * @param {object} options - Fetch options
   * @returns {Promise} Response data
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    // Handle FormData (for file uploads)
   // Handle FormData (file uploads)
if (options.body instanceof FormData) {
  delete config.headers['Content-Type']; // let browser set boundary
}

// Handle JSON body
else if (options.body && typeof options.body === 'object') {
  config.headers['Content-Type'] = 'application/json';
  config.body = JSON.stringify(options.body);
}


    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ============ AUTH METHODS ============
  
  async signup(username, password, role) {
    const data = await this.request('/auth/signup', {
      method: 'POST',
      body: { username, password, role },
    });
    return data;
  }

  async login(username, password, role) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: { username, password, role },
    });
    if (data.token) {
      this.token = data.token;
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('loggedInUser', JSON.stringify(data.user));
    }
    return data;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUser');
  }

  async updateProfileImage(profileImage) {
    const data = await this.request('/auth/profile-image', {
      method: 'PUT',
      body: { profileImage },
    });
    if (data.user) {
      localStorage.setItem('loggedInUser', JSON.stringify(data.user));
    }
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // ============ STUDENT METHODS ============
  
  async getStudents() {
    return this.request('/students');
  }

  async getStudent(username) {
    return this.request(`/students/${username}`);
  }

  async createStudent(studentData) {
    return this.request('/students', {
      method: 'POST',
      body: studentData,
    });
  }

  async updateStudent(username, studentData) {
    return this.request(`/students/${username}`, {
      method: 'PUT',
      body: studentData,
    });
  }

  // ============ FACULTY METHODS ============
  
  async getFaculty() {
    return this.request('/faculty');
  }

  async getFacultyMember(username) {
    return this.request(`/faculty/${username}`);
  }

  async createFaculty(facultyData) {
    return this.request('/faculty', {
      method: 'POST',
      body: facultyData,
    });
  }

  async updateFaculty(username, facultyData) {
    return this.request(`/faculty/${username}`, {
      method: 'PUT',
      body: facultyData,
    });
  }

  // ============ ALUMNI METHODS ============
  
  async getAlumni() {
    return this.request('/alumni');
  }

  async createAlumni(alumniData) {
    return this.request('/alumni', {
      method: 'POST',
      body: alumniData,
    });
  }

  async updateAlumni(id, alumniData) {
    return this.request(`/alumni/${id}`, {
      method: 'PUT',
      body: alumniData,
    });
  }

  async deleteAlumni(id) {
    return this.request(`/alumni/${id}`, {
      method: 'DELETE',
    });
  }

  async seedAlumni() {
    return this.request('/alumni/seed', {
      method: 'POST',
    });
  }

  // ============ EVENT METHODS ============
  
  async getEvents() {
    return this.request('/events');
  }

  async getEvent(id) {
    return this.request(`/events/${id}`);
  }

  async createEvent(eventData) {
    return this.request('/events', {
      method: 'POST',
      body: eventData,
    });
  }

  async updateEvent(id, eventData) {
    return this.request(`/events/${id}`, {
      method: 'PUT',
      body: eventData,
    });
  }

  async deleteEvent(id) {
    return this.request(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  // ============ COMPLAINT METHODS ============
  
  async getComplaints() {
    return this.request('/complaints');
  }

  async getComplaint(id) {
    return this.request(`/complaints/${id}`);
  }

  async createComplaint(complaintData) {
    return this.request('/complaints', {
      method: 'POST',
      body: complaintData,
    });
  }

  async updateComplaintStatus(id, status) {
    return this.request(`/complaints/${id}/status`, {
      method: 'PUT',
      body: { status },
    });
  }

  async deleteComplaint(id) {
    return this.request(`/complaints/${id}`, {
      method: 'DELETE',
    });
  }

  // ============ NOTICE METHODS ============
  
  async getNotices() {
    return this.request('/notices');
  }

  async getNotice(id) {
    return this.request(`/notices/${id}`);
  }

  async createNotice(noticeData) {
    return this.request('/notices', {
      method: 'POST',
      body: noticeData,
    });
  }

  async updateNotice(id, noticeData) {
    return this.request(`/notices/${id}`, {
      method: 'PUT',
      body: noticeData,
    });
  }

  async deleteNotice(id) {
    return this.request(`/notices/${id}`, {
      method: 'DELETE',
    });
  }

  // ============ ATTENDANCE METHODS ============
  
  async getAttendance(username) {
    return this.request(`/attendance/${username}`);
  }

  async getAttendanceBySubject(username, subjectId) {
    return this.request(`/attendance/${username}/${subjectId}`);
  }

  async getAttendanceStats(username) {
    return this.request(`/attendance/${username}/stats`);
  }

  async createAttendance(attendanceData) {
    return this.request('/attendance', {
      method: 'POST',
      body: attendanceData,
    });
  }

  async updateAttendance(id, attendanceData) {
    return this.request(`/attendance/${id}`, {
      method: 'PUT',
      body: attendanceData,
    });
  }

  async deleteAttendance(id) {
    return this.request(`/attendance/${id}`, {
      method: 'DELETE',
    });
  }

  // ============ TODO METHODS ============
  
  async getTodos() {
    return this.request('/todos');
  }

  async createTodo(text) {
    return this.request('/todos', {
      method: 'POST',
      body: { text },
    });
  }

  async updateTodo(id, todoData) {
    return this.request(`/todos/${id}`, {
      method: 'PUT',
      body: todoData,
    });
  }

  async deleteTodo(id) {
    return this.request(`/todos/${id}`, {
      method: 'DELETE',
    });
  }

  // ============ UPLOAD METHODS ============
  
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }
    
    return response.json();
  }

  // ============ NOTIFICATION METHODS ============
  
  async getNotifications() {
    return this.request('/notifications');
  }

  async getUnreadNotificationCount() {
    return this.request('/notifications/unread-count');
  }

  async markNotificationAsRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async deleteNotification(id) {
    return this.request(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export const api = new API();

