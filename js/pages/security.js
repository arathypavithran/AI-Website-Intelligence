// ════════════════════════════════════════════════════════════════
//  SECURITY MONITORING PAGE
// ════════════════════════════════════════════════════════════════
import { securityChecks, websites, getScoreColor } from '../data.js';

export function renderSecurity(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-heading">Security Audit & Vulnerability Shield</h1>
        <p class="page-desc">Malware scanning, SSL configuration, security headers, WAF firewall status, and CVE vulnerability monitoring</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="showToast('Malware & Vulnerability scan launched across 15 websites...','success')">🛡️ Run Security Scan</button>
      </div>
    </div>

    <!-- SUMMARY KPI -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-title">Average Security Score</div>
        <div class="kpi-value" style="color:var(--success)">${Math.round(securityChecks.reduce((a,s) => a+s.score,0)/securityChecks.length)} / 100</div>
        <div class="kpi-trend trend-up">High security posture</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Sites with Vulnerable Plugins</div>
        <div class="kpi-value" style="color:var(--danger)">${securityChecks.filter(s => s.vulnerablePlugins > 0).length}</div>
        <div class="kpi-trend trend-down">Patching required</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Security Headers Active</div>
        <div class="kpi-value" style="color:var(--success)">${securityChecks.filter(s => s.securityHeaders).length} / ${securityChecks.length}</div>
        <div class="kpi-trend trend-neutral">HSTS / CSP / XFO enabled</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Firewall (WAF) Active</div>
        <div class="kpi-value" style="color:var(--success)">${securityChecks.filter(s => s.firewallActive).length} / ${securityChecks.length}</div>
        <div class="kpi-trend trend-up">Cloudflare / Sucuri active</div>
      </div>
    </div>

    <!-- SECURITY CHECKS TABLE -->
    <div class="card" style="margin-top:20px;">
      <div class="card-header">
        <div class="card-title">Website Security Audit Results</div>
      </div>
      <div class="card-body p-0">
        <table class="data-table">
          <thead>
            <tr>
              <th>Website</th>
              <th>Security Score</th>
              <th>Vulnerable Plugins</th>
              <th>Security Headers</th>
              <th>Mixed Content</th>
              <th>Firewall (WAF)</th>
              <th>Backup Status</th>
            </tr>
          </thead>
          <tbody>
            ${securityChecks.map(s => {
              const w = websites.find(x => x.id === s.websiteId);
              if (!w) return '';
              const scoreColor = getScoreColor(s.score);
              return `
                <tr>
                  <td><strong>${w.name}</strong></td>
                  <td>
                    <span class="score-pill" style="background:${scoreColor}20;color:${scoreColor};font-weight:600;padding:4px 10px;border-radius:12px">
                      ${s.score}/100
                    </span>
                  </td>
                  <td><span class="badge ${s.vulnerablePlugins > 0 ? 'badge-danger' : 'badge-success'}">${s.vulnerablePlugins > 0 ? s.vulnerablePlugins + ' CVE' : 'None'}</span></td>
                  <td><span class="badge ${s.securityHeaders ? 'badge-success' : 'badge-warning'}">${s.securityHeaders ? 'Active' : 'Missing'}</span></td>
                  <td><span class="badge ${s.mixedContent ? 'badge-warning' : 'badge-success'}">${s.mixedContent ? 'Detected' : 'Clean'}</span></td>
                  <td><span class="badge ${s.firewallActive ? 'badge-success' : 'badge-danger'}">${s.firewallActive ? 'Protected' : 'No WAF'}</span></td>
                  <td><span class="badge ${s.backupOk ? 'badge-success' : 'badge-danger'}">${s.backupOk ? 'OK' : 'Failed'}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
