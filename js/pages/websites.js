// ════════════════════════════════════════════════════════════════
//  WEBSITES PAGE — List + Detail
// ════════════════════════════════════════════════════════════════
import { websites, getDomainByWebsite, getSSLByWebsite, getPerformanceByWebsite, getSEOByWebsite, getUptimeByWebsite, getSecurityByWebsite, getEventsByWebsite, getPluginsByWebsite, getWordPressByWebsite, getBackupByWebsite, getAuditIssuesByWebsite, formatTimeAgo, getScoreColor, getScoreClass } from '../data.js';
import { analyzeWebsiteByUrl } from '../analyzer-ui.js';

export function renderWebsites(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-heading">Websites</h1>
        <p class="page-desc">Monitoring ${websites.length} websites</p>
      </div>
      <div class="page-header-right" style="display:flex; gap:10px;">
        <button class="btn btn-primary btn-sm" id="websites-new-analyze-btn">⚡ Analyze New Website URL</button>
        <button class="btn btn-secondary btn-sm" onclick="window.openAIPanel('Which websites need attention today?')"><span>✦</span> Ask AI</button>
      </div>
    </div>

    <div class="filters-bar">
      <input type="text" class="filter-search" placeholder="Search websites..." id="site-search">
      <select class="filter-select" id="status-filter">
        <option value="">All Status</option>
        <option value="healthy">Healthy</option>
        <option value="warning">Warning</option>
        <option value="attention">Attention</option>
        <option value="critical">Critical</option>
      </select>
      <select class="filter-select" id="type-filter">
        <option value="">All Types</option>
        <option value="wordpress">WordPress</option>
        <option value="nextjs">Next.js</option>
        <option value="custom">Custom</option>
      </select>
      <select class="filter-select" id="sort-filter">
        <option value="health">Sort: Health Score</option>
        <option value="name">Sort: Name</option>
        <option value="seo">Sort: SEO</option>
        <option value="performance">Sort: Performance</option>
      </select>
    </div>

    <div class="card">
      <div class="table-wrap">
        <table class="data-table" id="websites-table">
          <thead><tr>
            <th>Website</th>
            <th>Status</th>
            <th class="sortable">Health</th>
            <th class="sortable">SEO</th>
            <th class="sortable">Performance</th>
            <th>Security</th>
            <th>Uptime</th>
            <th>Type</th>
            <th>Actions</th>
          </tr></thead>
          <tbody id="websites-tbody">
            ${renderWebsiteRows(websites)}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Filters
  const search = container.querySelector('#site-search');
  const statusF = container.querySelector('#status-filter');
  const typeF = container.querySelector('#type-filter');
  const sortF = container.querySelector('#sort-filter');

  function applyFilters() {
    const q = search.value.toLowerCase();
    const status = statusF.value;
    const type = typeF.value;
    const sort = sortF.value;

    let filtered = websites.filter(w => {
      const matchQ = !q || w.name.toLowerCase().includes(q) || w.client.toLowerCase().includes(q);
      const matchStatus = !status || w.status === status;
      const matchType = !type || w.type === type;
      return matchQ && matchStatus && matchType;
    });

    filtered.sort((a,b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'seo') return b.seoScore - a.seoScore;
      if (sort === 'performance') return b.performanceScore - a.performanceScore;
      return b.healthScore - a.healthScore;
    });

    document.getElementById('websites-tbody').innerHTML = renderWebsiteRows(filtered);
    bindRowEvents(container);
  }

  [search, statusF, typeF, sortF].forEach(el => el?.addEventListener('input', applyFilters));
  bindRowEvents(container);

  container.querySelector('#websites-new-analyze-btn')?.addEventListener('click', () => {
    const url = prompt('Enter the website URL to analyze automatically:', 'https://');
    if (url && url.trim() && url !== 'https://') {
      analyzeWebsiteByUrl(url);
    }
  });
}

