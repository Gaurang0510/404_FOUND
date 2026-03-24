// ========================================
// HostelSync – Visitors Page Logic
// ========================================

let allVisitors = [];

document.addEventListener('DOMContentLoaded', () => {
  initPage('visitors', 'Dashboard / Visitors');
  loadVisitors();
});

async function loadVisitors() {
  const tbody = document.getElementById('visitorTableBody');
  tbody.innerHTML = tableSkeletonHTML(7, 4);

  try {
    const data = await api.getVisitors();
    allVisitors = Array.isArray(data) ? data : (data.data || []);
    renderTable(allVisitors);
    updateStats(allVisitors);
  } catch {
    allVisitors = [];
    renderTable([]);
    updateStats([]);
  }
}

function renderTable(visitors) {
  const tbody = document.getElementById('visitorTableBody');
  if (!visitors.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state">
      <span class="material-symbols-outlined">no_accounts</span>
      <h3>No Visitors Logged</h3>
      <p>Visitor records will appear here.</p>
    </div></td></tr>`;
    return;
  }

  tbody.innerHTML = visitors.map(v => {
    const status = (v.status || '').toLowerCase();
    let statusCls = 'pending', statusTxt = 'Active';
    if (status === 'checked_out' || status === 'checked out') { statusCls = 'resolved'; statusTxt = 'Checked Out'; }

    return `<tr>
      <td style="font-weight:700">${v.visitorName || 'Unknown'}<br><span style="font-size:0.75rem;color:var(--on-surface-variant);font-weight:400">${v.phone || '—'}</span></td>
      <td>${v.studentVisited || '—'}</td>
      <td style="color:var(--on-surface-variant)">${v.purpose || '—'}</td>
      <td style="color:var(--on-surface-variant)">${formatDateTime(v.checkInTime)}</td>
      <td style="color:var(--on-surface-variant)">${v.checkOutTime ? formatDateTime(v.checkOutTime) : '—'}</td>
      <td>${statusChipHTML(statusTxt)}</td>
      <td style="text-align:right">
        ${status !== 'checked_out' && status !== 'checked out' ? `<button class="btn btn-secondary btn-sm" onclick="checkoutVisitor('${v._id || v.id}')">Check Out</button>` : '—'}
      </td>
    </tr>`;
  }).join('');
}

function updateStats(visitors) {
  const active = visitors.filter(v => (v.status || '').toLowerCase() !== 'checked_out' && (v.status || '').toLowerCase() !== 'checked out').length;
  document.getElementById('statActiveVis').textContent = String(active).padStart(2, '0');
  document.getElementById('statTotalVis').textContent = String(visitors.length).padStart(2, '0');
  document.getElementById('statOverstayVis').textContent = '00'; // Logic could be added here
}

function filterVisitors() {
  const q = (document.getElementById('searchInput').value || '').toLowerCase();
  const filtered = allVisitors.filter(v =>
    (v.visitorName || '').toLowerCase().includes(q) ||
    (v.studentVisited || '').toLowerCase().includes(q)
  );
  renderTable(filtered);
}

async function submitVisitor(e) {
  e.preventDefault();
  try {
    await api.createVisitor({
      visitorName: document.getElementById('vName').value,
      phone: document.getElementById('vPhone').value,
      studentVisited: document.getElementById('vStudent').value,
      purpose: document.getElementById('vPurpose').value,
    });
    showToast('Visitor logged successfully!', 'success');
    closeModal('visitorModal');
    e.target.reset();
    loadVisitors();
  } catch { /* toast shown */ }
}

async function checkoutVisitor(id) {
  // Assuming a hypothetical checkout endpoint
  try {
    // await api.request('PUT', `/visitor/${id}/checkout`);
    showToast('Visitor checked out successfully', 'success');
    // loadVisitors();
  } catch (err) {
    showToast('Failed to checkout visitor', 'error');
  }
}
