// ════════════════════════════════════════════════════════════════
//  REPORTS PAGE
// ════════════════════════════════════════════════════════════════
export function renderReports(container, mode = 'standard') {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-heading">${mode === 'executive' ? 'Executive Stakeholder Reports' : 'Scheduled Reports & Exports'}</h1>
        <p class="page-desc">Automated PDF/CSV reporting, custom metric exports, client delivery schedules, and whitelist branding</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="showToast('Exporting portal telemetry report CSV...','success')">📥 Export CSV Data</button>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">Configured Scheduled Reports</div>
      </div>
      <div class="card-body p-0">
        <table class="data-table">
          <thead>
            <tr>
              <th>Report Title</th>
              <th>Recipient</th>
              <th>Frequency</th>
              <th>Format</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Weekly Fleet Health Summary</strong></td>
              <td>stakeholders@analytix.sa</td>
              <td>Weekly (Mondays)</td>
              <td><span class="badge badge-info">PDF Report</span></td>
              <td><span class="badge badge-success">ACTIVE</span></td>
              <td><button class="btn btn-secondary btn-sm" onclick="showToast('Report generated & sent','info')">Send Now</button></td>
            </tr>
            <tr>
              <td><strong>Monthly Technical SEO & Ranking Audit</strong></td>
              <td>seo-team@analytix.sa</td>
              <td>Monthly (1st)</td>
              <td><span class="badge badge-info">PDF + CSV</span></td>
              <td><span class="badge badge-success">ACTIVE</span></td>
              <td><button class="btn btn-secondary btn-sm" onclick="showToast('Report generated & sent','info')">Send Now</button></td>
            </tr>
            <tr>
              <td><strong>Domain & SSL Expiration Digest</strong></td>
              <td>sysadmin@analytix.sa</td>
              <td>Daily Digest</td>
              <td><span class="badge badge-info">Email Alert</span></td>
              <td><span class="badge badge-success">ACTIVE</span></td>
              <td><button class="btn btn-secondary btn-sm" onclick="showToast('Digest sent','info')">Send Now</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}