function renderWebsiteRows(list) {
  return list.map(w => `
    <tr onclick="window.location.hash='websites/${w.id}'" style="cursor:pointer" data-id="${w.id}">
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div class="site-icon" style="background:${w.color}">${w.name[0]}</div>
          <div>
            <div style="font-size:13px;font-weight:600;color:var(--text)">${w.name}</div>
            <div style="font-size:11px;color:var(--text-muted)">${w.client}</div>
          </div>
        </div>
      </td>
      <td>
        <div style="display:flex;align-items:center;gap:6px">
          <span class="status-dot ${w.status}"></span>
          <span class="badge badge-${w.status}" style="text-transform:capitalize">${w.status}</span>
        </div>
      </td>
      <td>${scoreBar(w.healthScore)}</td>
      <td>${scoreBar(w.seoScore)}</td>
      <td>${scoreBar(w.performanceScore)}</td>
      <td>${scoreBar(w.securityScore)}</td>
      <td>
        <span style="font-size:12px;font-weight:700;color:${w.uptime>=99.9?'var(--success)':w.uptime>=99?'var(--warning)':'var(--danger)'}">${w.uptime}%</span>
      </td>
      <td><span class="badge badge-primary" style="text-transform:uppercase;font-size:10px">${w.type}</span></td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation();window.location.hash='websites/${w.id}'">View</button>
          <button class="btn btn-sm" style="background:var(--primary-dim);color:var(--primary);font-size:11px;padding:4px 8px" onclick="event.stopPropagation();window.openAIPanel('Analyze ${w.name}')">✦ AI</button>
        </div>
      </td>
    </tr>`).join('');
}

function scoreBar(score) {
  const color = getScoreColor(score);
  return `
    <div style="display:flex;align-items:center;gap:6px">
      <span style="font-size:12px;font-weight:700;color:${color};width:28px">${score}</span>
      <div style="flex:1;height:4px;background:var(--border);border-radius:2px;width:50px">
        <div style="width:${score}%;height:100%;background:${color};border-radius:2px"></div>
      </div>
    </div>`;
}

function bindRowEvents(container) {
  container.querySelectorAll('.data-table tbody tr').forEach(row => {
    row.addEventListener('click', () => {
      const id = row.dataset.id;
      if (id) window.location.hash = `websites/${id}`;
    });
  });
}

// ─── WEBSITE DETAIL ──────────────────────────────────────────
export function renderWebsiteDetail(container, id) {
  const site = websites.find(w => w.id === id);
  if (!site) { container.innerHTML = '<div class="empty-state"><h4>Website not found</h4></div>'; return; }

  const domain = getDomainByWebsite(id);
  const ssl = getSSLByWebsite(id);
  const perf = getPerformanceByWebsite(id, 'mobile');
  const perfD = getPerformanceByWebsite(id, 'desktop');
  const seo = getSEOByWebsite(id);
  const up = getUptimeByWebsite(id);
  const sec = getSecurityByWebsite(id);
  const wp = getWordPressByWebsite(id);
  const backup = getBackupByWebsite(id);
  const plugList = getPluginsByWebsite(id);
  const events = getEventsByWebsite(id);
  const issues = getAuditIssuesByWebsite(id);

  const domDays = domain ? Math.ceil((new Date(domain.expires)-new Date('2026-09-23'))/86400000) : null;
  const sslDays = ssl ? Math.ceil((new Date(ssl.expires)-new Date('2026-09-23'))/86400000) : null;

  container.innerHTML = `
    <!-- BACK + ACTIONS -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
      <button class="btn btn-secondary btn-sm" onclick="window.location.hash='websites'">← Back to Websites</button>
      <div style="display:flex;gap:8px">
        <a href="${site.url}" target="_blank" class="btn btn-secondary btn-sm">🔗 Visit Site</a>
        <button class="btn btn-primary btn-sm" onclick="window.openAIPanel('Analyze ${site.name}')"><span>✦</span> Analyze with AI</button>
      </div>
    </div>

    <!-- HERO -->
    <div class="website-detail-hero">
      <div class="website-detail-icon" style="background:linear-gradient(135deg,${site.color},${site.color}88)">${site.name[0]}</div>
      <div class="website-detail-info">
        <div class="website-detail-name">${site.name}</div>
        <div class="website-detail-url">${site.url}</div>
        <div class="website-detail-meta">
          <div class="website-detail-meta-item">
            <span class="status-dot ${site.status}"></span>
            <span class="badge badge-${site.status}" style="text-transform:capitalize">${site.status}</span>
          </div>
          <div class="website-detail-meta-item">👤 ${site.client}</div>
          <div class="website-detail-meta-item">🏷️ ${site.type.toUpperCase()}</div>
          <div class="website-detail-meta-item">📄 ${site.pageCount} pages</div>
          <div class="website-detail-meta-item">🌍 ${site.country}</div>
          <div class="website-detail-meta-item">🕐 Last audit: ${formatTimeAgo(site.lastAudit)}</div>
        </div>
      </div>
      <div class="website-scores">
        ${scoreCell('Health', site.healthScore)}
        ${scoreCell('SEO', seo?.score || site.seoScore)}
        ${scoreCell('Performance', perf?.score || site.performanceScore)}
        ${scoreCell('Security', sec?.score || site.securityScore)}
      </div>
    </div>

    <!-- TABS -->
    <div class="tabs" id="detail-tabs">
      <div class="tab active" data-tab="overview">Overview</div>
      <div class="tab" data-tab="seo">SEO</div>
      <div class="tab" data-tab="performance">Performance</div>
      <div class="tab" data-tab="security">Security</div>
      <div class="tab" data-tab="maintenance">Maintenance</div>
      <div class="tab" data-tab="events">Events (${events.length})</div>
    </div>

    <div id="detail-tab-content">
      ${renderOverviewTab(site, domain, ssl, up, backup, wp, perf, domDays, sslDays)}
    </div>
  `;

  // Tab switching
  container.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const content = document.getElementById('detail-tab-content');
      switch(tab.dataset.tab) {
        case 'overview':    content.innerHTML = renderOverviewTab(site, domain, ssl, up, backup, wp, perf, domDays, sslDays); break;
        case 'seo':         content.innerHTML = renderSEOTab(seo); break;
        case 'performance': content.innerHTML = renderPerfTab(perf, perfD); break;
        case 'security':    content.innerHTML = renderSecurityTab(sec, wp); break;
        case 'maintenance': content.innerHTML = renderMaintenanceTab(domain, ssl, plugList, wp, backup, domDays, sslDays); break;
        case 'events':      content.innerHTML = renderEventsTab(events); break;
      }
    });
  });
}

