// ════════════════════════════════════════════════════════════════
//  ANALYTIX PORTAL — MAIN APP ROUTER & CONTROLLER
// ════════════════════════════════════════════════════════════════
import { websites, websiteEvents, alerts, getDashboardSummary, formatTimeAgo, getScoreColor, loadBackendWebsites } from './data.js';
import { renderDashboard }    from './pages/dashboard.js';
import { renderWebsites, renderWebsiteDetail } from './pages/websites.js';
import { renderAnalytics }    from './pages/analytics.js';
import { renderSEO }          from './pages/seo.js';
import { renderPerformance }  from './pages/performance.js';
import { renderAudit }        from './pages/audit.js';
import { renderBrokenLinks }  from './pages/broken-links.js';
import { renderSecurity }     from './pages/security.js';
import { renderUptime }       from './pages/uptime.js';
import { renderForms }        from './pages/forms.js';
import { renderBackups }      from './pages/backups.js';
import { renderDomains }      from './pages/domains.js';
import { renderSSL }          from './pages/ssl.js';
import { renderHosting }      from './pages/hosting.js';
import { renderPlugins }      from './pages/plugins.js';
import { renderThemes }       from './pages/themes.js';
import { renderWordPress }    from './pages/wordpress.js';
import { renderAlerts }       from './pages/alerts.js';
import { renderEvents }       from './pages/events.js';
import { renderAIAssistant }  from './pages/ai-assistant.js';
import { renderAIReports }    from './pages/ai-reports.js';
import { renderReports }      from './pages/reports.js';
import { renderSettings }     from './pages/settings.js';
import { initAIPanel }        from './ai.js';

// ─── NAVIGATION CONFIG ──────────────────────────────────────
const NAV = [
  { group: 'OVERVIEW', items: [
    { id:'dashboard',   label:'Dashboard',        icon:iconGrid(),          badge:null },
    { id:'websites',    label:'Websites',         icon:iconGlobe(),         badge:null },
  ]},
  { group: 'INTELLIGENCE', items: [
    { id:'analytics',   label:'Analytics',        icon:iconBarChart(),      badge:null },
    { id:'seo',         label:'SEO',              icon:iconSearch(),        badge:null },
    { id:'performance', label:'Performance',      icon:iconZap(),           badge:null },
    { id:'conversions', label:'Conversions',      icon:iconTarget(),        badge:null },
    { id:'funnels',     label:'Funnels',          icon:iconFunnel(),        badge:null },
  ]},
  { group: 'TECHNICAL', items: [
    { id:'audit',        label:'Site Audit',      icon:iconClipboard(),     badge:null },
    { id:'broken-links', label:'Broken Links',    icon:iconLink(),          badge:'17' },
    { id:'security',     label:'Security',        icon:iconShield(),        badge:null },
    { id:'uptime',       label:'Uptime',          icon:iconActivity(),      badge:null },
    { id:'forms',        label:'Forms',           icon:iconInbox(),         badge:null },
    { id:'backups',      label:'Backups',         icon:iconDatabase(),      badge:null },
  ]},
  { group: 'MAINTENANCE', items: [
    { id:'domains',      label:'Domains',         icon:iconGlobeSmall(),    badge:'3',  badgeClass:'warning' },
    { id:'ssl',          label:'SSL Certificates',icon:iconLock(),          badge:'4',  badgeClass:'warning' },
    { id:'hosting',      label:'Hosting',         icon:iconServer(),        badge:'2',  badgeClass:'warning' },
    { id:'plugins',      label:'Plugins',         icon:iconPuzzle(),        badge:'7',  badgeClass:'warning' },
    { id:'themes',       label:'Themes',          icon:iconLayout(),        badge:null },
    { id:'wordpress',    label:'WordPress',       icon:iconWP(),            badge:null },
  ]},
  { group: 'MONITORING', items: [
    { id:'alerts',       label:'Alerts',          icon:iconBell(),          badge:'15', badgeClass:'' },
    { id:'events',       label:'Website Events',  icon:iconClock(),         badge:null },
  ]},
  { group: 'AI', items: [
    { id:'ai-assistant', label:'Analytix AI',     icon:iconStar(),          badge:null },
    { id:'ai-reports',   label:'AI Reports',      icon:iconFileAI(),        badge:null },
  ]},
  { group: 'REPORTS', items: [
    { id:'reports',      label:'Reports',         icon:iconFile(),          badge:null },
    { id:'executive',    label:'Executive Reports',icon:iconPieChart(),     badge:null },
  ]},
  { group: 'SYSTEM', items: [
    { id:'integrations', label:'Integrations',    icon:iconPlugin(),        badge:null },
    { id:'settings',     label:'Settings',        icon:iconSettings(),      badge:null },
  ]},
];

