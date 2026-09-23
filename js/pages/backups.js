// ════════════════════════════════════════════════════════════════
//  BACKUPS MANAGEMENT PAGE
// ════════════════════════════════════════════════════════════════
import { backups, websites, formatTimeAgo } from '../data.js';

export function renderBackups(container) {
  const failed = backups.filter(b => b.status === 'failed').length;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-heading">Automated Backups & Disaster Recovery</h1>
        <p class="page-desc">Daily cloud backups, database snapshots, storage utilization, and integrity validation</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="showToast('Triggering full fleet backup snapshot...','success')">💾 Backup All Sites</button>
      </div>
    </div>

    <!-- SUMMARY -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-title">Total Backup Jobs Tracked</div>
        <div class="kpi-value">${backups.length}</div>
        <div class="kpi-trend trend-up">Cloud Storage Providers</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Successful Backups</div>
        <div class="kpi-value" style="color:var(--success)">${backups.filter(b=>b.status==='success').length} / ${backups.length}</div>
        <div class="kpi-trend trend-up">Completed</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Backup Failures</div>
        <div class="kpi-value" style="color:var(--danger)">${failed}</div>
        <div class="kpi-trend trend-down">Disk space / connection error</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Total Data Protected</div>
        <div class="kpi-value">21.7 GB</div>
        <div class="kpi-trend trend-up">Across 15 websites</div>
      </div>
    </div>

    <!-- BACKUPS TABLE -->
    <div class="card" style="margin-top:20px;">
      <div class="card-header">
        <div class="card-title">Recent Backup Jobs</div>
      </div>
      <div class="card-body p-0">
        <table class="data-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Website</th>
              <th>Backup Provider</th>
              <th>Last Backup</th>
              <th>Backup Size</th>
              <th>Restore Tested</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${backups.map(b => {
              const w = websites.find(x => x.id === b.websiteId);
              const isSuccess = b.status === 'success';
              return `
                <tr>
                  <td><span class="badge ${isSuccess ? 'badge-success' : 'badge-danger'}">${b.status.toUpperCase()}</span></td>
                  <td><strong>${w ? w.name : 'Unknown'}</strong></td>
                  <td><span class="badge badge-secondary">${b.provider}</span></td>
                  <td>${formatTimeAgo(b.lastBackup)}</td>
                  <td>${b.size}</td>
                  <td>${formatTimeAgo(b.restoreTested)}</td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="showToast('Restoring backup snapshot...','info')">Restore</button>
                    <button class="btn btn-primary btn-sm" onclick="showToast('Downloading backup archive...','info')">Download</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