function scoreCell(label, score) {
  const c = getScoreColor(score);
  return `<div class="website-score-cell">
    <div class="website-score-cell-label">${label}</div>
    <div class="website-score-cell-val" style="color:${c}">${score}</div>
  </div>`;
}

function renderOverviewTab(site, domain, ssl, up, backup, wp, perf, domDays, sslDays) {
  return `<div class="grid-3" style="margin-top:0">
    <div class="card">
      <div class="card-header"><div class="card-title">Uptime & Performance</div></div>
      <div class="card-body">
        <div class="metric-row"><span class="metric-label">30-day Uptime</span><span class="metric-value" style="color:${up?.uptime<99?'var(--danger)':'var(--success)'}">${up?.uptime||site.uptime}%</span></div>
        <div class="metric-row"><span class="metric-label">Response Time</span><span class="metric-value">${up?.responseTime||'—'}ms</span></div>
        <div class="metric-row"><span class="metric-label">HTTP Status</span><span class="metric-value">${up?.httpStatus||200}</span></div>
        <div class="metric-row"><span class="metric-label">Mobile Perf Score</span><span class="metric-value" style="color:${getScoreColor(perf?.score||0)}">${perf?.score||'—'}/100</span></div>
        <div class="metric-row"><span class="metric-label">LCP (mobile)</span><span class="metric-value">${perf?.lcp||'—'}s</span></div>
        <div class="metric-row"><span class="metric-label">Page Size</span><span class="metric-value">${perf?.pageSize||'—'}MB</span></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Domain & SSL</div></div>
      <div class="card-body">
        <div class="metric-row"><span class="metric-label">Domain</span><span class="metric-value" style="font-size:12px">${domain?.domain||'—'}</span></div>
        <div class="metric-row"><span class="metric-label">Registrar</span><span class="metric-value">${domain?.registrar||'—'}</span></div>
        <div class="metric-row"><span class="metric-label">Domain Expires</span><span class="metric-value ${domDays&&domDays<30?'text-danger':''}">${domDays!=null?domDays+' days':'—'}</span></div>
        <div class="metric-row"><span class="metric-label">Auto Renew</span><span class="metric-value" style="color:${domain?.autoRenew?'var(--success)':'var(--danger)'}">${domain?.autoRenew?'Enabled':'Disabled'}</span></div>
        <div class="metric-row"><span class="metric-label">SSL Issuer</span><span class="metric-value">${ssl?.issuer||'—'}</span></div>
        <div class="metric-row"><span class="metric-label">SSL Expires</span><span class="metric-value ${sslDays&&sslDays<30?'text-danger':''}">${sslDays!=null?sslDays+' days':'—'}</span></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Technical Stack</div></div>
      <div class="card-body">
        ${wp?`
        <div class="metric-row"><span class="metric-label">WordPress</span><span class="metric-value" style="color:${wp.wpVersion===wp.latestWP?'var(--success)':'var(--warning)'}">${wp.wpVersion}${wp.wpVersion!==wp.latestWP?' ⚠':''}</span></div>
        <div class="metric-row"><span class="metric-label">PHP Version</span><span class="metric-value" style="color:${wp.phpVersion.startsWith('8')?'var(--text)':'var(--danger)'}">${wp.phpVersion}</span></div>
        <div class="metric-row"><span class="metric-label">Database Size</span><span class="metric-value">${wp.dbSize}</span></div>
        <div class="metric-row"><span class="metric-label">Updates Available</span><span class="metric-value" style="color:${wp.updatesAvailable>0?'var(--warning)':'var(--success)'}">${wp.updatesAvailable}</span></div>
        `:
        `<div class="metric-row"><span class="metric-label">Type</span><span class="metric-value">${site.type.toUpperCase()}</span></div>`}
        <div class="metric-row"><span class="metric-label">Last Backup</span><span class="metric-value" style="color:${backup?.status==='failed'?'var(--danger)':'var(--success)'}">${backup?formatTimeAgo(backup.lastBackup):'Unknown'}</span></div>
        <div class="metric-row"><span class="metric-label">Backup Status</span><span class="metric-value"><span class="badge badge-${backup?.status==='success'?'healthy':'critical'}">${backup?.status||'Unknown'}</span></span></div>
      </div>
    </div>
  </div>`;
}

