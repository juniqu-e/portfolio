import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";

declare global {
  var __guestbookDb: Database.Database | undefined;
}

const DEFAULT_DB_PATH = "/data/guestbook.db";

function migrate(db: Database.Database) {
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS guestbook (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL DEFAULT '',
      body        TEXT    NOT NULL,
      ip_hash     TEXT    NOT NULL,
      approved    INTEGER NOT NULL DEFAULT 0,
      deleted     INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT    NOT NULL,
      updated_at  TEXT    NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_guestbook_visible
      ON guestbook (approved, deleted, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_guestbook_ip_recent
      ON guestbook (ip_hash, created_at DESC);
  `);
}

function open(): Database.Database {
  const path = process.env.DB_PATH || DEFAULT_DB_PATH;
  const dir = dirname(path);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  const db = new Database(path);
  migrate(db);
  return db;
}

export function getDb(): Database.Database {
  if (!globalThis.__guestbookDb) {
    globalThis.__guestbookDb = open();
  }
  return globalThis.__guestbookDb;
}

export type GuestbookRow = {
  id: number;
  name: string;
  body: string;
  ip_hash: string;
  approved: number;
  deleted: number;
  created_at: string;
  updated_at: string;
};
