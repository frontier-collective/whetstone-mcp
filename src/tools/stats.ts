import { getDb } from "../db/connection.js";

export interface StatsResult {
  total_rejections: number;
  total_constraints: number;
  active_constraints: number;
  rejections_by_domain: Array<{ domain: string; count: number }>;
  encoded_by_domain: Array<{ domain: string; count: number }>;
  most_applied: Array<{ id: string; title: string; domain: string; severity: string; times_applied: number; rule: string; reasoning: string | null; rejected_example: string | null; accepted_example: string | null }>;
  unencoded_rejections: number;
  stale_constraints: Array<{ id: string; title: string; domain: string; severity: string; created_at: string; rule: string; reasoning: string | null; rejected_example: string | null; accepted_example: string | null }>;
  elevation_candidates: Array<{ id: string; title: string; domain: string; severity: string; times_applied: number; rule: string; reasoning: string | null; rejected_example: string | null; accepted_example: string | null }>;
  recently_encoded: Array<{ id: string; description: string; domain: string; constraint_id: string; created_at: string }>;
  // New: weekly deltas for trajectory
  week_delta: {
    rejections: number;
    constraints: number;
    encoded: number;
  };
  // New: graduation candidates (applied 8+, proven durable)
  graduation_candidates: Array<{ id: string; title: string; domain: string; severity: string; times_applied: number; rule: string; reasoning: string | null; rejected_example: string | null; accepted_example: string | null }>;
  // New: domain gaps (domains with most unencoded rejections as % of total)
  domain_gaps: Array<{ domain: string; total: number; encoded: number; unencoded: number; coverage_pct: number }>;
  // New: dead constraints (were applied, haven't been applied recently)
  dead_constraints: Array<{ id: string; title: string; domain: string; severity: string; times_applied: number; last_applied_at: string; rule: string; reasoning: string | null; rejected_example: string | null; accepted_example: string | null }>;
}

export function stats(): StatsResult {
  const db = getDb();

  const totalRejections = (db.prepare("SELECT COUNT(*) as count FROM rejections").get() as { count: number }).count;
  const totalConstraints = (db.prepare("SELECT COUNT(*) as count FROM constraints").get() as { count: number }).count;
  const activeConstraints = (db.prepare("SELECT COUNT(*) as count FROM constraints WHERE status = 'active'").get() as { count: number }).count;
  const unencodedRejections = (db.prepare("SELECT COUNT(*) as count FROM rejections WHERE constraint_id IS NULL").get() as { count: number }).count;

  const rejectionsByDomain = db.prepare(`
    SELECT domain, COUNT(*) as count FROM rejections
    GROUP BY domain ORDER BY count DESC
  `).all() as Array<{ domain: string; count: number }>;

  const encodedByDomain = db.prepare(`
    SELECT domain, COUNT(*) as count FROM rejections
    WHERE constraint_id IS NOT NULL
    GROUP BY domain ORDER BY count DESC
  `).all() as Array<{ domain: string; count: number }>;

  const mostApplied = db.prepare(`
    SELECT id, title, domain, severity, times_applied, rule, reasoning, rejected_example, accepted_example FROM constraints
    WHERE status = 'active' AND times_applied > 0
    ORDER BY times_applied DESC
    LIMIT 10
  `).all() as StatsResult["most_applied"];

  // Active constraints with 0 applications, older than 7 days
  const staleConstraints = db.prepare(`
    SELECT id, title, domain, severity, created_at, rule, reasoning, rejected_example, accepted_example FROM constraints
    WHERE status = 'active'
      AND times_applied = 0
      AND created_at <= ?
    ORDER BY created_at ASC
    LIMIT 10
  `).all(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) as StatsResult["stale_constraints"];

  // Frequently applied constraints that aren't critical yet
  const elevationCandidates = db.prepare(`
    SELECT id, title, domain, severity, times_applied, rule, reasoning, rejected_example, accepted_example FROM constraints
    WHERE status = 'active'
      AND times_applied >= 5
      AND severity != 'critical'
    ORDER BY times_applied DESC
    LIMIT 10
  `).all() as StatsResult["elevation_candidates"];

  const recentlyEncoded = db.prepare(`
    SELECT id, description, domain, constraint_id, created_at FROM rejections
    WHERE constraint_id IS NOT NULL
    ORDER BY created_at DESC
    LIMIT 10
  `).all() as StatsResult["recently_encoded"];

  // --- New queries ---

  // Weekly deltas: how many rejections/constraints were created in last 7 days
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const weekRejections = (db.prepare("SELECT COUNT(*) as count FROM rejections WHERE created_at >= ?").get(weekAgo) as { count: number }).count;
  const weekConstraints = (db.prepare("SELECT COUNT(*) as count FROM constraints WHERE created_at >= ?").get(weekAgo) as { count: number }).count;
  const weekEncoded = (db.prepare("SELECT COUNT(*) as count FROM rejections WHERE constraint_id IS NOT NULL AND created_at >= ?").get(weekAgo) as { count: number }).count;

  // Graduation candidates: applied 8+ times, proven durable — ready to move to CLAUDE.md
  const graduationCandidates = db.prepare(`
    SELECT id, title, domain, severity, times_applied, rule, reasoning, rejected_example, accepted_example FROM constraints
    WHERE status = 'active'
      AND times_applied >= 8
    ORDER BY times_applied DESC
    LIMIT 10
  `).all() as StatsResult["graduation_candidates"];

  // Domain gaps: domains ranked by worst coverage
  const encodedMap = new Map<string, number>();
  for (const e of encodedByDomain) {
    encodedMap.set(e.domain, e.count);
  }
  const domainGaps: StatsResult["domain_gaps"] = rejectionsByDomain
    .map((d) => {
      const encoded = encodedMap.get(d.domain) || 0;
      const unencoded = d.count - encoded;
      const coverage_pct = d.count > 0 ? Math.round((encoded / d.count) * 100) : 100;
      return { domain: d.domain, total: d.count, encoded, unencoded, coverage_pct };
    })
    .filter((d) => d.unencoded > 0)
    .sort((a, b) => a.coverage_pct - b.coverage_pct);

  // Dead constraints: have been applied (times_applied > 0) but last applied > 30 days ago
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const deadConstraints = db.prepare(`
    SELECT id, title, domain, severity, times_applied, last_applied_at, rule, reasoning, rejected_example, accepted_example FROM constraints
    WHERE status = 'active'
      AND times_applied > 0
      AND last_applied_at IS NOT NULL
      AND last_applied_at <= ?
    ORDER BY last_applied_at ASC
    LIMIT 10
  `).all(thirtyDaysAgo) as StatsResult["dead_constraints"];

  return {
    total_rejections: totalRejections,
    total_constraints: totalConstraints,
    active_constraints: activeConstraints,
    rejections_by_domain: rejectionsByDomain,
    encoded_by_domain: encodedByDomain,
    most_applied: mostApplied,
    unencoded_rejections: unencodedRejections,
    stale_constraints: staleConstraints,
    elevation_candidates: elevationCandidates,
    recently_encoded: recentlyEncoded,
    week_delta: {
      rejections: weekRejections,
      constraints: weekConstraints,
      encoded: weekEncoded,
    },
    graduation_candidates: graduationCandidates,
    domain_gaps: domainGaps,
    dead_constraints: deadConstraints,
  };
}
