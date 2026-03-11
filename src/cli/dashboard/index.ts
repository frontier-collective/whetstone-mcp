// Dashboard HTML assembly.
// Phase 1: Passthrough — imports from the legacy dashboard-html.ts.
// Future phases will replace this with Lit component assembly.

import { getDashboardHtml as getLegacyHtml } from "../dashboard-html.js";

export function getDashboardHtml(version: string): string {
  return getLegacyHtml(version);
}
