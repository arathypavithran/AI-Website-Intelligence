// ════════════════════════════════════════════════════════════════
//  WORDPRESS THEMES PAGE
// ════════════════════════════════════════════════════════════════
import { themes, websites, getDaysColor } from '../data.js';

export function renderThemes(container) {
  const now = new Date('2026-09-23T09:20:00+05:30');

  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-heading">WordPress Theme Inventory</h1>
        <p class="page-desc">Active themes, child themes, framework versions, license tracking and update checks across WordPress sites</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="showToast('Checking theme update repositories...','info')">↻ Check Theme Updates</button>
      </div>
    </div>

    <!-- SUMMARY KPI -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-title">Total Themes Tracked</div>
        <div class="kpi-value">${themes.length}</div>
        <div class="kpi-trend trend-neutral">Across 12 WP sites</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Updates Available</div>
        <div class="kpi-value" style="color:var(--warning)">${themes.filter(t => t.updateAvailable).length}</div>
        <div class="kpi-trend trend-down">New versions ready</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Expired Licenses</div>
        <div class="kpi-value" style="color:var(--danger)">${themes.filter(t => t.status === 'expired').length}</div>
        <div class="kpi-trend trend-down">Renewal required</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Child Themes Active</div>
        <div class="kpi-value" style="color:var(--success)">${themes.filter(t => t.childTheme).length}</div>
        <div class="kpi-trend trend-up">Best practice followed</div>
      </div>
    </div>

    <!-- THEMES TABLE -->
    <div class="card" style="margin-top:20px;">
      <div class="card-header">
        <div class="card-title">Active Themes & Child Themes</div>
      </div>
      <div class="card-body p-0">
        <table class="data-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Website</th>
              <th>Active Theme</th>
              <th>Installed Ver.</th>
              <th>Latest Ver.</th>
              <th>Child Theme</th>
              <th>License Expiry</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${themes.map(t => {
              const w = websites.find(x => x.id === t.websiteId);
              const statusBadgeClass = t.status === 'ok' ? 'badge-success' : t.status === 'expired' ? 'badge-danger' : t.status === 'expiring' ? 'badge-warning' : 'badge-info';
              let daysLeftStr = '—';
              let daysColorClass = '';
              if (t.licenseExpiry) {
                const expDate = new Date(t.licenseExpiry);
                const daysLeft = Math.ceil((expDate - now) / 86400000);
                if (daysLeft > 0) {
                  daysLeftStr = `${daysLeft} days`;
                  daysColorClass = getDaysColor(daysLeft);
                } else {
                  daysLeftStr = `Expired ${Math.abs(daysLeft)}d ago`;
                  daysColorClass = 'days-critical';
                }
              }
              return `
                <tr>
                  <td><span class="badge ${statusBadgeClass}">${t.status.toUpperCase()}</span></td>
                  <td><strong>${w ? w.name : 'Unknown'}</strong></td>
                  <td><strong>${t.name}</strong></td>
                  <td>${t.version}</td>
                  <td><span class="badge ${t.updateAvailable ? 'badge-warning' : 'badge-secondary'}">${t.latestVersion}</span></td>
                  <td><span class="badge ${t.childTheme ? 'badge-success' : 'badge-warning'}">${t.childTheme ? 'YES' : 'NO'}</span></td>
                  <td><span class="${daysColorClass}">${daysLeftStr}</span></td>
                  <td><button class="btn btn-secondary btn-sm" onclick="showToast('Updating theme...','info')">Update</button></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
