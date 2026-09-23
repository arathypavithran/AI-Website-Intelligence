// ════════════════════════════════════════════════════════════════
//  HOSTING MANAGEMENT PAGE
// ════════════════════════════════════════════════════════════════
import { hosting, websites } from '../data.js';

export function renderHosting(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-heading">Hosting Infrastructure & Server Audit</h1>
        <p class="page-desc">Server resource consumption, PHP versions, database performance, disk storage, and host provider details</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="showToast('Querying cPanel/Plesk API metrics...','info')">📊 Refresh Host Metrics</button>
      </div>
    </div>

    <!-- SUMMARY KPI -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-title">Active Hosting Providers</div>
        <div class="kpi-value">4 Providers</div>
        <div class="kpi-trend trend-neutral">AWS, SiteGround, Kinsta, Cloudways</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Avg Disk Usage</div>
        <div class="kpi-value" style="color:var(--warning)">68.4%</div>
        <div class="kpi-trend trend-neutral">2 accounts near 85% limit</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Outdated PHP Versions</div>
        <div class="kpi-value" style="color:var(--danger)">2 Accounts</div>
        <div class="kpi-trend trend-down">PHP 7.4 detected (EOL)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Server Uptime</div>
        <div class="kpi-value" style="color:var(--success)">99.94%</div>
        <div class="kpi-trend trend-up">High availability</div>
      </div>
    </div>

    <!-- HOSTING TABLE -->
    <div class="card" style="margin-top:20px;">
      <div class="card-header">
        <div class="card-title">Hosting Account Infrastructure</div>
      </div>
      <div class="card-body p-0">
        <table class="data-table">
          <thead>
            <tr>
              <th>Provider / Plan</th>
              <th>Server Location</th>
              <th>Server IP</th>
              <th>Storage</th>
              <th>Bandwidth</th>
              <th>Backups</th>
              <th>Renews</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${hosting.map(h => {
              const hostedSites = websites.filter(w => w.hostingId === h.id);
              const statusBadge = h.status === 'active' ? 'badge-success' : h.status === 'attention' ? 'badge-warning' : 'badge-danger';
              return `
                <tr>
                  <td>
                    <strong>${h.name}</strong>
                    <div style="font-size:11px;color:var(--text-dim)">${h.provider}</div>
                    <div style="font-size:11px;color:var(--text-dim);margin-top:3px">${hostedSites.map(s=>s.name).join(', ')}</div>
                  </td>
                  <td>${h.server}</td>
                  <td style="font-family:monospace;font-size:12px">${h.ip}</td>
                  <td>${h.storage}</td>
                  <td>${h.bandwidth}</td>
                  <td><span class="badge ${h.backup ? 'badge-success' : 'badge-danger'}">${h.backup ? 'Yes' : 'No'}</span></td>
                  <td>${h.renewDate}</td>
                  <td><span class="badge ${statusBadge}">${h.status.toUpperCase()}</span></td>
                  <td><button class="btn btn-secondary btn-sm" onclick="showToast('Opening hosting control panel...','info')">cPanel SSO</button></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

          </tbody>
        </table>
      </div>
    </div>
  `;
}
