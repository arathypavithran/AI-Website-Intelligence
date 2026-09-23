// ════════════════════════════════════════════════════════════════
//  DOMAINS MANAGEMENT PAGE
// ════════════════════════════════════════════════════════════════
import { domains, websites, getDaysColor } from '../data.js';

export function renderDomains(container) {
  const now = new Date('2026-09-23T09:20:00+05:30');
  const critical = domains.filter(d => d.status === 'critical').length;
  const warning = domains.filter(d => d.status === 'warning').length;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-heading">Domain Name Portfolio & Expiry Audit</h1>
        <p class="page-desc">Registrar monitoring, WHOIS records, auto-renewal status, and domain expiration alerts</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="showToast('Querying registrar WHOIS endpoints...','info')">↻ Refresh WHOIS Data</button>
      </div>
    </div>

    <!-- DOMAIN SUMMARY -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-title">Total Monitored Domains</div>
        <div class="kpi-value">${domains.length}</div>
        <div class="kpi-trend trend-neutral">Across ${new Set(domains.map(d=>d.registrar)).size} Registrars</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Critical — Expires &lt; 7 Days</div>
        <div class="kpi-value" style="color:var(--danger)">${critical}</div>
        <div class="kpi-trend trend-down">Immediate action required</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Warning — Expires &lt; 30 Days</div>
        <div class="kpi-value" style="color:var(--warning)">${warning}</div>
        <div class="kpi-trend trend-neutral">Renewal recommended</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Auto-Renew Disabled</div>
        <div class="kpi-value" style="color:var(--danger)">${domains.filter(d=>!d.autoRenew).length}</div>
        <div class="kpi-trend trend-down">Risk of domain loss</div>
      </div>
    </div>

    <!-- DOMAINS TABLE -->
    <div class="card" style="margin-top:20px;">
      <div class="card-header">
        <div class="card-title">Domain Registration Records</div>
      </div>
      <div class="card-body p-0">
        <table class="data-table">
          <thead>
            <tr>
              <th>Domain Name</th>
              <th>Website Client</th>
              <th>Registrar</th>
              <th>Expires Date</th>
              <th>Days Left</th>
              <th>Auto-Renew</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${domains.map(d => {
              const w = websites.find(x => x.id === d.websiteId);
              const expDate = new Date(d.expires);
              const daysLeft = Math.ceil((expDate - now) / 86400000);
              const daysColorClass = getDaysColor(daysLeft);
              const statusBadgeClass = d.status === 'critical' ? 'badge-danger' : d.status === 'warning' ? 'badge-warning' : 'badge-success';
              return `
                <tr>
                  <td><strong>${d.domain}</strong></td>
                  <td>${w ? w.client : '—'}</td>
                  <td><span class="badge badge-secondary">${d.registrar}</span></td>
                  <td>${d.expires}</td>
                  <td><span class="${daysColorClass}" style="font-weight:600">${daysLeft} days</span></td>
                  <td>
                    <span class="badge ${d.autoRenew ? 'badge-success' : 'badge-danger'}">
                      ${d.autoRenew ? 'ENABLED' : 'OFF'}
                    </span>
                  </td>
                  <td><span class="badge ${statusBadgeClass}">${d.status.toUpperCase()}</span></td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="showToast('Opening registrar portal...','info')">Manage</button>
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
