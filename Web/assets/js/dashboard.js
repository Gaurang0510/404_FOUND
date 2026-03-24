// ========================================
// HostelSync – Dashboard Page Logic
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initPage('dashboard', 'Dashboard / Home');
  loadDashboardData();
});

async function loadDashboardData() {
  try {
    const stats = await api.getDashboardStats();
    populateStats(stats);
  } catch (err) {
    // API may not be available yet – show fallback UI
    showFallbackDashboard();
  }

  try {
    const passes = await api.getGatePassList({ limit: 5 });
    populateRecentActivity(Array.isArray(passes) ? passes : (passes.data || []));
  } catch {
    populateRecentActivity([]);
  }

  try {
    const complaints = await api.getComplaints({ limit: 3 });
    populateMaintenanceList(Array.isArray(complaints) ? complaints : (complaints.data || []));
  } catch {
    populateMaintenanceList([]);
  }
}

function populateStats(stats) {
  if (!stats) return showFallbackDashboard();

  const s = stats;
  setText('totalStudents', formatNumber(s.totalStudents));
  setText('badgeStudents', `+${s.newStudents || 0} new`);
  const cap = s.capacityPercent || 0;
  setWidth('capacityBar', cap + '%');
  setText('capacityText', `${cap}% Capacity utilized across all wings`);

  setText('pendingGatePass', formatNumber(s.pendingGatePass));
  setText('leaveRequests', formatNumber(s.leaveRequests));
  setText('badgeLeave', `${s.returningToday || 0} Returning Today`);

  const lb = document.getElementById('leaveBreakdown');
  if (lb && s.leaveBreakdown) {
    lb.innerHTML = Object.entries(s.leaveBreakdown).map(([k, v]) =>
      `<div style="display:flex;justify-content:space-between;font-size:0.75rem">
        <span style="color:var(--on-surface-variant)">${k}</span>
        <span style="color:var(--on-surface);font-weight:700">${v}</span>
      </div>`
    ).join('');
  }

  setText('attendancePercent', (s.attendancePercent || 0) + '%');
  setWidth('attendanceBar', (s.attendancePercent || 0) + '%');
  setText('presentCount', `${formatNumber(s.presentCount)} Present`);

  setText('activeComplaints', formatNumber(s.activeComplaints));
  setText('badgeComplaints', `${s.criticalComplaints || 0} Critical`);
  setText('complaintIssues', `Primary Issues: ${(s.primaryIssues || []).join(', ')}`);

  setText('visitorsToday', formatNumber(s.visitorsToday));
  setText('badgeVisitors', `${s.activeVisitors || 0} Active Now`);
}

function showFallbackDashboard() {
  // Show placeholder values when API is unavailable
  setText('totalStudents', '—');
  setText('badgeStudents', 'No data');
  setText('pendingGatePass', '—');
  setText('leaveRequests', '—');
  setText('badgeLeave', 'No data');
  setText('attendancePercent', '—');
  setText('presentCount', '—');
  setText('activeComplaints', '—');
  setText('badgeComplaints', 'No data');
  setText('complaintIssues', 'Connect to server for live data');
  setText('visitorsToday', '—');
  setText('badgeVisitors', 'No data');
}

function populateRecentActivity(passes) {
  const container = document.getElementById('recentActivity');
  if (!container) return;

  if (!passes.length) {
    container.innerHTML = `<div class="empty-state">
      <span class="material-symbols-outlined">event_busy</span>
      <h3>No Recent Activity</h3>
      <p>Gate pass requests will appear here</p>
    </div>`;
    return;
  }

  container.innerHTML = passes.slice(0, 5).map(p => `
    <div class="activity-item">
      <div class="activity-item-info">
        <div class="table-student-avatar" style="background:${getInitialsColor(p.studentName)};color:var(--on-surface);width:48px;height:48px;border-radius:12px;font-size:0.875rem">
          ${getInitials(p.studentName)}
        </div>
        <div>
          <p class="activity-item-name">${p.studentName || 'Unknown'}</p>
          <p class="activity-item-detail">Room: ${p.roomNumber || '—'} • ${p.block || ''}</p>
        </div>
      </div>
      <div class="activity-item-status">
        ${statusChipHTML(p.status)}
        <p class="activity-item-time">${timeAgo(p.createdAt)}</p>
      </div>
    </div>
  `).join('');
}

function populateMaintenanceList(complaints) {
  const container = document.getElementById('maintenanceList');
  if (!container) return;

  if (!complaints.length) {
    container.innerHTML = `<div class="empty-state">
      <span class="material-symbols-outlined">build</span>
      <h3>No Maintenance Items</h3>
      <p>Active maintenance tasks will appear here</p>
    </div>`;
    return;
  }

  container.innerHTML = complaints.slice(0, 3).map(c => `
    <div class="maintenance-item">
      <div class="maintenance-item-header">
        <span class="maintenance-item-title">${c.title || c.description || 'Issue'}</span>
        <span class="maintenance-item-priority" style="color:${c.priority === 'high' || c.priority === 'critical' ? 'var(--error)' : 'var(--on-surface-variant)'}">${c.priority || 'Standard'}</span>
      </div>
      <div class="maintenance-item-schedule">
        <span class="material-symbols-outlined" style="font-size:0.875rem">schedule</span>
        ${timeAgo(c.createdAt) || 'Recently'}
      </div>
    </div>
  `).join('');
}

// Helpers
function setText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }
function setWidth(id, w) { const el = document.getElementById(id); if (el) el.style.width = w; }
function formatNumber(n) { return n != null ? Number(n).toLocaleString() : '—'; }
