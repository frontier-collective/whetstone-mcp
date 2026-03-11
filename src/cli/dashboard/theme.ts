// Tailwind v4 @theme configuration for the Whetstone dark theme.
// These tokens become Tailwind utility classes:
//   bg-surface, bg-raised, bg-card, border-edge, text-primary, text-muted, etc.

export const THEME = `
@theme {
  --color-surface: #0d1117;
  --color-raised: #161b22;
  --color-card: #1c2128;
  --color-card-hover: #232a33;
  --color-edge: #30363d;
  --color-edge-subtle: #252b33;
  --color-edge-hover: #444c56;
  --color-primary: #e6edf3;
  --color-muted: #8b949e;
  --color-accent: #58a6ff;
  --color-green: #3fb950;
  --color-yellow: #d29922;
  --color-red: #f85149;
  --color-purple: #bc8cff;
  --color-orange: #f0883e;
  --color-glow-accent: rgba(88,166,255,0.08);
  --color-glow-green: rgba(63,185,80,0.10);
  --color-glow-yellow: rgba(210,153,34,0.10);
  --color-glow-red: rgba(248,81,73,0.10);
  --color-glow-purple: rgba(188,140,255,0.10);
  --color-glow-orange: rgba(240,136,62,0.10);
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
  --glow-accent: var(--color-glow-accent);
  --glow-green: var(--color-glow-green);
  --glow-yellow: var(--color-glow-yellow);
  --glow-red: var(--color-glow-red);
  --glow-purple: var(--color-glow-purple);
  --glow-orange: var(--color-glow-orange);
}
`;

// ── Pattern library ──────────────────────────────────────────────────
//
// Hierarchy:  container → page → grid → section/stat/card → content
//
//   .wh-container    Max-width wrapper, centered, responsive horizontal padding
//   .wh-page         Vertical flex column with consistent gap between siblings
//
//   .wh-grid         Single auto-fit grid — items spread evenly
//   .wh-col-2        Span two grid tracks (for wider items like cards)
//   .wh-col-full     Span all grid tracks
//
//   .wh-section      Boxed content area with heading bar
//   .wh-stat         Individual stat display (value + label + optional delta)
//   .wh-card         Clickable content card with hover state
//   .wh-badge        Inline label (domain, severity, category, status)
//   .wh-tag          Pill-shaped tag (for user-defined tags)
//   .wh-list-item    Compact list row inside a section
//
//   .wh-filter-bar   Filter toolbar with inputs/selects
//   .wh-modal-field  Key/value pair inside modal detail views
//   .wh-empty        Empty-state placeholder
//
// Spacing: parent containers own the gap between children.
// Children never set margin-bottom to space themselves from siblings.

