import Database from 'better-sqlite3';

export function createDatabase(filename = ':memory:') {
  const db = new Database(filename);

  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    );
  `);

  return db;
}

export const db = createDatabase('database.sqlite');
