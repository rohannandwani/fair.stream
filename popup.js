// FairStream Chrome Extension - Popup Script

document.addEventListener('DOMContentLoaded', () => {
  // Load settings
  chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (settings) => {
    if (settings) {
      document.getElementById('toggle-enabled').classList.toggle('active', settings.enabled);
      document.getElementById('toggle-indicators').classList.toggle('active', settings.showIndicators);
    }
  });

  // Load stats
  chrome.runtime.sendMessage({ type: 'GET_STATS' }, (stats) => {
    if (!stats) return;

    const score = 100 - (stats.rabbitHoleScore || 0);
    const scoreEl = document.getElementById('score-value');
    const circleEl = document.getElementById('score-circle');
    const statusEl = document.getElementById('status');

    scoreEl.textContent = score;
    circleEl.style.setProperty('--score', `${score}%`);

    // Update status
    if (score >= 70) {
      statusEl.textContent = '✓ Your feed is well balanced';
      statusEl.className = 'status good';
      circleEl.style.background = 'conic-gradient(#10b981 var(--score), #334155 0)';
    } else if (score >= 40) {
      statusEl.textContent = '⚠ Consider diversifying your sources';
      statusEl.className = 'status warning';
      circleEl.style.background = 'conic-gradient(#f59e0b var(--score), #334155 0)';
    } else {
      statusEl.textContent = '⚠ You may be in a filter bubble';
      statusEl.className = 'status danger';
      circleEl.style.background = 'conic-gradient(#ef4444 var(--score), #334155 0)';
    }

    // Update stats
    document.getElementById('total-articles').textContent = stats.totalArticles || 0;
    document.getElementById('left-count').textContent = stats.leftLeaning || 0;
    document.getElementById('right-count').textContent = stats.rightLeaning || 0;
    document.getElementById('center-count').textContent = stats.center || 0;
  });

  // Toggle handlers
  document.getElementById('toggle-enabled').addEventListener('click', function() {
    this.classList.toggle('active');
    updateSettings();
  });

  document.getElementById('toggle-indicators').addEventListener('click', function() {
    this.classList.toggle('active');
    updateSettings();
  });

  function updateSettings() {
    const enabled = document.getElementById('toggle-enabled').classList.contains('active');
    const showIndicators = document.getElementById('toggle-indicators').classList.contains('active');

    chrome.runtime.sendMessage({
      type: 'UPDATE_SETTINGS',
      settings: { enabled, showIndicators }
    });
  }

  // Open dashboard button
  document.getElementById('open-dashboard').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://fairstream.app' });
  });
});
