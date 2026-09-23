// ════════════════════════════════════════════════════════════════
//  WORDPRESS PLUGINS PAGE
// ════════════════════════════════════════════════════════════════
import { plugins, websites, getDaysColor } from '../data.js';

export function renderPlugins(container) {
  const now = new Date('2026-09-23T09:20:00+05:30');

  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-heading">WordPress Plugin Inventory & Vulnerability Tracking</h1>
        <p class="page-desc">Plugin version updates, active vulnerabilities, pro license expiration, and compatibility audits</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="showToast('Scanning WP-Org repository for plugin updates...','info')">↻ Check Plugin Updates</button>
      </div>
    </div>

    <!-- SUMMARY KPI -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-title">Total Active Plugins</div>
        <div class="kpi-value">142</div>
        <div class="kpi-trend trend-neutral">Across 12 WP websites</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Outdated Plugins</div>
        <div class="kpi-value" style="color:var(--warning)">18</div>
        <div class="kpi-trend trend-down">Updates available</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Vulnerable Plugins</div>
        <div class="kpi-value" style="color:var(--danger)">2</div>
        <div class="kpi-trend trend-down">High severity CVEs</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Expiring Pro Licenses</div>
        <div class="kpi-value" style="color:var(--warning)">5</div>
        <div class="kpi-trend trend-down">Expires &lt; 30 days</div>
      </div>
    </div>

    <!-- PLUGINS TABLE -->
    <div class="card" style="margin-top:20px;">
      <div class="card-header">
        <div class="card-title">WordPress Plugin Health & License Status</div>
      </div>
      <div class="card-body p-0">
        <table class="data-table">
          <thead>
            <tr>
              <th>Plugin Name</th>
              <th>Website</th>
              <th>Installed Ver.</th>
              <th>Latest Ver.</th>
              <th>Status</th>
              <th>Pro License Expiry</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${plugins.map(p => {
              const w = websites.find(x => x.id === p.websiteId);
              const isOutdated = p.updateAvailable;
              let daysLeftStr = 'N/A (Free)';
              let daysColorClass = '';
              if (p.licenseExpiry) {
                const expDate = new Date(p.licenseExpiry);
                const daysLeft = Math.ceil((expDate - now) / 86400000);
                if (daysLeft > 0) {
                  daysLeftStr = `${daysLeft} days`;
                  daysColorClass = getDaysColor(daysLeft);
                } else {
                  daysLeftStr = `Expired ${Math.abs(daysLeft)}d ago`;
                  daysColorClass = 'days-critical';
                }
              }
              const statusBadge = p.status === 'security' ? 'badge-danger' : p.status === 'expired' ? 'badge-danger' : p.status === 'expiring' ? 'badge-warning' : p.status === 'update' ? 'badge-warning' : 'badge-success';
              return `
                <tr>
                  <td><strong>${p.name}</strong></td>
                  <td>${w ? w.name : 'Unknown'}</td>
                  <td>${p.version}</td>
                  <td><span class="badge ${isOutdated ? 'badge-warning' : 'badge-secondary'}">${p.latestVersion}</span></td>
                  <td>
                    <span class="badge ${statusBadge}">
                      ${p.status.toUpperCase()}
                    </span>
                  </td>
                  <td><span class="${daysColorClass}">${daysLeftStr}</span></td>
                  <td><button class="btn btn-secondary btn-sm" onclick="showToast('Updating ${p.name}...','info')">Update</button></td>
                </tr>
              `;
            }).join('')}

          </tbody>
        </table>
      </div>
    </div>
  `;
}
