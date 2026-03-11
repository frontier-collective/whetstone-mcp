// <whet-stat-card> — Reusable stat card component.
// Attributes: value, label, delta (optional), value-class (optional: good/warn), value-color (optional inline color)

export const STAT_CARD = `
class WhetStatCard extends WhetBase {
  static get properties() {
    return {
      value: { type: String },
      label: { type: String },
      delta: { type: String },
    };
  }

  constructor() {
    super();
    this.value = '';
    this.label = '';
    this.delta = '';
  }

  updated() {
    // Apply stat-card class + optional variant class to the element itself
    var vc = this.getAttribute('value-class') || '';
    this.className = 'stat-card' + (vc ? ' ' + vc : '');
  }

  render() {
    var colorStyle = this.getAttribute('value-color');
    var styleAttr = colorStyle ? ' style="color:' + colorStyle + '"' : '';
    // Use innerHTML approach for the value since we need optional style attribute
    var h = '<div class="value"' + styleAttr + '>' + esc(this.value) + '</div>';
    h += '<div class="label">' + esc(this.label) + '</div>';
    if (this.delta) {
      var n = parseFloat(this.delta);
      var cls = n > 0 ? 'positive' : n < 0 ? 'negative' : '';
      h += '<div class="delta ' + cls + '">' + esc(this.delta) + '</div>';
    }
    this.innerHTML = h;
  }
}
customElements.define('whet-stat-card', WhetStatCard);
`;
