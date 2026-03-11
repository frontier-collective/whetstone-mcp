// <whet-overview> — Overview page with stats, domain bars, and insight sections.
// Receives data via load(stats, listResult, patternsData) from <whet-app>.
// Exposes global wrappers for backward compat with onclick handlers.

export const OVERVIEW = `
class WhetOverview extends WhetBase {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = this._template();

    // Expose global wrappers for onclick handlers
    var self = this;
    window.toggleAppliedList = function(btn) { self._toggleAppliedList(btn); };
    window.toggleUnencodedList = function(btn) { self._toggleUnencodedList(btn); };
    window.renderStatsCards = function(s) { self._renderStatsCards(s); };
    window.renderDomainBars = function(s) { self._renderDomainBars(s); };
    window.renderMostApplied = function(s) { self._renderMostApplied(s); };
    window.renderUnencoded = function(lr) { self._renderUnencoded(lr); };
    window.renderRecentlyEncoded = function(s) { self._renderRecentlyEncoded(s); };
    window.renderPatterns = function(p) { self._renderPatterns(p); };
    window.renderGraduation = function(s) { self._renderGraduation(s); };
    window.renderDomainGaps = function(s) { self._renderDomainGaps(s); };
    window.renderDead = function(s) { self._renderDead(s); };
    window.renderElevation = function(s) { self._renderElevation(s); };
  }

  _template() {
    return '<section class="stats-grid" id="stats-cards"></section>' +
      '<section class="two-col">' +
        '<div class="card"><h2>Rejections by Domain</h2><div id="domain-bars"></div></div>' +
        '<div class="card"><h2>Most Applied Constraints</h2><div id="applied-list"></div></div>' +
      '</section>' +
      '<section class="two-col">' +
        '<div class="card"><h2>Unencoded Rejections</h2><div id="unencoded-list"></div></div>' +
        '<div class="card"><h2>Recently Encoded</h2><div id="recently-encoded-list"></div></div>' +
      '</section>' +
      '<section class="card" id="patterns-section" style="display:none">' +
        '<h2>Encode These Next <span class="section-label">\\u2014 recurring rejection patterns without constraints</span></h2>' +
        '<div id="patterns-list"></div>' +
      '</section>' +
      '<section class="two-col" id="gaps-graduation-section" style="display:none">' +
        '<div class="card" id="domain-gaps-section"><h2>Domain Gaps <span class="section-label">\\u2014 taste being lost</span></h2><div id="domain-gaps-list"></div></div>' +
        '<div class="card" id="graduation-section"><h2>Ready to Graduate <span class="section-label">\\u2014 move to CLAUDE.md</span></h2><div id="graduation-list"></div></div>' +
      '</section>' +
      '<section class="two-col" id="dead-elevation-section">' +
        '<div class="card" id="dead-section" style="display:none"><h2>Fading Constraints <span class="section-label">\\u2014 applied before, silent now</span></h2><div id="dead-list"></div></div>' +
        '<div class="card"><h2>Elevation Candidates</h2><div id="elevation-list"></div></div>' +
      '</section>';
  }

  async load() {
    var results = await Promise.all([
      fetchJson('/api/stats'),
      fetchJson('/api/list?status=unencoded&limit=30'),
      fetchJson('/api/patterns')
    ]);
    var stats = results[0];
    var listResult = results[1];
    var patternsData = results[2];
    this._renderStatsCards(stats);
    this._renderDomainBars(stats);
    this._renderMostApplied(stats);
    this._renderPatterns(patternsData);
    this._renderUnencoded(listResult);
    this._renderRecentlyEncoded(stats);
    this._renderDomainGaps(stats);
    this._renderGraduation(stats);
    this._renderDead(stats);
    this._renderElevation(stats);
  }

  _renderStatsCards(s) {
    var el = document.getElementById('stats-cards');
    var unencodedClass = s.unencoded_rejections > 0 ? 'warn' : '';
    var encoded = s.total_rejections - s.unencoded_rejections;
    var coveragePct = s.total_rejections > 0 ? Math.round((encoded / s.total_rejections) * 100) : 0;
    var coverageClass = coveragePct >= 80 ? 'good' : coveragePct >= 50 ? '' : 'warn';
    var wd = s.week_delta || {};
    var domainCount = (s.rejections_by_domain || []).length;
    el.innerHTML =
      '<whet-stat-card value="' + s.total_rejections + '" label="Rejections" delta="' + esc(deltaText(wd.rejections, 'this week')) + '"></whet-stat-card>' +
      '<whet-stat-card value="' + s.total_constraints + '" label="Constraints" delta="' + esc(deltaText(wd.constraints, 'this week')) + '"></whet-stat-card>' +
      '<whet-stat-card value="' + s.active_constraints + '" label="Active" value-class="good"></whet-stat-card>' +
      '<whet-stat-card value="' + s.unencoded_rejections + '" label="Unencoded"' + (unencodedClass ? ' value-class="' + unencodedClass + '"' : '') + '></whet-stat-card>' +
      '<whet-stat-card value="' + coveragePct + '%" label="Coverage"' + (coverageClass ? ' value-class="' + coverageClass + '"' : '') + ' delta="' + esc(deltaText(wd.encoded, 'encoded this week')) + '"></whet-stat-card>' +
      '<whet-stat-card value="' + domainCount + '" label="Domains"></whet-stat-card>';
  }

  _renderDomainBars(s) {
    var el = document.getElementById('domain-bars');
    var domains = s.rejections_by_domain || [];
    if (domains.length === 0) {
      el.innerHTML = '<div class="empty">No rejections yet</div>';
      return;
    }
    var encodedMap = {};
    var enc = s.encoded_by_domain || [];
    for (var j = 0; j < enc.length; j++) {
      encodedMap[enc[j].domain] = enc[j].count;
    }
    var max = Math.max.apply(null, domains.map(function(d) { return d.count; }));
    var html = '<div class="bar-legend"><span class="legend-encoded">Encoded</span><span class="legend-unencoded">Unencoded</span></div>';
    for (var i = 0; i < domains.length; i++) {
      var d = domains[i];
      var encodedCount = encodedMap[d.domain] || 0;
      var unencodedCount = d.count - encodedCount;
      var encodedPct = max > 0 ? Math.round((encodedCount / max) * 100) : 0;
      var unencodedPct = max > 0 ? Math.round((unencodedCount / max) * 100) : 0;
      html += '<div class="bar-row">' +
        '<div class="bar-label">' + esc(d.domain) + '</div>' +
        '<div class="bar-track">' +
          '<div class="bar-fill-encoded" style="width:' + encodedPct + '%"></div>' +
          '<div class="bar-fill-unencoded" style="width:' + unencodedPct + '%"></div>' +
        '</div>' +
        '<div class="bar-count">' + encodedCount + '/' + d.count + '</div>' +
        '</div>';
    }
    el.innerHTML = html;
  }

  _renderMostApplied(s) {
    var el = document.getElementById('applied-list');
    var items = s.most_applied || [];
    if (items.length === 0) {
      el.innerHTML = '<div class="empty">No constraints applied yet</div>';
      return;
    }
    var limit = 8;
    var showAll = items.length <= limit;
    var visible = showAll ? items : items.slice(0, limit);
    var html = '';
    for (var i = 0; i < visible.length; i++) {
      var c = visible[i];
      html += renderConstraintDetail(c, '<span>Applied ' + c.times_applied + 'x</span>');
    }
    if (!showAll) {
      html += '<button class="show-more-btn" onclick="toggleAppliedList(this)" data-expanded="false">Show ' + (items.length - limit) + ' more</button>';
    }
    el.innerHTML = html;
    el._fullItems = items;
    el._limit = limit;
  }

  _toggleAppliedList(btn) {
    var el = document.getElementById('applied-list');
    var items = el._fullItems;
    var limit = el._limit;
    var expanded = btn.getAttribute('data-expanded') === 'true';
    var visible = expanded ? items.slice(0, limit) : items;
    var html = '';
    for (var i = 0; i < visible.length; i++) {
      var c = visible[i];
      html += renderConstraintDetail(c, '<span>Applied ' + c.times_applied + 'x</span>');
    }
    if (expanded) {
      html += '<button class="show-more-btn" onclick="toggleAppliedList(this)" data-expanded="false">Show ' + (items.length - limit) + ' more</button>';
    } else {
      html += '<button class="show-more-btn" onclick="toggleAppliedList(this)" data-expanded="true">Show less</button>';
    }
    el.innerHTML = html;
    el._fullItems = items;
    el._limit = limit;
  }

  _renderUnencoded(listResult) {
    var el = document.getElementById('unencoded-list');
    var items = listResult.rejections || [];
    if (items.length === 0) {
      el.innerHTML = '<div class="empty">All rejections are encoded \\u2014 nice work</div>';
      return;
    }
    var limit = 10;
    var visible = items.slice(0, limit);
    var html = '';
    for (var i = 0; i < visible.length; i++) {
      var r = visible[i];
      html += '<div class="list-item clickable" onclick="openRejection(\\'' + esc(r.id) + '\\')">' +
        '<div class="title">' + esc(r.description) + '</div>' +
        '<div class="meta">' + domainBadge(r.domain) + '<span>' + timeAgo(r.created_at) + '</span></div></div>';
    }
    if (listResult.total > limit) {
      var remaining = listResult.total - limit;
      html += '<button class="show-more-btn" onclick="toggleUnencodedList(this)" data-expanded="false">' + remaining + ' more unencoded rejections</button>';
    }
    el.innerHTML = html;
    el._allItems = items;
    el._total = listResult.total;
  }

  _toggleUnencodedList(btn) {
    var el = document.getElementById('unencoded-list');
    var items = el._allItems;
    var expanded = btn.getAttribute('data-expanded') === 'true';
    var visible = expanded ? items.slice(0, 10) : items;
    var html = '';
    for (var i = 0; i < visible.length; i++) {
      var r = visible[i];
      html += '<div class="list-item clickable" onclick="openRejection(\\'' + esc(r.id) + '\\')">' +
        '<div class="title">' + esc(r.description) + '</div>' +
        '<div class="meta">' + domainBadge(r.domain) + '<span>' + timeAgo(r.created_at) + '</span></div></div>';
    }
    var remaining = el._total - (expanded ? 10 : items.length);
    if (expanded) {
      html += '<button class="show-more-btn" onclick="toggleUnencodedList(this)" data-expanded="false">' + (el._total - 10) + ' more unencoded rejections</button>';
    } else if (remaining > 0) {
      html += '<div class="empty">' + remaining + ' more not loaded</div>';
    }
    if (!expanded && items.length >= el._total) {
      html += '<button class="show-more-btn" onclick="toggleUnencodedList(this)" data-expanded="true">Show less</button>';
    }
    el.innerHTML = html;
    el._allItems = items;
  }

  _renderRecentlyEncoded(s) {
    var el = document.getElementById('recently-encoded-list');
    var items = s.recently_encoded || [];
    if (items.length === 0) {
      el.innerHTML = '<div class="empty">No encoded rejections yet</div>';
      return;
    }
    var html = '';
    for (var i = 0; i < items.length; i++) {
      var r = items[i];
      html += '<div class="list-item clickable" onclick="openRejection(\\'' + esc(r.id) + '\\')">' +
        '<div class="title">' + esc(r.description) + '</div>' +
        '<div class="meta">' + domainBadge(r.domain) +
        '<span>' + timeAgo(r.created_at) + '</span></div></div>';
    }
    el.innerHTML = html;
  }

  _renderPatterns(patternsData) {
    var section = document.getElementById('patterns-section');
    var el = document.getElementById('patterns-list');
    if (!patternsData || patternsData.length === 0) {
      section.style.display = 'none';
      return;
    }
    section.style.display = '';
    var html = '';
    for (var i = 0; i < Math.min(patternsData.length, 5); i++) {
      var p = patternsData[i];
      html += '<div class="pattern-cluster">' +
        '<div class="pattern-header">' +
        domainBadge(p.domain) +
        '<span class="pattern-count">' + p.count + ' similar rejections</span>' +
        '</div>' +
        '<div class="pattern-theme">Keywords: ' + esc(p.theme) + '</div>' +
        '<div class="pattern-examples">';
      for (var j = 0; j < Math.min(p.descriptions.length, 3); j++) {
        html += '<div>' + esc(p.descriptions[j]) + '</div>';
      }
      if (p.descriptions.length > 3) {
        html += '<div style="color:var(--text-secondary);font-style:italic">+' + (p.descriptions.length - 3) + ' more</div>';
      }
      html += '</div></div>';
    }
    el.innerHTML = html;
  }

  _renderGraduation(s) {
    var section = document.getElementById('graduation-section');
    var el = document.getElementById('graduation-list');
    var items = s.graduation_candidates || [];
    if (items.length === 0) {
      section.style.display = 'none';
      this._updateGapsGraduationWrapper();
      return;
    }
    section.style.display = '';
    var html = '';
    for (var i = 0; i < items.length; i++) {
      var c = items[i];
      html += '<div class="list-item clickable" onclick="openConstraint(\\'' + esc(c.id) + '\\')">' +
        '<div class="title">' + esc(c.title) + '</div>' +
        '<div class="graduation-rule">' + esc(c.rule) + '</div>' +
        '<div class="meta">' + domainBadge(c.domain) + severityBadge(c.severity) +
        '<span>Applied ' + c.times_applied + 'x</span></div></div>';
    }
    el.innerHTML = html;
    this._updateGapsGraduationWrapper();
  }

  _updateGapsGraduationWrapper() {
    var wrapper = document.getElementById('gaps-graduation-section');
    var gaps = document.getElementById('domain-gaps-section');
    var grad = document.getElementById('graduation-section');
    var gapsHidden = gaps.style.display === 'none';
    var gradHidden = grad.style.display === 'none';
    if (gapsHidden && gradHidden) {
      wrapper.style.display = 'none';
    } else {
      wrapper.style.display = '';
      wrapper.style.gridTemplateColumns = (gapsHidden || gradHidden) ? '1fr' : '1fr 1fr';
    }
  }

  _updateDeadElevationWrapper() {
    var wrapper = document.getElementById('dead-elevation-section');
    var dead = document.getElementById('dead-section');
    var deadHidden = dead.style.display === 'none';
    wrapper.style.gridTemplateColumns = deadHidden ? '1fr' : '1fr 1fr';
  }

  _renderDomainGaps(s) {
    var section = document.getElementById('domain-gaps-section');
    var el = document.getElementById('domain-gaps-list');
    var items = s.domain_gaps || [];
    if (items.length === 0) {
      section.style.display = 'none';
      this._updateGapsGraduationWrapper();
      return;
    }
    section.style.display = '';
    var html = '';
    for (var i = 0; i < items.length; i++) {
      var d = items[i];
      var gapPct = 100 - d.coverage_pct;
      html += '<div class="domain-gap">' +
        '<div class="gap-domain">' + esc(d.domain) + '</div>' +
        '<div class="gap-bar"><div class="gap-bar-fill" style="width:' + gapPct + '%"></div></div>' +
        '<div class="gap-stats">' + d.unencoded + ' unencoded / ' + d.coverage_pct + '% covered</div>' +
        '</div>';
    }
    el.innerHTML = html;
    this._updateGapsGraduationWrapper();
  }

  _renderDead(s) {
    var section = document.getElementById('dead-section');
    var el = document.getElementById('dead-list');
    var items = s.dead_constraints || [];
    if (items.length === 0) {
      section.style.display = 'none';
      this._updateDeadElevationWrapper();
      return;
    }
    section.style.display = '';
    var html = '';
    for (var i = 0; i < items.length; i++) {
      var c = items[i];
      html += renderConstraintDetail(c, '<span>Applied ' + c.times_applied + 'x \\u00B7 last ' + timeAgo(c.last_applied_at) + '</span>');
    }
    el.innerHTML = html;
    this._updateDeadElevationWrapper();
  }

  _renderElevation(s) {
    var el = document.getElementById('elevation-list');
    var items = s.elevation_candidates || [];
    if (items.length === 0) {
      el.innerHTML = '<div class="empty">No elevation candidates</div>';
      return;
    }
    var html = '';
    for (var i = 0; i < items.length; i++) {
      var c = items[i];
      html += renderConstraintDetail(c, '<span>Applied ' + c.times_applied + 'x</span>');
    }
    el.innerHTML = html;
  }
}
customElements.define('whet-overview', WhetOverview);
`;
