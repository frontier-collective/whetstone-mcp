// <whet-rejections> — Rejections page with filters, summary stats, patterns, and list.
// Owns filter state and data fetching.
// Exposes load() for <whet-app> to call on page switch/refresh.

export const REJECTIONS = `
class WhetRejections extends WhetBase {
  connectedCallback() {
    super.connectedCallback();
    this._searchTimer = null;
    this.innerHTML = this._template();

    // Expose global wrappers for backward compat with onclick handlers
    var self = this;
    window.applyRejectionFilters = function() { self.load(); };
    window.debounceRejectionSearch = function() { self._debounceSearch(); };
    window.clearRejectionFilters = function() { self._clearFilters(); };
    window.loadRejectionsPage = function() { self.load(); };
  }

  _template() {
    return '<div class="filter-bar">' +
      '<select id="rf-domain" onchange="applyRejectionFilters()"><option value="">All Domains</option></select>' +
      '<select id="rf-encoded" onchange="applyRejectionFilters()">' +
        '<option value="">All</option>' +
        '<option value="no">Unencoded</option>' +
        '<option value="yes">Encoded</option>' +
      '</select>' +
      '<select id="rf-sort" onchange="applyRejectionFilters()">' +
        '<option value="newest">Newest First</option>' +
        '<option value="oldest">Oldest First</option>' +
      '</select>' +
      '<input type="text" id="rf-search" placeholder="Search rejections..." oninput="debounceRejectionSearch()">' +
      '<button onclick="clearRejectionFilters()">Clear</button>' +
    '</div>' +
    '<div class="constraints-summary" id="rejections-summary"></div>' +
    '<section class="card" id="rej-patterns-section" style="display:none">' +
      '<h2>Patterns <span class="section-label">\\u2014 recurring themes in unencoded rejections</span></h2>' +
      '<div id="rej-patterns-list"></div>' +
    '</section>' +
    '<div id="rejections-count" class="results-count"></div>' +
    '<div id="rejections-list"></div>';
  }

  _buildFilterParams() {
    var parts = [];
    var d = document.getElementById('rf-domain').value;
    var enc = document.getElementById('rf-encoded').value;
    var sort = document.getElementById('rf-sort').value;
    var q = document.getElementById('rf-search').value.trim();
    if (d) parts.push('domain=' + encodeURIComponent(d));
    if (enc) parts.push('encoded=' + encodeURIComponent(enc));
    if (sort) parts.push('sort=' + encodeURIComponent(sort));
    if (q) parts.push('q=' + encodeURIComponent(q));
    return parts.length > 0 ? '?' + parts.join('&') : '';
  }

  _debounceSearch() {
    var self = this;
    if (this._searchTimer) clearTimeout(this._searchTimer);
    this._searchTimer = setTimeout(function() { self.load(); }, 300);
  }

  _clearFilters() {
    document.getElementById('rf-domain').value = '';
    document.getElementById('rf-encoded').value = '';
    document.getElementById('rf-sort').value = 'newest';
    document.getElementById('rf-search').value = '';
    this.load();
  }

  _populateDropdowns(summary) {
    var domainEl = document.getElementById('rf-domain');
    var cur = domainEl.value;
    domainEl.innerHTML = '<option value="">All Domains</option>';
    var domains = summary.by_domain || [];
    for (var i = 0; i < domains.length; i++) {
      domainEl.innerHTML += '<option value="' + esc(domains[i].domain) + '">' + esc(domains[i].domain) + ' (' + domains[i].count + ')</option>';
    }
    domainEl.value = cur;
  }

  _renderSummary(summary) {
    var el = document.getElementById('rejections-summary');
    el.innerHTML =
      '<whet-stat-card value="' + (summary.total || 0) + '" label="Total"></whet-stat-card>' +
      '<whet-stat-card value="' + (summary.unencoded || 0) + '" label="Unencoded" value-color="var(--accent-yellow)"></whet-stat-card>' +
      '<whet-stat-card value="' + (summary.encoded || 0) + '" label="Encoded" value-class="good"></whet-stat-card>' +
      '<whet-stat-card value="' + ((summary.by_domain || []).length) + '" label="Domains"></whet-stat-card>';
  }

  _renderPatterns(patternsData) {
    var section = document.getElementById('rej-patterns-section');
    var el = document.getElementById('rej-patterns-list');
    if (!patternsData || patternsData.length === 0) {
      section.style.display = 'none';
      return;
    }
    section.style.display = '';
    var html = '';
    for (var i = 0; i < patternsData.length; i++) {
      var p = patternsData[i];
      html += '<div class="pattern-banner">';
      html += '<div class="pattern-count">' + p.count + '</div>';
      html += '<div><div class="pattern-info">' + esc(p.theme) + '</div>';
      html += '<div class="pattern-domain">' + esc(p.domain) + ' \\u00B7 ' + p.count + ' similar rejections \\u00B7 ' + (p.sample_ids ? p.sample_ids.length : 0) + ' samples</div>';
      html += '</div></div>';
    }
    el.innerHTML = html;
  }

  _renderList(rejections) {
    var countEl = document.getElementById('rejections-count');
    var el = document.getElementById('rejections-list');
    countEl.innerHTML = rejections.length + ' rejection' + (rejections.length !== 1 ? 's' : '');

    if (rejections.length === 0) {
      el.innerHTML = '<div class="empty">No rejections match the current filters</div>';
      return;
    }

    var html = '';
    for (var i = 0; i < rejections.length; i++) {
      var r = rejections[i];
      var encodedHtml = '';
      if (r.constraint_id) {
        encodedHtml = '<div class="rejection-constraint-link">\\u2192 ' + esc(r.constraint_title || r.constraint_id) + '</div>';
      } else {
        encodedHtml = '<span style="font-size:11px;color:var(--accent-yellow)">unencoded</span>';
      }

      html += '<div class="rejection-card" onclick="openRejection(\\'' + esc(r.id) + '\\')">';
      html += '<div class="rejection-desc">' + esc(r.description) + '</div>';
      if (r.reasoning) html += '<div class="rejection-reasoning">' + esc(r.reasoning) + '</div>';
      html += '<div class="constraint-meta">';
      html += domainBadge(r.domain) + ' ' + encodedHtml;
      html += '</div>';
      html += '<div class="constraint-stats">' + timeAgo(r.created_at) + '</div>';
      html += '</div>';
    }
    el.innerHTML = html;
  }

  async load() {
    var params = this._buildFilterParams();
    try {
      var results = await Promise.all([
        fetchJson('/api/rejections/all' + params),
        fetchJson('/api/rejections/summary'),
        fetchJson('/api/patterns')
      ]);
      this._populateDropdowns(results[1]);
      this._renderSummary(results[1]);
      this._renderPatterns(results[2]);
      this._renderList(results[0]);
    } catch(err) {
      document.getElementById('rejections-list').innerHTML = '<div class="empty">Error: ' + esc(err.message) + '</div>';
    }
  }
}
customElements.define('whet-rejections', WhetRejections);
`;