function renderSEOTab(seo) {
  if (!seo) return '<div class="empty-state"><h4>No SEO data available</h4></div>';
  return `<div class="grid-2" style="margin-top:0">
    <div class="card">
      <div class="card-header"><div class="card-title">SEO Score: <span style="color:${getScoreColor(seo.score)}">${seo.score}/100</span></div></div>
      <div class="card-body">
        <div class="metric-row"><span class="metric-label">Missing Titles</span><span class="metric-value" style="color:${seo.missingTitles>0?'var(--danger)':'var(--success)'}">${seo.missingTitles}</span></div>
        <div class="metric-row"><span class="metric-label">Missing Meta Descriptions</span><span class="metric-value" style="color:${seo.missingDescriptions>0?'var(--warning)':'var(--success)'}">${seo.missingDescriptions}</span></div>
        <div class="metric-row"><span class="metric-label">Missing ALT Text</span><span class="metric-value" style="color:${seo.missingAlt>0?'var(--warning)':'var(--success)'}">${seo.missingAlt}</span></div>
        <div class="metric-row"><span class="metric-label">Broken Links</span><span class="metric-value" style="color:${seo.brokenLinks>0?'var(--danger)':'var(--success)'}">${seo.brokenLinks}</span></div>
        <div class="metric-row"><span class="metric-label">Canonical Issues</span><span class="metric-value" style="color:${seo.canonicalIssues>0?'var(--warning)':'var(--success)'}">${seo.canonicalIssues}</span></div>
        <div class="metric-row"><span class="metric-label">H1 Issues</span><span class="metric-value" style="color:${seo.h1Issues>0?'var(--warning)':'var(--success)'}">${seo.h1Issues}</span></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Technical SEO</div></div>
      <div class="card-body">
        <div class="metric-row"><span class="metric-label">Sitemap</span><span class="metric-value" style="color:${seo.sitemapOk?'var(--success)':'var(--danger)'}">${seo.sitemapOk?'✓ Found':'✗ Missing'}</span></div>
        <div class="metric-row"><span class="metric-label">Robots.txt</span><span class="metric-value" style="color:${seo.robotsOk?'var(--success)':'var(--danger)'}">${seo.robotsOk?'✓ OK':'✗ Issue'}</span></div>
        <div class="metric-row"><span class="metric-label">Schema Issues</span><span class="metric-value" style="color:${seo.schemaIssues>0?'var(--warning)':'var(--success)'}">${seo.schemaIssues}</span></div>
        <div class="metric-row"><span class="metric-label">Indexed Pages</span><span class="metric-value">${seo.indexedPages}</span></div>
        <div class="metric-row"><span class="metric-label">Duplicate Content</span><span class="metric-value" style="color:${seo.duplicateContent>0?'var(--warning)':'var(--success)'}">${seo.duplicateContent}</span></div>
      </div>
    </div>
  </div>`;
}

