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
    this.className = 'badge' + (this.variant ? ' ' + this.variant : '');
  }

  render() {
    this.textContent = this.text || '';
  }
}
customElements.define('whet-badge', WhetBadge);
`;
