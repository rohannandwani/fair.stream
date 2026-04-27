// FairStream Chrome Extension - Content Script
// Runs on YouTube, Twitter, Facebook, Reddit

(function() {
  'use strict';

  // Configuration
  let settings = {
    echoChamberStrength: 50,
    diversityTarget: 50,
    opposingViewpointRatio: 30,
    enabled: true,
    showIndicators: true,
    blockRabitholes: false
  };

  // Load settings
  chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (response) => {
    if (response) {
      settings = { ...settings, ...response };
    }
  });

  // Create and inject UI elements
  function createFairStreamUI() {
    // Create floating indicator
    const indicator = document.createElement('div');
    indicator.id = 'fairstream-indicator';
    indicator.innerHTML = `
      <div class="fairstream-badge">
        <span class="fairstream-icon">🛡️</span>
        <span class="fairstream-text">FairStream Active</span>
        <span class="fairstream-score" id="fairstream-score">50</span>
      </div>
    `;
    indicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    document.body.appendChild(indicator);

    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
      .fairstream-badge {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        border: 1px solid #334155;
        border-radius: 24px;
        color: white;
        font-size: 13px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      }
      .fairstream-icon {
        font-size: 16px;
      }
      .fairstream-score {
        background: linear-gradient(135deg, #10b981, #059669);
        padding: 2px 8px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 12px;
      }
      .fairstream-score.warning {
        background: linear-gradient(135deg, #f59e0b, #d97706);
      }
      .fairstream-score.danger {
        background: linear-gradient(135deg, #ef4444, #dc2626);
      }
    `;
    document.head.appendChild(style);

    // Update score periodically
    updateScore();
    setInterval(updateScore, 5000);
  }

  function updateScore() {
    chrome.runtime.sendMessage({ type: 'GET_STATS' }, (stats) => {
      if (!stats) return;
      
      const scoreEl = document.getElementById('fairstream-score');
      if (scoreEl) {
        const score = 100 - (stats.rabbitHoleScore || 0);
        scoreEl.textContent = score;
        
        scoreEl.classList.remove('warning', 'danger');
        if (score < 30) {
          scoreEl.classList.add('danger');
        } else if (score < 60) {
          scoreEl.classList.add('warning');
        }
      }
    });
  }

  // Analyze page content and log to background
  function analyzePage() {
    if (!settings.enabled) return;

    const articles = document.querySelectorAll('article, [role="article"], .tweet, .post, .content');
    
    articles.forEach((article, index) => {
      if (article.dataset.fairstreamLogged) return;
      article.dataset.fairstreamLogged = 'true';

      // Simple heuristic for bias detection
      const text = article.textContent.toLowerCase();
      const url = article.querySelector('a')?.href || window.location.href;
      
      // Determine bias based on keywords (simplified)
      let bias = 'center';
      const leftKeywords = ['progressive', 'liberal', 'democrat', 'equality', 'climate', 'healthcare'];
      const rightKeywords = ['conservative', 'republican', 'freedom', 'tradition', 'economy', 'border'];
      
      const leftCount = leftKeywords.filter(k => text.includes(k)).length;
      const rightCount = rightKeywords.filter(k => text.includes(k)).length;
      
      if (leftCount > rightCount) bias = 'left';
      else if (rightCount > leftCount) bias = 'right';

      // Log to background
      chrome.runtime.sendMessage({
        type: 'LOG_ARTICLE',
        url: url,
        bias: bias
      });
    });
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      createFairStreamUI();
      analyzePage();
    });
  } else {
    createFairStreamUI();
    analyzePage();
  }

  // Watch for dynamic content
  const observer = new MutationObserver(() => {
    analyzePage();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
