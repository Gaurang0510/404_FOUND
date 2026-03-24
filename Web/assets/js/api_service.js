// ========================================
// HostelSync – Central API Service
// ========================================

const API_BASE = 'http://10.197.192.17:8000';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE;
  }

  getToken() {
    return localStorage.getItem('hostelsync_token');
  }

  getHeaders(withAuth = true) {
    const headers = { 'Content-Type': 'application/json' };
    if (withAuth) {
      const token = this.getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(method, endpoint, data = null, withAuth = true) {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      method,
      headers: this.getHeaders(withAuth),
    };
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.detail || result.message || 'Request failed');
      }
      return result;
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        showToast('Server unavailable. Please check your connection.', 'error');
      } else {
        showToast(error.message, 'error');
      }
      throw error;
    }
  }

  // ===== AUTH =====
  async login(email, password) {
    const result = await this.request('POST', '/login', { email, password }, false);
    if (result.accessToken) {
      localStorage.setItem('hostelsync_token', result.accessToken);
      localStorage.setItem('hostelsync_user', JSON.stringify({
        userId: result.userId,
        role: result.role,
        name: result.name,
        hostelId: result.hostelId,
      }));
    }
    return result;
  }

  async registerWarden(data) {
    return this.request('POST', '/register/warden', data, false);
  }

  logout() {
    localStorage.removeItem('hostelsync_token');
    localStorage.removeItem('hostelsync_user');
    window.location.href = 'index.html';
  }

  getUser() {
    const user = localStorage.getItem('hostelsync_user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  // ===== GATE PASS =====
  async createGatePass(data) {
    return this.request('POST', '/gatepass', data);
  }

  async getGatePassList(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request('GET', `/gatepass${query ? '?' + query : ''}`);
  }

  async approveGatePass(id) {
    return this.request('PUT', `/gatepass/${id}/approve`);
  }

  async rejectGatePass(id) {
    return this.request('PUT', `/gatepass/${id}/reject`);
  }

  // ===== LEAVE =====
  async createLeave(data) {
    return this.request('POST', '/leave', data);
  }

  async getLeaves(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request('GET', `/leave${query ? '?' + query : ''}`);
  }

  async approveLeave(id) {
    return this.request('PUT', `/leave/${id}/approve`);
  }

  async rejectLeave(id) {
    return this.request('PUT', `/leave/${id}/reject`);
  }

  // ===== ATTENDANCE =====
  async markAttendance(data) {
    return this.request('POST', '/attendance', data);
  }

  async getAttendanceStatus(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request('GET', `/attendance${query ? '?' + query : ''}`);
  }

  // ===== COMPLAINTS =====
  async createComplaint(data) {
    return this.request('POST', '/complaint', data);
  }

  async getComplaints(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request('GET', `/complaint${query ? '?' + query : ''}`);
  }

  async updateComplaintStatus(id, status) {
    return this.request('PUT', `/complaint/${id}`, { status });
  }

  // ===== VISITORS =====
  async createVisitor(data) {
    return this.request('POST', '/visitor', data);
  }

  async getVisitors(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request('GET', `/visitor${query ? '?' + query : ''}`);
  }

  // ===== VOTING =====
  async vote(data) {
    return this.request('POST', '/vote', data);
  }

  async getResults(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request('GET', `/vote/results${query ? '?' + query : ''}`);
  }

  // ===== NOTIFICATIONS =====
  async getNotifications() {
    return this.request('GET', '/notifications');
  }

  // ===== DASHBOARD =====
  async getDashboardStats() {
    return this.request('GET', '/dashboard/stats');
  }
}

// ===== Toast notification =====
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    toast.style.transition = 'all 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Global instance
const api = new ApiService();
