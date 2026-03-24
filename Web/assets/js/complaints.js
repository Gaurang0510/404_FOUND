/**
 * Complaints Module
 * Handles complaint listing and management
 */

class ComplaintsManager {
  constructor() {
    this.complaints = [];
    this.currentComplaint = null;
  }

  async init() {
    if (!localStorage.getItem('authToken')) {
      window.location.href = 'index.html';
      return;
    }

    await this.loadComplaints();
    this.attachEventListeners();
  }

  async loadComplaints() {
    try {
      // Mock data for demo
      this.complaints = [
        {
          id: 1,
          complainant: 'Ashish Singh',
          category: 'Maintenance',
          block: 'A-105',
          issue: 'Water leakage in bathroom',
          status: 'in-progress',
          date: '2024-03-20',
          description: 'Water is leaking from the shower area, creating a wet floor hazard.'
        },
        {
          id: 2,
          complainant: 'Neha Gupta',
          category: 'Cleanliness',
          block: 'B-201',
          issue: 'Common area not cleaned',
          status: 'open',
          date: '2024-03-23',
          description: 'The common study area has not been cleaned for 3 days.'
        }
      ];
      
      this.renderComplaints();
    } catch (error) {
      console.error('Error loading complaints:', error);
    }
  }

  renderComplaints() {
    const table = document.getElementById('complaintsList');
    if (!table) return;

    table.innerHTML = this.complaints.map(complaint => `
      <tr>
        <td>${complaint.complainant}</td>
        <td>${complaint.category}</td>
        <td>${complaint.block}</td>
        <td>${complaint.issue}</td>
        <td>
          <span class="badge badge-${complaint.status === 'resolved' ? 'success' : complaint.status === 'open' ? 'rejected' : 'pending'}">
            ${complaint.status}
          </span>
        </td>
        <td>${complaint.date}</td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="complaintsManager.viewComplaint(${complaint.id})">
            View
          </button>
        </td>
      </tr>
    `).join('');
  }

  viewComplaint(id) {
    this.currentComplaint = this.complaints.find(c => c.id === id);
    if (!this.currentComplaint) return;

    // Show details (implementation would include modal)
    console.log('Viewing complaint:', this.currentComplaint);
  }

  attachEventListeners() {
    const applyBtn = document.getElementById('applyFiltersBtn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => this.applyFilters());
    }
  }

  applyFilters() {
    const status = document.getElementById('filterStatus').value;
    const category = document.getElementById('filterCategory').value;
    const block = document.getElementById('filterBlock').value;

    const filtered = this.complaints.filter(complaint => {
      const statusMatch = !status || complaint.status === status;
      const categoryMatch = !category || complaint.category === category;
      const blockMatch = !block || complaint.block.includes(block);
      return statusMatch && categoryMatch && blockMatch;
    });

    // Render filtered results
    const table = document.getElementById('complaintsList');
    if (table) {
      table.innerHTML = filtered.map(complaint => `
        <tr>
          <td>${complaint.complainant}</td>
          <td>${complaint.category}</td>
          <td>${complaint.block}</td>
          <td>${complaint.issue}</td>
          <td>
            <span class="badge badge-${complaint.status === 'resolved' ? 'success' : complaint.status === 'open' ? 'rejected' : 'pending'}">
              ${complaint.status}
            </span>
          </td>
          <td>${complaint.date}</td>
          <td>
            <button class="btn btn-primary btn-sm" onclick="complaintsManager.viewComplaint(${complaint.id})">
              View
            </button>
          </td>
        </tr>
      `).join('');
    }
  }
}

const complaintsManager = new ComplaintsManager();

document.addEventListener('DOMContentLoaded', () => {
  complaintsManager.init();
});
