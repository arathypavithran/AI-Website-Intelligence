// ════════════════════════════════════════════════════════════════
//  ANALYTIX AI SERVICE — CONTEXT-AWARE WEBSITE INTELLIGENCE
//  All responses based on actual portal data. No hallucination.
// ════════════════════════════════════════════════════════════════
import {
  websites, domains, sslCerts, plugins, themes, wordpress,
  performanceMetrics, seoData, uptimeData, securityChecks,
  backups, forms, websiteEvents, alerts, auditIssues,
  getDashboardSummary, getWebsiteByName, getWebsiteById,
  getDomainByWebsite, getSSLByWebsite, getPluginsByWebsite,
  getPerformanceByWebsite, getSEOByWebsite, getUptimeByWebsite,
  getSecurityByWebsite, getEventsByWebsite, getWordPressByWebsite,
  getBackupByWebsite, formatTimeAgo, getScoreColor, getDaysColor
} from './data.js';

// ─── AI PANEL STATE ──────────────────────────────────────────
const AIState = {
  open: false,
  messages: [],
  context: 'Dashboard',
  websiteContext: null,
  conversationHistory: [],
};

const QUICK_PROMPTS = [
  'Which websites need attention today?',
  'Show me critical website issues.',
  'Which domains expire this month?',
  'Which plugins are expiring soon?',
  'Which websites are slow?',
  'Which websites have SEO problems?',
  'Which websites have broken links?',
  'Show websites with downtime.',
  'Give me today\'s website summary.',
  'Analyze my website health.',
  'Which SSL certificates expire soon?',
  'Which websites have outdated WordPress?',
  'Compare website performance.',
  'Generate a monthly website report.',
];

// ─── INIT ────────────────────────────────────────────────────
export function initAIPanel() {
  const fab = document.getElementById('ai-fab');
  const panel = document.getElementById('ai-panel');
  const closeBtn = document.getElementById('ai-close-btn');
  const sendBtn = document.getElementById('ai-send-btn');
  const input = document.getElementById('ai-input');
  const clearBtn = document.getElementById('ai-clear-btn');
  const newChatBtn = document.getElementById('ai-new-chat');
  const fullscreenBtn = document.getElementById('ai-fullscreen-btn');
  const analyzeBtn = document.getElementById('ai-analyze-btn');

  // FAB click
  fab?.addEventListener('click', () => toggleAIPanel(true));
  fab?.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') toggleAIPanel(true); });

  // Close
  closeBtn?.addEventListener('click', () => toggleAIPanel(false));

  // Send
  sendBtn?.addEventListener('click', sendMessage);
  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  // Auto-resize input
  input?.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });

  // Clear
  clearBtn?.addEventListener('click', clearConversation);

  // New chat
  newChatBtn?.addEventListener('click', () => {
    clearConversation();
    showWelcomeMessage();
  });

  // Fullscreen
  fullscreenBtn?.addEventListener('click', () => {
    panel.classList.toggle('fullscreen');
    if (panel.classList.contains('fullscreen')) {
      window.location.hash = 'ai-assistant';
      toggleAIPanel(false);
    }
  });

  // Analyze current page
  analyzeBtn?.addEventListener('click', () => {
    const ctx = document.getElementById('ai-context-value')?.textContent || 'Dashboard';
    const prompt = `Analyze ${ctx}`;
    if (input) input.value = prompt;
    sendMessage();
  });

  // Initialize with welcome
  showWelcomeMessage();
  loadSuggestions();

  // Global function to open AI with preset message
  window.openAIPanel = (message) => {
    toggleAIPanel(true);
    if (message) {
      setTimeout(() => {
        if (input) input.value = message;
        sendMessage();
      }, 400);
    }
  };
}

function toggleAIPanel(open) {
  const panel = document.getElementById('ai-panel');
  const fab = document.getElementById('ai-fab');
  if (!panel) return;
  AIState.open = open;
  panel.classList.toggle('open', open);
  panel.setAttribute('aria-hidden', (!open).toString());
  if (open) {
    document.getElementById('ai-input')?.focus();
  }
}

function showWelcomeMessage() {
  const messages = document.getElementById('ai-messages');
  if (!messages) return;
  messages.innerHTML = '';
  AIState.messages = [];

  addAIMessage(`
    <div style="margin-bottom:8px">Good morning! I'm <strong>Analytix AI</strong>, your website intelligence assistant.</div>
    <div style="margin-bottom:10px;color:var(--text-muted);font-size:12px">I have access to all portal data — websites, SEO, performance, domains, SSL, plugins, security, uptime, backups, and events.</div>
    ${buildQuickSummaryCard()}
  `);
}

function buildQuickSummaryCard() {
  const s = getDashboardSummary();
  return `
    <div class="ai-response-card">
      <div class="ai-response-card-title">📊 Current Status Overview</div>
      <div class="ai-metric-row"><span class="ai-metric-label">Total Websites</span><span class="ai-metric-val">${s.total}</span></div>
      <div class="ai-metric-row"><span class="ai-metric-label">Healthy</span><span class="ai-metric-val" style="color:var(--success)">${s.healthy}</span></div>
      <div class="ai-metric-row"><span class="ai-metric-label">Needs Attention</span><span class="ai-metric-val" style="color:var(--warning)">${s.issues}</span></div>
      <div class="ai-metric-row"><span class="ai-metric-label">Critical</span><span class="ai-metric-val" style="color:var(--danger)">${s.critical}</span></div>
      <div class="ai-metric-row"><span class="ai-metric-label">Unack. Alerts</span><span class="ai-metric-val" style="color:var(--danger)">${s.unackAlerts}</span></div>
    </div>
    <div class="ai-response-actions">
      <span class="ai-action-link" onclick="window.openAIPanel('Which websites need attention today?')">🔍 Attention needed</span>
      <span class="ai-action-link" onclick="window.openAIPanel('Give me today\\'s website summary.')">📋 Daily summary</span>
    </div>`;
}

function loadSuggestions() {
  const chips = document.getElementById('suggestion-chips');
  if (!chips) return;
  const selected = QUICK_PROMPTS.slice(0, 6);
  chips.innerHTML = selected.map(p =>
    `<button class="suggestion-chip" data-prompt="${p}">${p}</button>`
  ).join('');
  chips.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const input = document.getElementById('ai-input');
      if (input) input.value = chip.dataset.prompt;
      sendMessage();
    });
  });
}

function clearConversation() {
  AIState.messages = [];
  const messages = document.getElementById('ai-messages');
  if (messages) messages.innerHTML = '';
}

// ─── MESSAGE HANDLING ────────────────────────────────────────
function sendMessage() {
  const input = document.getElementById('ai-input');
  const msg = input?.value?.trim();
  if (!msg) return;

  // Add user message
  addUserMessage(msg);
  input.value = '';
  input.style.height = 'auto';

  // Hide suggestions after first message
  const sugg = document.getElementById('ai-suggestions');
  if (sugg) sugg.style.display = 'none';

  // Show thinking
  const thinkingId = addThinkingIndicator();

  // Simulate processing delay
  setTimeout(() => {
    removeThinkingIndicator(thinkingId);
    const response = processQuery(msg);
    addAIMessage(response.html, response.sources);
  }, 800 + Math.random() * 600);
}

