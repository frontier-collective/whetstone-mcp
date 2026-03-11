// Tailwind v4 @theme configuration for the Whetstone dark theme.
// These tokens become Tailwind utility classes:
//   bg-surface, bg-raised, bg-card, border-edge, text-primary, text-muted, etc.

export const THEME = `
@theme {
  --color-surface: #0d1117;
  --color-raised: #161b22;
  --color-card: #1c2128;
  --color-edge: #30363d;
  --color-primary: #e6edf3;
  --color-muted: #8b949e;
  --color-accent: #58a6ff;
  --color-green: #3fb950;
  --color-yellow: #d29922;
  --color-red: #f85149;
  --color-purple: #bc8cff;
  --color-orange: #f0883e;
  --font-mono: 'SF Mono', 'Cascadia Code', 'Fira Code', monospace;
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
`;

// Backward-compat aliases so inline style="var(--accent)" etc. still work in SCRIPT.
// Tailwind @theme creates --color-accent, but old code uses var(--accent).
export const COMPAT_VARS = `
:root {
  --bg-primary: var(--color-surface);
  --bg-secondary: var(--color-raised);
  --bg-card: var(--color-card);
  --border: var(--color-edge);
  --text-primary: var(--color-primary);
  --text-secondary: var(--color-muted);
  --accent: var(--color-accent);
  --accent-green: var(--color-green);
  --accent-yellow: var(--color-yellow);
  --accent-red: var(--color-red);
  --accent-purple: var(--color-purple);
  --accent-orange: var(--color-orange);
}
`;

// Minimal CSS for things Tailwind can't handle:
// pseudo-elements, -webkit-line-clamp, details markers, transitions, @apply shortcuts
export const CUSTOM_CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

details summary { list-style: none; }
details summary::before {
  content: '\\25B6';
  font-size: 10px;
  color: var(--color-muted);
  margin-top: 4px;
  transition: transform 0.15s;
  flex-shrink: 0;
}
details[open] summary::before { transform: rotate(90deg); }

.bar-legend span::before {
  content: '';
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  margin-right: 4px;
  vertical-align: middle;
}
.bar-legend .legend-encoded::before { background: var(--color-green); }
.bar-legend .legend-unencoded::before { background: var(--color-accent); }

.pattern-examples div::before {
  content: '\\2022 ';
  color: var(--color-muted);
}

.clickable { cursor: pointer; }
.clickable:hover .title { color: var(--color-accent); }

.bar-fill-encoded, .bar-fill-unencoded, .gap-bar-fill {
  transition: width 0.4s ease;
}

/* Semantic @apply classes for innerHTML-heavy patterns */
.wh-card {
  @apply bg-card border border-edge rounded-lg p-4 mb-2 cursor-pointer transition-colors;
}
.wh-card:hover { @apply border-accent; }

.wh-list-item {
  @apply py-2.5 border-b border-edge text-sm;
}
.wh-list-item:last-child { @apply border-b-0; }

.wh-section {
  @apply bg-card border border-edge rounded-lg p-5 mb-6;
}

.wh-section h2 {
  @apply text-sm font-semibold uppercase tracking-wide text-muted mb-4;
}

.wh-empty {
  @apply text-muted text-sm italic py-5 text-center;
}

.wh-modal-field { @apply mb-4; }
.wh-modal-field:last-child { @apply mb-0; }
.wh-field-label {
  @apply text-[11px] font-semibold text-muted uppercase tracking-wide mb-1 font-mono;
}
.wh-field-value {
  @apply text-sm text-primary leading-relaxed whitespace-pre-wrap break-words;
}
.wh-field-value.mono {
  @apply font-mono text-xs text-muted;
}
.wh-field-value.empty {
  @apply text-muted italic;
}
.wh-field-value code {
  @apply bg-raised py-2 px-3 rounded-md block font-mono text-[13px] leading-normal overflow-x-auto;
}

.wh-tag {
  @apply inline-block text-[11px] font-mono px-2 rounded bg-raised text-accent border border-edge;
}

.wh-show-more {
  @apply block w-full bg-transparent border border-dashed border-edge text-muted p-2 mt-2 text-xs cursor-pointer rounded;
}
.wh-show-more:hover {
  @apply text-accent border-accent bg-transparent;
}
`;
