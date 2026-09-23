// ════════════════════════════════════════════════════════════════
//  FORMS MONITORING PAGE
// ════════════════════════════════════════════════════════════════
import { forms, websites } from '../data.js';

export function renderForms(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-heading">Form Submission & Conversion Monitoring</h1>
        <p class="page-desc">Automated testing of Contact, Lead, and Checkout form submissions across monitored sites</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="showToast('Executing synthetic form submit tests...','info')">🧪 Test All Forms</button>
      </div>
    </div>

    <!-- KPI -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-title">Forms Monitored</div>
        <div class="kpi-value">28</div>
        <div class="kpi-trend trend-up">Across 15 sites</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Success Rate</div>
        <div class="kpi-value" style="color:var(--success)">98.4%</div>
        <div class="kpi-trend trend-up">High deliverability</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Failing Forms</div>
        <div class="kpi-value" style="color:var(--danger)">1</div>
        <div class="kpi-trend trend-down">northstar.com Contact Form</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Avg Submission Latency</div>
        <div class="kpi-value">1.1s</div>
        <div class="kpi-trend trend-up">Fast response</div>
      </div>
    </div>

    <!-- FORMS TABLE -->
    <div class="card" style="margin-top:20px;">
      <div class="card-header">
        <div class="card-title">Form Test Status & Endpoint Health</div>
      </div>
      <div class="card-body p-0">
        <table class="data-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Form Name</th>
              <th>Website</th>
              <th>Type</th>
              <th>Submissions (30d)</th>
              <th>Last Test</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${forms.flatMap(entry => {
              const w = websites.find(x => x.id === entry.websiteId);
              return entry.forms.map(f => {
                const isWorking = f.status === 'ok';
                return `
                  <tr>
                    <td><span class="badge ${isWorking ? 'badge-success' : 'badge-danger'}">${f.status.toUpperCase()}</span></td>
                    <td><strong>${f.name}</strong></td>
                    <td>${w ? w.name : 'Unknown'}</td>
                    <td><span class="badge badge-secondary">Contact</span></td>
                    <td>—</td>
                    <td>${f.lastTest ? new Date(f.lastTest).toLocaleDateString() : '—'}</td>
                    <td><button class="btn btn-secondary btn-sm" onclick="showToast('Testing form submission endpoint...','info')">Test Form</button></td>
                  </tr>
                `;
              });
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
