// <whet-badge> — Reusable badge component for domain, severity, category, status.
// Attributes: text, variant (optional: critical/important/preference)

export const BADGE = `
class WhetBadge extends WhetBase {
  static get properties() {
    return {
      text: { type: String },
      variant: { type: String },
    };
  }

  constructor() {
    super();
    this.text = '';
    this.variant = '';
  }

  updated() {
    var base = 'inline-block text-[11px] font-mono font-medium px-2 py-px mr-1.5 rounded-md border';
    if (this.variant === 'critical') this.className = base + ' border-red/30 text-red bg-glow-red';
    else if (this.variant === 'important') this.className = base + ' border-yellow/30 text-yellow bg-glow-yellow';
    else if (this.variant === 'preference') this.className = base + ' border-purple/30 text-purple bg-glow-purple';
    else this.className = base + ' border-edge text-muted bg-raised';
  }

  render() {
    this.textContent = this.text || '';
  }
}
customElements.define('whet-badge', WhetBadge);
`;
