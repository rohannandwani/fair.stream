// FairStream Chrome Extension - Background Service Worker

// Default settings
const DEFAULT_SETTINGS = {
  echoChamberStrength: 50,
  diversityTarget: 50,
  opposingViewpointRatio: 30,
  enabled: true,
  showIndicators: true,
  blockRabitholes: false
};

// Initialize extension on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ fairstreamSettings: DEFAULT_SETTINGS });
  console.log('FairStream extension installed');
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_SETTINGS') {
    chrome.storage.sync.get('fairstreamSettings', (result) => {
      sendResponse(result.fairstreamSettings || DEFAULT_SETTINGS);
    });
    return true;
  }

  if (message.type === 'UPDATE_SETTINGS') {
    chrome.storage.sync.set({ fairstreamSettings: message.settings });
    sendResponse({ success: true });
  }

  if (message.type === 'GET_STATS') {
    // Get browsing statistics
    chrome.storage.local.get('browsingStats', (result) => {
      sendResponse(result.browsingStats || {
        totalArticles: 0,
        leftLeaning: 0,
        rightLeaning: 0,
        center: 0,
        rabbitHoleScore: 0
      });
    });
    return true;
  }

  if (message.type === 'LOG_ARTICLE') {
    // Log article consumption for drift detection
    chrome.storage.local.get('browsingStats', (result) => {
      const stats = result.browsingStats || {
        totalArticles: 0,
        leftLeaning: 0,
        rightLeaning: 0,
        center: 0,
        rabbitHoleScore: 0,
        recentArticles: []
      };
      
      stats.totalArticles++;
      stats[message.bias] = (stats[message.bias] || 0) + 1;
      stats.recentArticles = [...stats.recentArticles, {
        url: message.url,
        bias: message.bias,
        timestamp: Date.now()
      }].slice(-50); // Keep last 50 articles

      // Calculate rabbit hole score (0-100)
      const maxLean = Math.max(stats.leftLeaning, stats.rightLeaning);
      const total = stats.totalArticles;
      if (total > 0) {
        stats.rabbitHoleScore = Math.round((maxLean / total) * 100);
      }

      chrome.storage.local.set({ browsingStats: stats });
      sendResponse({ success: true });
    });
    return true;
  }
});

// Badge update for rabbit hole warning
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.browsingStats) {
    const stats = changes.browsingStats.newValue;
    if (stats && stats.rabbitHoleScore > 70) {
      chrome.action.setBadgeText({ text: '!' });
      chrome.action.setBadgeBackgroundColor({ color: '#ef4444' });
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  }
});
