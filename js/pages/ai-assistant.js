// ════════════════════════════════════════════════════════════════
//  AI ASSISTANT DEDICATED PAGE
// ════════════════════════════════════════════════════════════════
import { askAI } from '../ai.js';

export function renderAIAssistant(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-heading">Analytix AI Website Intelligence Assistant</h1>
        <p class="page-desc">Context-aware website intelligence agent powered by real portal telemetry data. No hallucinated metrics.</p>
      </div>
    </div>

    <div class="card" style="min-height:500px;display:flex;flex-direction:column">
      <div class="card-header">
        <div class="card-title">✦ Interactive AI Diagnostics Console</div>
      </div>
      <div class="card-body" style="flex:1;display:flex;flex-direction:column;gap:15px;">
        <div id="ai-page-chat-log" style="flex:1;min-height:300px;max-height:450px;overflow-y:auto;background:var(--bg-dark-3);padding:20px;border-radius:var(--radius-md);display:flex;flex-direction:column;gap:12px">
          <div style="background:var(--bg-card-2);padding:12px 16px;border-radius:8px;border:1px solid var(--border);font-size:13px;line-height:1.5">
            <strong>✦ Analytix AI:</strong> Hello! I have complete telemetry access across all 15 monitored websites, SEO rankings, SSL certs, PHP versions, and security scans. How can I help optimize your fleet today?
          </div>
        </div>
        <div style="display:flex;gap:10px">
          <input type="text" class="form-control" id="ai-page-input" placeholder="e.g. Which websites have expiring domains? or How is setupz.com performing?" style="flex:1">
          <button class="btn btn-primary" id="ai-page-send-btn">Ask AI</button>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-secondary btn-sm prompt-chip">Which websites have expiring domains?</button>
          <button class="btn btn-secondary btn-sm prompt-chip">Show critical issues across fleet</button>
          <button class="btn btn-secondary btn-sm prompt-chip">Audit setupz.com security & SEO</button>
          <button class="btn btn-secondary btn-sm prompt-chip">List outdated WordPress plugins</button>
        </div>
      </div>
    </div>
  `;

  const chatLog = container.querySelector('#ai-page-chat-log');
  const input = container.querySelector('#ai-page-input');
  const sendBtn = container.querySelector('#ai-page-send-btn');

  function handleSend(promptText) {
    const query = promptText || input.value.trim();
    if (!query) return;

    if (!promptText) input.value = '';

    chatLog.innerHTML += `
      <div style="background:rgba(59,130,246,0.15);color:var(--text-bright);padding:10px 14px;border-radius:8px;align-self:flex-end;max-width:80%;font-size:13px">
        ${query}
      </div>
    `;
    chatLog.scrollTop = chatLog.scrollHeight;

    setTimeout(() => {
      const response = askAI(query);
      chatLog.innerHTML += `
        <div style="background:var(--bg-card-2);padding:14px;border-radius:8px;border:1px solid var(--border);font-size:13px;line-height:1.6;align-self:flex-start;max-width:90%">
          <strong>✦ Analytix AI:</strong><br>${response}
        </div>
      `;
      chatLog.scrollTop = chatLog.scrollHeight;
    }, 300);
  }

  sendBtn?.addEventListener('click', () => handleSend());
  input?.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });

  container.querySelectorAll('.prompt-chip').forEach(btn => {
    btn.addEventListener('click', () => handleSend(btn.textContent));
  });
}
