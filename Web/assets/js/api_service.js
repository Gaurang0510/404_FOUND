/**
 * API Service Module
 * Centralized API communication for HostelSync Warden Dashboard
 */

const API_BASE_URL = 'http://localhost:8000';

class APIService {
  /**
   * Make an API request
   * @param {string} endpoint - API endpoint path
   * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
   * @param {object} data - Request body data
   * @returns {Promise} - API response
   */
  static async request(endpoint, method = 'GET', data = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`,
      },
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * Get authentication token from localStorage
   */
  static getToken() {
    return localStorage.getItem('authToken') || '';
  }

  /**
   * Set authentication token in localStorage
   */
  static setToken(token) {
    localStorage.setItem('authToken', token);
  }

  /**
   * Logout and clear authentication
   */
  static logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = '/index.html';
  }

  // ==================== GATE PASS REQUESTS ====================

  /**
   * Create a new gate pass request
   * @param {object} data - Gate pass data
   */
  static async createGatePass(data) {
    return this.request('/api/gate-pass', 'POST', data);
  }

  /**
   * Get all gate pass requests
   * @param {object} params - Query parameters (filters, pagination)
   */
  static async getGatePassList(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/api/gate-pass${query ? '?' + query : ''}`;
    return this.request(endpoint, 'GET');
  }

  /**
   * Get a specific gate pass request
   * @param {string} id - Gate pass ID
   */
  static async getGatePass(id) {
    return this.request(`/api/gate-pass/${id}`, 'GET');
  }

  /**
   * Approve a gate pass request
   * @param {string} id - Gate pass ID
   * @param {object} data - Approval data (remarks, etc.)
   */
  static async approveGatePass(id, data = {}) {
    return this.request(`/api/gate-pass/${id}/approve`, 'PUT', data);
  }

  /**
   * Reject a gate pass request
   * @param {string} id - Gate pass ID
   * @param {object} data - Rejection reason
   */
  static async rejectGatePass(id, data = {}) {
    return this.request(`/api/gate-pass/${id}/reject`, 'PUT', data);
  }

  // ==================== LEAVE REQUESTS ====================

  /**
   * Create a new leave request
   * @param {object} data - Leave request data
   */
  static async createLeave(data) {
    return this.request('/api/leave', 'POST', data);
  }

  /**
   * Get all leave requests
   * @param {object} params - Query parameters
   */
  static async getLeaves(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/api/leave${query ? '?' + query : ''}`;
    return this.request(endpoint, 'GET');
  }

  /**
   * Get a specific leave request
   * @param {string} id - Leave ID
   */
  static async getLeave(id) {
    return this.request(`/api/leave/${id}`, 'GET');
  }

  /**
   * Approve a leave request
   * @param {string} id - Leave ID
   * @param {object} data - Approval data
   */
  static async approveLeave(id, data = {}) {
    return this.request(`/api/leave/${id}/approve`, 'PUT', data);
  }

  /**
   * Reject a leave request
   * @param {string} id - Leave ID
   * @param {object} data - Rejection data
   */
  static async rejectLeave(id, data = {}) {
    return this.request(`/api/leave/${id}/reject`, 'PUT', data);
  }

  // ==================== COMPLAINTS ====================

  /**
   * Create a new complaint
   * @param {object} data - Complaint data
   */
  static async createComplaint(data) {
    return this.request('/api/complaint', 'POST', data);
  }

  /**
   * Get all complaints
   * @param {object} params - Query parameters
   */
  static async getComplaints(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/api/complaint${query ? '?' + query : ''}`;
    return this.request(endpoint, 'GET');
  }

  /**
   * Get a specific complaint
   * @param {string} id - Complaint ID
   */
  static async getComplaint(id) {
    return this.request(`/api/complaint/${id}`, 'GET');
  }

  /**
   * Update complaint status
   * @param {string} id - Complaint ID
   * @param {object} data - Status update data
   */
  static async updateComplainStatus(id, data = {}) {
    return this.request(`/api/complaint/${id}`, 'PUT', data);
  }

  /**
   * Close a complaint
   * @param {string} id - Complaint ID
   * @param {object} data - Closure data
   */
  static async closeComplaint(id, data = {}) {
    return this.request(`/api/complaint/${id}/close`, 'PUT', data);
  }

  // ==================== ATTENDANCE ====================

  /**
   * Mark attendance for a student
   * @param {object} data - Attendance data
   */
  static async markAttendance(data) {
    return this.request('/api/attendance', 'POST', data);
  }

