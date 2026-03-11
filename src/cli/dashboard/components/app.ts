// <whet-app> — Top-level application shell.
// Owns routing, auto-refresh timer, and page switching.
// Renders <whet-nav> + page components + modal overlay.
// Delegates data fetching to page components via load().
// Exposes global functions for backward compat with onclick handlers.

export const APP = `
class WhetApp extends WhetBase {
  connectedCallback() {
    super.connectedCallback();
    this.currentPage = 'overview';
    this._autoRefresh = true;
    this._refreshTimer = null;

    // Render the shell DOM (one-time setup)
    this.innerHTML = document.getElementById('app-template').innerHTML;

    // Wire up nav events
    var nav = this.querySelector('whet-nav');
    var self = this;
    nav.addEventListener('page-change', function(e) { self.switchPage(e.detail); });
    nav.addEventListener('manual-refresh', function() { self.refresh(); });
    nav.addEventListener('toggle-refresh', function() { self.toggleAuto(); });

    // Expose globally for onclick handlers still in vanilla JS
    window.app = self;
    window.switchPage = function(p) { self.switchPage(p); };
    window.refresh = function() { self.refresh(); };
    window.toggleAuto = function() { self.toggleAuto(); };

    // Hash routing
    if (window.location.hash === '#constraints') {
      this.switchPage('constraints');
    } else if (window.location.hash === '#rejections') {
      this.switchPage('rejections');
    } else {
      this.refresh();
    }
    this.startAutoRefresh();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._refreshTimer) clearInterval(this._refreshTimer);
  }

  switchPage(page) {
    this.currentPage = page;
    this.querySelector('#page-overview').style.display = page === 'overview' ? '' : 'none';
    this.querySelector('#page-rejections').style.display = page === 'rejections' ? '' : 'none';
    this.querySelector('#page-constraints').style.display = page === 'constraints' ? '' : 'none';

    // Update nav
    var nav = this.querySelector('whet-nav');
    nav.currentPage = page;

    window.location.hash = page === 'overview' ? '' : page;

    // Delegate to page component
    var pageEl = this.querySelector('#page-' + page);
    if (pageEl && pageEl.load) pageEl.load();
  }

  async refresh() {
    var nav = this.querySelector('whet-nav');
    nav.status = 'Refreshing...';
    try {
      var pageEl = this.querySelector('#page-' + this.currentPage);
      if (pageEl && pageEl.load) {
        await pageEl.load();
      }
      nav.status = 'Updated ' + new Date().toLocaleTimeString();
    } catch (err) {
      nav.status = 'Error: ' + err.message;
    }
  }

  toggleAuto() {
    this._autoRefresh = !this._autoRefresh;
    var nav = this.querySelector('whet-nav');
    nav.autoRefresh = this._autoRefresh;
    if (this._autoRefresh) {
      this.startAutoRefresh();
    } else {
      if (this._refreshTimer) { clearInterval(this._refreshTimer); this._refreshTimer = null; }
    }
  }

  startAutoRefresh() {
    var self = this;
    if (this._refreshTimer) clearInterval(this._refreshTimer);
    this._refreshTimer = setInterval(function() { self.refresh(); }, 10000);
  }
}
customElements.define('whet-app', WhetApp);
`;
