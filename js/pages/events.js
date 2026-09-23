// ════════════════════════════════════════════════════════════════
//  WEBSITE SYSTEM EVENTS PAGE
// ════════════════════════════════════════════════════════════════
import { websiteEvents, websites, formatTimeAgo } from '../data.js';

export function renderEvents(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-heading">Website & System Event Audit Log</h1>
        <p class="page-desc">Automated system events: SSL renewals, cron jobs, backups, performance drops, security scans, uptime pings</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="showToast('Event audit stream synced...','info')">↻ Refresh Stream</button>
      </div>
    </div>

    <!-- EVENTS LIST TABLE -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Real-Time System Event Feed</div>
      </div>
      <div class="card-body p-0">
        <table class="data-table">
          <thead>
            <tr>
              <th>Event Type</th>
              <th>Website Target</th>
              <th>Description</th>
              <th>Timestamp</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            ${websiteEvents.map(e => {
              const w = websites.find(x => x.id === e.websiteId);
              const isWarning = e.type === 'warning' || e.type === 'error';
              return `
                <tr>
                  <td><span class="badge ${isWarning ? 'badge-warning' : 'badge-info'}">${e.type.toUpperCase()}</span></td>
                  <td><strong>${w ? w.name : 'System Core'}</strong></td>
                  <td>${e.title || e.description || e.message}</td>
                  <td>${formatTimeAgo(e.time)}</td>
                  <td><span class="badge badge-secondary">${e.category || 'SYSTEM'}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
