/**
 * Dashboard Module
 * Handles dashboard statistics and data loading
 */

class Dashboard {
  static async init() {
    // Check authentication
    if (!localStorage.getItem('authToken')) {
      window.location.href = 'index.html';
      return;
    }

    await this.loadDashboardData();
    this.attachEventListeners();
  }

  static async loadDashboardData() {
    try {
      // Load summary data
      const summary = await APIService.getDashboardSummary();
      this.updateSummaryCards(summary);

      // Load gate pass list
      const gatePasses = await APIService.getGatePassList({ limit: 5 });
      this.renderGatePassList(gatePasses);

      // Load attendance summary
      const attendance = await APIService.getAttendanceStatus();
      this.renderAttendanceSummary(attendance);

      // Load complaints
      const complaints = await APIService.getComplaints({ limit: 5 });
      this.renderComplaintsList(complaints);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.showErrorMessage('Failed to load dashboard data');
    }
  }

  static updateSummaryCards(data) {
    // Update total students
    const totalStudentsEl = document.getElementById('totalStudents');
    if (totalStudentsEl && data.totalStudents) {
      totalStudentsEl.textContent = data.totalStudents;
    }

    // Update pending requests
    const pendingRequestsEl = document.getElementById('pendingRequests');
    if (pendingRequestsEl && data.pendingRequests) {
      pendingRequestsEl.textContent = data.pendingRequests;
    }

    // Update active visitors
    const activeVisitorsEl = document.getElementById('activeVisitors');
    if (activeVisitorsEl && data.activeVisitors) {
      activeVisitorsEl.textContent = data.activeVisitors;
    }

    // Update unresolved complaints
    const unresolvedComplaintsEl = document.getElementById('unresolvedComplaints');
    if (unresolvedComplaintsEl && data.unresolvedComplaints) {
      unresolvedComplaintsEl.textContent = data.unresolvedComplaints;
    }
  }

  static renderGatePassList(data) {
    const container = document.getElementById('gatePassList');
    if (!container) return;

    if (!data || data.length === 0) {
      container.innerHTML = '<p class="text-muted text-sm">No recent gate pass requests</p>';
      return;
    }

    container.innerHTML = data.map(request => `
      <div class="flex justify-between items-start p-3 bg-surface-container rounded-lg">
        <div>
          <p class="font-bold">${request.studentName || 'Unknown'}</p>
          <p class="text-muted text-sm">${request.destination || 'N/A'}</p>
        </div>
        <span class="badge badge-${request.status === 'approved' ? 'success' : request.status === 'pending' ? 'pending' : 'rejected'}">
          ${request.status || 'pending'}
        </span>
      </div>
    `).join('');
  }

  static renderAttendanceSummary(data) {
    const container = document.getElementById('attendanceSummary');
    if (!container) return;

    const present = data.present || 0;
    const absent = data.absent || 0;
    const total = data.total || 0;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    container.innerHTML = `
      <div class="flex justify-between items-center p-3 bg-surface-container rounded-lg">
        <div>
          <p class="text-muted text-sm">Present</p>
          <p class="font-bold text-lg">${present}</p>
        </div>
        <span class="badge badge-success">${percentage}%</span>
      </div>
      <div class="flex justify-between items-center p-3 bg-surface-container rounded-lg">
        <div>
          <p class="text-muted text-sm">Absent</p>
          <p class="font-bold text-lg">${absent}</p>
        </div>
        <span class="badge badge-rejected">${absent}</span>
      </div>
    `;
  }

  static renderComplaintsList(data) {
    const container = document.getElementById('complaintsList');
    if (!container) return;

    if (!data || data.length === 0) {
      container.innerHTML = '<p class="text-muted text-sm">No recent complaints</p>';
      return;
    }

    container.innerHTML = data.map(complaint => `
      <div class="flex justify-between items-start p-4 border-b border-surface-container-high last:border-0">
        <div class="flex-1">
          <p class="font-bold">${complaint.complainant || 'Unknown'}</p>
          <p class="text-muted text-sm">${complaint.issue || 'N/A'}</p>
          <div class="flex gap-2 mt-2">
            <span class="badge badge-info">${complaint.category || 'Other'}</span>
            <span class="text-xs text-on-surface-variant">${complaint.date || 'N/A'}</span>
          </div>
        </div>
        <span class="badge badge-${complaint.status === 'resolved' ? 'success' : complaint.status === 'open' ? 'rejected' : 'pending'}">
          ${complaint.status || 'open'}
        </span>
      </div>
    `).join('');
  }

  static attachEventListeners() {
    const createRequestBtn = document.getElementById('createRequestBtn');
    if (createRequestBtn) {
      createRequestBtn.addEventListener('click', () => {
        window.location.href = 'requests.html';
      });
    }
  }

  static showErrorMessage(message) {
    console.error(message);
    // You can show a toast notification here
  }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  Dashboard.init();
});
