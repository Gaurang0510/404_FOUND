/**
 * Visitors Module
 * Handles visitor management
 */

class VisitorsManager {
  constructor() {
    this.visitors = [];
  }

  async init() {
    if (!localStorage.getItem('authToken')) {
      window.location.href = 'index.html';
      return;
    }

    await this.loadVisitors();
    this.attachEventListeners();
  }

  async loadVisitors() {
    try {
      // Mock data
      this.visitors = [
        {
          id: 1,
          name: 'John Doe',
          student: 'Rajesh Kumar',
          block: 'A-101',
          checkIn: '2024-03-24 10:30 AM',
          checkOut: '-',
          status: 'In'
        },
        {
          id: 2,
          name: 'Jane Smith',
          student: 'Priya Sharma',
          block: 'A-102',
          checkIn: '2024-03-24 02:15 PM',
          checkOut: '2024-03-24 05:00 PM',
          status: 'Out'
        }
      ];

      this.renderVisitors();
    } catch (error) {
      console.error('Error loading visitors:', error);
    }
  }

  renderVisitors() {
    const table = document.getElementById('visitorsList');
    if (!table) return;

    if (this.visitors.length === 0) {
      table.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No visitors</td></tr>';
      return;
    }

    table.innerHTML = this.visitors.map(visitor => `
      <tr>
        <td>${visitor.name}</td>
        <td>${visitor.student}</td>
        <td>${visitor.block}</td>
        <td>${visitor.checkIn}</td>
        <td>${visitor.checkOut}</td>
        <td>
          <span class="badge badge-${visitor.status === 'In' ? 'success' : 'info'}">
            ${visitor.status}
          </span>
        </td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="visitorsManager.checkOut(${visitor.id})">
            Check Out
          </button>
        </td>
      </tr>
    `).join('');
  }

  checkOut(id) {
    const visitor = this.visitors.find(v => v.id === id);
    if (visitor) {
      visitor.checkOut = new Date().toLocaleString();
      visitor.status = 'Out';
      this.renderVisitors();
      alert('Visitor checked out successfully');
    }
  }

  attachEventListeners() {
    // Add filter functionality
  }
}

const visitorsManager = new VisitorsManager();

document.addEventListener('DOMContentLoaded', () => {
  visitorsManager.init();
});
