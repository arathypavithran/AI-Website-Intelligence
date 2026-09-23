// ════════════════════════════════════════════════════════════════
//  SEO INTELLIGENCE PAGE
// ════════════════════════════════════════════════════════════════
import { seoData, websites, getScoreColor } from '../data.js';

export function renderSEO(container, websiteId = null) {
  const filteredSeo = websiteId ? seoData.filter(s => s.websiteId === websiteId) : seoData;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-heading">SEO Intelligence & Keywords</h1>
        <p class="page-desc">Search engine rankings, indexation status, sitemap validation, schema markup, and keyword tracking</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="showToast('Initiated Google Search Console audit sync...','info')">↻ Sync Search Console</button>
      </div>
    </div>

    <!-- SUMMARY KPI -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-title">Average SEO Health</div>
        <div class="kpi-value" style="color:var(--success)">81.4 / 100</div>
        <div class="kpi-trend trend-up">↑ +3.2 pts this month</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Keywords in Top 10</div>
        <div class="kpi-value">342</div>
        <div class="kpi-trend trend-up">↑ +28 new keywords</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Indexed Pages</div>
        <div class="kpi-value">1,248</div>
        <div class="kpi-trend trend-neutral">99.2% index rate</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">SEO Issues Found</div>
        <div class="kpi-value" style="color:var(--warning)">47</div>
        <div class="kpi-trend trend-down">12 critical missing meta tags</div>
      </div>
    </div>

    <!-- SEO AUDIT TABLE -->
    <div class="card" style="margin-top:20px;">
      <div class="card-header">
        <div class="card-title">Website Technical SEO Audit Summary</div>
      </div>
      <div class="card-body p-0">
        <table class="data-table">
          <thead>
            <tr>
              <th>Website</th>
              <th>SEO Score</th>
              <th>Keywords Ranked</th>
              <th>Missing Titles</th>
              <th>Missing Alts</th>
              <th>Sitemap Status</th>
              <th>Schema Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filteredSeo.map(s => {
              const w = websites.find(x => x.id === s.websiteId);
              if (!w) return '';
              const scoreColor = getScoreColor(w.seoScore);
              const keywordsEst = Math.floor(w.seoScore * 4.2);
              return `
                <tr>
                  <td>
                    <strong>${w.name}</strong>
                    <div style="font-size:11px;color:var(--text-dim)">${w.client}</div>
                  </td>
                  <td>
                    <span class="score-pill" style="background:${scoreColor}20;color:${scoreColor};font-weight:600;padding:4px 10px;border-radius:12px">
                      ${w.seoScore}/100
                    </span>
                  </td>
                  <td><strong>~${keywordsEst}</strong> keywords</td>
                  <td><span class="badge ${s.missingTitles > 0 ? 'badge-warning' : 'badge-success'}">${s.missingTitles} pages</span></td>
                  <td><span class="badge ${s.missingAlt > 0 ? 'badge-warning' : 'badge-success'}">${s.missingAlt} images</span></td>
                  <td><span class="badge ${s.sitemapOk ? 'badge-success' : 'badge-warning'}">${s.sitemapOk ? 'Valid XML' : 'Missing'}</span></td>
                  <td><span class="badge badge-info">JSON-LD Active</span></td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="showToast('Inspecting SEO for ${w.name}','info')">View Details</button>
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