  /**
   * Get attendance status
   * @param {object} params - Query parameters
   */
  static async getAttendanceStatus(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/api/attendance${query ? '?' + query : ''}`;
    return this.request(endpoint, 'GET');
  }

  /**
   * Get attendance report
   * @param {object} params - Query parameters (date range, block, etc.)
   */
  static async getAttendanceReport(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/api/attendance/report${query ? '?' + query : ''}`;
    return this.request(endpoint, 'GET');
  }

  // ==================== VISITORS ====================

  /**
   * Create a new visitor entry
   * @param {object} data - Visitor data
   */
  static async createVisitor(data) {
    return this.request('/api/visitor', 'POST', data);
  }

  /**
   * Get all visitors
   * @param {object} params - Query parameters
   */
  static async getVisitors(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/api/visitor${query ? '?' + query : ''}`;
    return this.request(endpoint, 'GET');
  }

  /**
   * Get a specific visitor
   * @param {string} id - Visitor ID
   */
  static async getVisitor(id) {
    return this.request(`/api/visitor/${id}`, 'GET');
  }

  /**
   * Check out a visitor
   * @param {string} id - Visitor ID
   * @param {object} data - Checkout data
   */
  static async checkoutVisitor(id, data = {}) {
    return this.request(`/api/visitor/${id}/checkout`, 'PUT', data);
  }

  // ==================== MESS VOTING ====================

  /**
   * Cast a vote
   * @param {object} data - Vote data
   */
  static async vote(data) {
    return this.request('/api/vote', 'POST', data);
  }

  /**
   * Get voting results
   * @param {object} params - Query parameters
   */
  static async getVotingResults(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/api/vote/results${query ? '?' + query : ''}`;
    return this.request(endpoint, 'GET');
  }

  /**
   * Get voting status for a student
   * @param {string} studentId - Student ID
   */
  static async getVotingStatus(studentId) {
    return this.request(`/api/vote/status/${studentId}`, 'GET');
  }

  // ==================== NOTIFICATIONS ====================

  /**
   * Get all notifications
   * @param {object} params - Query parameters
   */
  static async getNotifications(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/api/notification${query ? '?' + query : ''}`;
    return this.request(endpoint, 'GET');
  }

  /**
   * Mark notification as read
   * @param {string} id - Notification ID
   */
  static async markNotificationRead(id) {
    return this.request(`/api/notification/${id}/read`, 'PUT');
  }

  /**
   * Mark all notifications as read
   */
  static async markAllNotificationsRead() {
    return this.request('/api/notification/mark-all-read', 'PUT');
  }

  // ==================== DASHBOARD ====================

  /**
   * Get dashboard summary
   */
  static async getDashboardSummary() {
    return this.request('/api/dashboard/summary', 'GET');
  }

  /**
   * Get hostel statistics
   * @param {object} params - Query parameters
   */
  static async getHostelStats(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/api/dashboard/stats${query ? '?' + query : ''}`;
    return this.request(endpoint, 'GET');
  }

  // ==================== STUDENTS ====================

  /**
   * Get all students
   * @param {object} params - Query parameters
   */
  static async getStudents(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/api/student${query ? '?' + query : ''}`;
    return this.request(endpoint, 'GET');
  }

  /**
   * Get a specific student
   * @param {string} id - Student ID
   */
  static async getStudent(id) {
    return this.request(`/api/student/${id}`, 'GET');
  }

  // ==================== PROFILE ====================

  /**
   * Get warden profile
   */
  static async getProfile() {
    return this.request('/api/profile', 'GET');
  }

  /**
   * Update warden profile
   * @param {object} data - Profile data
   */
  static async updateProfile(data) {
    return this.request('/api/profile', 'PUT', data);
  }

  /**
   * Change password
   * @param {object} data - Password change data
   */
  static async changePassword(data) {
    return this.request('/api/profile/change-password', 'PUT', data);
  }

  // ==================== AUTHENTICATION ====================

  /**
   * Login
   * @param {object} credentials - Login credentials
   */
  static async login(credentials) {
    const response = await this.request('/api/auth/login', 'POST', credentials);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  /**
   * Logout
   */
  static async logoutAPI() {
    try {
      await this.request('/api/auth/logout', 'POST');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.logout();
    }
  }

  /**
   * Refresh token
   */
  static async refreshToken() {
    const response = await this.request('/api/auth/refresh', 'POST');
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = APIService;
}
