import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || path.resolve(__dirname, '../../data/finzeal.db');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function initializeDb(): void {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      name            TEXT    NOT NULL,
      email           TEXT    NOT NULL UNIQUE,
      password_hash   TEXT    NOT NULL,
      phone           TEXT,
      business_name   TEXT,
      business_type   TEXT,
      location        TEXT,
      avatar_initials TEXT,
      decision_score  INTEGER NOT NULL DEFAULT 50,
      created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS loans (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title           TEXT    NOT NULL,
      bank_name       TEXT    NOT NULL,
      principal       REAL    NOT NULL,
      interest_rate   REAL    NOT NULL,
      tenure_months   INTEGER NOT NULL,
      start_date      TEXT    NOT NULL,
      status          TEXT    NOT NULL DEFAULT 'active'
                      CHECK(status IN ('active','closed','pending')),
      emi_amount      REAL    NOT NULL,
      paid_emis       INTEGER NOT NULL DEFAULT 0,
      created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS emi_records (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      loan_id     INTEGER NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
      due_date    TEXT    NOT NULL,
      amount      REAL    NOT NULL,
      status      TEXT    NOT NULL DEFAULT 'pending'
                  CHECK(status IN ('paid','pending','overdue')),
      paid_date   TEXT
    );

    CREATE TABLE IF NOT EXISTS documents (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id           INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name              TEXT    NOT NULL,
      type              TEXT    NOT NULL,
      file_name         TEXT,
      file_size_kb      REAL    NOT NULL DEFAULT 0,
      status            TEXT    NOT NULL DEFAULT 'pending'
                        CHECK(status IN ('verified','pending','rejected','missing')),
      rejection_reason  TEXT,
      uploaded_at       TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS gov_schemes (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT    NOT NULL,
      category      TEXT    NOT NULL,
      ministry      TEXT,
      description   TEXT,
      loan_amount   TEXT,
      interest_rate TEXT,
      eligibility   TEXT    NOT NULL DEFAULT '[]',
      tags          TEXT    NOT NULL DEFAULT '[]',
      deadline      TEXT,
      match_score   INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS community_posts (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      author_name     TEXT    NOT NULL,
      author_role     TEXT,
      author_initials TEXT,
      title           TEXT    NOT NULL,
      content         TEXT    NOT NULL,
      category        TEXT    NOT NULL DEFAULT 'General',
      tags            TEXT    NOT NULL DEFAULT '[]',
      likes           INTEGER NOT NULL DEFAULT 0,
      reply_count     INTEGER NOT NULL DEFAULT 0,
      created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS community_replies (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id     INTEGER NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      author_name TEXT    NOT NULL,
      content     TEXT    NOT NULL,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS training_modules (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      title         TEXT    NOT NULL,
      description   TEXT,
      duration_mins INTEGER NOT NULL DEFAULT 30,
      rating        REAL    NOT NULL DEFAULT 4.5,
      category      TEXT    NOT NULL DEFAULT 'General',
      order_index   INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS user_module_progress (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      module_id     INTEGER NOT NULL REFERENCES training_modules(id) ON DELETE CASCADE,
      progress      INTEGER NOT NULL DEFAULT 0,
      status        TEXT    NOT NULL DEFAULT 'not-started'
                    CHECK(status IN ('not-started','in-progress','completed')),
      started_at    TEXT,
      completed_at  TEXT,
      UNIQUE(user_id, module_id)
    );

    CREATE TABLE IF NOT EXISTS cashflow_entries (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      month     TEXT    NOT NULL,
      inflow    REAL    NOT NULL DEFAULT 0,
      outflow   REAL    NOT NULL DEFAULT 0,
      UNIQUE(user_id, month)
    );

    CREATE TABLE IF NOT EXISTS post_likes (
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      post_id INTEGER NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
      PRIMARY KEY(user_id, post_id)
    );
  `);
}
