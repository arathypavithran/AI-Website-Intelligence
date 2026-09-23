// ════════════════════════════════════════════════════════════════
//  WORDPRESS MANAGEMENT PAGE
// ════════════════════════════════════════════════════════════════
import { wordpress, websites, themes } from '../data.js';

export function renderWordPress(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-heading">WordPress Core & Instance Intelligence</h1>
        <p class="page-desc">Core versions, auto-update policies, PHP runtime, database size, and security issue tracking</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="showToast('Executing WordPress core version check...','info')">↻ Check Core Updates</button>
      </div>
    </div>

    <!-- SUMMARY KPI -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-title">Total WordPress Sites</div>
        <div class="kpi-value">${wordpress.length} Sites</div>
        <div class="kpi-trend trend-neutral">80% of monitored fleet</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Core Updates Available</div>
        <div class="kpi-value" style="color:var(--warning)">${wordpress.filter(w => w.wpVersion !== w.latestWP).length} Sites</div>
        <div class="kpi-trend trend-down">WP 6.6.1 available</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Security Issues Detected</div>
        <div class="kpi-value" style="color:var(--danger)">${wordpress.filter(w => w.securityIssues > 0).length} Sites</div>
        <div class="kpi-trend trend-down">Require immediate patching</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Outdated PHP Versions</div>
        <div class="kpi-value" style="color:var(--warning)">${wordpress.filter(w => w.phpVersion.startsWith('7')).length} Sites</div>
        <div class="kpi-trend trend-down">PHP 7.x detected (EOL)</div>
      </div>
    </div>

    <!-- WORDPRESS TABLE -->
    <div class="card" style="margin-top:20px;">
      <div class="card-header">
        <div class="card-title">WordPress Instances & Core Health</div>
      </div>
      <div class="card-body p-0">
        <table class="data-table">
          <thead>
            <tr>
              <th>Website</th>
              <th>WP Version</th>
              <th>Latest Core</th>
              <th>PHP Version</th>
              <th>DB Size</th>
              <th>Security Issues</th>
              <th>Pending Updates</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${wordpress.map(wp => {
              const w = websites.find(x => x.id === wp.websiteId);
              const isOutdated = wp.wpVersion !== wp.latestWP;
              const phpBadgeClass = wp.phpVersion.startsWith('7') ? 'badge-danger' : wp.phpVersion.startsWith('8.0') ? 'badge-warning' : 'badge-success';
              return `
                <tr>
                  <td><strong>${w ? w.name : 'Unknown'}</strong></td>
                  <td>${wp.wpVersion}</td>
                  <td><span class="badge ${isOutdated ? 'badge-warning' : 'badge-success'}">${wp.latestWP}</span></td>
                  <td><span class="badge ${phpBadgeClass}">PHP ${wp.phpVersion}</span></td>
                  <td>${wp.dbSize}</td>
                  <td>
                    <span class="badge ${wp.securityIssues > 0 ? 'badge-danger' : 'badge-success'}">
                      ${wp.securityIssues > 0 ? wp.securityIssues + ' CVEs' : 'Clean'}
                    </span>
                  </td>
                  <td>${wp.updatesAvailable} pending</td>
                  <td><button class="btn btn-secondary btn-sm" onclick="showToast('Initiating core WordPress update...','info')">Update Core</button></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