function renderPerfTab(perf, perfD) {
  if (!perf) return '<div class="empty-state"><h4>No performance data</h4></div>';
  const cwv = (p) => p ? `
    <div class="cwv-grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="cwv-card"><div class="cwv-label">Score</div><div class="cwv-value ${p.score>=90?'cwv-good':p.score>=50?'cwv-needs':'cwv-poor'}">${p.score}</div></div>
      <div class="cwv-card"><div class="cwv-label">LCP</div><div class="cwv-value ${p.lcp<=2.5?'cwv-good':p.lcp<=4?'cwv-needs':'cwv-poor'}">${p.lcp}s</div></div>
      <div class="cwv-card"><div class="cwv-label">CLS</div><div class="cwv-value ${p.cls<=0.1?'cwv-good':p.cls<=0.25?'cwv-needs':'cwv-poor'}">${p.cls}</div></div>
      <div class="cwv-card"><div class="cwv-label">INP</div><div class="cwv-value ${p.inp<=200?'cwv-good':p.inp<=500?'cwv-needs':'cwv-poor'}">${p.inp}ms</div></div>
      <div class="cwv-card"><div class="cwv-label">FCP</div><div class="cwv-value cwv-score">${p.fcp}s</div></div>
      <div class="cwv-card"><div class="cwv-label">TTFB</div><div class="cwv-value cwv-score">${p.ttfb}s</div></div>
      <div class="cwv-card"><div class="cwv-label">Page Size</div><div class="cwv-value cwv-score">${p.pageSize}MB</div></div>
      <div class="cwv-card"><div class="cwv-label">Requests</div><div class="cwv-value cwv-score">${p.requests}</div></div>
    </div>` : '';
  return `
    <div style="margin-bottom:16px"><div style="font-size:13px;font-weight:700;margin-bottom:10px">📱 Mobile Performance</div>${cwv(perf)}</div>
    ${perfD?`<div><div style="font-size:13px;font-weight:700;margin-bottom:10px">🖥️ Desktop Performance</div>${cwv(perfD)}</div>`:''}`;
}

function renderSecurityTab(sec, wp) {
  if (!sec) return '<div class="empty-state"><h4>No security data</h4></div>';
  const checks = [
    { label:'HTTPS Active', val:sec.https, good:true },
    { label:'Mixed Content', val:!sec.mixedContent, good:true, falseLabel:'Detected' },
    { label:'Security Headers', val:sec.securityHeaders, good:true },
    { label:'Firewall Active', val:sec.firewallActive, good:true },
    { label:'WordPress Updated', val:sec.wordpressUpdated, good:true },
    { label:'PHP Updated', val:sec.phpUpdated, good:true },
    { label:'Backup OK', val:sec.backupOk, good:true },
    { label:'Vulnerable Plugins', val:sec.vulnerablePlugins===0, good:true, trueLabel:`${sec.vulnerablePlugins} found`, falseLabel:'None' },
  ];
  return `<div class="card">
    <div class="card-header"><div class="card-title">Security Score: <span style="color:${getScoreColor(sec.score)}">${sec.score}/100</span></div></div>
    <div class="security-check-list">
      ${checks.map(c=>`
        <div class="security-check-item">
          <div class="security-check-left">
            <div class="security-check-icon" style="background:${c.val?'var(--success-dim)':'var(--danger-dim)'}">${c.val?'✓':'✗'}</div>
            <span>${c.label}</span>
          </div>
          <span class="badge badge-${c.val?'healthy':'critical'}">${c.val?(c.falseLabel||'OK'):(c.trueLabel||'Issue')}</span>
        </div>`).join('')}
      ${wp?`
        <div class="security-check-item">
          <div class="security-check-left">
            <div class="security-check-icon" style="background:var(--primary-dim)">ℹ</div>
            <span>PHP Version</span>
          </div>
          <span class="badge badge-${wp.phpVersion.startsWith('8')?'healthy':'critical'}">${wp.phpVersion}</span>
        </div>
        <div class="security-check-item">
          <div class="security-check-left">
            <div class="security-check-icon" style="background:var(--primary-dim)">ℹ</div>
            <span>WordPress Version</span>
          </div>
          <span class="badge badge-${wp.wpVersion===wp.latestWP?'healthy':'warning'}">${wp.wpVersion}</span>
        </div>`:''}
    </div>
  </div>`;
}

