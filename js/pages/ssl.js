// ════════════════════════════════════════════════════════════════
//  SSL CERTIFICATES MANAGEMENT PAGE
// ════════════════════════════════════════════════════════════════
import { sslCerts, websites, getDaysColor } from '../data.js';

export function renderSSL(container) {
  const now = new Date('2026-09-23T09:20:00+05:30');
  const critical = sslCerts.filter(s => s.status === 'critical').length;
  const warning = sslCerts.filter(s => s.status === 'warning').length;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-heading">SSL / TLS Certificate Monitoring</h1>
        <p class="page-desc">Certificate chain validation, issuer tracking, expiration alerts, and cipher suite strength checks</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="showToast('Re-verifying SSL certificates across 15 websites...','success')">🔒 Verify All SSL Certificates</button>
      </div>
    </div>

    <!-- SUMMARY KPI -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-title">Active SSL Certificates</div>
        <div class="kpi-value" style="color:var(--success)">${sslCerts.length} / ${sslCerts.length}</div>
        <div class="kpi-trend trend-up">All sites HTTPS secure</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Critical — Expires &lt; 7 Days</div>
        <div class="kpi-value" style="color:var(--danger)">${critical}</div>
        <div class="kpi-trend trend-down">Immediate renewal required</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Warning — Expires &lt; 30 Days</div>
        <div class="kpi-value" style="color:var(--warning)">${warning}</div>
        <div class="kpi-trend trend-neutral">Renewal recommended</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">TLS 1.3 Protocol</div>
        <div class="kpi-value" style="color:var(--success)">100%</div>
        <div class="kpi-trend trend-up">Modern ciphers enabled</div>
      </div>
    </div>

    <!-- SSL TABLE -->
    <div class="card" style="margin-top:20px;">
      <div class="card-header">
        <div class="card-title">SSL Certificate Details & Expiration Status</div>
      </div>
      <div class="card-body p-0">
        <table class="data-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Domain</th>
              <th>Issuer</th>
              <th>Certificate Type</th>
              <th>Issued Date</th>
              <th>Expiration Date</th>
              <th>Days Left</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${sslCerts.map(s => {
              const expDate = new Date(s.expires);
              const daysLeft = Math.ceil((expDate - now) / 86400000);
              const daysColorClass = getDaysColor(daysLeft);
              const statusBadgeClass = s.status === 'critical' ? 'badge-danger' : s.status === 'warning' ? 'badge-warning' : 'badge-success';
              return `
                <tr>
                  <td><span class="badge ${statusBadgeClass}">${s.status.toUpperCase()}</span></td>
                  <td><strong>${s.domain}</strong></td>
                  <td><span class="badge badge-secondary">${s.issuer}</span></td>
                  <td>${s.type}</td>
                  <td>${s.issued}</td>
                  <td>${s.expires}</td>
                  <td><span class="${daysColorClass}" style="font-weight:600">${daysLeft} days</span></td>
                  <td><button class="btn btn-secondary btn-sm" onclick="showToast('Initiating certificate renewal...','info')">Renew SSL</button></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
