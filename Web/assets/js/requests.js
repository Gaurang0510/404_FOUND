/**
 * Gate Pass Requests Module
 * Handles gate pass request listing and management
 */

class RequestsManager {
  constructor() {
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.allRequests = [];
    this.filteredRequests = [];
  }

  async init() {
    // Check authentication
    if (!localStorage.getItem('authToken')) {
      window.location.href = 'index.html';
      return;
    }

    await this.loadRequests();
    this.attachEventListeners();
  }

  async loadRequests() {
    try {
      // Load gate pass requests from API
      // For demo, using mock data
      this.allRequests = [
        {
          id: 1,
          studentName: 'Rajesh Kumar',
          destination: 'Home',
          date: '2024-03-25',
          status: 'pending',
          submittedOn: '2024-03-23'
        },
        {
          id: 2,
          studentName: 'Priya Sharma',
          destination: 'City Center',
          date: '2024-03-26',
          status: 'approved',
          submittedOn: '2024-03-22'
        },
        {
          id: 3,
          studentName: 'Ashish Singh',
          destination: 'Railway Station',
          date: '2024-03-27',
          status: 'rejected',
          submittedOn: '2024-03-21'
        },
      ];
      
      this.filteredRequests = [...this.allRequests];
      this.renderTable();
      this.renderPagination();
    } catch (error) {
      console.error('Error loading gate pass requests:', error);
    }
  }

  renderTable() {
    const table = document.getElementById('requestsTable');
    if (!table) return;

    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const pageData = this.filteredRequests.slice(start, end);

    if (pageData.length === 0) {
      table.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No requests found</td></tr>';
      return;
    }

    table.innerHTML = pageData.map(request => `
      <tr>
        <td>${request.studentName}</td>
        <td>${request.destination}</td>
        <td>${request.date}</td>
        <td>
          <span class="badge badge-${request.status === 'approved' ? 'success' : request.status === 'pending' ? 'pending' : 'rejected'}">
            ${request.status}
          </span>
        </td>
        <td>${request.submittedOn}</td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="requestsManager.viewRequest(${request.id})">
            <span class="material-symbols-outlined">visibility</span>
            View
          </button>
        </td>
      </tr>
    `).join('');
  }

  renderPagination() {
    const container = document.getElementById('paginationContainer');
    if (!container) return;

    const totalPages = Math.ceil(this.filteredRequests.length / this.itemsPerPage);
    
    if (totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    let html = '';
    
    // Previous button
    if (this.currentPage > 1) {
      html += `<button class="btn btn-secondary btn-sm" onclick="requestsManager.goToPage(${this.currentPage - 1})">
        <span class="material-symbols-outlined">chevron_left</span>
      </button>`;
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (i === this.currentPage) {
        html += `<button class="btn btn-primary btn-sm">${i}</button>`;
      } else {
        html += `<button class="btn btn-secondary btn-sm" onclick="requestsManager.goToPage(${i})">${i}</button>`;
      }
    }

    // Next button
    if (this.currentPage < totalPages) {
      html += `<button class="btn btn-secondary btn-sm" onclick="requestsManager.goToPage(${this.currentPage + 1})">
        <span class="material-symbols-outlined">chevron_right</span>
      </button>`;
    }

    container.innerHTML = html;
  }

  goToPage(page) {
    this.currentPage = page;
    this.renderTable();
    this.renderPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  viewRequest(id) {
    const request = this.allRequests.find(r => r.id === id);
    if (!request) return;

    // Show modal
    const modal = document.getElementById('requestModal');
    const content = document.getElementById('modalContent');
    
    if (modal && content) {
      content.innerHTML = `
        <div class="space-y-3">
          <div>
            <p class="text-muted text-sm">Student Name</p>
            <p class="font-bold">${request.studentName}</p>
          </div>
          <div>
            <p class="text-muted text-sm">Destination</p>
            <p class="font-bold">${request.destination}</p>
          </div>
          <div>
            <p class="text-muted text-sm">Date of Journey</p>
            <p class="font-bold">${request.date}</p>
          </div>
          <div>
            <p class="text-muted text-sm">Current Status</p>
            <span class="badge badge-${request.status === 'approved' ? 'success' : request.status === 'pending' ? 'pending' : 'rejected'}">
              ${request.status}
            </span>
          </div>
          <div>
            <p class="text-muted text-sm">Submitted On</p>
            <p class="font-bold">${request.submittedOn}</p>
          </div>
        </div>
      `;

      modal.style.display = 'flex';
      this.currentRequestId = id;
    }
  }

  attachEventListeners() {
    // Filter buttons
    const applyBtn = document.getElementById('applyFiltersBtn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => this.applyFilters());
    }

    // Modal close button
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        const modal = document.getElementById('requestModal');
        if (modal) modal.style.display = 'none';
      });
    }

    // Approve button
    const approveBtn = document.getElementById('approveBtn');
    if (approveBtn) {
      approveBtn.addEventListener('click', () => this.approveRequest());
    }

    // Reject button
    const rejectBtn = document.getElementById('rejectBtn');
    if (rejectBtn) {
      rejectBtn.addEventListener('click', () => this.rejectRequest());
    }

    // Close modal on background click
    const modal = document.getElementById('requestModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });
    }
  }

  applyFilters() {
    const statusFilter = document.getElementById('filterStatus').value;
    const dateFilter = document.getElementById('filterDate').value;
    const studentFilter = document.getElementById('filterStudent').value.toLowerCase();

    this.filteredRequests = this.allRequests.filter(request => {
      const statusMatch = !statusFilter || request.status === statusFilter;
      const dateMatch = !dateFilter || request.date === dateFilter;
      const studentMatch = !studentFilter || request.studentName.toLowerCase().includes(studentFilter);
      
      return statusMatch && dateMatch && studentMatch;
    });

    this.currentPage = 1;
    this.renderTable();
    this.renderPagination();
  }

  async approveRequest() {
    if (!this.currentRequestId) return;

    try {
      await APIService.approveGatePass(this.currentRequestId, {});
      
      // Update local data
      const request = this.allRequests.find(r => r.id === this.currentRequestId);
      if (request) {
        request.status = 'approved';
      }

      this.renderTable();
      
      // Close modal
      const modal = document.getElementById('requestModal');
      if (modal) modal.style.display = 'none';

      alert('Request approved successfully');
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request');
    }
  }

  async rejectRequest() {
    if (!this.currentRequestId) return;

    try {
      await APIService.rejectGatePass(this.currentRequestId, {
        reason: 'Rejected by warden'
      });

      // Update local data
      const request = this.allRequests.find(r => r.id === this.currentRequestId);
      if (request) {
        request.status = 'rejected';
      }

      this.renderTable();

      // Close modal
      const modal = document.getElementById('requestModal');
      if (modal) modal.style.display = 'none';

      alert('Request rejected successfully');
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request');
    }
  }
}

// Initialize manager
const requestsManager = new RequestsManager();

document.addEventListener('DOMContentLoaded', () => {
  requestsManager.init();
});
