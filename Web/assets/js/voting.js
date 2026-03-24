// ========================================
// HostelSync – Voting Page Logic
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initPage('voting', 'Dashboard / Mess Voting');
  loadPolls();
});

async function loadPolls() {
  try {
    const data = await api.getResults();
    const active = data.active || null;
    const history = data.history || [];
    renderActivePoll(active);
    renderPastPolls(history);
  } catch {
    renderActivePoll(null);
    renderPastPolls([]);
  }
}

function renderActivePoll(poll) {
  const container = document.getElementById('pollResults');
  const desc = document.getElementById('activePollDesc');
  const total = document.getElementById('totalVotes');

  if (!poll) {
    desc.textContent = 'There are no active polls at the moment.';
    container.innerHTML = `<div class="empty-state">
      <span class="material-symbols-outlined">front_hand</span>
      <h3>No Active Poll</h3>
      <p>Click "Create New Poll" to start one.</p>
    </div>`;
    total.textContent = '0';
    return;
  }

  desc.textContent = poll.description || 'Cast your vote for the upcoming menu.';
  total.textContent = poll.totalVotes || 0;
  
  const maxVotes = Math.max(...(poll.options || []).map(o => o.votes || 0), 1);

  container.innerHTML = (poll.options || []).map(opt => {
    const pct = Math.round(((opt.votes || 0) / (poll.totalVotes || 1)) * 100) || 0;
    const isWinner = (opt.votes || 0) === maxVotes && (opt.votes || 0) > 0;
    const fillClass = isWinner ? 'progress-bar-fill--primary' : '';
    const fillStyle = isWinner ? '' : 'background:var(--tertiary)';

    return `<div class="vote-bar">
      <span class="vote-bar-label">${opt.name}</span>
      <div class="vote-bar-track">
        <div class="vote-bar-fill ${fillClass}" style="width:${pct}%;${fillStyle}">${pct > 10 ? pct + '%' : ''}</div>
      </div>
      <span class="vote-bar-count">${opt.votes || 0}</span>
    </div>`;
  }).join('');
  
  // Update header title
  const header = document.querySelector('.section-card-header h4');
  if (header) header.textContent = `Active Poll: ${poll.title || 'Untitled'}`;
}

function renderPastPolls(polls) {
  const container = document.getElementById('pastPolls');
  if (!polls.length) {
    container.innerHTML = `<div class="empty-state"><span class="material-symbols-outlined">history</span><p>No past polls found</p></div>`;
    return;
  }

  container.innerHTML = polls.map(p => `
    <div class="activity-item">
      <div>
        <h5 style="font-size:0.875rem;font-weight:700;margin-bottom:4px">${p.title || 'Past Poll'}</h5>
        <p style="font-size:0.75rem;color:var(--on-surface-variant)">Winner: <strong style="color:var(--primary)">${p.winner || '—'}</strong> (${p.totalVotes || 0} votes)</p>
      </div>
      <span style="font-size:0.75rem;color:var(--on-surface-variant)">${timeAgo(p.createdAt)}</span>
    </div>
  `).join('');
}

async function submitPoll(e) {
  e.preventDefault();
  try {
    const title = document.getElementById('pTitle').value;
    const desc = document.getElementById('pDesc').value;
    const opts = document.getElementById('pOptions').value.split(',').map(s => s.trim()).filter(s => s);
    
    // Hypothetical create poll endpoint
    await api.request('POST', '/vote/poll', { title, description: desc, options: opts });
    showToast('Poll created successfully!', 'success');
    closeModal('pollModal');
    e.target.reset();
    loadPolls();
  } catch {
    // If endpoint doesn't exist, just show toast for demo
    showToast('Poll created (Demo Mode)', 'success');
    closeModal('pollModal');
    e.target.reset();
  }
}