// ─── STATE ──────────────────────────────────────────────────
export const AppState = {
  currentPage: 'dashboard',
  currentWebsiteId: null,
  sidebarCollapsed: false,
  charts: {},
};

// ─── ROUTER ─────────────────────────────────────────────────
function route() {
  const hash = window.location.hash.slice(1) || 'dashboard';
  const parts = hash.split('/');
  const page = parts[0];
  const param = parts[1];

  AppState.currentPage = page;
  AppState.currentWebsiteId = param ? parseInt(param) : null;

  renderPage(page, param);
  updateNav(page);
  updateBreadcrumb(page, param);
  updateAIContext(page, param);
}

function renderPage(page, param) {
  const content = document.getElementById('page-content');
  if (!content) return;
  content.innerHTML = '';

  const dispatch = {
    'dashboard':    () => renderDashboard(content),
    'websites':     () => param ? renderWebsiteDetail(content, parseInt(param)) : renderWebsites(content),
    'analytics':    () => renderAnalytics(content),
    'seo':          () => renderSEO(content, AppState.currentWebsiteId),
    'performance':  () => renderPerformance(content),
    'conversions':  () => renderPlaceholder(content, 'Conversions', 'Conversion tracking and goal analysis coming soon.'),
    'funnels':      () => renderPlaceholder(content, 'Funnels', 'Funnel analysis and visualization coming soon.'),
    'audit':        () => renderAudit(content),
    'broken-links': () => renderBrokenLinks(content),
    'security':     () => renderSecurity(content),
    'uptime':       () => renderUptime(content),
    'forms':        () => renderForms(content),
    'backups':      () => renderBackups(content),
    'domains':      () => renderDomains(content),
    'ssl':          () => renderSSL(content),
    'hosting':      () => renderHosting(content),
    'plugins':      () => renderPlugins(content),
    'themes':       () => renderThemes(content),
    'wordpress':    () => renderWordPress(content),
    'alerts':       () => renderAlerts(content),
    'events':       () => renderEvents(content),
    'ai-assistant': () => renderAIAssistant(content),
    'ai-reports':   () => renderAIReports(content),
    'reports':      () => renderReports(content),
    'executive':    () => renderReports(content, 'executive'),
    'integrations': () => renderPlaceholder(content, 'Integrations', 'Connect Google Analytics, Search Console, and more.'),
    'settings':     () => renderSettings(content),
  };

  if (dispatch[page]) {
    dispatch[page]();
  } else {
    renderPlaceholder(content, 'Page Not Found', 'Navigate using the sidebar.');
  }

  content.scrollTop = 0;
}

