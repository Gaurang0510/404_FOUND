// ========================================
// HostelSync – Component Loader & Utilities
// ========================================

// Load an HTML component into an element
async function loadComponent(elementId, filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Failed to load ${filePath}`);
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
  } catch (error) {
    console.error('Component load error:', error);
  }
}

// Initialize page layout: sidebar + navbar + auth guard
async function initPage(pageName, breadcrumb) {
  // Auth guard
  if (!api.isAuthenticated()) {
    window.location.href = 'index.html';
    return;
  }

  // Load components
  await Promise.all([
    loadComponent('sidebar-root', 'components/sidebar.html'),
    loadComponent('navbar-root', 'components/navbar.html'),
  ]);

  // Set active sidebar item
  setActiveSidebar(pageName);

  // Set breadcrumb
  if (breadcrumb) {
    const bc = document.getElementById('navBreadcrumb');
    if (bc) bc.textContent = breadcrumb;
  }

  // Set profile info
  const user = api.getUser();
  if (user) {
    const nameEl = document.getElementById('navProfileName');
    const roleEl = document.getElementById('navProfileRole');
    if (nameEl) nameEl.textContent = user.name || 'Warden';
    if (roleEl) roleEl.textContent = user.role || 'Warden';
  }

  // Setup sidebar overlay/mobile toggle
  setupMobileSidebar();
}

// Highlight active sidebar link
function setActiveSidebar(pageName) {
  const links = document.querySelectorAll('.sidebar-nav a');
  links.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.page === pageName) {
      link.classList.add('active');
    }
  });
}

// Mobile sidebar toggle
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('active');
}

function setupMobileSidebar() {
  const overlay = document.getElementById('sidebarOverlay');
  if (overlay) {
    overlay.addEventListener('click', toggleSidebar);
  }
}

// Format date helper
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' +
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const then = new Date(dateStr);
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// Generate initials avatar
function getInitials(name) {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getInitialsColor(name) {
  const colors = [
    'var(--secondary-container)',
    'var(--tertiary-container)',
    'var(--surface-container-highest)',
    'var(--primary-container)',
  ];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

// Status chip HTML
function statusChipHTML(status) {
  const s = (status || '').toLowerCase();
  let cls = 'pending';
  if (s === 'approved') cls = 'approved';
  else if (s === 'rejected') cls = 'rejected';
  else if (s === 'open') cls = 'open';
  else if (s === 'in progress' || s === 'in_progress') cls = 'in-progress';
  else if (s === 'resolved') cls = 'resolved';
  return `<span class="status-chip status-chip--${cls}">
    <span class="status-dot"></span>${status || 'Pending'}
  </span>`;
}

// Priority badge HTML
function priorityBadgeHTML(priority) {
  const p = (priority || '').toLowerCase();
  let cls = 'medium';
  if (p === 'high') cls = 'high';
  else if (p === 'low') cls = 'low';
  else if (p === 'critical') cls = 'critical';
  return `<span class="priority-badge priority-badge--${cls}">
    <span class="status-dot"></span>${priority || 'Medium'}
  </span>`;
}

// Modal helpers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// Skeleton loading for tables
function tableSkeletonHTML(cols = 5, rows = 4) {
  let html = '';
  for (let r = 0; r < rows; r++) {
    html += '<tr>';
    for (let c = 0; c < cols; c++) {
      html += `<td><div class="skeleton" style="height:16px;width:${60 + Math.random() * 40}%"></div></td>`;
    }
    html += '</tr>';
  }
  return html;
}
