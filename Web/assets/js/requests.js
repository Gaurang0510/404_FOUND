// ========================================
// HostelSync – Gate Pass / Leave Requests
// ========================================

let currentMode = 'gatepass'; // or 'leave'
let allRequests = [];

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('type') === 'leave') {
    currentMode = 'leave';
  }
  const pageName = currentMode === 'leave' ? 'leave' : 'requests';
  const breadcrumb = currentMode === 'leave' ? 'Dashboard / Leave Requests' : 'Dashboard / Gate Pass';
  initPage(pageName, breadcrumb);
  updatePageTitle();
  loadRequests();
});

function updatePageTitle() {
  const title = document.getElementById('pageTitle');
  const desc = document.getElementById('pageDesc');
  const toggleLabel = document.getElementById('toggleLabel');
  if (currentMode === 'leave') {
    if (title) title.textContent = 'Leave Requests';
    if (desc) desc.textContent = 'Manage and review student leave applications for the current academic session.';
    if (toggleLabel) toggleLabel.textContent = 'Switch to Gate Pass';
    document.title = 'Leave Requests | HostelSync';
  } else {
    if (title) title.textContent = 'Gate Pass Management';
    if (desc) desc.textContent = 'Review and manage student gate pass requests in real-time.';
    if (toggleLabel) toggleLabel.textContent = 'Switch to Leave Requests';
    document.title = 'Gate Pass Requests | HostelSync';
  }
}

function toggleLeaveView() {
  currentMode = currentMode === 'gatepass' ? 'leave' : 'gatepass';
  const pageName = currentMode === 'leave' ? 'leave' : 'requests';
  setActiveSidebar(pageName);
  updatePageTitle();
  loadRequests();
  // Update URL without reload
  const url = currentMode === 'leave' ? 'requests.html?type=leave' : 'requests.html';
  window.history.replaceState({}, '', url);
}

async function loadRequests() {
  const tbody = document.getElementById('requestsTableBody');
  tbody.innerHTML = tableSkeletonHTML(7, 4);

  try {
    let data;
    if (currentMode === 'leave') {
      data = await api.getLeaves();
    } else {
      data = await api.getGatePassList();
    }
    allRequests = Array.isArray(data) ? data : (data.data || []);
    renderTable(allRequests);
    updateStats(allRequests);
  } catch {
    allRequests = [];
    renderTable([]);
    updateStats([]);
  }
}

function renderTable(requests) {
  const tbody = document.getElementById('requestsTableBody');
  if (!requests.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state">
      <span class="material-symbols-outlined">event_busy</span>
      <h3>No Requests Found</h3>
      <p>Requests will appear here when students submit them</p>
    </div></td></tr>`;
    renderPagination(0);
    return;
  }

  tbody.innerHTML = requests.map((r, i) => `
    <tr>
      <td>
        <div class="table-student">
          <div class="table-student-avatar" style="background:${getInitialsColor(r.studentName)};color:var(--on-surface)">${getInitials(r.studentName)}</div>
          <div>
            <p class="table-student-name">${r.studentName || 'Unknown'}</p>
            <p class="table-student-id">ID: ${r.studentId || r.rollNumber || '—'}</p>
          </div>
        </div>
      </td>
      <td style="font-weight:500">${r.roomNumber || '—'}</td>
      <td style="color:var(--on-surface-variant)">${formatDateTime(r.exitTime || r.startDate)}</td>
      <td style="color:var(--on-surface-variant)">${formatDateTime(r.returnTime || r.endDate)}</td>
      <td style="color:var(--on-surface-variant);font-style:italic;font-size:0.875rem;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">"${r.reason || '—'}"</td>
      <td>${statusChipHTML(r.status)}</td>
      <td style="text-align:right">${getActionHTML(r)}</td>
    </tr>
  `).join('');

  renderPagination(requests.length);
}

function getActionHTML(r) {
  const status = (r.status || '').toLowerCase();
  if (status === 'pending') {
    return `<div style="display:flex;justify-content:flex-end;gap:8px">
      <button class="btn btn-approve btn-sm" onclick="approveRequest('${r._id || r.id}')">Approve</button>
      <button class="btn btn-reject btn-sm" onclick="rejectRequest('${r._id || r.id}')">Reject</button>
    </div>`;
  } else if (status === 'approved') {
    return `<span style="font-size:0.75rem;color:var(--on-surface-variant)">Approved by Warden</span>`;
  } else if (status === 'rejected') {
    return `<span style="font-size:0.75rem;color:var(--error);font-style:italic">${r.rejectReason || 'Rejected'}</span>`;
  }
  return '';
}

async function approveRequest(id) {
  try {
    if (currentMode === 'leave') await api.approveLeave(id);
    else await api.approveGatePass(id);
    showToast('Request approved successfully!', 'success');
    loadRequests();
  } catch { /* toast already shown */ }
}

async function rejectRequest(id) {
  try {
    if (currentMode === 'leave') await api.rejectLeave(id);
    else await api.rejectGatePass(id);
    showToast('Request rejected', 'warning');
    loadRequests();
  } catch { /* toast already shown */ }
}

function filterRequests() {
  const q = (document.getElementById('searchInput').value || '').toLowerCase();
  const filtered = allRequests.filter(r =>
    (r.studentName || '').toLowerCase().includes(q) ||
    (r.roomNumber || '').toLowerCase().includes(q) ||
    (r.reason || '').toLowerCase().includes(q)
  );
  renderTable(filtered);
}

function updateStats(requests) {
  const pending = requests.filter(r => (r.status || '').toLowerCase() === 'pending').length;
  const approved = requests.filter(r => (r.status || '').toLowerCase() === 'approved').length;
  const rejected = requests.filter(r => (r.status || '').toLowerCase() === 'rejected').length;
  document.getElementById('statPending').textContent = String(pending).padStart(2, '0');
  document.getElementById('statApproved').textContent = String(approved).padStart(2, '0');
  document.getElementById('statLate').textContent = String(rejected).padStart(2, '0');
  document.getElementById('statActive').textContent = String(requests.length).padStart(2, '0');
}

function renderPagination(total) {
  const container = document.getElementById('pagination');
  const perPage = 10;
  const pages = Math.ceil(total / perPage) || 1;
  container.innerHTML = `
    <p class="pagination-info">Showing <strong>1 to ${Math.min(total, perPage)}</strong> of <strong>${total}</strong> requests</p>
    <div class="pagination-btns">
      <button class="pagination-btn" disabled><span class="material-symbols-outlined" style="font-size:0.875rem">chevron_left</span></button>
      ${Array.from({ length: Math.min(pages, 3) }, (_, i) =>
        `<button class="pagination-btn ${i === 0 ? 'active' : ''}">${i + 1}</button>`
      ).join('')}
      <button class="pagination-btn"><span class="material-symbols-outlined" style="font-size:0.875rem">chevron_right</span></button>
    </div>
  `;
}