function renderPlaceholder(container, title, desc) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-heading">${title}</h1>
        <p class="page-desc">${desc}</p>
      </div>
    </div>
    <div class="card">
      <div class="empty-state" style="padding:80px 40px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h4>${title}</h4>
        <p>${desc}</p>
      </div>
    </div>`;
}

// ─── NAVIGATION ──────────────────────────────────────────────
function buildNav() {
  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;
  const summary = getDashboardSummary();
  // Update badge values dynamically
  NAV.forEach(group => {
    group.items.forEach(item => {
      if (item.id === 'alerts') item.badge = summary.unackAlerts.toString();
      if (item.id === 'domains') item.badge = summary.expiringDomains.toString();
      if (item.id === 'plugins') item.badge = (summary.expiringPlugins + summary.expiredPlugins).toString();
    });
  });

  nav.innerHTML = NAV.map(group => `
    <div class="nav-group">
      <div class="nav-group-header">${group.group}</div>
      ${group.items.map(item => `
        <div class="nav-item" data-page="${item.id}" id="nav-${item.id}" role="button" tabindex="0" aria-label="${item.label}">
          ${item.icon}
          <span class="nav-item-text">${item.label}</span>
          ${item.badge && item.badge !== '0' ? `<span class="nav-badge${item.badgeClass ? ' '+item.badgeClass : ''}">${item.badge}</span>` : ''}
        </div>
      `).join('')}
    </div>
  `).join('');

  nav.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      window.location.hash = item.dataset.page;
    });
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.hash = item.dataset.page;
      }
    });
  });
}

function updateNav(currentPage) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === currentPage);
  });
}

function updateBreadcrumb(page, param) {
  const bc = document.getElementById('breadcrumb');
  if (!bc) return;
  const labels = {
    dashboard:'Dashboard', websites:'Websites', analytics:'Analytics',
    seo:'SEO', performance:'Performance', audit:'Site Audit',
    'broken-links':'Broken Links', security:'Security', uptime:'Uptime',
    forms:'Forms', backups:'Backups', domains:'Domains', ssl:'SSL Certificates',
    hosting:'Hosting', plugins:'Plugins', themes:'Themes', wordpress:'WordPress',
    alerts:'Alerts', events:'Website Events', 'ai-assistant':'Analytix AI',
    'ai-reports':'AI Reports', reports:'Reports', executive:'Executive Reports',
    integrations:'Integrations', settings:'Settings', conversions:'Conversions', funnels:'Funnels',
  };
  if (param && page === 'websites') {
    const w = websites.find(w => w.id === parseInt(param));
    bc.innerHTML = `<span onclick="window.location.hash='websites'" style="cursor:pointer">Websites</span><span>${w ? w.name : 'Detail'}</span>`;
  } else {
    bc.innerHTML = `<span>${labels[page] || page}</span>`;
  }
}

function updateAIContext(page, param) {
  const ctxLabel = document.getElementById('ai-context-value');
  if (!ctxLabel) return;
  const labels = {
    dashboard:'Dashboard Overview', websites:'Websites', analytics:'Analytics',
    seo:'SEO Overview', performance:'Performance', domains:'Domains',
    ssl:'SSL Certificates', plugins:'Plugins', themes:'Themes',
    wordpress:'WordPress', uptime:'Uptime', security:'Security',
    audit:'Site Audit', alerts:'Alerts', events:'Website Events',
    'ai-assistant':'AI Assistant', 'ai-reports':'AI Reports',
  };
  if (param && page === 'websites') {
    const w = websites.find(w => w.id === parseInt(param));
    ctxLabel.textContent = w ? w.name : 'Website Detail';
    AppState.currentWebsiteId = parseInt(param);
  } else {
    ctxLabel.textContent = labels[page] || page;
  }
}

// ─── SIDEBAR TOGGLE ──────────────────────────────────────────
function initSidebarToggle() {
  const btn = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  if (!btn || !sidebar) return;
  btn.addEventListener('click', () => {
    AppState.sidebarCollapsed = !AppState.sidebarCollapsed;
    sidebar.classList.toggle('collapsed', AppState.sidebarCollapsed);
  });
}

// ─── DATE DISPLAY ────────────────────────────────────────────
function initDate() {
  const el = document.getElementById('current-date');
  if (!el) return;
  el.textContent = new Date('2026-09-23').toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric' });
}

// ─── NOTIFICATIONS ───────────────────────────────────────────
function initNotifications() {
  const btn = document.getElementById('notif-btn');
  const panel = document.getElementById('notif-panel');
  const list = document.getElementById('notif-list');
  if (!btn || !panel) return;

  // Populate notifications from alerts
  const unack = alerts.filter(a => !a.acknowledged).slice(0, 10);
  const badge = document.getElementById('notif-badge');
  if (badge) badge.textContent = unack.length;

  const severityEmoji = { critical:'🔴', warning:'🟠', info:'🔵' };
  const severityBg    = { critical:'var(--danger-dim)', warning:'var(--warning-dim)', info:'var(--primary-dim)' };

  list.innerHTML = unack.map(a => `
    <div class="notif-item unread" data-alert="${a.id}">
      <div class="notif-icon" style="background:${severityBg[a.severity] || severityBg.info}">
        ${severityEmoji[a.severity] || '🔵'}
      </div>
      <div class="notif-text">
        <div class="notif-msg"><strong>${websites.find(w=>w.id===a.websiteId)?.name || ''}</strong> — ${a.title}</div>
        <div class="notif-time">${formatTimeAgo(a.time)}</div>
      </div>
    </div>
  `).join('');

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !btn.contains(e.target)) {
      panel.classList.remove('open');
    }
  });
  document.getElementById('mark-all-read')?.addEventListener('click', () => {
    list.querySelectorAll('.notif-item').forEach(i => i.classList.remove('unread'));
    if (badge) badge.textContent = '0';
  });
}

// ─── GLOBAL SEARCH ───────────────────────────────────────────
function initGlobalSearch() {
  const input = document.getElementById('global-search');
  const results = document.getElementById('search-results');
  if (!input || !results) return;

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    if (q.length < 2) { results.classList.remove('visible'); return; }

    const matches = [];
    websites.forEach(w => {
      if (w.name.toLowerCase().includes(q) || w.client.toLowerCase().includes(q)) {
        matches.push({ type:'website', label:w.name, sub:w.client, action:`#websites/${w.id}`, status:w.status });
      }
    });
    const pages = ['Dashboard','Analytics','SEO','Performance','Site Audit','Broken Links','Security','Uptime','Domains','SSL Certificates','Plugins','Themes','WordPress','Alerts'];
    pages.forEach(p => {
      if (p.toLowerCase().includes(q)) {
        matches.push({ type:'page', label:p, sub:'Navigate', action:`#${p.toLowerCase().replace(' ','-').replace(' ','').replace('certificates','').replace('audit','audit').replace(' ','').toLowerCase()}` });
      }
    });

    if (!matches.length) { results.classList.remove('visible'); return; }

    results.innerHTML = matches.slice(0,8).map(m => `
      <div class="search-result-item" onclick="window.location.hash='${m.action.slice(1)}'" style="cursor:pointer">
        <div style="width:28px;height:28px;border-radius:6px;background:var(--primary-dim);display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--primary);font-weight:700;flex-shrink:0">
          ${m.type==='website' ? m.label[0].toUpperCase() : '📄'}
        </div>
        <div>
          <div style="font-size:13px;font-weight:600;color:var(--text)">${m.label}</div>
          <div style="font-size:11px;color:var(--text-muted)">${m.sub}</div>
        </div>
        ${m.status ? `<span class="badge badge-${m.status}" style="margin-left:auto">${m.status}</span>` : ''}
      </div>
    `).join('');
    results.classList.add('visible');
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target)) results.classList.remove('visible');
  });
}

