// ════════════════════════════════════════════════════════════════
//  ANALYTICS PAGE
// ════════════════════════════════════════════════════════════════
import { websites } from '../data.js';

export function renderAnalytics(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-heading">Web Analytics Intelligence</h1>
        <p class="page-desc">Traffic monitoring, user engagement, pageviews, and bounce rate analysis across monitored websites</p>
      </div>
      <div class="page-header-actions">
        <select class="form-control" style="width:180px" id="analytics-timeframe">
          <option value="30d">Last 30 Days</option>
          <option value="7d">Last 7 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
        <button class="btn btn-primary" onclick="showToast('Analytics refreshed from server','success')">↻ Refresh Data</button>
      </div>
    </div>

    <!-- KPI ROW -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-title">Total Monthly Pageviews</div>
        <div class="kpi-value">1.42M</div>
        <div class="kpi-trend trend-up">↑ +14.2% vs last month</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Unique Visitors</div>
        <div class="kpi-value">482,900</div>
        <div class="kpi-trend trend-up">↑ +8.7% vs last month</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Avg. Bounce Rate</div>
        <div class="kpi-value">41.8%</div>
        <div class="kpi-trend trend-up">↓ -2.4% improved</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Avg. Session Duration</div>
        <div class="kpi-value">2m 48s</div>
        <div class="kpi-trend trend-up">↑ +18s longer</div>
      </div>
    </div>

    <!-- CHARTS -->
    <div class="grid-3 dashboard-row" style="margin-top:20px;">
      <div class="card col-span-2">
        <div class="card-header">
          <div class="card-title">Traffic Trend (30 Days)</div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height:240px"><canvas id="analyticsTrendChart"></canvas></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">Device Share</div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height:240px"><canvas id="deviceShareChart"></canvas></div>
        </div>
      </div>
    </div>

    <!-- WEBSITES TRAFFIC TABLE -->
    <div class="card" style="margin-top:20px;">
      <div class="card-header">
        <div class="card-title">Traffic breakdown by Monitored Website</div>
      </div>
      <div class="card-body p-0">
        <table class="data-table">
          <thead>
            <tr>
              <th>Website</th>
              <th>Monthly Visitors</th>
              <th>Pageviews</th>
              <th>Bounce Rate</th>
              <th>Avg Duration</th>
              <th>Top Traffic Source</th>
            </tr>
          </thead>
          <tbody>
            ${websites.map(w => {
              const visitors = Math.floor(Math.random() * 80000 + 10000);
              const pvs = Math.floor(visitors * (Math.random() * 2 + 1.8));
              const bounce = (Math.random() * 20 + 35).toFixed(1);
              const durM = Math.floor(Math.random() * 2 + 1);
              const durS = Math.floor(Math.random() * 50 + 10);
              const sources = ['Google Organic', 'Direct Traffic', 'LinkedIn Ads', 'Social Media', 'Referrals'];
              const src = sources[Math.floor(Math.random() * sources.length)];
              return `
                <tr>
                  <td>
                    <div style="display:flex;align-items:center;gap:10px;">
                      <span class="status-indicator" style="background:${w.color}"></span>
                      <div>
                        <strong>${w.name}</strong>
                        <div style="font-size:11px;color:var(--text-dim)">${w.client}</div>
                      </div>
                    </div>
                  </td>
                  <td>${visitors.toLocaleString()}</td>
                  <td>${pvs.toLocaleString()}</td>
                  <td>${bounce}%</td>
                  <td>${durM}m ${durS}s</td>
                  <td><span class="badge badge-info">${src}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Render Charts
  setTimeout(() => {
    if (window.Chart) {
      const ctx1 = document.getElementById('analyticsTrendChart')?.getContext('2d');
      if (ctx1) {
        new window.Chart(ctx1, {
          type: 'line',
          data: {
            labels: Array.from({length: 15}, (_, i) => `Day ${i*2+1}`),
            datasets: [{
              label: 'Pageviews',
              data: [32000, 34000, 31000, 39000, 42000, 45000, 48000, 44000, 47000, 52000, 51000, 56000, 59000, 62000, 65000],
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.4
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      const ctx2 = document.getElementById('deviceShareChart')?.getContext('2d');
      if (ctx2) {
        new window.Chart(ctx2, {
          type: 'doughnut',
          data: {
            labels: ['Mobile', 'Desktop', 'Tablet'],
            datasets: [{
              data: [58, 37, 5],
              backgroundColor: ['#3B82F6', '#10B981', '#F59E0B']
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }
    }
  }, 100);
}
