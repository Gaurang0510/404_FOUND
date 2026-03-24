/**
 * Attendance Module
 * Handles attendance tracking and management
 */

class AttendanceManager {
  constructor() {
    this.records = [];
  }

  async init() {
    if (!localStorage.getItem('authToken')) {
      window.location.href = 'index.html';
      return;
    }

    await this.loadAttendance();
    this.attachEventListeners();
  }

  async loadAttendance() {
    try {
      // Mock data
      this.records = [
        { name: 'Rajesh Kumar', roll: 'CS001', block: 'A-101', status: 'Present', date: '2024-03-24' },
        { name: 'Priya Sharma', roll: 'CS002', block: 'A-102', status: 'Absent', date: '2024-03-24' },
        { name: 'Ashish Singh', roll: 'CS003', block: 'B-201', status: 'Present', date: '2024-03-24' }
      ];
      
      this.renderRecords();
      this.updateStatistics();
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  }

  updateStatistics() {
    const totalStudents = document.getElementById('totalStudents');
    const presentToday = document.getElementById('presentToday');
    const absentToday = document.getElementById('absentToday');

    if (totalStudents) totalStudents.textContent = this.records.length;
    if (presentToday) presentToday.textContent = this.records.filter(r => r.status === 'Present').length;
    if (absentToday) absentToday.textContent = this.records.filter(r => r.status === 'Absent').length;
  }

  renderRecords() {
    const table = document.getElementById('attendanceTable');
    if (!table) return;

    table.innerHTML = this.records.map(record => `
      <tr>
        <td>${record.name}</td>
        <td>${record.roll}</td>
        <td>${record.block}</td>
        <td>
          <span class="badge badge-${record.status === 'Present' ? 'success' : 'rejected'}">
            ${record.status}
          </span>
        </td>
        <td>${record.date}</td>
      </tr>
    `).join('');
  }

  attachEventListeners() {
    // Add filter functionality
  }
}

const attendanceManager = new AttendanceManager();

document.addEventListener('DOMContentLoaded', () => {
  attendanceManager.init();
});