export const CUSTOM_CSS = `

/* ── Reset ── */

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: radial-gradient(ellipse at top, #111820 0%, var(--color-surface) 60%);
}

/* ── Container ── */

.wh-container {
  @apply max-w-[1600px] w-full mx-auto px-4 md:px-8 lg:px-10;
}

/* ── Page layout ── */

.wh-page {
  @apply flex flex-col gap-8;
}

/* ── Grid ── */
/*
 * One grid class. auto-fit means items always spread evenly:
 *   6 stats  → 6 columns       2 sections → 2 columns
 *   4 stats  → 4 columns       1 section  → full width
 * For wider items (cards), add .wh-col-2 to span two tracks.
 */

.wh-grid {
  @apply grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4;
}
.wh-col-2 { grid-column: span 2; }
.wh-col-full { grid-column: 1 / -1; }

@media (max-width: 640px) {
  .wh-grid { grid-template-columns: 1fr; }
  .wh-col-2 { grid-column: auto; }
}
.wh-flex-row {
  @apply flex items-center gap-3;
}
.wh-flex-wrap {
  @apply flex flex-wrap gap-2 items-center;
}

/* ── Stat ── */

.wh-stat {
  @apply bg-card border border-edge rounded-lg p-5
         transition-all duration-150
         shadow-[0_1px_2px_rgba(0,0,0,0.15)]
         hover:shadow-[0_2px_8px_rgba(0,0,0,0.25)]
         hover:border-edge-hover;
}
.wh-stat-value {
  @apply text-3xl font-bold font-mono leading-none tracking-tight;
}
.wh-stat-value.good { @apply text-green; }
.wh-stat-value.warn { @apply text-yellow; }
.wh-stat-label {
  @apply text-xs text-muted uppercase tracking-wide mt-2;
}
.wh-stat-delta {
  @apply text-[11px] font-mono mt-2;
}

/* ── Card ── */

.wh-card {
  @apply bg-card border border-edge rounded-lg p-5 cursor-pointer
         transition-all duration-150 ease-out
         shadow-[0_1px_3px_rgba(0,0,0,0.2),0_1px_2px_rgba(0,0,0,0.12)];
}
.wh-card:hover {
  @apply bg-card-hover border-edge-hover
         shadow-[0_4px_12px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.2)];
}
.wh-card:active { @apply scale-[0.995]; }

/* ── Section ── */

.wh-section {
  @apply bg-card border border-edge rounded-lg p-6 relative overflow-hidden;
}
.wh-section::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--color-edge-hover) 50%, transparent 100%);
}
.wh-section h2 {
  @apply text-xs font-bold uppercase tracking-widest text-muted mb-5 flex items-center gap-2;
}
.wh-section h2::before {
  content: '';
  width: 3px;
  height: 14px;
  background: var(--color-accent);
  border-radius: 2px;
  flex-shrink: 0;
}

/* ── Badge ── */

.wh-badge {
  @apply inline-block text-[11px] font-mono font-medium px-2 py-px rounded-md
         border border-edge text-muted bg-raised;
}
.wh-badge-critical { @apply border-red/30 text-red bg-glow-red; }
.wh-badge-important { @apply border-yellow/30 text-yellow bg-glow-yellow; }
.wh-badge-preference { @apply border-purple/30 text-purple bg-glow-purple; }

/* ── Tag ── */

.wh-tag {
  @apply inline-block text-[11px] font-mono px-2 py-1 rounded-full
         bg-glow-accent text-accent border border-accent/20;
}

/* ── List ── */

.wh-list-item {
  @apply py-4 px-3 -mx-3 border-b border-edge-subtle text-sm rounded transition-colors;
}
.wh-list-item:hover { @apply bg-raised; }
.wh-list-item:last-child { @apply border-b-0; }

/* ── Filter bar ── */

.wh-filter-bar {
  @apply flex gap-3 flex-wrap items-center p-4 bg-raised/50 rounded-lg border border-edge-subtle;
}
.wh-filter-select {
  @apply bg-surface text-primary border border-edge rounded-md py-2 px-3
         text-xs font-sans transition-colors
         focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30;
}
.wh-filter-input {
  @apply bg-surface text-primary border border-edge rounded-md py-2 px-3
         text-xs font-sans min-w-[180px] transition-colors
         focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30;
}
.wh-filter-btn {
  @apply bg-surface text-muted border border-edge rounded-md py-2 px-3
         text-xs cursor-pointer font-sans transition-colors
         hover:text-primary hover:border-edge-hover hover:bg-raised
         focus:outline-none focus:ring-1 focus:ring-accent/30;
}

/* ── Modal ── */

.wh-modal-field { @apply mb-5 pb-5 border-b border-edge-subtle; }
.wh-modal-field:last-child { @apply mb-0 pb-0 border-b-0; }
.wh-field-label {
  @apply text-[11px] font-bold text-muted uppercase tracking-widest mb-2 font-mono;
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
  @apply bg-raised py-3 px-3 rounded-md block font-mono text-[13px] leading-normal overflow-x-auto
         border-l-2 border-l-edge-hover;
}

/* ── Empty state ── */

.wh-empty {
  @apply text-muted text-sm py-10 text-center border border-dashed border-edge-subtle rounded-lg;
}

/* ── Show more button ── */

.wh-show-more {
  @apply block w-full bg-transparent border-none text-muted p-3 mt-4
         text-xs cursor-pointer rounded-md transition-colors;
}
.wh-show-more:hover {
  @apply text-accent bg-raised;
}

/* ── Utilities (pseudo-elements, transitions, clamp) ── */

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.clickable { cursor: pointer; transition: background-color 0.15s; }
.clickable:hover { background-color: var(--color-raised); border-radius: 6px; }
.clickable:hover .title { color: var(--color-accent); }

.bar-fill-encoded, .bar-fill-unencoded, .gap-bar-fill {
  transition: width 0.4s ease;
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
`;
