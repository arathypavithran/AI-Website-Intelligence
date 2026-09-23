// ════════════════════════════════════════════════════════════════
//  ALERTS MONITORING PAGE
// ════════════════════════════════════════════════════════════════
import { alerts, websites, formatTimeAgo } from '../data.js';

export function renderAlerts(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-heading">Alert Center & Incident Notifications</h1>
        <p class="page-desc">Real-time web event notifications, severity filtering, resolution workflow, and dispatch logs</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="showToast('All active alerts acknowledged!','success')">✓ Acknowledge All Alerts</button>
      </div>
    </div>

    <!-- ALERTS TABLE -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">System & Website Security Alerts</div>
      </div>
      <div class="card-body p-0">
        <table class="data-table">
          <thead>
            <tr>
              <th>Severity</th>
              <th>Website</th>
              <th>Alert Message</th>
              <th>Triggered Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${alerts.map(a => {
              const w = websites.find(x => x.id === a.websiteId);
              const badgeClass = a.severity === 'critical' ? 'badge-danger' : a.severity === 'high' ? 'badge-warning' : 'badge-info';
              return `
                <tr>
                  <td><span class="badge ${badgeClass}">${a.severity.toUpperCase()}</span></td>
                  <td><strong>${w ? w.name : 'System Wide'}</strong></td>
                  <td>${a.message}</td>
                  <td>${formatTimeAgo(a.time)}</td>
                  <td><span class="badge ${a.acknowledged ? 'badge-secondary' : 'badge-danger'}">${a.acknowledged ? 'ACKNOWLEDGED' : 'UNREAD'}</span></td>
                  <td><button class="btn btn-secondary btn-sm" onclick="showToast('Alert status updated','info')">Acknowledge</button></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
