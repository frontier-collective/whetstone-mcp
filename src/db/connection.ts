import Database from "better-sqlite3";
import type { Database as DatabaseType, Statement } from "better-sqlite3";
import { mkdirSync, existsSync } from "fs";
import { dirname, resolve } from "path";
import { runMigrations } from "./migrations.js";

// --- Ergonomic wrapper preserving the existing API contract ---

interface RunResult {
  changes: number;
}

class PreparedStatement {
  private stmt: Statement;

  constructor(stmt: Statement) {
    this.stmt = stmt;
  }

  run(...params: unknown[]): RunResult {
    const result = this.stmt.run(...params);
    return { changes: result.changes };
  }

  get(...params: unknown[]): Record<string, unknown> | undefined {
    return this.stmt.get(...params) as Record<string, unknown> | undefined;
  }

  all(...params: unknown[]): Record<string, unknown>[] {
    return this.stmt.all(...params) as Record<string, unknown>[];
  }
}

export class DatabaseWrapper {
  private rawDb: DatabaseType;

  constructor(dbPath: string) {
    const dir = dirname(dbPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    this.rawDb = new Database(dbPath);

    // WAL mode allows concurrent readers (dashboard + MCP server + CLI)
    this.rawDb.pragma("journal_mode = WAL");
    // Wait up to 5s if another connection holds a write lock
    this.rawDb.pragma("busy_timeout = 5000");
  }

  prepare(sql: string): PreparedStatement {
    return new PreparedStatement(this.rawDb.prepare(sql));
  }

  exec(sql: string): void {
    this.rawDb.exec(sql);
  }

  pragma(cmd: string, options?: { simple: true }): unknown {
    return this.rawDb.pragma(cmd, options);
  }

  transaction<T>(fn: () => T): () => T {
    return this.rawDb.transaction(fn) as () => T;
  }

  close(): void {
    this.rawDb.close();
  }
}

let db: DatabaseWrapper | null = null;
let resolvedDbPath: string | null = null;

export function getDbPath(): string {
  if (resolvedDbPath) return resolvedDbPath;
  const raw = process.env.WHETSTONE_DB || ".whetstone/whetstone.db";
  return resolve(raw);
}

export function getDb(): DatabaseWrapper {
  if (db) return db;

  const raw = process.env.WHETSTONE_DB || ".whetstone/whetstone.db";
  resolvedDbPath = resolve(raw);
  db = new DatabaseWrapper(resolvedDbPath);

  // Run migrations with foreign keys off
  db.pragma("foreign_keys = OFF");
  runMigrations(db);
  db.pragma("foreign_keys = ON");

  return db;
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
