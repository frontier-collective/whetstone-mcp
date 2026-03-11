export function getDashboardHtml(version: string): string {
  const footer = '\n<footer><div>Whetstone MCP v' + version + ' · MIT License</div><div><a href="https://github.com/frontier-collective/whetstone-mcp">GitHub</a> · <a href="https://www.npmjs.com/package/@frontier-collective/whetstone-mcp">npm</a> · Built by <a href="https://github.com/frontier-collective">Frontier Collective</a></div></footer>\n';
  return '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>Whetstone Dashboard</title>\n<style>\n'
+ STYLES + '\n</style>\n</head>\n<body>\n<main>\n' + BODY + '\n</main>\n' + footer + '\n<script>\n' + SCRIPT + '\n</script>\n</body>\n</html>';
}

// ── Styles ────────────────────────────────────────────────────────────

const STYLES = `
:root {
  --bg-primary: #0d1117;
  --bg-secondary: #161b22;
  --bg-card: #1c2128;
  --border: #30363d;
  --text-primary: #e6edf3;
  --text-secondary: #8b949e;
  --accent: #58a6ff;
  --accent-green: #3fb950;
  --accent-yellow: #d29922;
  --accent-red: #f85149;
  --accent-purple: #bc8cff;
  --accent-orange: #f0883e;
  --font-mono: 'SF Mono', 'Cascadia Code', 'Fira Code', monospace;
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-sans);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  padding: 24px;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

header h1 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

header h1 span {
  color: var(--text-secondary);
  font-weight: 400;
  font-size: 14px;
  margin-left: 8px;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

#status {
  font-size: 12px;
  color: var(--text-secondary);
  font-family: var(--font-mono);
}

button {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  font-family: var(--font-sans);
  transition: background 0.15s;
}

button:hover { background: var(--bg-card); }
button.active { border-color: var(--accent); color: var(--accent); }

.nav-tabs {
  display: flex;
  gap: 4px;
}

.nav-tab {
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  border-radius: 0;
  padding: 8px 16px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}

.nav-tab:hover { background: transparent; color: var(--text-primary); }
.nav-tab.active { color: var(--accent); border-bottom-color: var(--accent); font-weight: 600; }

.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.filter-bar select, .filter-bar input[type="text"] {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 12px;
  font-family: var(--font-sans);
}

.filter-bar select:focus, .filter-bar input[type="text"]:focus {
  border-color: var(--accent);
  outline: none;
}

.filter-bar input[type="text"] {
  min-width: 180px;
}

.constraints-summary {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.constraint-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: border-color 0.15s;
}

.constraint-card:hover { border-color: var(--accent); }

.constraint-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.constraint-rule {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 8px;
}

.constraint-meta { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }

.constraint-stats {
  margin-top: 6px;
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--text-secondary);
}

.rejection-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: border-color 0.15s;
}

.rejection-card:hover { border-color: var(--accent); }

.rejection-card .rejection-desc {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.rejection-card .rejection-reasoning {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 8px;
}

.rejection-card .rejection-constraint-link {
  font-size: 11px;
  color: var(--accent);
  font-family: var(--font-mono);
}

.pattern-banner {
  background: linear-gradient(135deg, rgba(209,154,102,0.1), rgba(209,154,102,0.05));
  border: 1px solid var(--accent-orange);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.pattern-banner .pattern-count {
  background: var(--accent-orange);
  color: var(--bg-primary);
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
}

.pattern-banner .pattern-info {
  font-size: 13px;
  color: var(--text-primary);
}

.pattern-banner .pattern-domain {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.results-count {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

@media (max-width: 900px) {
  .constraints-summary { grid-template-columns: repeat(4, 1fr); }
}
@media (max-width: 600px) {
  .constraints-summary { grid-template-columns: repeat(2, 1fr); }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px;
}

.stat-card .value {
  font-size: 32px;
  font-weight: 700;
  font-family: var(--font-mono);
  line-height: 1;
  margin-bottom: 4px;
}

.stat-card .label {
  font-size: 13px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-card .delta {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--text-secondary);
  margin-top: 4px;
}

.stat-card .delta.positive { color: var(--accent-green); }
.stat-card .delta.negative { color: var(--accent-red); }

.stat-card.warn .value { color: var(--accent-yellow); }
.stat-card.good .value { color: var(--accent-green); }

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.two-col .card { margin-bottom: 0; }

.card h2 {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.bar-label {
  width: 120px;
  text-align: right;
  font-size: 13px;
  font-family: var(--font-mono);
  color: var(--text-secondary);
  flex-shrink: 0;
}

.bar-track {
  flex: 1;
  height: 22px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
}

.bar-fill-encoded {
  height: 100%;
  background: var(--accent-green);
  transition: width 0.4s ease;
}

.bar-fill-unencoded {
  height: 100%;
  background: var(--accent);
  transition: width 0.4s ease;
}

.bar-count {
  width: 60px;
  font-size: 13px;
  font-family: var(--font-mono);
  color: var(--text-secondary);
}

.bar-legend {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 12px;
  color: var(--text-secondary);
}

.bar-legend span::before {
  content: '';
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  margin-right: 4px;
  vertical-align: middle;
}

.bar-legend .legend-encoded::before { background: var(--accent-green); }
.bar-legend .legend-unencoded::before { background: var(--accent); }

.list-item {
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}

.list-item:last-child { border-bottom: none; }

.list-item .title {
  color: var(--text-primary);
  font-weight: 500;
}

.list-item .meta {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.badge {
  display: inline-block;
  font-size: 11px;
  font-family: var(--font-mono);
  padding: 2px 6px;
  margin-right: 8px;
  border-radius: 4px;
  border: 1px solid var(--border);
  color: var(--text-secondary);
}

.badge.critical { color: var(--accent-red); border-color: var(--accent-red); }
.badge.important { color: var(--accent-yellow); border-color: var(--accent-yellow); }
.badge.preference { color: var(--accent-purple); border-color: var(--accent-purple); }

details {
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}

details:last-child { border-bottom: none; }

details summary {
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

details summary::before {
  content: '\\25B6';
  font-size: 10px;
  color: var(--text-secondary);
  margin-top: 4px;
  transition: transform 0.15s;
  flex-shrink: 0;
}

details[open] summary::before { transform: rotate(90deg); }

details .detail-body {
  margin-top: 8px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.detail-body .detail-field {
  margin-bottom: 8px;
}

.detail-body .detail-field:last-child { margin-bottom: 0; }

.detail-body .detail-label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.empty {
  color: var(--text-secondary);
  font-size: 14px;
  font-style: italic;
  padding: 20px 0;
  text-align: center;
}

.count-badge {
  display: inline-block;
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--accent);
  margin-left: 4px;
}

.show-more-btn {
  display: block;
  width: 100%;
  background: none;
  border: 1px dashed var(--border);
  color: var(--text-secondary);
  padding: 8px;
  margin-top: 8px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 4px;
}

.show-more-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: none;
}

.pattern-cluster {
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 6px;
  margin-bottom: 8px;
  border-left: 3px solid var(--accent-orange);
}

.pattern-cluster .pattern-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.pattern-cluster .pattern-count {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--accent-orange);
  font-weight: 600;
}

.pattern-cluster .pattern-theme {
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.pattern-cluster .pattern-examples {
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.5;
}

.pattern-cluster .pattern-examples div {
  padding: 2px 0;
}

.pattern-cluster .pattern-examples div::before {
  content: '\\2022 ';
  color: var(--text-secondary);
}

.domain-gap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
}

.domain-gap:last-child { border-bottom: none; }

.domain-gap .gap-domain {
  width: 120px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text-primary);
  flex-shrink: 0;
}

.domain-gap .gap-bar {
  flex: 1;
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
}

.domain-gap .gap-bar-fill {
  height: 100%;
  background: var(--accent-red);
  border-radius: 4px;
  transition: width 0.4s ease;
}

.domain-gap .gap-stats {
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--text-secondary);
  white-space: nowrap;
}

.graduation-rule {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
  padding-left: 4px;
  border-left: 2px solid var(--accent-green);
  line-height: 1.4;
}

.section-label {
  font-size: 11px;
  color: var(--text-secondary);
  font-family: var(--font-mono);
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  width: 100%;
  max-width: 720px;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: var(--bg-card);
  border-radius: 12px 12px 0 0;
  z-index: 1;
}

.modal-header h2 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.4;
  text-transform: none;
  letter-spacing: 0;
}

.modal-header .modal-type {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 24px;
  cursor: pointer;
  padding: 0 0 0 16px;
  line-height: 1;
  flex-shrink: 0;
}

.modal-close:hover { color: var(--text-primary); background: none; }

.modal-body {
  padding: 20px 24px;
}

.modal-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.modal-field {
  margin-bottom: 16px;
}

.modal-field:last-child { margin-bottom: 0; }

.modal-field .field-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
  font-family: var(--font-mono);
}

.modal-field .field-value {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.modal-field .field-value.mono {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-secondary);
}

.modal-field .field-value.empty {
  color: var(--text-secondary);
  font-style: italic;
}

.modal-field .field-value code {
  background: var(--bg-secondary);
  padding: 8px 12px;
  border-radius: 6px;
  display: block;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.5;
  overflow-x: auto;
}

.modal-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.modal-tags .tag {
  display: inline-block;
  font-size: 11px;
  font-family: var(--font-mono);
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--bg-secondary);
  color: var(--accent);
  border: 1px solid var(--border);
}

.modal-linked {
  margin-top: 8px;
}

.modal-linked .linked-item {
  padding: 8px 12px;
  background: var(--bg-secondary);
  border-radius: 6px;
  margin-bottom: 6px;
  cursor: pointer;
  transition: border-color 0.15s;
  border: 1px solid transparent;
}

.modal-linked .linked-item:hover {
  border-color: var(--accent);
}

.modal-linked .linked-item .linked-desc {
  font-size: 13px;
  color: var(--text-primary);
}

.modal-linked .linked-item .linked-meta {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.modal-divider {
  border: none;
  border-top: 1px solid var(--border);
  margin: 16px 0;
}

.clickable { cursor: pointer; }
.clickable:hover .title { color: var(--accent); }

footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border);
  text-align: center;
  font-size: 12px;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  line-height: 1.8;
}

footer a {
  color: var(--accent);
  text-decoration: none;
}

footer a:hover { text-decoration: underline; }

@media (max-width: 1100px) {
  .stats-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 900px) {
  .two-col { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}
`;

