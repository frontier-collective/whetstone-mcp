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
    var base = 'inline-block text-[11px] font-mono px-1.5 mr-2 rounded border';
    if (this.variant === 'critical') this.className = base + ' border-red text-red';
    else if (this.variant === 'important') this.className = base + ' border-yellow text-yellow';
    else if (this.variant === 'preference') this.className = base + ' border-purple text-purple';
    else this.className = base + ' border-edge text-muted';
  }

  render() {
    this.textContent = this.text || '';
  }
}
customElements.define('whet-badge', WhetBadge);
`;
