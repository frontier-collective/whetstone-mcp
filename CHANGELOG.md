# Changelog

All notable changes to Whetstone are documented here.

## [0.3.1] - 2026-03-11

- Fix stale database connection after clear-db (299a10a)
- Update README with db_path tool, db-path and clear-db commands (da0d656)


## [0.3.0] - 2026-03-11

- Dashboard: add flywheel-driven sections (5bd617c)
- Add right margin to dashboard badge labels (c2aab52)
- Add clear-db command to wipe and recreate database (30bbcb5)
- Add db-path to CLI help output (a7c707f)
- Add db-path CLI command (393cea2)
- Add db_path MCP tool for querying database location (1329fb7)
- Update docs for better-sqlite3, dashboard, and list tool (bac4d10)


## [0.2.0] - 2026-03-11




## [0.1.1] - 2026-03-11

- Improve dashboard with 8 enhancements (405124a)
- Migrate from sql.js to better-sqlite3 (d69da4f)
- Add dashboard footer with version/license and CLI database diagnostics (69a7d1c)
- Add web dashboard for browsing rejections and constraints (3f800ce)
- Add list tool for browsing rejections by domain and status (f885a04)


## [0.1.0] - 2026-03-11

- Initial public release of Whetstone MCP
- MCP server with SQLite backend for capturing and encoding human rejections
- 10 MCP tools: reject, constrain, get_constraints, search, applied, link, update_constraint, export, patterns, stats
- CLI interface with all tools available as subcommands
- Pre-push git hook for automatic constraint exports
- Project initialization with `whetstone init`
- Pattern detection for uncoded rejection clusters
- Markdown and JSON export formats
- Published as @frontier-collective/whetstone-mcp on npm
