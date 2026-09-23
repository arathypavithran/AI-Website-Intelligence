// ════════════════════════════════════════════════════════════════
//  DASHBOARD PAGE
// ════════════════════════════════════════════════════════════════
import {
  websites, domains, sslCerts, plugins, websiteEvents, alerts,
  healthTrend, analyticsData, getDashboardSummary, formatTimeAgo,
  getScoreColor, getScoreClass, getDaysColor
} from '../data.js';
import { analyzeWebsiteByUrl } from '../analyzer-ui.js';

export function renderDashboard(container) {
  const s = getDashboardSummary();

  container.innerHTML = `
    <!-- PAGE HEADER -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-heading">Dashboard</h1>
        <p class="page-desc">Website Intelligence Overview — ${new Date('2026-09-23').toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})}</p>
      </div>
      <div class="page-header-right">
        <select class="filter-select" id="dash-website-filter">
          <option value="">All Websites (${websites.length})</option>
          ${websites.map(w=>`<option value="${w.id}">${w.name}</option>`).join('')}
        </select>
        <button class="btn btn-secondary btn-sm" onclick="window.location.hash='events'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Events Log
        </button>
        <button class="btn btn-primary btn-sm" onclick="window.openAIPanel('Which websites need attention today?')">
          <span>✦</span> Ask AI
        </button>
      </div>
    </div>

    <!-- HERO AUTOMATED WEBSITE URL ANALYZER -->
    <div class="card" style="background: linear-gradient(135deg, rgba(37,99,235,0.18), rgba(139,92,246,0.18)); border: 1px solid rgba(59,130,246,0.4); padding: 22px 24px; margin-bottom: 24px; border-radius: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 12px;">
        <div>
          <h2 style="font-size: 19px; font-weight: 700; color: #ffffff; margin: 0 0 4px 0; display: flex; align-items: center; gap: 8px;">
            <span style="color: #3B82F6;">⚡</span> Analyze Any Website Automatically
          </h2>
          <p style="font-size: 13px; color: rgba(255,255,255,0.7); margin: 0;">
            Enter any website URL. The portal crawls & extracts all SEO, Security, Performance, Tech Stack & Issues automatically.
          </p>
        </div>
        <div style="display: flex; gap: 10px;">
          <label class="btn btn-secondary btn-sm" style="cursor: pointer; background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); color: #fff;">
            📁 Upload ZIP / Folder
            <input type="file" id="hero-zip-upload" style="display: none;" accept=".zip,.html" />
          </label>
        </div>
      </div>
      <div style="display: flex; gap: 10px;">
        <input type="text" id="dash-hero-url" placeholder="Enter Website URL (e.g. https://example.com or http://localhost/my-site)" style="flex: 1; padding: 12px 16px; font-size: 14px; background: rgba(15,23,42,0.9); border: 1px solid rgba(59,130,246,0.4); border-radius: 8px; color: #ffffff; outline: none;" />
        <button id="dash-hero-analyze-btn" class="btn btn-primary" style="padding: 0 24px; font-weight: 600; white-space: nowrap;">
          <span>⚡</span> Analyze Website
        </button>
      </div>
    </div>

    <!-- KPI ROW 1 -->
    <div class="kpi-grid dashboard-row">
      ${kpiCard('Total Websites', s.total, null, iconGlobe(), 'var(--primary)', 'Monitored platforms', '#websites')}
      ${kpiCard('Healthy', s.healthy, '+2 this week', iconCheckCircle(), 'var(--success)', 'No active issues', '#websites')}
      ${kpiCard('Needs Attention', s.issues, null, iconAlertTriangle(), 'var(--warning)', 'Warning or attention', '#websites')}
      ${kpiCard('Critical', s.critical, null, iconXCircle(), 'var(--danger)', 'Immediate action needed', '#websites')}
      ${kpiCard('Avg Health Score', s.avgHealth + '/100', null, iconHeart(), getScoreColor(s.avgHealth), 'All sites', '#websites')}
      ${kpiCard('Avg SEO Score', s.avgSEO + '/100', null, iconSearch(), '#A855F7', 'All sites', '#seo')}
    </div>

    <!-- KPI ROW 2 -->
    <div class="kpi-grid dashboard-row">
      ${kpiCard('Avg Performance', s.avgPerf + '/100', null, iconZap(), getScoreColor(s.avgPerf), 'Mobile average', '#performance')}
      ${kpiCard('Avg Uptime', s.avgUptime + '%', null, iconActivity(), 'var(--cyan)', '30 days', '#uptime')}
      ${kpiCard('Expiring Domains', s.expiringDomains, null, iconGlobeSmall(), 'var(--warning)', 'Within 30 days', '#domains')}
      ${kpiCard('Expiring SSL', s.expiringSSL + 2, null, iconLock(), 'var(--warning)', 'Within 30 days', '#ssl')}
      ${kpiCard('Plugin Alerts', s.expiringPlugins + s.expiredPlugins, null, iconPuzzle(), 'var(--danger)', 'Expired or expiring', '#plugins')}
      ${kpiCard('WP Updates', s.outdatedWP, null, iconWP(), 'var(--primary)', 'Outdated WordPress', '#wordpress')}
    </div>

    <!-- ROW 3: CHARTS -->
    <div class="grid-3 dashboard-row">
      <!-- Health Trend Chart -->
      <div class="card col-span-2">
        <div class="card-header">
          <div class="card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            Website Health Trend
            <span class="card-subtitle">30 days</span>
          </div>
          <div class="card-actions">
            <button class="btn btn-secondary btn-sm" id="health-trend-toggle">Avg Score</button>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height:220px"><canvas id="healthTrendChart"></canvas></div>
        </div>
      </div>

      <!-- Status Distribution + AI Insights -->
      <div style="display:flex;flex-direction:column;gap:20px">
        <!-- Status Distribution -->
        <div class="card" style="flex:1">
          <div class="card-header">
            <div class="card-title">Status Distribution</div>
          </div>
          <div class="card-body">
            <div class="status-dist-list">
              ${statusDistRow('Healthy',   s.healthy,   websites.length, 'var(--success)')}
              ${statusDistRow('Attention', s.issues,    websites.length, 'var(--warning)')}
              ${statusDistRow('Critical',  s.critical,  websites.length, 'var(--danger)')}
              ${statusDistRow('Offline',   0,           websites.length, 'var(--text-dim)')}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ROW 4: AI INSIGHTS + EVENTS + ISSUES -->
    <div class="grid-3 dashboard-row">
      <!-- AI Insights -->
      <div class="ai-insights-card">
        <div class="ai-insights-header">
          <div class="ai-insights-title">
            <span class="ai-star">✦</span> AI Website Insights
          </div>
          <button class="text-btn" onclick="window.location.hash='ai-assistant'">View →</button>
        </div>
        <div class="ai-insights-body">
          <div class="insight-row"><span class="insight-dot">🔴</span><span><strong>2 websites</strong> have performance scores below 40. constructionfirst.com (38) and northstar.com (44) require urgent investigation.</span></div>
          <div class="insight-row"><span class="insight-dot">🟠</span><span><strong>5 plugin licenses</strong> expire within 30 days. Elementor Pro expires in 9 days on globalexports.com.</span></div>
          <div class="insight-row"><span class="insight-dot">🔴</span><span><strong>3 backup failures</strong> detected. northstar.com, globalexports.com and constructionfirst.com have not backed up in 3-8 days.</span></div>
          <div class="insight-row"><span class="insight-dot">🟠</span><span><strong>analytix.sa domain</strong> expires in 8 days with auto-renew disabled.</span></div>
          <div class="insight-row"><span class="insight-dot">🔵</span><span><strong>12 websites</strong> have SEO issues. Most common: missing meta descriptions (69 pages).</span></div>
        </div>
        <div class="ai-insights-footer">
          <button class="btn btn-primary btn-sm w-full" onclick="window.openAIPanel('Which websites need attention today?')">
            <span>✦</span> Ask Analytix AI
          </button>
        </div>
      </div>

      <!-- Recent Website Events -->
      <div class="card col-span-2">
        <div class="card-header">
          <div class="card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Recent Website Events
          </div>
          <button class="text-btn" onclick="window.location.hash='events'">View all →</button>
        </div>
        <div class="event-list" id="recent-events">
          ${websiteEvents.slice(0,8).map(e => renderEventItem(e)).join('')}
        </div>
      </div>
    </div>

    <!-- ROW 5: TOP ISSUES + TRAFFIC -->
    <div class="grid-2-1 dashboard-row">
      <!-- Top Technical Issues -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Top Technical Issues
          </div>
          <button class="text-btn" onclick="window.location.hash='audit'">View all →</button>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr>
              <th>Website</th><th>Issue</th><th>Severity</th><th>Category</th><th></th>
            </tr></thead>
            <tbody>
              ${topIssuesRows()}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Uptime Status -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Uptime Status</div>
          <button class="text-btn" onclick="window.location.hash='uptime'">View →</button>
        </div>
        <div class="card-body" style="padding-top:12px">
          ${uptimeMini()}
        </div>
      </div>
    </div>

    <!-- ROW 6: EXPIRY TABLES -->
    <div class="grid-3 dashboard-row">
      <!-- Domains Expiring -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Domains Expiring</div>
          <button class="text-btn" onclick="window.location.hash='domains'">View →</button>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Domain</th><th>Days</th><th>Auto</th></tr></thead>
            <tbody>
              ${domains.filter(d=>{
                const days = Math.ceil((new Date(d.expires)-new Date('2026-09-23'))/86400000);
                return days < 60;
              }).sort((a,b)=>new Date(a.expires)-new Date(b.expires)).slice(0,5).map(d=>{
                const days = Math.ceil((new Date(d.expires)-new Date('2026-09-23'))/86400000);
                const site = websites.find(w=>w.id===d.websiteId);
                return `<tr onclick="window.location.hash='domains'" style="cursor:pointer">
                  <td>
                    <div style="font-size:12px;font-weight:600;color:var(--text)">${d.domain}</div>
                    <div style="font-size:10px;color:var(--text-dim)">${site?.client||''}</div>
                  </td>
                  <td><span class="days-remaining ${getDaysColor(days)}">${days}d</span></td>
                  <td>${d.autoRenew ? '<span class="badge badge-healthy">ON</span>' : '<span class="badge badge-critical">OFF</span>'}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- SSL Expiring -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">SSL Expiring</div>
          <button class="text-btn" onclick="window.location.hash='ssl'">View →</button>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Domain</th><th>Issuer</th><th>Days</th></tr></thead>
            <tbody>
              ${sslCerts.filter(s=>{
                const days = Math.ceil((new Date(s.expires)-new Date('2026-09-23'))/86400000);
                return days < 60;
              }).sort((a,b)=>new Date(a.expires)-new Date(b.expires)).slice(0,5).map(s=>{
                const days = Math.ceil((new Date(s.expires)-new Date('2026-09-23'))/86400000);
                return `<tr onclick="window.location.hash='ssl'" style="cursor:pointer">
                  <td style="font-size:12px;font-weight:600">${s.domain}</td>
                  <td style="font-size:11px;color:var(--text-muted)">${s.issuer}</td>
                  <td><span class="days-remaining ${getDaysColor(days)}">${days}d</span></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Plugins Needing Attention -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Plugin Alerts</div>
          <button class="text-btn" onclick="window.location.hash='plugins'">View →</button>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Plugin</th><th>Site</th><th>Status</th></tr></thead>
            <tbody>
              ${plugins.filter(p=>['expiring','expired','security'].includes(p.status)).slice(0,5).map(p=>{
                const site = websites.find(w=>w.id===p.websiteId);
                return `<tr onclick="window.location.hash='plugins'" style="cursor:pointer">
                  <td style="font-size:12px;font-weight:600;max-width:120px;overflow:hidden;text-overflow:ellipsis">${p.name}</td>
                  <td style="font-size:11px;color:var(--text-muted)">${site?.name||''}</td>
                  <td>${pluginBadge(p.status, p.licenseExpiry)}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ROW 7: ANALYTICS OVERVIEW -->
    <div class="card dashboard-row">
      <div class="card-header">
        <div class="card-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          Traffic Overview
          <span class="card-subtitle">30 days, all sites</span>
        </div>
        <button class="text-btn" onclick="window.location.hash='analytics'">Full Analytics →</button>
      </div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:20px">
          ${analyticsKPI('Total Sessions', '284,720', '+12.4%', 'up')}
          ${analyticsKPI('Unique Users', '198,440', '+9.8%', 'up')}
          ${analyticsKPI('Pageviews', '842,180', '+14.2%', 'up')}
          ${analyticsKPI('Bounce Rate', '42.8%', '-2.1%', 'up')}
        </div>
        <div class="chart-container" style="height:180px"><canvas id="trafficChart"></canvas></div>
      </div>
    </div>
  `;

  // Initialize charts after DOM is ready
  requestAnimationFrame(() => {
    initHealthTrendChart();
    initTrafficChart();
  });

  // Bind Automated Website Analyzer events
  const heroUrlInput   = container.querySelector('#dash-hero-url');
  const heroAnalyzeBtn = container.querySelector('#dash-hero-analyze-btn');
  const heroZipUpload  = container.querySelector('#hero-zip-upload');

  heroAnalyzeBtn?.addEventListener('click', () => {
    if (heroUrlInput?.value) {
      analyzeWebsiteByUrl(heroUrlInput.value);
    }
  });

  heroUrlInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && heroUrlInput.value) {
      analyzeWebsiteByUrl(heroUrlInput.value);
    }
  });

  heroZipUpload?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('website_file', file);
    try {
      const res = await fetch('api/upload.php', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        analyzeWebsiteByUrl(data.url);
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
  });

  // Ask AI on events
  container.querySelectorAll('.event-ask-ai').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const msg = btn.dataset.message;
      window.openAIPanel(msg);
    });
  });
}

// ─── KPI CARD ────────────────────────────────────────────────
function kpiCard(label, value, change, icon, color, sub, link) {
  return `
    <div class="kpi-card" style="--kpi-color:${color};--kpi-color-dim:${color}22" onclick="window.location.hash='${link.slice(1)}'">
      <div class="kpi-icon">${icon}</div>
      <div class="kpi-label">${label}</div>
      <div class="kpi-value">${value}</div>
      ${change ? `<span class="kpi-change up">${change}</span>` : `<span style="font-size:11px;color:var(--text-dim)">${sub}</span>`}
    </div>`;
}

function statusDistRow(label, count, total, color) {
  const pct = total ? Math.round((count/total)*100) : 0;
  return `
    <div class="status-dist-item">
      <span class="status-dist-label">${label}</span>
      <div class="status-dist-bar"><div class="status-dist-fill" style="width:${pct}%;background:${color}"></div></div>
      <span class="status-dist-count">${count}</span>
    </div>`;
}

function renderEventItem(e) {
  const site = websites.find(w => w.id === e.websiteId);
  const emoji = { critical:'🔴', warning:'🟠', success:'🟢', info:'🔵' };
  return `
    <div class="event-item">
      <div class="event-severity ${e.severity}">${emoji[e.severity]||'⚪'}</div>
      <div class="event-body">
        <div class="event-site">${site?.name||'Unknown'}</div>
        <div class="event-msg">${e.message}</div>
        <div class="event-time">${formatTimeAgo(e.time)}</div>
      </div>
      <button class="event-ask-ai" data-message="Tell me about: ${e.message} on ${site?.name}">Ask AI</button>
    </div>`;
}

function topIssuesRows() {
  const issues = [
    { site:'constructionfirst.com', issue:'HTTP 500 Error — Website Down', severity:'critical', cat:'Uptime', id:15 },
    { site:'northstar.com',         issue:'PHP 7.4 end of life — Security Risk', severity:'critical', cat:'Security', id:5 },
    { site:'constructionfirst.com', issue:'WP 5.9.5 — 5 CVE vulnerabilities', severity:'critical', cat:'Security', id:15 },
    { site:'northstar.com',         issue:'Performance Score: 44/100 (mobile)', severity:'high',    cat:'Performance', id:5 },
    { site:'setupz.com',            issue:'Performance Score Dropped 21 points', severity:'high',    cat:'Performance', id:1 },
    { site:'northstar.com',         issue:'SSL expires in 10 days', severity:'critical', cat:'SSL', id:5 },
  ];
  return issues.map(i => `
    <tr onclick="window.location.hash='websites/${i.id}'" style="cursor:pointer">
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="site-icon" style="background:${websites.find(w=>w.name===i.site)?.color||'#3B82F6'};width:22px;height:22px;font-size:9px">${i.site[0].toUpperCase()}</div>
          <span style="font-size:12px;font-weight:600">${i.site}</span>
        </div>
      </td>
      <td style="font-size:12px;color:var(--text)">${i.issue}</td>
      <td><span class="audit-severity-badge sev-${i.severity}">${i.severity}</span></td>
      <td><span class="badge badge-primary" style="font-size:10px">${i.cat}</span></td>
      <td><button class="event-ask-ai" style="opacity:1" onclick="event.stopPropagation();window.openAIPanel('Explain: ${i.issue} on ${i.site}')">Ask AI</button></td>
    </tr>`).join('');
}

function uptimeMini() {
  const uptimeRows = [
    { name:'constructionfirst.com', uptime:97.8,  color:'var(--danger)' },
    { name:'northstar.com',         uptime:98.2,  color:'var(--danger)' },
    { name:'globalexports.com',     uptime:99.1,  color:'var(--warning)' },
    { name:'greenleaf.org',         uptime:99.4,  color:'var(--warning)' },
    { name:'meritacademy.edu',      uptime:99.5,  color:'var(--warning)' },
    { name:'analytixconnect.com',   uptime:99.7,  color:'var(--success)' },
    { name:'techvista.io',          uptime:100.0, color:'var(--success)' },
  ];
  return uptimeRows.map(u => `
    <div class="uptime-mini-row">
      <span class="uptime-mini-site">${u.name}</span>
      <div style="flex:1;height:4px;background:var(--border);border-radius:2px;overflow:hidden;margin:0 8px">
        <div style="width:${u.uptime}%;height:100%;background:${u.color};border-radius:2px"></div>
      </div>
      <span class="uptime-mini-val" style="color:${u.color}">${u.uptime}%</span>
    </div>`).join('');
}

function pluginBadge(status, expiry) {
  if (status === 'expired') return `<span class="badge badge-critical">Expired</span>`;
  if (status === 'security') return `<span class="badge badge-critical">Security</span>`;
  if (status === 'expiring') {
    const days = Math.ceil((new Date(expiry)-new Date('2026-09-23'))/86400000);
    return `<span class="badge badge-warning">${days}d left</span>`;
  }
  return `<span class="badge badge-healthy">OK</span>`;
}

function analyticsKPI(label, val, change, dir) {
  return `
    <div>
      <div style="font-size:22px;font-weight:800;color:var(--text);margin-bottom:4px">${val}</div>
      <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px">${label}</div>
      <div style="font-size:11px;font-weight:600;color:${dir==='up'?'var(--success)':'var(--danger)'};margin-top:2px">${change}</div>
    </div>`;
}

// ─── CHARTS ──────────────────────────────────────────────────
function initHealthTrendChart() {
  const ctx = document.getElementById('healthTrendChart');
  if (!ctx || !window.Chart) return;
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: healthTrend.labels.filter((_,i)=>i%3===0),
      datasets: [
        {
          label: 'Avg Health Score',
          data: healthTrend.avgHealth.filter((_,i)=>i%3===0),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59,130,246,0.08)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
        },
        {
          label: 'Healthy Sites',
          data: healthTrend.healthy.filter((_,i)=>i%3===0).map(v=>v*6),
          borderColor: '#22C55E',
          backgroundColor: 'transparent',
          fill: false,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 1.5,
          borderDash: [4,4],
        }
      ]
    },
    options: chartOptions()
  });
}

function initTrafficChart() {
  const ctx = document.getElementById('trafficChart');
  if (!ctx || !window.Chart) return;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: analyticsData.chartLabels.filter((_,i)=>i%3===0),
      datasets: [{
        label: 'Sessions',
        data: analyticsData.sessionsTimeline.filter((_,i)=>i%3===0),
        backgroundColor: 'rgba(59,130,246,0.5)',
        borderColor: '#3B82F6',
        borderWidth: 1,
        borderRadius: 4,
      }]
    },
    options: chartOptions()
  });
}

function chartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode:'index', intersect:false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111A2A',
        borderColor: '#22304A',
        borderWidth: 1,
        titleColor: '#F8FAFC',
        bodyColor: '#94A3B8',
        padding: 10,
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(34,48,74,0.4)', drawBorder: false },
        ticks: { color: '#64748B', font:{size:10} }
      },
      y: {
        grid: { color: 'rgba(34,48,74,0.4)', drawBorder: false },
        ticks: { color: '#64748B', font:{size:10} },
        border: { display: false }
      }
    }
  };
}

// ─── ICON HELPERS ────────────────────────────────────────────
function icon(d) { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${d}</svg>`; }
function iconGlobe()      { return icon('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'); }
function iconGlobeSmall() { return iconGlobe(); }
function iconCheckCircle(){ return icon('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'); }
function iconAlertTriangle(){ return icon('<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'); }
function iconXCircle()    { return icon('<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'); }
function iconHeart()      { return icon('<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>'); }
function iconSearch()     { return icon('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>'); }
function iconZap()        { return icon('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'); }
function iconActivity()   { return icon('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'); }
function iconLock()       { return icon('<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'); }
function iconPuzzle()     { return icon('<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>'); }
function iconWP()         { return icon('<circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>'); }