function renderMaintenanceTab(domain, ssl, plugList, wp, backup, domDays, sslDays) {
  return `<div class="grid-2" style="margin-top:0">
    <div class="card">
      <div class="card-header"><div class="card-title">Plugins (${plugList.length})</div></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Plugin</th><th>Version</th><th>License</th><th>Status</th></tr></thead>
          <tbody>
            ${plugList.map(p=>`<tr>
              <td style="font-size:12px;font-weight:600">${p.name}</td>
              <td style="font-size:11px;color:${p.updateAvailable?'var(--warning)':'var(--text-muted)'}">${p.version}${p.updateAvailable?` → ${p.latestVersion}`:''}</td>
              <td style="font-size:11px;color:var(--text-muted)">${p.license}</td>
              <td><span class="badge badge-${p.status==='ok'?'healthy':p.status==='expired'||p.status==='security'?'critical':'warning'}">${p.status}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="card">
        <div class="card-header"><div class="card-title">Backup Status</div></div>
        <div class="card-body">
          <div class="metric-row"><span class="metric-label">Last Backup</span><span class="metric-value" style="color:${backup?.status==='failed'?'var(--danger)':'var(--success)'}">${backup?formatTimeAgo(backup.lastBackup):'—'}</span></div>
          <div class="metric-row"><span class="metric-label">Provider</span><span class="metric-value">${backup?.provider||'—'}</span></div>
          <div class="metric-row"><span class="metric-label">Size</span><span class="metric-value">${backup?.size||'—'}</span></div>
          <div class="metric-row"><span class="metric-label">Status</span><span class="metric-value"><span class="badge badge-${backup?.status==='success'?'healthy':'critical'}">${backup?.status||'—'}</span></span></div>
        </div>
      </div>
      ${wp?`<div class="card">
        <div class="card-header"><div class="card-title">WordPress</div></div>
        <div class="card-body">
          <div class="metric-row"><span class="metric-label">WP Version</span><span class="metric-value">${wp.wpVersion}</span></div>
          <div class="metric-row"><span class="metric-label">PHP</span><span class="metric-value">${wp.phpVersion}</span></div>
          <div class="metric-row"><span class="metric-label">Updates</span><span class="metric-value" style="color:${wp.updatesAvailable>0?'var(--warning)':'var(--success)'}">${wp.updatesAvailable} pending</span></div>
          <div class="metric-row"><span class="metric-label">DB Size</span><span class="metric-value">${wp.dbSize}</span></div>
        </div>
      </div>`:''}
    </div>
  </div>`;
}

function renderEventsTab(events) {
  if (!events.length) return '<div class="empty-state"><h4>No events recorded</h4></div>';
  const emoji = { critical:'🔴', warning:'🟠', success:'🟢', info:'🔵' };
  return `<div class="card">
    <div class="event-list">
      ${events.map(e=>`
        <div class="event-item">
          <div class="event-severity ${e.severity}">${emoji[e.severity]||'⚪'}</div>
          <div class="event-body">
            <div class="event-msg">${e.message}</div>
            <div class="event-time">${formatTimeAgo(e.time)} · ${e.category}</div>
          </div>
          <button class="event-ask-ai" style="opacity:1" onclick="window.openAIPanel('Tell me about: ${e.message}')">Ask AI</button>
        </div>`).join('')}
    </div>
  </div>`;
}
