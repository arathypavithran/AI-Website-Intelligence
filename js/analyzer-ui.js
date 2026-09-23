// ════════════════════════════════════════════════════════════════
//  ANALYZER UI MODULE
//  Handles automated real-time website analysis by URL or Upload
// ════════════════════════════════════════════════════════════════

export async function analyzeWebsiteByUrl(inputUrl, options = {}) {
  let url = inputUrl.trim();
  if (!url) {
    showToast('Please enter a valid website URL', 'error');
    return;
  }
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  showAnalysisModal(url);

  try {
    const res = await fetch('api/analyze.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url, maxPages: options.maxPages || 50 })
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      updateModalError(data.error || 'Failed to start analysis');
      return;
    }

    const analysisId = data.analysisId;
    pollAnalysisStatus(analysisId);

  } catch (err) {
    updateModalError('Connection error: ' + err.message);
  }
}

export function showAnalysisModal(url) {
  let modalOverlay = document.getElementById('modal-overlay');
  let modalTitle   = document.getElementById('modal-title');
  let modalBody    = document.getElementById('modal-body');
  let modalFooter  = document.getElementById('modal-footer');

  modalTitle.innerHTML = `⚡ Analyzing Website`;
  modalBody.innerHTML = `
    <div class="analysis-progress-container" style="padding:20px 10px; text-align:center;">
      <div class="analysis-url-display" style="font-size:16px; font-weight:600; color:var(--primary); margin-bottom:15px; word-break:break-all;">
        ${escapeHtml(url)}
      </div>

      <div class="progress-bar-wrap" style="background:var(--bg-tertiary); height:12px; border-radius:6px; overflow:hidden; margin:20px 0; border:1px solid var(--border-color);">
        <div id="analysis-progress-fill" style="width:5%; height:100%; background:linear-gradient(90deg, #3B82F6, #8B5CF6); transition:width 0.4s ease;"></div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; font-size:13px; color:var(--text-secondary);">
        <span id="analysis-status-text">Initializing live scanner...</span>
        <span id="analysis-percent" style="font-weight:700; color:var(--text-primary);">5%</span>
      </div>

      <div id="analysis-steps-log" style="margin-top:20px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:8px; padding:12px; text-align:left; font-size:12px; font-family:monospace; height:120px; overflow-y:auto; color:var(--text-dim);">
        <div>[System] Launching automated web crawler...</div>
      </div>
    </div>
  `;

  modalFooter.innerHTML = `
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
  `;

  modalOverlay.setAttribute('aria-hidden', 'false');
  modalOverlay.classList.add('active');
}

function pollAnalysisStatus(analysisId) {
  let attempts = 0;
  const maxAttempts = 120; // 2 minutes max

  const interval = setInterval(async () => {
    attempts++;
    try {
      const res = await fetch(`api/status.php?id=${analysisId}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        clearInterval(interval);
        updateModalError(data.error || 'Analysis failed');
        return;
      }

      const progress = Math.max(5, Math.min(100, data.progress || 5));
      const stepText = data.currentStep || 'Processing...';

      const fill = document.getElementById('analysis-progress-fill');
      const percentEl = document.getElementById('analysis-percent');
      const statusText = document.getElementById('analysis-status-text');
      const logEl = document.getElementById('analysis-steps-log');

      if (fill) fill.style.width = `${progress}%`;
      if (percentEl) percentEl.textContent = `${progress}%`;
      if (statusText) statusText.textContent = stepText;

      if (logEl) {
        const lastLine = logEl.lastElementChild?.textContent;
        const newLine = `[${new Date().toLocaleTimeString()}] ${stepText}`;
        if (lastLine !== newLine) {
          const div = document.createElement('div');
          div.style.color = progress === 100 ? '#22C55E' : 'var(--text-secondary)';
          div.textContent = newLine;
          logEl.appendChild(div);
          logEl.scrollTop = logEl.scrollHeight;
        }
      }

      if (data.status === 'completed' || progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onAnalysisCompleted(analysisId, data.domain);
        }, 800);
      } else if (data.status === 'failed') {
        clearInterval(interval);
        updateModalError(data.errorMessage || 'Analysis encountered an error');
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        updateModalError('Analysis timed out');
      }

    } catch (err) {
      // keep retrying
    }
  }, 1000);
}

function updateModalError(msg) {
  const statusText = document.getElementById('analysis-status-text');
  const logEl = document.getElementById('analysis-steps-log');
  const fill = document.getElementById('analysis-progress-fill');

  if (fill) fill.style.background = 'var(--danger)';
  if (statusText) statusText.textContent = 'Analysis Failed';
  if (logEl) {
    const div = document.createElement('div');
    div.style.color = 'var(--danger)';
    div.textContent = `[Error] ${msg}`;
    logEl.appendChild(div);
  }
}

async function onAnalysisCompleted(analysisId, domain) {
  let modalTitle = document.getElementById('modal-title');
  let modalBody  = document.getElementById('modal-body');
  let modalFooter = document.getElementById('modal-footer');

  try {
    const res = await fetch(`api/results.php?id=${analysisId}`);
    const data = await res.json();

    modalTitle.innerHTML = `✅ Analysis Complete: ${escapeHtml(domain)}`;
    modalBody.innerHTML = `
      <div style="text-align:center; padding:15px;">
        <div style="font-size:48px; margin-bottom:10px;">🎉</div>
        <h3 style="margin-bottom:10px; color:var(--text-primary);">Website Audit Finished</h3>
        <p style="color:var(--text-secondary); margin-bottom:20px;">
          Successfully extracted SEO, Security, Performance, and Technology Stack for <strong>${escapeHtml(domain)}</strong>.
        </p>

        <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:20px;">
          <div style="background:var(--bg-secondary); padding:12px; border-radius:8px; border:1px solid var(--border-color);">
            <div style="font-size:11px; color:var(--text-dim);">HEALTH</div>
            <div style="font-size:22px; font-weight:800; color:#22C55E;">${data.analysis.healthScore}/100</div>
          </div>
          <div style="background:var(--bg-secondary); padding:12px; border-radius:8px; border:1px solid var(--border-color);">
            <div style="font-size:11px; color:var(--text-dim);">SEO</div>
            <div style="font-size:22px; font-weight:800; color:#A855F7;">${data.website.seoScore}/100</div>
          </div>
          <div style="background:var(--bg-secondary); padding:12px; border-radius:8px; border:1px solid var(--border-color);">
            <div style="font-size:11px; color:var(--text-dim);">PERFORMANCE</div>
            <div style="font-size:22px; font-weight:800; color:#3B82F6;">${data.website.performanceScore}/100</div>
          </div>
          <div style="background:var(--bg-secondary); padding:12px; border-radius:8px; border:1px solid var(--border-color);">
            <div style="font-size:11px; color:var(--text-dim);">SECURITY</div>
            <div style="font-size:22px; font-weight:800; color:#06B6D4;">${data.website.securityScore}/100</div>
          </div>
        </div>
      </div>
    `;

    modalFooter.innerHTML = `
      <button class="btn btn-primary" onclick="closeModal(); window.location.hash='websites'; window.location.reload();">
        View Dashboard Results
      </button>
    `;

  } catch (e) {
    closeModal();
    window.location.hash = 'websites';
    window.location.reload();
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showToast(msg, type = 'info') {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${msg}</span>`;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

window.closeModal = function() {
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay) {
    modalOverlay.setAttribute('aria-hidden', 'true');
    modalOverlay.classList.remove('active');
  }
};
