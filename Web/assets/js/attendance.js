// ========================================
// HostelSync – Attendance Page Logic
// ========================================

let allAttendance = [];

document.addEventListener('DOMContentLoaded', () => {
  initPage('attendance', 'Dashboard / Attendance');
  loadAttendance();
});

async function loadAttendance() {
  const tbody = document.getElementById('attTableBody');
  tbody.innerHTML = tableSkeletonHTML(7, 4);

  try {
    const data = await api.getAttendanceStatus();
    allAttendance = Array.isArray(data) ? data : (data.data || []);
    renderTable(allAttendance);
    updateStats(allAttendance, data.summary || {});
  } catch {
    allAttendance = [];
    renderTable([]);
    updateStats([], {});
  }
}

function renderTable(records) {
  const tbody = document.getElementById('attTableBody');
  if (!records.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state">
      <span class="material-symbols-outlined">event_busy</span>
      <h3>No Records for Today</h3>
      <p>Attendance data will appear here.</p>
    </div></td></tr>`;
    return;
  }

  tbody.innerHTML = records.map(r => {
    const status = (r.status || '').toLowerCase();
    let statusCls = 'pending', statusTxt = 'Unknown';
    if (status === 'present') { statusCls = 'approved'; statusTxt = 'Present'; }
    else if (status === 'absent') { statusCls = 'rejected'; statusTxt = 'Absent'; }
    else if (status === 'leave') { statusCls = 'in-progress'; statusTxt = 'On Leave'; }

    return `<tr>
      <td style="font-weight:700">${r.studentName || 'Unknown'}</td>
      <td>${r.studentId || r.rollNumber || '—'}</td>
      <td style="color:var(--on-surface-variant)">${r.roomNumber || '—'}</td>
      <td style="color:var(--on-surface-variant)">${formatDateTime(r.timestamp)}</td>
      <td style="color:var(--on-surface-variant)"><span style="font-size:0.75rem;padding:4px 8px;background:var(--surface-container-high);border-radius:4px">${r.method || 'Biometric'}</span></td>
      <td>${statusChipHTML(statusTxt)}</td>
      <td style="text-align:right">
        <button class="btn btn-secondary btn-sm" onclick="openModal('attendanceModal');document.getElementById('aRoll').value='${r.studentId || r.rollNumber || ''}'">Update</button>
      </td>
    </tr>`;
  }).join('');
}

function updateStats(records, summary) {
  // Use summary from API if available, else calculate from records
  const present = summary.present || records.filter(r => (r.status || '').toLowerCase() === 'present').length;
  const leave = summary.leave || records.filter(r => (r.status || '').toLowerCase() === 'leave').length;
  const absent = summary.absent || records.filter(r => (r.status || '').toLowerCase() === 'absent').length;

  const total = present + leave + absent || 1; // avoid /0
  const pct = Math.round((present / total) * 100);

  document.getElementById('statPresent').textContent = `${pct}% (${present})`;
  document.getElementById('barPresent').style.width = pct + '%';
  document.getElementById('statLeave').textContent = String(leave).padStart(2, '0');
  document.getElementById('statAbsent').textContent = String(absent).padStart(2, '0');
}

function filterAttendance() {
  const q = (document.getElementById('searchInput').value || '').toLowerCase();
  const filtered = allAttendance.filter(r =>
    (r.studentName || '').toLowerCase().includes(q) ||
    (r.studentId || r.rollNumber || '').toLowerCase().includes(q)
  );
  renderTable(filtered);
}

async function submitAttendance(e) {
  e.preventDefault();
  try {
    await api.markAttendance({
      rollNumber: document.getElementById('aRoll').value,
      status: document.getElementById('aStatus').value,
      note: document.getElementById('aNote').value,
    });
    showToast('Attendance logged manually', 'success');
    closeModal('attendanceModal');
    e.target.reset();
    loadAttendance();
  } catch { /* toast shown */ }
}
