// ========================================
// HostelSync – Complaints Page Logic
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initPage('complaints', 'Complaints Management');
  loadComplaints();
});

async function loadComplaints() {
  try {
    const data = await api.getComplaints();
    const complaints = Array.isArray(data) ? data : (data.data || []);
    renderComplaints(complaints);
    renderComplaintStats(complaints);
  } catch {
    renderComplaints([]);
    renderComplaintStats([]);
  }
}

function renderComplaints(complaints) {
  const grid = document.getElementById('complaintsGrid');
  if (!complaints.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <span class="material-symbols-outlined">task_alt</span>
      <h3>No Active Complaints</h3>
      <p>All clear! Complaints will appear here when filed.</p>
    </div>`;
    return;
  }

  grid.innerHTML = complaints.map(c => {
    const status = (c.status || 'open').toLowerCase();
    const priority = (c.priority || 'medium').toLowerCase();
    const statusLabel = status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1);
    const borderColor = status === 'resolved' ? 'var(--primary)' : priority === 'high' || priority === 'critical' ? 'var(--error)' : 'var(--tertiary)';

    return `<div class="glass-card glow-soft complaint-card" style="border-color:rgba(69,70,77,0.05)">
      <div class="complaint-card-header">
        ${priorityBadgeHTML(c.priority || 'Medium')}
        <span style="font-size:0.75rem;color:var(--on-surface-variant)">${timeAgo(c.createdAt)}</span>
      </div>
      <h3>${c.title || 'Untitled Issue'}</h3>
      <p>${c.description || 'No description provided.'}</p>
      <div class="complaint-card-footer">
        <div class="complaint-card-assigned">
          <span style="color:var(--on-surface-variant)">Assigned To</span>
          <div style="display:flex;align-items:center;gap:8px;font-weight:500">
            <span class="material-symbols-outlined" style="font-size:1rem;color:var(--on-surface-variant)">person</span>
            ${c.assignedTo || 'Unassigned'}
          </div>
        </div>
        <div class="complaint-card-actions">
          ${statusChipHTML(statusLabel)}
          <button class="complaint-card-link" style="color:${borderColor}">
            ${status === 'resolved' ? 'Archive' : 'View Details'}
            <span class="material-symbols-outlined" style="font-size:1.125rem">${status === 'resolved' ? 'archive' : 'arrow_right_alt'}</span>
          </button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function renderComplaintStats(complaints) {
  const container = document.getElementById('complaintStats');
  const pending = complaints.filter(c => (c.status || '').toLowerCase() === 'open' || (c.status || '').toLowerCase() === 'pending').length;
  const inProgress = complaints.filter(c => (c.status || '').toLowerCase() === 'in_progress' || (c.status || '').toLowerCase() === 'in progress').length;
  const resolved = complaints.filter(c => (c.status || '').toLowerCase() === 'resolved').length;

  container.innerHTML = `
    <div class="stat-card stat-card-compact" style="display:flex;align-items:center;gap:16px;border:1px solid rgba(69,70,77,0.05)">
      <div style="width:48px;height:48px;border-radius:50%;background:rgba(173,198,255,0.1);display:flex;align-items:center;justify-content:center;color:var(--primary)">
        <span class="material-symbols-outlined" style="font-size:1.875rem">assignment_late</span>
      </div>
      <div><p class="stat-card-label" style="margin:0">Pending</p><p style="font-size:1.5rem;font-weight:700">${pending}</p></div>
    </div>
    <div class="stat-card stat-card-compact" style="display:flex;align-items:center;gap:16px;border:1px solid rgba(69,70,77,0.05)">
      <div style="width:48px;height:48px;border-radius:50%;background:rgba(227,193,147,0.1);display:flex;align-items:center;justify-content:center;color:var(--tertiary)">
        <span class="material-symbols-outlined" style="font-size:1.875rem">engineering</span>
      </div>
      <div><p class="stat-card-label" style="margin:0">In Progress</p><p style="font-size:1.5rem;font-weight:700">${inProgress}</p></div>
    </div>
    <div class="stat-card stat-card-compact" style="display:flex;align-items:center;gap:16px;border:1px solid rgba(69,70,77,0.05)">
      <div style="width:48px;height:48px;border-radius:50%;background:rgba(186,198,233,0.1);display:flex;align-items:center;justify-content:center;color:var(--secondary)">
        <span class="material-symbols-outlined" style="font-size:1.875rem">task_alt</span>
      </div>
      <div><p class="stat-card-label" style="margin:0">Resolved</p><p style="font-size:1.5rem;font-weight:700">${resolved}</p></div>
    </div>
  `;
}

async function submitComplaint(e) {
  e.preventDefault();
  try {
    await api.createComplaint({
      title: document.getElementById('cTitle').value,
      description: document.getElementById('cDesc').value,
      priority: document.getElementById('cPriority').value,
      category: document.getElementById('cCategory').value,
    });
    showToast('Complaint logged successfully!', 'success');
    closeModal('complaintModal');
    e.target.reset();
    loadComplaints();
  } catch { /* toast shown */ }
}