// ── Body ──────────────────────────────────────────────────────────────

const BODY = `
<whet-app></whet-app>

<template id="app-template">
<whet-nav current-page="overview" status="Loading..." auto-refresh></whet-nav>

<whet-overview id="page-overview" class="page"></whet-overview>
<whet-rejections id="page-rejections" class="page" style="display:none"></whet-rejections>
<whet-constraints id="page-constraints" class="page" style="display:none"></whet-constraints>

<div id="modal-overlay" class="modal-overlay" style="display:none" onclick="if(event.target===this)closeModal()">
  <div class="modal" id="modal-content"></div>
</div>
</template>
`;

// ── Script ────────────────────────────────────────────────────────────

const SCRIPT = `
function esc(s) {
  if (!s) return '';
  var d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function timeAgo(iso) {
  if (!iso) return '';
  var ms = Date.now() - new Date(iso).getTime();
  var days = Math.floor(ms / 86400000);
  if (days > 0) return days + 'd ago';
  var hrs = Math.floor(ms / 3600000);
  if (hrs > 0) return hrs + 'h ago';
  var mins = Math.floor(ms / 60000);
  return mins + 'm ago';
}

function severityBadge(sev) {
  return '<whet-badge text="' + esc(sev) + '" variant="' + esc(sev) + '"></whet-badge>';
}

function domainBadge(domain) {
  return '<whet-badge text="' + esc(domain) + '"></whet-badge>';
}

async function fetchJson(path) {
  var res = await fetch(path);
  return res.json();
}

function formatDate(iso) {
  if (!iso) return null;
  try {
    var d = new Date(iso);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  } catch(e) { return iso; }
}

function modalField(label, value, opts) {
  opts = opts || {};
  if (!value && !opts.showEmpty) return '';
  var cls = opts.mono ? ' mono' : '';
  var val;
  if (!value) {
    val = '<div class="field-value empty">—</div>';
  } else if (opts.code) {
    val = '<div class="field-value"><code>' + esc(value) + '</code></div>';
  } else if (opts.html) {
    val = '<div class="field-value' + cls + '">' + value + '</div>';
  } else {
    val = '<div class="field-value' + cls + '">' + esc(value) + '</div>';
  }
  return '<div class="modal-field"><div class="field-label">' + esc(label) + '</div>' + val + '</div>';
}

function closeModal() {
  document.getElementById('modal-overlay').style.display = 'none';
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});

async function unlinkRejection(rejectionId) {
  if (!confirm('Unlink this rejection from its constraint?')) return;
  try {
    var res = await fetch('/api/rejection/' + encodeURIComponent(rejectionId) + '/unlink', { method: 'POST' });
    var data = await res.json();
    if (!res.ok) { alert(data.error || 'Unknown error'); return; }
    openRejection(rejectionId);
    refresh();
  } catch(err) { alert(err.message); }
}

async function unlinkFromConstraint(rejectionId, constraintId) {
  if (!confirm('Unlink this rejection from the constraint?')) return;
  try {
    var res = await fetch('/api/rejection/' + encodeURIComponent(rejectionId) + '/unlink', { method: 'POST' });
    var data = await res.json();
    if (!res.ok) { alert(data.error || 'Unknown error'); return; }
    openConstraint(constraintId);
    refresh();
  } catch(err) { alert(err.message); }
}

async function deleteConstraint(constraintId) {
  if (!confirm('Permanently delete this constraint? This cannot be undone.')) return;
  try {
    var res = await fetch('/api/constraint/' + encodeURIComponent(constraintId), { method: 'DELETE' });
    var data = await res.json();
    if (!res.ok) { alert(data.error || 'Unknown error'); return; }
    closeModal();
    refresh();
  } catch(err) { alert(err.message); }
}

async function openRejection(id) {
  var overlay = document.getElementById('modal-overlay');
  var content = document.getElementById('modal-content');
  content.innerHTML = '<div class="modal-body"><div class="empty">Loading...</div></div>';
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  try {
    var r = await fetchJson('/api/rejection/' + encodeURIComponent(id));
    var html = '<div class="modal-header"><div><div class="modal-type">Rejection</div><h2>' + esc(r.description) + '</h2></div><button class="modal-close" onclick="closeModal()">\\u00D7</button></div>';
    html += '<div class="modal-body">';
    html += '<div class="modal-badges">' + domainBadge(r.domain) + '</div>';
    html += modalField('Description', r.description);
    html += modalField('Reasoning', r.reasoning, { showEmpty: true });
    html += modalField('Raw Output', r.raw_output, { code: true, showEmpty: true });
    if (r.constraint_id) {
      html += '<div class="modal-field"><div class="field-label">Encoded By</div><div class="field-value" style="display:flex;align-items:center;gap:12px"><a href="#" onclick="event.preventDefault();openConstraint(\\'' + esc(r.constraint_id) + '\\')" style="color:var(--accent);text-decoration:none;font-family:var(--font-mono);font-size:12px">' + esc(r.constraint_id) + ' \\u2192 View constraint</a><button onclick="unlinkRejection(\\'' + esc(r.id) + '\\')" style="color:#e06c75;border:1px solid #e06c75;background:transparent;border-radius:4px;font-size:11px;padding:2px 8px;cursor:pointer">Unlink</button></div></div>';
    } else {
      html += modalField('Encoded By', 'Not yet encoded', { showEmpty: true });
    }
    html += '<hr class="modal-divider">';
    html += modalField('ID', r.id, { mono: true });
    html += modalField('Created', formatDate(r.created_at), { mono: true });
    html += '</div>';
    content.innerHTML = html;
  } catch(err) {
    content.innerHTML = '<div class="modal-body"><div class="empty">Error: ' + esc(err.message) + '</div></div>';
  }
}

async function openConstraint(id) {
  var overlay = document.getElementById('modal-overlay');
  var content = document.getElementById('modal-content');
  content.innerHTML = '<div class="modal-body"><div class="empty">Loading...</div></div>';
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  try {
    var c = await fetchJson('/api/constraint/' + encodeURIComponent(id));
    var html = '<div class="modal-header"><div><div class="modal-type">Constraint</div><h2>' + esc(c.title) + '</h2></div><button class="modal-close" onclick="closeModal()">\\u00D7</button></div>';
    html += '<div class="modal-body">';
    html += '<div class="modal-badges">' + domainBadge(c.domain) + severityBadge(c.severity) + '<whet-badge text="' + esc(c.category) + '"></whet-badge><whet-badge text="' + esc(c.status) + '"></whet-badge></div>';
    html += modalField('Rule', c.rule);
    html += modalField('Reasoning', c.reasoning, { showEmpty: true });
    html += modalField('Bad Example', c.rejected_example, { code: true, showEmpty: true });
    html += modalField('Good Example', c.accepted_example, { code: true, showEmpty: true });
    // Tags
    var tags = null;
    try { tags = c.tags ? JSON.parse(c.tags) : null; } catch(e) { tags = c.tags ? [c.tags] : null; }
    if (tags && tags.length > 0) {
      var tagsHtml = '<div class="modal-tags">';
      for (var t = 0; t < tags.length; t++) tagsHtml += '<span class="tag">' + esc(tags[t]) + '</span>';
      tagsHtml += '</div>';
      html += '<div class="modal-field"><div class="field-label">Tags</div>' + tagsHtml + '</div>';
    } else {
      html += modalField('Tags', null, { showEmpty: true });
    }
    html += modalField('Source', c.source, { showEmpty: true });
    html += '<hr class="modal-divider">';
    html += modalField('Times Applied', String(c.times_applied || 0), { mono: true });
    html += modalField('Last Applied', c.last_applied_at ? formatDate(c.last_applied_at) : null, { mono: true, showEmpty: true });
    html += modalField('ID', c.id, { mono: true });
    html += modalField('Created', formatDate(c.created_at), { mono: true });
    html += modalField('Updated', formatDate(c.updated_at), { mono: true });
    // Linked rejections
    var linked = c.linked_rejections || [];
    html += '<hr class="modal-divider">';
    html += '<div class="modal-field"><div class="field-label">Linked Rejections (' + linked.length + ')</div>';
    if (linked.length > 0) {
      html += '<div class="modal-linked">';
      for (var i = 0; i < linked.length; i++) {
        var lr = linked[i];
        html += '<div class="linked-item" onclick="openRejection(\\'' + esc(lr.id) + '\\')">';
        html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">';
        html += '<div><div class="linked-desc">' + esc(lr.description) + '</div>';
        html += '<div class="linked-meta">' + esc(lr.domain) + ' \\u00B7 ' + timeAgo(lr.created_at) + '</div></div>';
        html += '<button onclick="event.stopPropagation();unlinkFromConstraint(\\'' + esc(lr.id) + '\\',\\'' + esc(c.id) + '\\')" style="color:#e06c75;border:1px solid #e06c75;background:transparent;border-radius:4px;font-size:10px;padding:2px 6px;cursor:pointer;flex-shrink:0">Unlink</button>';
        html += '</div></div>';
      }
      html += '</div>';
    } else {
      html += '<div class="field-value empty">\\u2014</div>';
    }
    html += '</div>';
    if (linked.length === 0) {
      html += '<div style="text-align:center;padding:12px 0">';
      html += '<button onclick="deleteConstraint(\\'' + esc(c.id) + '\\')" style="color:#e06c75;border:1px solid #e06c75;background:transparent;border-radius:6px;font-size:13px;padding:8px 16px;cursor:pointer">Delete Constraint</button>';
      html += '<div style="font-size:11px;color:var(--text-secondary);margin-top:6px">No linked rejections \\u2014 safe to delete</div>';
      html += '</div>';
    }
    html += '</div>';
    content.innerHTML = html;
  } catch(err) {
    content.innerHTML = '<div class="modal-body"><div class="empty">Error: ' + esc(err.message) + '</div></div>';
  }
}

function deltaText(n, label) {
  if (!n) return '';
  var sign = n > 0 ? '+' : '';
  return sign + n + ' ' + label;
}

// ── Shared render helper (used by overview component) ──

function renderConstraintDetail(c, extraMeta) {
  var body = '';
  if (c.rule) body += '<div class="detail-field"><div class="detail-label">Rule</div><div>' + esc(c.rule) + '</div></div>';
  if (c.reasoning) body += '<div class="detail-field"><div class="detail-label">Reasoning</div><div>' + esc(c.reasoning) + '</div></div>';
  if (c.rejected_example) body += '<div class="detail-field"><div class="detail-label">Bad Example</div><div>' + esc(c.rejected_example) + '</div></div>';
  if (c.accepted_example) body += '<div class="detail-field"><div class="detail-label">Good Example</div><div>' + esc(c.accepted_example) + '</div></div>';
  body += '<div class="detail-field" style="font-family:var(--font-mono);font-size:11px">ID: ' + esc(c.id) + '</div>';
  var hasBody = c.rule || c.reasoning || c.rejected_example || c.accepted_example;
  if (hasBody) {
    return '<details class="clickable" onclick="if(!event.target.closest(\\'summary\\')){return}event.preventDefault();openConstraint(\\'' + esc(c.id) + '\\')">' +
      '<summary><div>' +
      '<div class="title">' + esc(c.title) + '</div>' +
      '<div class="meta">' + domainBadge(c.domain) + severityBadge(c.severity) + (extraMeta || '') + '</div>' +
      '</div></summary>' +
      '</details>';
  }
  return '<div class="list-item clickable" onclick="openConstraint(\\'' + esc(c.id) + '\\')">' +
    '<div class="title">' + esc(c.title) + '</div>' +
    '<div class="meta">' + domainBadge(c.domain) + severityBadge(c.severity) + (extraMeta || '') + '</div></div>';
}

`;

