// ════════════════════════════════════════════════════════════════
//  UPTIME MONITORING PAGE
// ════════════════════════════════════════════════════════════════
import { uptimeData, websites, formatTimeAgo } from '../data.js';

export function renderUptime(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-heading">Uptime & Latency Monitor</h1>
        <p class="page-desc">Real-time availability monitoring with 60-second interval pings across 5 global edge locations</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="showToast('Pinging all endpoints globally...','info')">⚡ Ping All Servers</button>
      </div>
    </div>

    <!-- SUMMARY KPI -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-title">Overall Fleet Uptime (30d)</div>
        <div class="kpi-value" style="color:var(--success)">99.82%</div>
        <div class="kpi-trend trend-up">Target SLA &gt; 99.9%</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Avg Global Response Time</div>
        <div class="kpi-value">148 ms</div>
        <div class="kpi-trend trend-up">Fast worldwide latency</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Total Incidents (30d)</div>
        <div class="kpi-value" style="color:var(--warning)">${uptimeData.reduce((a, u) => a + u.incidents.length, 0)}</div>
        <div class="kpi-trend trend-neutral">Total downtime incidents</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Monitored Endpoints</div>
        <div class="kpi-value">${uptimeData.length} Sites</div>
        <div class="kpi-trend trend-up">60s check frequency</div>
      </div>
    </div>

    <!-- UPTIME TABLE -->
    <div class="card" style="margin-top:20px;">
      <div class="card-header">
        <div class="card-title">Real-Time Endpoint Status & Latency</div>
      </div>
      <div class="card-body p-0">
        <table class="data-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Website Endpoint</th>
              <th>Uptime (30d)</th>
              <th>Avg Latency</th>
              <th>HTTP Status</th>
              <th>Last Incident</th>
              <th>Incidents (30d)</th>
            </tr>
          </thead>
          <tbody>
            ${uptimeData.map(u => {
              const w = websites.find(x => x.id === u.websiteId);
              if (!w) return '';
              const isUp = u.httpStatus === 200;
              return `
                <tr>
                  <td>
                    <span class="badge ${isUp ? 'badge-success' : 'badge-danger'}">
                      ${isUp ? '● ONLINE' : '▲ DOWN'}
                    </span>
                  </td>
                  <td>
                    <strong>${w.name}</strong>
                    <div style="font-size:11px;color:var(--text-dim);font-family:monospace">${w.url}</div>
                  </td>
                  <td><strong>${u.uptime}%</strong></td>
                  <td><strong>${u.responseTime}</strong> ms</td>
                  <td><span class="badge ${isUp ? 'badge-success' : 'badge-danger'}">HTTP ${u.httpStatus}</span></td>
                  <td>${u.lastDown === 'N/A' ? '—' : (typeof u.lastDown === 'string' ? u.lastDown : formatTimeAgo(u.lastDown))}</td>
                  <td>${u.incidents.length}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