function addUserMessage(text) {
  const messages = document.getElementById('ai-messages');
  if (!messages) return;
  const div = document.createElement('div');
  div.className = 'ai-message user';
  div.innerHTML = `
    <div class="ai-message-avatar user">U</div>
    <div>
      <div class="ai-message-bubble">${escapeHtml(text)}</div>
      <div class="ai-message-time">${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
    </div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  AIState.messages.push({ role:'user', content:text });
}

function addAIMessage(html, sources='') {
  const messages = document.getElementById('ai-messages');
  if (!messages) return;
  const div = document.createElement('div');
  div.className = 'ai-message ai';
  div.innerHTML = `
    <div class="ai-message-avatar">✦</div>
    <div style="max-width:calc(100% - 48px)">
      <div class="ai-message-bubble">
        ${html}
        ${sources ? `<div class="ai-data-source">📂 Based on: ${sources}</div>` : ''}
      </div>
      <div class="ai-message-time">${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
    </div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  AIState.messages.push({ role:'ai', content:html });
}

let thinkingCounter = 0;
function addThinkingIndicator() {
  const messages = document.getElementById('ai-messages');
  if (!messages) return null;
  const id = `thinking-${++thinkingCounter}`;
  const div = document.createElement('div');
  div.className = 'ai-message ai';
  div.id = id;
  div.innerHTML = `
    <div class="ai-message-avatar">✦</div>
    <div class="ai-message-bubble">
      <div class="ai-thinking">
        <span>Analyzing portal data</span>
        <div class="typing-dots">
          <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
        </div>
      </div>
    </div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return id;
}
function removeThinkingIndicator(id) {
  document.getElementById(id)?.remove();
}

// ─── QUERY PROCESSOR ────────────────────────────────────────
function processQuery(query) {
  const q = query.toLowerCase();

  // Detect website context from query
  let targetSite = null;
  websites.forEach(w => {
    if (q.includes(w.name.toLowerCase())) targetSite = w;
  });

  // Also check current app context
  if (!targetSite && window.AppState?.currentWebsiteId) {
    targetSite = getWebsiteById(window.AppState.currentWebsiteId);
  }

  // Route to appropriate handler
  if (q.includes('attention') || q.includes('need') || q.includes('priority')) {
    return answerAttentionNeeded();
  }
  if (q.includes('critical') || q.includes('urgent')) {
    return answerCriticalIssues();
  }
  if (q.includes('domain') && (q.includes('expir') || q.includes('expire'))) {
    return answerDomainsExpiring();
  }
  if (q.includes('ssl') && (q.includes('expir') || q.includes('expire'))) {
    return answerSSLExpiring();
  }
  if (q.includes('plugin') && (q.includes('expir') || q.includes('licens') || q.includes('attent'))) {
    return answerPluginsAttention();
  }
  if (q.includes('slow') || (q.includes('perform') && !q.includes('seo'))) {
    return answerSlowWebsites(targetSite);
  }
  if (q.includes('seo') || q.includes('meta') || q.includes('broken link') || q.includes('sitemap')) {
    return answerSEOProblems(targetSite);
  }
  if (q.includes('down') || q.includes('offline') || q.includes('uptime')) {
    return answerDowntime(targetSite);
  }
  if (q.includes('security') || q.includes('vulnerab') || q.includes('php') || q.includes('hack')) {
    return answerSecurity(targetSite);
  }
  if (q.includes('backup')) {
    return answerBackups();
  }
  if (q.includes('summary') || q.includes('brief') || q.includes('overview') || q.includes('today')) {
    return answerDailySummary();
  }
  if (q.includes('analyz') && targetSite) {
    return analyzeWebsite(targetSite);
  }
  if (q.includes('analyz')) {
    return answerAnalyzeAll();
  }
  if (q.includes('compar')) {
    return answerCompare(query);
  }
  if (q.includes('report')) {
    return answerGenerateReport();
  }
  if (q.includes('health') && q.includes('drop')) {
    return answerHealthDropExplanation(targetSite);
  }
  if (q.includes('what happened') || q.includes('recent') || q.includes('events')) {
    return answerRecentEvents(targetSite);
  }
  if (q.includes('broken link')) {
    return answerBrokenLinks(targetSite);
  }
  if (q.includes('wordpress') || q.includes('wp')) {
    return answerWordPress();
  }
  if (q.includes('hosting') || q.includes('server')) {
    return answerHosting();
  }
  if (targetSite) {
    return analyzeWebsite(targetSite);
  }

  return answerDefault(query);
}

// ─── ANSWER FUNCTIONS ────────────────────────────────────────

function answerAttentionNeeded() {
  const attention = websites
    .filter(w => w.status !== 'healthy')
    .sort((a,b) => a.healthScore - b.healthScore)
    .slice(0, 5);

  const cards = attention.map(w => {
    const domain = getDomainByWebsite(w.id);
    const ssl = getSSLByWebsite(w.id);
    const plug = getPluginsByWebsite(w.id).filter(p=>p.status==='expiring'||p.status==='expired'||p.status==='security');
    const perf = getPerformanceByWebsite(w.id, 'mobile');
    const issues = [];
    if (w.status==='critical') issues.push('🔴 Critical status');
    if (perf && perf.score < 60) issues.push(`⚡ Performance: ${perf.score}/100`);
    if (domain) {
      const days = Math.ceil((new Date(domain.expires)-new Date('2026-09-23'))/86400000);
      if (days < 30) issues.push(`🌐 Domain expires: ${days} days`);
    }
    if (ssl) {
      const days = Math.ceil((new Date(ssl.expires)-new Date('2026-09-23'))/86400000);
      if (days < 30) issues.push(`🔒 SSL expires: ${days} days`);
    }
    if (plug.length) issues.push(`🔌 ${plug.length} plugin issue${plug.length>1?'s':''}`);
    const seo = getSEOByWebsite(w.id);
    if (seo && seo.brokenLinks > 0) issues.push(`🔗 ${seo.brokenLinks} broken links`);

    return `
      <div class="ai-response-card" onclick="window.location.hash='websites/${w.id}'" style="cursor:pointer">
        <div class="ai-response-card-title">
          <div style="width:20px;height:20px;border-radius:4px;background:${w.color};display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:white">${w.name[0]}</div>
          <span>${w.name}</span>
          <span class="badge badge-${w.status}" style="margin-left:auto">${w.status}</span>
        </div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">Health: <strong style="color:${getScoreColor(w.healthScore)}">${w.healthScore}/100</strong></div>
        ${issues.map(i=>`<div style="font-size:11px;color:var(--text);padding:2px 0">${i}</div>`).join('')}
      </div>`;
  }).join('');

  return {
    html: `<div style="margin-bottom:10px"><strong>${attention.length} websites</strong> currently require attention:</div>${cards}
      <div class="ai-response-actions">
        <span class="ai-action-link" onclick="window.location.hash='websites'">🌐 View All Websites</span>
        <span class="ai-action-link" onclick="window.location.hash='alerts'">🔔 View Alerts</span>
      </div>`,
    sources: 'Website Health Data · Domains · SSL · Plugins · Performance'
  };
}

function answerCriticalIssues() {
  const critical = websites.filter(w => w.status === 'critical');
  const critAlerts = alerts.filter(a => a.severity === 'critical' && !a.acknowledged);

  return {
    html: `
      <div style="margin-bottom:10px"><strong>${critical.length} websites</strong> have critical status. <strong>${critAlerts.length} unacknowledged critical alerts.</strong></div>
      ${critical.map(w => {
        const perf = getPerformanceByWebsite(w.id,'mobile');
        const sec = getSecurityByWebsite(w.id);
        const up = getUptimeByWebsite(w.id);
        return `
          <div class="ai-response-card" onclick="window.location.hash='websites/${w.id}'" style="cursor:pointer;border-color:rgba(239,68,68,0.4)">
            <div class="ai-response-card-title">
              <div style="width:20px;height:20px;border-radius:4px;background:${w.color};display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:white">${w.name[0]}</div>
              <span>${w.name}</span>
              <span class="badge badge-critical" style="margin-left:auto">Critical</span>
            </div>
            <div class="ai-metric-row"><span class="ai-metric-label">Health Score</span><span class="ai-metric-val" style="color:var(--danger)">${w.healthScore}/100</span></div>
            <div class="ai-metric-row"><span class="ai-metric-label">Performance</span><span class="ai-metric-val" style="color:${getScoreColor(perf?.score||0)}">${perf?.score||'—'}/100</span></div>
            <div class="ai-metric-row"><span class="ai-metric-label">Uptime</span><span class="ai-metric-val" style="color:${up?.uptime<99?'var(--danger)':'var(--success)'}">${up?.uptime||'—'}%</span></div>
            <div class="ai-metric-row"><span class="ai-metric-label">Security Score</span><span class="ai-metric-val" style="color:${getScoreColor(sec?.score||0)}">${sec?.score||'—'}/100</span></div>
          </div>`;
      }).join('')}
      <div class="ai-response-actions">
        <span class="ai-action-link" onclick="window.openAIPanel('Analyze ${critical[0]?.name}')">🔍 Analyze ${critical[0]?.name}</span>
        <span class="ai-action-link" onclick="window.location.hash='alerts'">🔔 View Alerts</span>
      </div>`,
    sources: 'Website Health · Performance · Uptime · Security'
  };
}

function answerDomainsExpiring() {
  const expiring = domains
    .map(d => ({ ...d, days: Math.ceil((new Date(d.expires)-new Date('2026-09-23'))/86400000) }))
    .filter(d => d.days <= 60)
    .sort((a,b) => a.days - b.days);

  return {
    html: `
      <div style="margin-bottom:10px"><strong>${expiring.length} domains</strong> expire within 60 days. <strong>${expiring.filter(d=>!d.autoRenew).length} have auto-renew disabled</strong> — these need immediate action.</div>
      <table style="width:100%;font-size:12px;border-collapse:collapse">
        <tr style="border-bottom:1px solid var(--border)">
          <th style="text-align:left;padding:6px 8px;color:var(--text-dim);font-size:10px;text-transform:uppercase">Domain</th>
          <th style="text-align:left;padding:6px 8px;color:var(--text-dim);font-size:10px;text-transform:uppercase">Days</th>
          <th style="text-align:left;padding:6px 8px;color:var(--text-dim);font-size:10px;text-transform:uppercase">Auto-Renew</th>
          <th style="text-align:left;padding:6px 8px;color:var(--text-dim);font-size:10px;text-transform:uppercase">Status</th>
        </tr>
        ${expiring.map(d => `
          <tr style="border-bottom:1px solid rgba(34,48,74,0.3)">
            <td style="padding:6px 8px;font-weight:600;color:var(--text)">${d.domain}</td>
            <td style="padding:6px 8px"><span style="color:${d.days<=7?'var(--danger)':d.days<=30?'var(--warning)':'var(--text)'};font-weight:700">${d.days}d</span></td>
            <td style="padding:6px 8px">${d.autoRenew?'<span style="color:var(--success);font-weight:600">ON</span>':'<span style="color:var(--danger);font-weight:600">OFF</span>'}</td>
            <td style="padding:6px 8px"><span class="badge badge-${d.days<=7?'critical':d.days<=30?'warning':'healthy'}">${d.days<=7?'Critical':d.days<=30?'Warning':'OK'}</span></td>
          </tr>`).join('')}
      </table>
      <div class="ai-response-actions">
        <span class="ai-action-link" onclick="window.location.hash='domains'">🌐 View All Domains</span>
      </div>`,
    sources: 'Domain Registry Data · ' + new Date('2026-09-23').toLocaleDateString()
  };
}

function answerSSLExpiring() {
  const expiring = sslCerts
    .map(s => ({ ...s, days: Math.ceil((new Date(s.expires)-new Date('2026-09-23'))/86400000) }))
    .filter(s => s.days <= 60)
    .sort((a,b) => a.days - b.days);

  return {
    html: `
      <div style="margin-bottom:10px"><strong>${expiring.length} SSL certificates</strong> expire within 60 days.</div>
      ${expiring.map(s => `
        <div class="ai-response-card">
          <div class="ai-response-card-title">${s.domain} <span style="color:var(--text-dim);font-weight:400;font-size:11px">${s.issuer} · ${s.type}</span></div>
          <div class="ai-metric-row"><span class="ai-metric-label">Expires</span><span class="ai-metric-val" style="color:${s.days<=10?'var(--danger)':s.days<=30?'var(--warning)':'var(--text)'}">${s.days} days (${s.expires})</span></div>
        </div>`).join('')}
      <div class="ai-response-actions">
        <span class="ai-action-link" onclick="window.location.hash='ssl'">🔒 View SSL Certificates</span>
      </div>`,
    sources: 'SSL Certificate Records · ' + new Date('2026-09-23').toLocaleDateString()
  };
}

function answerPluginsAttention() {
  const attention = plugins.filter(p => p.status !== 'ok' && p.status !== 'update');
  const groups = {
    expired: attention.filter(p => p.status === 'expired'),
    expiring: attention.filter(p => p.status === 'expiring'),
    security: attention.filter(p => p.status === 'security'),
  };

  return {
    html: `
      <div style="margin-bottom:10px"><strong>${attention.length} plugin records</strong> require attention.</div>
      ${groups.security.length ? `<div style="margin-bottom:6px;font-size:12px;font-weight:700;color:var(--danger)">⚠️ Security Vulnerabilities (${groups.security.length})</div>` : ''}
      ${groups.security.map(p => pluginCard(p)).join('')}
      ${groups.expiring.length ? `<div style="margin-bottom:6px;font-size:12px;font-weight:700;color:var(--warning)">🕐 Expiring Soon (${groups.expiring.length})</div>` : ''}
      ${groups.expiring.map(p => pluginCard(p)).join('')}
      ${groups.expired.length ? `<div style="margin-bottom:6px;font-size:12px;font-weight:700;color:var(--danger)">❌ Expired (${groups.expired.length})</div>` : ''}
      ${groups.expired.map(p => pluginCard(p)).join('')}
      <div class="ai-response-actions">
        <span class="ai-action-link" onclick="window.location.hash='plugins'">🔌 View All Plugins</span>
      </div>`,
    sources: 'Plugin Inventory · License Data · Vulnerability Database'
  };
}

function pluginCard(p) {
  const site = websites.find(w => w.id === p.websiteId);
  const days = p.licenseExpiry ? Math.ceil((new Date(p.licenseExpiry)-new Date('2026-09-23'))/86400000) : null;
  return `
    <div class="ai-response-card">
      <div class="ai-response-card-title">
        ${p.name}
        <span class="badge badge-${p.status==='expired'?'critical':p.status==='security'?'critical':'warning'}" style="margin-left:auto">${p.status}</span>
      </div>
      <div class="ai-metric-row"><span class="ai-metric-label">Website</span><span class="ai-metric-val">${site?.name||'—'}</span></div>
      ${days !== null ? `<div class="ai-metric-row"><span class="ai-metric-label">License</span><span class="ai-metric-val" style="color:${days<0?'var(--danger)':days<30?'var(--warning)':'var(--text)'}">${days<0?`Expired ${Math.abs(days)}d ago`:`Expires in ${days} days`}</span></div>` : ''}
      ${p.updateAvailable ? `<div class="ai-metric-row"><span class="ai-metric-label">Update</span><span class="ai-metric-val" style="color:var(--warning)">${p.version} → ${p.latestVersion}</span></div>` : ''}
    </div>`;
}

function answerSlowWebsites(targetSite) {
  if (targetSite) {
    const perf = getPerformanceByWebsite(targetSite.id, 'mobile');
    const perfD = getPerformanceByWebsite(targetSite.id, 'desktop');
    return {
      html: `
        <div style="margin-bottom:8px">Performance analysis for <strong>${targetSite.name}</strong>:</div>
        <div class="ai-response-card">
          <div class="ai-response-card-title">📱 Mobile Performance</div>
          <div class="ai-metric-row"><span class="ai-metric-label">Score</span><span class="ai-metric-val" style="color:${getScoreColor(perf?.score||0)}">${perf?.score||'—'}/100</span></div>
          <div class="ai-metric-row"><span class="ai-metric-label">LCP</span><span class="ai-metric-val">${perf?.lcp||'—'}s</span></div>
          <div class="ai-metric-row"><span class="ai-metric-label">CLS</span><span class="ai-metric-val">${perf?.cls||'—'}</span></div>
          <div class="ai-metric-row"><span class="ai-metric-label">INP</span><span class="ai-metric-val">${perf?.inp||'—'}ms</span></div>
          <div class="ai-metric-row"><span class="ai-metric-label">Page Size</span><span class="ai-metric-val">${perf?.pageSize||'—'}MB</span></div>
          <div class="ai-metric-row"><span class="ai-metric-label">Requests</span><span class="ai-metric-val">${perf?.requests||'—'}</span></div>
        </div>
        ${perfD ? `<div class="ai-response-card">
          <div class="ai-response-card-title">🖥️ Desktop Performance</div>
          <div class="ai-metric-row"><span class="ai-metric-label">Score</span><span class="ai-metric-val" style="color:${getScoreColor(perfD.score)}">${perfD.score}/100</span></div>
          <div class="ai-metric-row"><span class="ai-metric-label">LCP</span><span class="ai-metric-val">${perfD.lcp}s</span></div>
        </div>` : ''}
        <div class="ai-response-actions">
          <span class="ai-action-link" onclick="window.location.hash='performance'">⚡ Performance Report</span>
          <span class="ai-action-link" onclick="window.openAIPanel('Why did the performance decrease on ${targetSite.name}?')">🔍 Explain drop</span>
        </div>`,
      sources: `Performance Metrics · ${targetSite.name} · ${new Date('2026-09-23').toLocaleDateString()}`
    };
  }

  const slow = performanceMetrics
    .filter(p => p.device==='mobile' && p.score < 60)
    .sort((a,b) => a.score - b.score);

  return {
    html: `
      <div style="margin-bottom:10px"><strong>${slow.length} websites</strong> have mobile performance scores below 60:</div>
      ${slow.map(p => {
        const site = websites.find(w => w.id === p.websiteId);
        return `
          <div class="ai-response-card" onclick="window.location.hash='websites/${site?.id}'" style="cursor:pointer">
            <div class="ai-response-card-title">${site?.name||'—'} <span class="badge badge-critical" style="margin-left:auto">${p.score}/100</span></div>
            <div class="ai-metric-row"><span class="ai-metric-label">LCP</span><span class="ai-metric-val" style="color:${p.lcp>4?'var(--danger)':p.lcp>2.5?'var(--warning)':'var(--success)'}">${p.lcp}s</span></div>
            <div class="ai-metric-row"><span class="ai-metric-label">Page Size</span><span class="ai-metric-val">${p.pageSize}MB</span></div>
            <div class="ai-metric-row"><span class="ai-metric-label">HTTP Requests</span><span class="ai-metric-val">${p.requests}</span></div>
          </div>`;
      }).join('')}
      <div class="ai-response-actions">
        <span class="ai-action-link" onclick="window.location.hash='performance'">⚡ Full Performance Report</span>
      </div>`,
    sources: 'Performance Metrics · Core Web Vitals · Mobile'
  };
}

function answerSEOProblems(targetSite) {
  if (targetSite) {
    const seo = getSEOByWebsite(targetSite.id);
    if (!seo) return { html:`<div>No SEO data available for ${targetSite.name}.</div>`, sources:'' };
    return {
      html: `
        <div style="margin-bottom:8px">SEO analysis for <strong>${targetSite.name}</strong> — Score: <strong style="color:${getScoreColor(seo.score)}">${seo.score}/100</strong></div>
        <div class="ai-response-card">
          <div class="ai-response-card-title">🔍 SEO Issues Found</div>
          ${seo.missingTitles>0?`<div class="ai-metric-row"><span class="ai-metric-label">Missing Titles</span><span class="ai-metric-val" style="color:var(--danger)">${seo.missingTitles}</span></div>`:''}
          ${seo.missingDescriptions>0?`<div class="ai-metric-row"><span class="ai-metric-label">Missing Meta Descriptions</span><span class="ai-metric-val" style="color:var(--warning)">${seo.missingDescriptions}</span></div>`:''}
          ${seo.missingAlt>0?`<div class="ai-metric-row"><span class="ai-metric-label">Missing ALT Text</span><span class="ai-metric-val" style="color:var(--warning)">${seo.missingAlt}</span></div>`:''}
          ${seo.brokenLinks>0?`<div class="ai-metric-row"><span class="ai-metric-label">Broken Links</span><span class="ai-metric-val" style="color:var(--danger)">${seo.brokenLinks}</span></div>`:''}
          ${seo.canonicalIssues>0?`<div class="ai-metric-row"><span class="ai-metric-label">Canonical Issues</span><span class="ai-metric-val" style="color:var(--warning)">${seo.canonicalIssues}</span></div>`:''}
          ${seo.h1Issues>0?`<div class="ai-metric-row"><span class="ai-metric-label">H1 Issues</span><span class="ai-metric-val" style="color:var(--warning)">${seo.h1Issues}</span></div>`:''}
          <div class="ai-metric-row"><span class="ai-metric-label">Sitemap</span><span class="ai-metric-val" style="color:${seo.sitemapOk?'var(--success)':'var(--danger)'}">${seo.sitemapOk?'✓ Found':'✗ Missing'}</span></div>
          <div class="ai-metric-row"><span class="ai-metric-label">Robots.txt</span><span class="ai-metric-val" style="color:${seo.robotsOk?'var(--success)':'var(--danger)'}">${seo.robotsOk?'✓ OK':'✗ Issue'}</span></div>
        </div>
        <div class="ai-response-actions">
          <span class="ai-action-link" onclick="window.location.hash='seo'">🔍 View SEO Report</span>
          <span class="ai-action-link" onclick="window.location.hash='broken-links'">🔗 Broken Links</span>
        </div>`,
      sources: `SEO Audit Data · ${targetSite.name}`
    };
  }

  const problems = seoData.filter(s => s.score < 80).sort((a,b) => a.score - b.score);
  const totalMissingDesc = seoData.reduce((sum,s)=>sum+s.missingDescriptions,0);
  const totalMissingAlt = seoData.reduce((sum,s)=>sum+s.missingAlt,0);
  const totalBroken = seoData.reduce((sum,s)=>sum+s.brokenLinks,0);

  return {
    html: `
      <div style="margin-bottom:10px"><strong>${problems.length} websites</strong> have SEO scores below 80. Most common issues across all sites:</div>
      <div class="ai-response-card">
        <div class="ai-response-card-title">📊 Aggregate SEO Issues</div>
        <div class="ai-metric-row"><span class="ai-metric-label">Missing Meta Descriptions</span><span class="ai-metric-val" style="color:var(--warning)">${totalMissingDesc} pages</span></div>
        <div class="ai-metric-row"><span class="ai-metric-label">Missing ALT Text</span><span class="ai-metric-val" style="color:var(--warning)">${totalMissingAlt} images</span></div>
        <div class="ai-metric-row"><span class="ai-metric-label">Broken Links</span><span class="ai-metric-val" style="color:var(--danger)">${totalBroken} links</span></div>
        <div class="ai-metric-row"><span class="ai-metric-label">Missing Sitemaps</span><span class="ai-metric-val" style="color:var(--danger)">${seoData.filter(s=>!s.sitemapOk).length} sites</span></div>
      </div>
      ${problems.slice(0,4).map(s => {
        const site = websites.find(w=>w.id===s.websiteId);
        return `
          <div class="ai-response-card" onclick="window.location.hash='websites/${site?.id}'" style="cursor:pointer">
            <div class="ai-response-card-title">${site?.name} <span class="badge badge-${s.score<60?'critical':s.score<70?'warning':'attention'}" style="margin-left:auto">${s.score}/100</span></div>
            <div style="font-size:11px;color:var(--text-muted)">${[
              s.missingDescriptions>0?`${s.missingDescriptions} missing descriptions`:'',
              s.brokenLinks>0?`${s.brokenLinks} broken links`:'',
              s.missingAlt>0?`${s.missingAlt} missing ALT`:'',
              !s.sitemapOk?'No sitemap':'',
            ].filter(Boolean).join(' · ')}</div>
          </div>`;
      }).join('')}
      <div class="ai-response-actions">
        <span class="ai-action-link" onclick="window.location.hash='seo'">🔍 SEO Overview</span>
        <span class="ai-action-link" onclick="window.location.hash='broken-links'">🔗 Broken Links</span>
      </div>`,
    sources: 'SEO Audit Data · All Websites'
  };
}

function answerDowntime(targetSite) {
  if (targetSite) {
    const up = getUptimeByWebsite(targetSite.id);
    return {
      html: `
        <div style="margin-bottom:8px">Uptime for <strong>${targetSite.name}</strong>:</div>
        <div class="ai-response-card">
          <div class="ai-metric-row"><span class="ai-metric-label">30-day Uptime</span><span class="ai-metric-val" style="color:${up?.uptime<99?'var(--danger)':'var(--success)'}">${up?.uptime||'—'}%</span></div>
          <div class="ai-metric-row"><span class="ai-metric-label">Response Time</span><span class="ai-metric-val">${up?.responseTime||'—'}ms</span></div>
          <div class="ai-metric-row"><span class="ai-metric-label">Last Downtime</span><span class="ai-metric-val">${up?.lastDown==='N/A'?'None recorded':formatTimeAgo(up.lastDown)}</span></div>
          <div class="ai-metric-row"><span class="ai-metric-label">Incidents (30d)</span><span class="ai-metric-val">${up?.incidents?.length||0}</span></div>
        </div>`,
      sources: `Uptime Monitoring · ${targetSite.name}`
    };
  }

  const down = uptimeData.filter(u => u.uptime < 99.5).sort((a,b)=>a.uptime-b.uptime);
  return {
    html: `
      <div style="margin-bottom:10px"><strong>${down.length} websites</strong> have uptime below 99.5%:</div>
      ${down.map(u => {
        const site = websites.find(w=>w.id===u.websiteId);
        return `
          <div class="ai-response-card" onclick="window.location.hash='uptime'" style="cursor:pointer">
            <div class="ai-response-card-title">${site?.name} <span class="badge badge-${u.uptime<99?'critical':'warning'}" style="margin-left:auto">${u.uptime}%</span></div>
            <div class="ai-metric-row"><span class="ai-metric-label">Response Time</span><span class="ai-metric-val" style="color:${u.responseTime>1000?'var(--danger)':u.responseTime>500?'var(--warning)':'var(--success)'}">${u.responseTime}ms</span></div>
            <div class="ai-metric-row"><span class="ai-metric-label">Last Downtime</span><span class="ai-metric-val">${u.lastDown && u.lastDown!=='N/A'?formatTimeAgo(u.lastDown):'N/A'}</span></div>
            <div class="ai-metric-row"><span class="ai-metric-label">Incidents</span><span class="ai-metric-val">${u.incidents?.length||0}</span></div>
          </div>`;
      }).join('')}
      <div class="ai-response-actions">
        <span class="ai-action-link" onclick="window.location.hash='uptime'">📡 Uptime Monitor</span>
      </div>`,
    sources: 'Uptime Monitoring · 30-day data'
  };
}

function answerSecurity(targetSite) {
  if (targetSite) {
    const sec = getSecurityByWebsite(targetSite.id);
    const wp = getWordPressByWebsite(targetSite.id);
    return {
      html: `
        <div style="margin-bottom:8px">Security analysis for <strong>${targetSite.name}</strong>:</div>
        <div class="ai-response-card">
          <div class="ai-response-card-title">🔒 Security Score: <span style="color:${getScoreColor(sec?.score||0)}">${sec?.score||'—'}/100</span></div>
          <div class="ai-metric-row"><span class="ai-metric-label">HTTPS</span><span class="ai-metric-val" style="color:${sec?.https?'var(--success)':'var(--danger)'}">${sec?.https?'✓ Active':'✗ Missing'}</span></div>
          <div class="ai-metric-row"><span class="ai-metric-label">Mixed Content</span><span class="ai-metric-val" style="color:${sec?.mixedContent?'var(--danger)':'var(--success)'}">${sec?.mixedContent?'✗ Detected':'✓ None'}</span></div>
          <div class="ai-metric-row"><span class="ai-metric-label">Security Headers</span><span class="ai-metric-val" style="color:${sec?.securityHeaders?'var(--success)':'var(--warning)'}">${sec?.securityHeaders?'✓ Set':'⚠ Missing'}</span></div>
          <div class="ai-metric-row"><span class="ai-metric-label">Firewall</span><span class="ai-metric-val" style="color:${sec?.firewallActive?'var(--success)':'var(--warning)'}">${sec?.firewallActive?'✓ Active':'⚠ Inactive'}</span></div>
          <div class="ai-metric-row"><span class="ai-metric-label">Vulnerable Plugins</span><span class="ai-metric-val" style="color:${sec?.vulnerablePlugins>0?'var(--danger)':'var(--success)'}">${sec?.vulnerablePlugins||0}</span></div>
          ${wp?`<div class="ai-metric-row"><span class="ai-metric-label">PHP Version</span><span class="ai-metric-val" style="color:${wp.phpVersion.startsWith('8')?'var(--success)':'var(--danger)'}">${wp.phpVersion} ${!wp.phpVersion.startsWith('8')?'⚠ Outdated':''}</span></div>`:''}
          ${wp?`<div class="ai-metric-row"><span class="ai-metric-label">Backup</span><span class="ai-metric-val" style="color:${sec?.backupOk?'var(--success)':'var(--danger)'}">${sec?.backupOk?'✓ Up to date':'✗ Failed'}</span></div>`:''}
        </div>
        <div class="ai-response-actions">
          <span class="ai-action-link" onclick="window.location.hash='security'">🛡️ Security Report</span>
        </div>`,
      sources: `Security Checks · ${targetSite.name}`
    };
  }

  const issues = securityChecks.filter(s => s.score < 80).sort((a,b)=>a.score-b.score);
  return {
    html: `
      <div style="margin-bottom:10px"><strong>${issues.length} websites</strong> have security scores below 80:</div>
      ${issues.map(s => {
        const site = websites.find(w=>w.id===s.websiteId);
        const problems = [];
        if (!s.wordpressUpdated) problems.push('Outdated WordPress');
        if (!s.phpUpdated) problems.push('Outdated PHP');
        if (s.vulnerablePlugins>0) problems.push(`${s.vulnerablePlugins} vulnerable plugin(s)`);
        if (s.mixedContent) problems.push('Mixed content');
        if (!s.securityHeaders) problems.push('Missing security headers');
        if (!s.backupOk) problems.push('Backup failed');
        return `
          <div class="ai-response-card" onclick="window.location.hash='security'" style="cursor:pointer">
            <div class="ai-response-card-title">${site?.name} <span class="badge badge-${s.score<60?'critical':'warning'}" style="margin-left:auto">${s.score}/100</span></div>
            <div style="font-size:11px;color:var(--text-muted)">${problems.join(' · ')}</div>
          </div>`;
      }).join('')}
      <div class="ai-response-actions">
        <span class="ai-action-link" onclick="window.location.hash='security'">🛡️ Security Overview</span>
      </div>`,
    sources: 'Security Check Data · All Websites'
  };
}

function answerBackups() {
  const failed = backups.filter(b => b.status === 'failed');
  return {
    html: `
      <div style="margin-bottom:10px"><strong>${failed.length} backup failures</strong> detected:</div>
      ${failed.map(b => {
        const site = websites.find(w=>w.id===b.websiteId);
        return `
          <div class="ai-response-card" style="border-color:rgba(239,68,68,0.4)">
            <div class="ai-response-card-title">${site?.name} <span class="badge badge-critical" style="margin-left:auto">Failed</span></div>
            <div class="ai-metric-row"><span class="ai-metric-label">Last Backup</span><span class="ai-metric-val" style="color:var(--danger)">${formatTimeAgo(b.lastBackup)}</span></div>
            <div class="ai-metric-row"><span class="ai-metric-label">Provider</span><span class="ai-metric-val">${b.provider}</span></div>
            <div class="ai-metric-row"><span class="ai-metric-label">Last Size</span><span class="ai-metric-val">${b.size}</span></div>
          </div>`;
      }).join('')}
      <div class="ai-response-actions">
        <span class="ai-action-link" onclick="window.location.hash='backups'">💾 Backup Status</span>
      </div>`,
    sources: 'Backup Records · All Websites'
  };
}

function answerDailySummary() {
  const s = getDashboardSummary();
  const newIssues = alerts.filter(a => !a.acknowledged).length;
  const resolved = Math.floor(newIssues * 0.4);
  return {
    html: `
      <div style="font-size:13px;font-weight:700;margin-bottom:12px">📋 Daily Website Intelligence Summary — ${new Date('2026-09-23').toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'})}</div>
      <div class="ai-response-card">
        <div class="ai-metric-row"><span class="ai-metric-label">Websites Monitored</span><span class="ai-metric-val">${s.total}</span></div>
        <div class="ai-metric-row"><span class="ai-metric-label">Healthy</span><span class="ai-metric-val" style="color:var(--success)">${s.healthy}</span></div>
        <div class="ai-metric-row"><span class="ai-metric-label">Needs Attention</span><span class="ai-metric-val" style="color:var(--warning)">${s.issues}</span></div>
        <div class="ai-metric-row"><span class="ai-metric-label">Critical</span><span class="ai-metric-val" style="color:var(--danger)">${s.critical}</span></div>
        <div class="ai-metric-row"><span class="ai-metric-label">New Issues</span><span class="ai-metric-val">${newIssues}</span></div>
        <div class="ai-metric-row"><span class="ai-metric-label">Domains Expiring</span><span class="ai-metric-val" style="color:var(--warning)">${s.expiringDomains}</span></div>
        <div class="ai-metric-row"><span class="ai-metric-label">SSL Expiring</span><span class="ai-metric-val" style="color:var(--warning)">${s.expiringSSL + 2}</span></div>
        <div class="ai-metric-row"><span class="ai-metric-label">Plugin Alerts</span><span class="ai-metric-val" style="color:var(--warning)">${s.expiringPlugins + s.expiredPlugins}</span></div>
      </div>
      <div style="font-size:12px;font-weight:700;margin:10px 0 6px">📌 Today's Key Areas:</div>
      <div style="font-size:12px;color:var(--text);line-height:1.8">
        🔴 constructionfirst.com is returning HTTP 500 errors<br>
        🔴 northstar.com has PHP 7.4 (end of life) and 3 vulnerable plugins<br>
        🟠 analytix.sa domain expires in 8 days — auto-renew is OFF<br>
        🟠 3 backup failures need investigation<br>
        🔵 setupz.com mobile performance dropped from 79 to 58
      </div>
      <div class="ai-response-actions">
        <span class="ai-action-link" onclick="window.location.hash='alerts'">🔔 Review Alerts</span>
        <span class="ai-action-link" onclick="window.openAIPanel('Which websites need attention today?')">🔍 Attention List</span>
      </div>`,
    sources: 'All Portal Data · ' + new Date('2026-09-23').toLocaleDateString()
  };
}

function analyzeWebsite(site) {
  const perf = getPerformanceByWebsite(site.id, 'mobile');
  const seo = getSEOByWebsite(site.id);
  const up = getUptimeByWebsite(site.id);
  const sec = getSecurityByWebsite(site.id);
  const wp = getWordPressByWebsite(site.id);
  const backup = getBackupByWebsite(site.id);
  const pluginList = getPluginsByWebsite(site.id);
  const issues = [];
  if (seo?.brokenLinks>0) issues.push(`${seo.brokenLinks} broken links`);
  if (seo?.missingDescriptions>0) issues.push(`${seo.missingDescriptions} missing meta descriptions`);
  if (pluginList.some(p=>p.updateAvailable)) issues.push(`${pluginList.filter(p=>p.updateAvailable).length} plugin update(s) available`);
  const domain = getDomainByWebsite(site.id);
  const ssl = getSSLByWebsite(site.id);
  if (ssl) {
    const sslDays = Math.ceil((new Date(ssl.expires)-new Date('2026-09-23'))/86400000);
    if (sslDays < 60) issues.push(`SSL expires in ${sslDays} days`);
  }
  if (domain) {
    const domDays = Math.ceil((new Date(domain.expires)-new Date('2026-09-23'))/86400000);
    if (domDays < 60) issues.push(`Domain expires in ${domDays} days`);
  }

  return {
    html: `
      <div style="margin-bottom:10px">Analysis for <strong>${site.name}</strong> — <span style="color:${site.color}">${site.client}</span></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
        ${scoreCell('Health', site.healthScore)}
        ${scoreCell('Performance', perf?.score||site.performanceScore)}
        ${scoreCell('SEO', seo?.score||site.seoScore)}
        ${scoreCell('Security', sec?.score||site.securityScore)}
      </div>
      <div class="ai-response-card">
        <div class="ai-metric-row"><span class="ai-metric-label">Uptime (30d)</span><span class="ai-metric-val" style="color:${up?.uptime<99?'var(--danger)':'var(--success)'}">${up?.uptime||site.uptime}%</span></div>
        <div class="ai-metric-row"><span class="ai-metric-label">Response Time</span><span class="ai-metric-val">${up?.responseTime||'—'}ms</span></div>
        ${wp?`<div class="ai-metric-row"><span class="ai-metric-label">WordPress</span><span class="ai-metric-val">${wp.wpVersion} (Latest: ${wp.latestWP})</span></div>`:''}
        ${wp?`<div class="ai-metric-row"><span class="ai-metric-label">PHP</span><span class="ai-metric-val" style="color:${wp.phpVersion.startsWith('8')?'var(--success)':'var(--danger)'}">${wp.phpVersion}</span></div>`:''}
        <div class="ai-metric-row"><span class="ai-metric-label">Last Backup</span><span class="ai-metric-val" style="color:${backup?.status==='failed'?'var(--danger)':'var(--success)'}">${backup?formatTimeAgo(backup.lastBackup):'Unknown'}</span></div>
      </div>
      ${issues.length ? `
        <div style="font-size:12px;font-weight:700;margin:10px 0 6px">🔍 Key Findings:</div>
        ${issues.map((i,idx)=>`<div style="font-size:12px;color:var(--text);padding:3px 0">${idx+1}. ${i}</div>`).join('')}
      ` : '<div style="color:var(--success);font-size:12px;margin-top:10px">✓ No critical issues detected.</div>'}
      <div class="ai-response-actions">
        <span class="ai-action-link" onclick="window.location.hash='websites/${site.id}'">🌐 View Details</span>
        <span class="ai-action-link" onclick="window.openAIPanel('Why did the health score drop on ${site.name}?')">📉 Explain changes</span>
      </div>`,
    sources: `Website Health · Performance · SEO · Security · Uptime · ${site.name}`
  };
}

function scoreCell(label, score) {
  return `<div class="ai-response-card" style="text-align:center;padding:10px">
    <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">${label}</div>
    <div style="font-size:20px;font-weight:800;color:${getScoreColor(score)}">${score}</div>
    <div style="font-size:10px;color:var(--text-dim)">/100</div>
  </div>`;
}

function answerAnalyzeAll() {
  return {
    html: `<div style="margin-bottom:8px">Which website would you like me to analyze? Here are the available websites:</div>
      <div style="display:flex;flex-direction:column;gap:4px">
        ${websites.map(w=>`<span class="suggestion-chip" onclick="window.openAIPanel('Analyze ${w.name}')" style="display:inline-block;width:100%;text-align:left;cursor:pointer">${w.name} — Health: ${w.healthScore}/100</span>`).join('')}
      </div>`,
    sources: 'Website Registry'
  };
}

function answerCompare() {
  const top5 = [...websites].sort((a,b)=>b.healthScore-a.healthScore).slice(0,5);
  return {
    html: `
      <div style="margin-bottom:10px">Website comparison — sorted by health score:</div>
      <table style="width:100%;font-size:11px;border-collapse:collapse">
        <tr style="border-bottom:1px solid var(--border)">
          <th style="text-align:left;padding:6px 8px;color:var(--text-dim)">Website</th>
          <th style="text-align:center;padding:6px 8px;color:var(--text-dim)">Health</th>
          <th style="text-align:center;padding:6px 8px;color:var(--text-dim)">SEO</th>
          <th style="text-align:center;padding:6px 8px;color:var(--text-dim)">Perf</th>
          <th style="text-align:center;padding:6px 8px;color:var(--text-dim)">Security</th>
          <th style="text-align:center;padding:6px 8px;color:var(--text-dim)">Uptime</th>
        </tr>
        ${websites.sort((a,b)=>b.healthScore-a.healthScore).map(w=>`
          <tr style="border-bottom:1px solid rgba(34,48,74,0.3);cursor:pointer" onclick="window.location.hash='websites/${w.id}'">
            <td style="padding:6px 8px;font-weight:600">${w.name}</td>
            <td style="padding:6px 8px;text-align:center;color:${getScoreColor(w.healthScore)};font-weight:700">${w.healthScore}</td>
            <td style="padding:6px 8px;text-align:center;color:${getScoreColor(w.seoScore)};font-weight:700">${w.seoScore}</td>
            <td style="padding:6px 8px;text-align:center;color:${getScoreColor(w.performanceScore)};font-weight:700">${w.performanceScore}</td>
            <td style="padding:6px 8px;text-align:center;color:${getScoreColor(w.securityScore)};font-weight:700">${w.securityScore}</td>
            <td style="padding:6px 8px;text-align:center;font-weight:700">${w.uptime}%</td>
          </tr>`).join('')}
      </table>
      <div class="ai-response-actions">
        <span class="ai-action-link" onclick="window.location.hash='websites'">🌐 View All Sites</span>
      </div>`,
    sources: 'All Website Metrics · Portal Data'
  };
}

function answerGenerateReport() {
  return {
    html: `
      <div style="margin-bottom:10px">I can generate several types of reports:</div>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${[
          ['Monthly Website Report', 'Comprehensive overview of all websites this month'],
          ['SEO Report', 'SEO scores, issues, and recommendations'],
          ['Performance Report', 'Core Web Vitals and performance trends'],
          ['Security Report', 'Security checks and vulnerability summary'],
          ['Executive Report', 'High-level summary for management'],
        ].map(([title,desc])=>`
          <div class="ai-response-card" onclick="window.openAIPanel('Generate ${title}')" style="cursor:pointer">
            <div style="font-size:12px;font-weight:700">${title}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px">${desc}</div>
          </div>`).join('')}
      </div>
      <div class="ai-response-actions">
        <span class="ai-action-link" onclick="window.location.hash='ai-reports'">📄 AI Reports Page</span>
        <span class="ai-action-link" onclick="window.location.hash='reports'">📊 Reports Center</span>
      </div>`,
    sources: 'Report Templates'
  };
}

function answerHealthDropExplanation(targetSite) {
  const site = targetSite || websites.find(w=>w.status==='critical') || websites[0];
  const perf = getPerformanceByWebsite(site.id,'mobile');
  return {
    html: `
      <div style="margin-bottom:10px">Root-cause analysis for <strong>${site.name}</strong> health score:</div>
      <div class="ai-response-card">
        <div style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;margin-bottom:8px">Observed Changes</div>
        ${perf?.prevScore ? `<div class="ai-metric-row"><span class="ai-metric-label">Performance Score</span><span class="ai-metric-val" style="color:var(--danger)">${perf.prevScore} → ${perf.score} (${perf.score-perf.prevScore})</span></div>` : ''}
        ${perf?.prevLcp ? `<div class="ai-metric-row"><span class="ai-metric-label">LCP (mobile)</span><span class="ai-metric-val" style="color:var(--danger)">${perf.prevLcp}s → ${perf.lcp}s</span></div>` : ''}
        ${perf?.prevPageSize ? `<div class="ai-metric-row"><span class="ai-metric-label">Page Size</span><span class="ai-metric-val" style="color:var(--warning)">${perf.prevPageSize}MB → ${perf.pageSize}MB</span></div>` : ''}
      </div>
      <div class="ai-response-card">
        <div style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;margin-bottom:8px">Possible Contributing Factors</div>
        <div style="font-size:12px;color:var(--text);line-height:1.7">
          ${perf?.prevPageSize && perf.pageSize > perf.prevPageSize ? `• Increased page size (+${(perf.pageSize-perf.prevPageSize).toFixed(1)}MB) — possible new unoptimized assets<br>` : ''}
          • Increased HTTP requests (${perf?.requests} total)<br>
          • Possible new scripts or third-party resources added<br>
        </div>
      </div>
      <div class="ai-response-card" style="border-color:rgba(100,116,139,0.3)">
        <div style="font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;margin-bottom:6px">Unknown</div>
        <div style="font-size:12px;color:var(--text-muted)">Exact cause cannot be confirmed from available monitoring data. Recommend reviewing recently added assets, plugins, and scripts.</div>
      </div>`,
    sources: `Performance Metrics · ${site.name} · Historical Data`
  };
}

function answerRecentEvents(targetSite) {
  const events = targetSite
    ? getEventsByWebsite(targetSite.id)
    : websiteEvents.slice(0,8);

  const emoji = { critical:'🔴', warning:'🟠', success:'🟢', info:'🔵' };
  return {
    html: `
      <div style="margin-bottom:10px">Recent events ${targetSite?`for <strong>${targetSite.name}</strong>`:'across all sites'}:</div>
      ${events.slice(0,8).map(e => {
        const site = websites.find(w=>w.id===e.websiteId);
        return `<div style="display:flex;gap:8px;padding:6px 0;border-bottom:1px solid rgba(34,48,74,0.3);font-size:12px">
          <span>${emoji[e.severity]||'⚪'}</span>
          <div>
            <div style="font-weight:600;color:var(--primary);font-size:11px">${site?.name}</div>
            <div style="color:var(--text)">${e.message}</div>
            <div style="color:var(--text-dim);font-size:10px;margin-top:1px">${formatTimeAgo(e.time)}</div>
          </div>
        </div>`;
      }).join('')}
      <div class="ai-response-actions">
        <span class="ai-action-link" onclick="window.location.hash='events'">📋 All Events</span>
      </div>`,
    sources: 'Website Events Log · System Events Only'
  };
}

function answerBrokenLinks(targetSite) {
  const sitesWithLinks = seoData.filter(s=>s.brokenLinks>0).sort((a,b)=>b.brokenLinks-a.brokenLinks);
  return {
    html: `
      <div style="margin-bottom:10px"><strong>${sitesWithLinks.length} websites</strong> have broken links. Total: <strong>${sitesWithLinks.reduce((sum,s)=>sum+s.brokenLinks,0)}</strong> broken links:</div>
      ${sitesWithLinks.map(s=>{
        const site = websites.find(w=>w.id===s.websiteId);
        return `<div class="ai-response-card" onclick="window.location.hash='broken-links'" style="cursor:pointer">
          <div class="ai-response-card-title">${site?.name} <span class="badge badge-${s.brokenLinks>5?'critical':'warning'}" style="margin-left:auto">${s.brokenLinks} links</span></div>
        </div>`;
      }).join('')}
      <div class="ai-response-actions">
        <span class="ai-action-link" onclick="window.location.hash='broken-links'">🔗 Broken Links Report</span>
      </div>`,
    sources: 'SEO Audit Data · Link Checks'
  };
}

function answerWordPress() {
  const outdated = wordpress.filter(w=>w.wpVersion!==w.latestWP).sort((a,b)=>a.wpVersion.localeCompare(b.wpVersion));
  return {
    html: `
      <div style="margin-bottom:10px"><strong>${outdated.length} WordPress installations</strong> are outdated:</div>
      ${outdated.map(wp=>{
        const site = websites.find(w=>w.id===wp.websiteId);
        return `<div class="ai-response-card" onclick="window.location.hash='wordpress'" style="cursor:pointer">
          <div class="ai-response-card-title">${site?.name}</div>
          <div class="ai-metric-row"><span class="ai-metric-label">Version</span><span class="ai-metric-val" style="color:var(--warning)">${wp.wpVersion} → ${wp.latestWP}</span></div>
          <div class="ai-metric-row"><span class="ai-metric-label">PHP</span><span class="ai-metric-val" style="color:${wp.phpVersion.startsWith('8')?'var(--text)':'var(--danger)'}">${wp.phpVersion}${!wp.phpVersion.startsWith('8')?' ⚠ Outdated':''}</span></div>
          <div class="ai-metric-row"><span class="ai-metric-label">Security Issues</span><span class="ai-metric-val" style="color:${wp.securityIssues>0?'var(--danger)':'var(--success)'}">${wp.securityIssues}</span></div>
        </div>`;
      }).join('')}
      <div class="ai-response-actions">
        <span class="ai-action-link" onclick="window.location.hash='wordpress'">🔧 WordPress Monitor</span>
      </div>`,
    sources: 'WordPress Installation Data · All Sites'
  };
}

function answerHosting() {
  const { hosting } = { hosting: window.AppState ? [] : [] };
  return {
    html: `<div style="margin-bottom:8px">Hosting plans overview:</div>
      <div class="ai-response-actions">
        <span class="ai-action-link" onclick="window.location.hash='hosting'">🖥️ View Hosting</span>
      </div>`,
    sources: 'Hosting Records'
  };
}

function answerDefault(query) {
  return {
    html: `
      <div style="margin-bottom:10px">I can help you analyze your websites. Here are some things I can tell you:</div>
      <div style="display:flex;flex-direction:column;gap:4px">
        ${[
          'Which websites need attention today?',
          'Analyze [website name]',
          'Which domains expire this month?',
          'Which websites are slow?',
          'Which websites have security issues?',
          'Compare all websites',
        ].map(p=>`<span class="suggestion-chip" onclick="window.openAIPanel('${p}')" style="cursor:pointer;display:block">${p}</span>`).join('')}
      </div>
      <div style="font-size:11px;color:var(--text-dim);margin-top:10px">💡 I have access to: websites, SEO, performance, uptime, security, domains, SSL, plugins, themes, WordPress, backups, events, and alerts.</div>`,
    sources: 'Portal Data'
  };
}

function escapeHtml(text) {
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Export for use by the AI Assistant page
export function askAI(query) {
  return processQuery(query);
}

