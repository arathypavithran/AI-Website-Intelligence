// ════════════════════════════════════════════════════════════════
//  TECHNICAL AUDITING PAGE
// ════════════════════════════════════════════════════════════════
import { auditIssues, websites } from '../data.js';

export function renderAudit(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-heading">Technical Site Audit & Health</h1>
        <p class="page-desc">Automated crawler results, HTML validation, accessibility (a11y), broken code detection, and crawl status</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="showToast('Triggered full site crawl across all 15 websites...','success')">🚀 Run Full Audit Crawl</button>
      </div>
    </div>

    <!-- AUDIT SUMMARY -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-title">Total Active Audit Issues</div>
        <div class="kpi-value" style="color:var(--warning)">38</div>
        <div class="kpi-trend trend-neutral">Across 15 sites</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Critical Severity</div>
        <div class="kpi-value" style="color:var(--danger)">7</div>
        <div class="kpi-trend trend-down">Action required</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Warning Level</div>
        <div class="kpi-value" style="color:var(--warning)">19</div>
        <div class="kpi-trend trend-neutral">Optimization suggested</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Crawl Health Index</div>
        <div class="kpi-value" style="color:var(--success)">94.2%</div>
        <div class="kpi-trend trend-up">All sitemaps valid</div>
      </div>
    </div>

    <!-- AUDIT ISSUES TABLE -->
    <div class="card" style="margin-top:20px;">
      <div class="card-header">
        <div class="card-title">Technical Audit Findings</div>
      </div>
      <div class="card-body p-0">
        <table class="data-table">
          <thead>
            <tr>
              <th>Severity</th>
              <th>Website</th>
              <th>Category</th>
              <th>Issue Title</th>
              <th>Affected Component</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${auditIssues.map(i => {
              const w = websites.find(x => x.id === i.websiteId);
              const badgeClass = i.severity === 'high' ? 'badge-danger' : i.severity === 'medium' ? 'badge-warning' : 'badge-info';
              return `
                <tr>
                  <td><span class="badge ${badgeClass}">${i.severity.toUpperCase()}</span></td>
                  <td><strong>${w ? w.name : 'System Wide'}</strong></td>
                  <td><span class="badge badge-secondary">${i.category.toUpperCase()}</span></td>
                  <td><strong>${i.title}</strong></td>
                  <td style="font-family:monospace;font-size:12px">${i.component}</td>
                  <td><button class="btn btn-secondary btn-sm" onclick="showToast('Resolving audit issue...','info')">Fix Issue</button></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
