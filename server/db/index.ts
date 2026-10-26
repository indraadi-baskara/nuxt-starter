import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (_db) return _db;
  const url = process.env.DATABASE_URL || "./data/app.db";
  const sqlite = new Database(url);
  sqlite.pragma("journal_mode = WAL");
  _db = drizzle(sqlite, { schema });
  return _db;
}
export type Db = ReturnType<typeof getDb>;
