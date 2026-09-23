// ════════════════════════════════════════════════════════════════
//  PERFORMANCE MONITORING PAGE
// ════════════════════════════════════════════════════════════════
import { performanceMetrics, websites, getScoreColor } from '../data.js';

export function renderPerformance(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-heading">Performance & Core Web Vitals</h1>
        <p class="page-desc">Lighthouse performance audits, LCP, FID/INP, CLS, TTFB, and Page Speed benchmarks</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="showToast('Running automated Lighthouse mobile test suite...','info')">⚡ Run Lighthouse Tests</button>
      </div>
    </div>

    <!-- CORE WEB VITALS BENCHMARKS -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-title">Avg. LCP (Largest Contentful Paint)</div>
        <div class="kpi-value" style="color:var(--success)">1.82s</div>
        <div class="kpi-trend trend-up">Good (Target &lt; 2.5s)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Avg. FID / INP</div>
        <div class="kpi-value" style="color:var(--success)">42ms</div>
        <div class="kpi-trend trend-up">Good (Target &lt; 100ms)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Avg. CLS (Cumulative Layout Shift)</div>
        <div class="kpi-value" style="color:var(--warning)">0.084</div>
        <div class="kpi-trend trend-neutral">Needs Improvement on 3 sites</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Avg. TTFB (Time to First Byte)</div>
        <div class="kpi-value" style="color:var(--success)">210ms</div>
        <div class="kpi-trend trend-up">Fast Server Response</div>
      </div>
    </div>

    <!-- PERFORMANCE METRICS TABLE -->
    <div class="card" style="margin-top:20px;">
      <div class="card-header">
        <div class="card-title">Website Speed & Core Web Vitals Audit</div>
      </div>
      <div class="card-body p-0">
        <table class="data-table">
          <thead>
            <tr>
              <th>Website</th>
              <th>Device</th>
              <th>Score</th>
              <th>LCP</th>
              <th>FID / INP</th>
              <th>CLS</th>
              <th>TTFB</th>
              <th>Total Size</th>
              <th>Requests</th>
            </tr>
          </thead>
          <tbody>
            ${performanceMetrics.map(p => {
              const w = websites.find(x => x.id === p.websiteId);
              if (!w) return '';
              const scoreColor = getScoreColor(p.score);
              return `
                <tr>
                  <td>
                    <strong>${w.name}</strong>
                  </td>
                  <td><span class="badge badge-secondary">${p.device.toUpperCase()}</span></td>
                  <td>
                    <span class="score-pill" style="background:${scoreColor}20;color:${scoreColor};font-weight:600;padding:4px 10px;border-radius:12px">
                      ${p.score}/100
                    </span>
                  </td>
                  <td>${p.lcp}s</td>
                  <td>${p.fid}ms</td>
                  <td>${p.cls}</td>
                  <td>${p.ttfb}ms</td>
                  <td>${(p.pageSize/1024/1024).toFixed(2)} MB</td>
                  <td>${p.requests}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
