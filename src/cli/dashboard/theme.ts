// Tailwind v4 @theme configuration for the Whetstone dark theme.
// These map the existing CSS custom properties to Tailwind tokens.
// Used in Phase 5 when we convert raw CSS to Tailwind utility classes.

export const THEME = `
@theme {
  --color-bg-primary: #0d1117;
  --color-bg-secondary: #161b22;
  --color-bg-card: #1c2128;
  --color-border: #30363d;
  --color-text-primary: #e6edf3;
  --color-text-secondary: #8b949e;
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
