/**
 * Voting Module
 * Handles mess voting management
 */

class VotingManager {
  constructor() {
    this.votingData = {};
  }

  async init() {
    if (!localStorage.getItem('authToken')) {
      window.location.href = 'index.html';
      return;
    }

    await this.loadVotingData();
  }

  async loadVotingData() {
    try {
      // Mock data
      this.votingData = {
        totalVoters: 150,
        votesReceived: 120,
        options: [
          { name: 'Mess Vendor A', votes: 65 },
          { name: 'Mess Vendor B', votes: 55 }
        ],
        startDate: '2024-03-20',
        endDate: '2024-04-20',
        status: 'Active'
      };

      this.renderVotingData();
    } catch (error) {
      console.error('Error loading voting data:', error);
    }
  }

  renderVotingData() {
    // Update statistics
    const totalVoters = document.getElementById('totalVoters');
    const votesReceived = document.getElementById('votesReceived');
    const votingRate = document.getElementById('votingRate');
    const votingStatus = document.getElementById('votingStatus');

    if (totalVoters) totalVoters.textContent = this.votingData.totalVoters;
    if (votesReceived) votesReceived.textContent = this.votingData.votesReceived;
    
    if (votingRate) {
      const rate = Math.round((this.votingData.votesReceived / this.votingData.totalVoters) * 100);
      votingRate.textContent = rate + '%';
    }

    if (votingStatus) votingStatus.textContent = this.votingData.status;

    // Update voting options
    const optionsContainer = document.getElementById('votingOptions');
    if (optionsContainer && this.votingData.options) {
      optionsContainer.innerHTML = this.votingData.options.map(option => {
        const percentage = Math.round((option.votes / this.votingData.votesReceived) * 100);
        return `
          <div>
            <div class="flex items-center justify-between mb-2">
              <span>${option.name}</span>
              <span class="badge badge-info">${option.votes} votes</span>
            </div>
            <div class="w-full bg-surface-container rounded-full h-2">
              <div class="bg-gradient-to-r from-primary to-on-primary-container h-2 rounded-full" style="width: ${percentage}%"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Update dates
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const daysRemaining = document.getElementById('daysRemaining');

    if (startDate) startDate.textContent = this.votingData.startDate;
    if (endDate) endDate.textContent = this.votingData.endDate;
    
    if (daysRemaining) {
      const end = new Date(this.votingData.endDate);
      const today = new Date();
      const days = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
      daysRemaining.textContent = days > 0 ? days + ' days' : 'Ended';
    }
  }
}

const votingManager = new VotingManager();

document.addEventListener('DOMContentLoaded', () => {
  votingManager.init();
});
