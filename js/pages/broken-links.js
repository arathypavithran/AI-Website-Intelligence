// ════════════════════════════════════════════════════════════════
//  BROKEN LINKS PAGE
// ════════════════════════════════════════════════════════════════
import { brokenLinks, websites } from '../data.js';

export function renderBrokenLinks(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-heading">Broken Links Audit (404 / 500 Monitoring)</h1>
        <p class="page-desc">Automated detection of broken internal, external, and image links across all managed websites</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="showToast('Re-scanning for broken links...','info')">🔗 Scan All Links</button>
      </div>
    </div>

    <!-- SUMMARY -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-title">Total Broken Links</div>
        <div class="kpi-value" style="color:var(--danger)">17</div>
        <div class="kpi-trend trend-down">Across 6 websites</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">404 Not Found</div>
        <div class="kpi-value">12</div>
        <div class="kpi-trend trend-neutral">Internal & external URLs</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">500 Internal Error</div>
        <div class="kpi-value" style="color:var(--danger)">3</div>
        <div class="kpi-trend trend-down">Server script failures</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Timeout Errors</div>
        <div class="kpi-value">2</div>
        <div class="kpi-trend trend-neutral">&gt; 10s response time</div>
      </div>
    </div>

    <!-- BROKEN LINKS TABLE -->
    <div class="card" style="margin-top:20px;">
      <div class="card-header">
        <div class="card-title">Detected Broken Links</div>
      </div>
      <div class="card-body p-0">
        <table class="data-table">
          <thead>
            <tr>
              <th>Status Code</th>
              <th>Website</th>
              <th>Broken Target URL</th>
              <th>Found On Page</th>
              <th>Link Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${brokenLinks.map(bl => {
              const w = websites.find(x => x.id === bl.websiteId);
              const badgeClass = bl.statusCode === 404 ? 'badge-warning' : 'badge-danger';
              return `
                <tr>
                  <td><span class="badge ${badgeClass}">${bl.statusCode}</span></td>
                  <td><strong>${w ? w.name : 'Unknown'}</strong></td>
                  <td style="font-family:monospace;font-size:12px;color:var(--danger)">${bl.targetUrl}</td>
                  <td style="font-family:monospace;font-size:12px;color:var(--text-dim)">${bl.sourcePage}</td>
                  <td><span class="badge badge-secondary">${bl.linkType}</span></td>
                  <td><button class="btn btn-secondary btn-sm" onclick="showToast('Fix redirect modal opened','info')">Fix / Redirect</button></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
