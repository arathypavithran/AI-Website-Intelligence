// ════════════════════════════════════════════════════════════════
//  SETTINGS PAGE
// ════════════════════════════════════════════════════════════════
export function renderSettings(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-heading">Portal System Settings</h1>
        <p class="page-desc">API integrations, webhook alerts, scan intervals, user preferences, and notification channels</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" onclick="showToast('Portal configuration saved!','success')">💾 Save Settings</button>
      </div>
    </div>

    <div class="grid-2 dashboard-row">
      <div class="card">
        <div class="card-header">
          <div class="card-title">Monitoring & Alert Channels</div>
        </div>
        <div class="card-body">
          <div class="form-group" style="margin-bottom:15px">
            <label style="display:block;margin-bottom:5px;font-weight:600">Slack Webhook URL</label>
            <input type="text" class="form-control" value="https://hooks.slack.com/services/T00/B00/XXXXXX" style="width:100%">
          </div>
          <div class="form-group" style="margin-bottom:15px">
            <label style="display:block;margin-bottom:5px;font-weight:600">Alert Email Recipients</label>
            <input type="text" class="form-control" value="alerts@analytix.sa, devops@setupz.com" style="width:100%">
          </div>
          <div class="form-group">
            <label style="display:block;margin-bottom:5px;font-weight:600">Uptime Check Interval</label>
            <select class="form-control" style="width:100%">
              <option value="60">60 Seconds (Default)</option>
              <option value="30">30 Seconds (High Priority)</option>
              <option value="300">5 Minutes</option>
            </select>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Analytix AI Model Configuration</div>
        </div>
        <div class="card-body">
          <div class="form-group" style="margin-bottom:15px">
            <label style="display:block;margin-bottom:5px;font-weight:600">AI Assistant Mode</label>
            <select class="form-control" style="width:100%">
              <option value="telemetry">Telemetry Strict (No Hallucinations)</option>
              <option value="proactive">Proactive AI Fleet Advisor</option>
            </select>
          </div>
          <div class="form-group" style="margin-bottom:15px">
            <label style="display:block;margin-bottom:5px;font-weight:600">Daily Executive AI Brief Time</label>
            <input type="time" class="form-control" value="09:00" style="width:100%">
          </div>
        </div>
      </div>
    </div>
  `;
}