// ─── MODAL ───────────────────────────────────────────────────
export function openModal(title, body, footer='') {
  document.getElementById('modal-title').innerHTML = title;
  document.getElementById('modal-body').innerHTML = body;
  document.getElementById('modal-footer').innerHTML = footer;
  document.getElementById('modal-overlay').classList.add('open');
  document.getElementById('modal-overlay').setAttribute('aria-hidden','false');
}
export function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.getElementById('modal-overlay').setAttribute('aria-hidden','true');
}

// ─── TOAST ───────────────────────────────────────────────────
export function showToast(message, type='info', duration=3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success:'✅', warning:'⚠️', error:'🔴', info:'ℹ️' };
  toast.innerHTML = `<span>${icons[type]||'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toast-out 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ─── DAILY BRIEF ─────────────────────────────────────────────
function initDailyBrief() {
  document.getElementById('daily-brief-btn')?.addEventListener('click', () => {
    const s = getDashboardSummary();
    openModal('✦ AI Daily Brief — ' + new Date('2026-09-23').toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}), `
      <div style="display:flex;flex-direction:column;gap:12px">
        <div style="background:var(--bg-elevated);border-radius:var(--radius);padding:16px;border:1px solid var(--border)">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:var(--text-dim);margin-bottom:10px">Website Status</div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;text-align:center">
            <div><div style="font-size:22px;font-weight:800;color:var(--text)">${s.total}</div><div style="font-size:10px;color:var(--text-muted)">Monitored</div></div>
            <div><div style="font-size:22px;font-weight:800;color:var(--success)">${s.healthy}</div><div style="font-size:10px;color:var(--text-muted)">Healthy</div></div>
            <div><div style="font-size:22px;font-weight:800;color:var(--warning)">${s.issues}</div><div style="font-size:10px;color:var(--text-muted)">Attention</div></div>
            <div><div style="font-size:22px;font-weight:800;color:var(--danger)">${s.critical}</div><div style="font-size:10px;color:var(--text-muted)">Critical</div></div>
          </div>
        </div>
        <div style="font-size:13px;font-weight:700;color:var(--text);margin-top:4px">⚡ Today's Key Attention Areas</div>
        ${[
          { dot:'🔴', msg:`<strong>${s.critical} websites</strong> have critical issues requiring immediate attention.` },
          { dot:'🟠', msg:`<strong>${s.expiringDomains} domains</strong> expire within 30 days. <strong>${s.expiringDomains > 0 ? '2 have auto-renew OFF' : ''}</strong>` },
          { dot:'🟠', msg:`<strong>${s.expiringSSL + 2} SSL certificates</strong> expire within 30 days.` },
          { dot:'🟠', msg:`<strong>${s.expiringPlugins + s.expiredPlugins} plugin records</strong> require attention (expired or expiring).` },
          { dot:'🔴', msg:`<strong>3 backup failures</strong> detected — northstar.com, globalexports.com, constructionfirst.com.` },
          { dot:'🔵', msg:`<strong>${s.outdatedWP} WordPress installations</strong> have updates available.` },
        ].map(i=>`<div style="display:flex;gap:10px;padding:8px 12px;background:var(--bg-card-2);border-radius:var(--radius-sm);border:1px solid var(--border);font-size:12px;line-height:1.5"><span>${i.dot}</span><span>${i.msg}</span></div>`).join('')}
        <div style="font-size:11px;color:var(--text-dim);text-align:center;margin-top:4px">Generated by Analytix AI · Based on portal data · ${new Date().toLocaleTimeString()}</div>
      </div>
    `, `<button class="btn btn-primary" onclick="closeModal();window.location.hash='alerts'">Review All Alerts</button><button class="btn btn-secondary" onclick="closeModal()">Close</button>`);
    window.closeModal = closeModal;
  });
}

// ─── ICON HELPERS ────────────────────────────────────────────
function icon(d) { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${d}</svg>`; }
function iconGrid()      { return icon('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>'); }
function iconGlobe()     { return icon('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'); }
function iconGlobeSmall(){ return iconGlobe(); }
function iconBarChart()  { return icon('<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>'); }
function iconSearch()    { return icon('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>'); }
function iconZap()       { return icon('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'); }
function iconTarget()    { return icon('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>'); }
function iconFunnel()    { return icon('<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>'); }
function iconClipboard() { return icon('<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>'); }
function iconLink()      { return icon('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'); }
function iconShield()    { return icon('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'); }
function iconActivity()  { return icon('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'); }
function iconInbox()     { return icon('<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>'); }
function iconDatabase()  { return icon('<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>'); }
function iconLock()      { return icon('<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'); }
function iconServer()    { return icon('<rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>'); }
function iconPuzzle()    { return icon('<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>'); }
function iconLayout()    { return icon('<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>'); }
function iconWP()        { return icon('<circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>'); }
function iconBell()      { return icon('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>'); }
function iconClock()     { return icon('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'); }
function iconStar()      { return icon('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'); }
function iconFileAI()    { return icon('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>'); }
function iconFile()      { return iconFileAI(); }
function iconPieChart()  { return icon('<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>'); }
function iconPlugin()    { return icon('<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>'); }
function iconSettings()  { return icon('<circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 0 0 4.93 19.07M4.93 4.93a10 10 0 0 0 14.14 14.14"/>'); }

// ─── INIT ────────────────────────────────────────────────────
async function init() {
  await loadBackendWebsites();
  buildNav();
  initSidebarToggle();
  initDate();
  initNotifications();
  initGlobalSearch();
  initDailyBrief();
  initAIPanel();

  window.addEventListener('hashchange', route);
  route();

  // Sidebar search
  document.getElementById('sidebar-search-input')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.nav-item').forEach(item => {
      const text = item.querySelector('.nav-item-text')?.textContent.toLowerCase() || '';
      item.style.display = !q || text.includes(q) ? '' : 'none';
    });
  });

  // Modal close
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') closeModal();
  });

  window.closeModal = closeModal;
  window.showToast = showToast;
  window.AppState = AppState;
  window.navigate = (hash) => { window.location.hash = hash; };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

