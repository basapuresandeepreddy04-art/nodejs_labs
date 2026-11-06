const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const SEED_BOOKS = [
  ['Clean Code', 'Robert C. Martin', 450],
  ['The Pragmatic Programmer', 'Andrew Hunt', 520],
  ['Eloquent JavaScript', 'Marijn Haverbeke', 380],
  ['You Don\'t Know JS', 'Kyle Simpson', 300],
  ['Node.js Design Patterns', 'Mario Casciaro', 610],
  ['JavaScript: The Good Parts', 'Douglas Crockford', 250],
  ['Learning SQL', 'Alan Beaulieu', 400],
  ['Designing Data-Intensive Applications', 'Martin Kleppmann', 899],
  ['Refactoring', 'Martin Fowler', 700],
  ['Python Crash Course', 'Eric Matthes', 350],
  ['Head First SQL', 'Lynn Beighley', 320],
  ['REST API Design Rulebook', 'Mark Masse', 280]
];

async function initDb() {
  const db = await open({
    filename: path.join(__dirname, 'books.db'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id     INTEGER PRIMARY KEY AUTOINCREMENT,
      title  TEXT NOT NULL,
      author TEXT NOT NULL,
      price  REAL NOT NULL
    )
  `);

  // Seed sample data when the table is empty (handy after a fresh deploy)
  const row = await db.get('SELECT COUNT(*) AS count FROM books');
  if (row.count === 0) {
    for (const [title, author, price] of SEED_BOOKS) {
      await db.run('INSERT INTO books (title, author, price) VALUES (?, ?, ?)', [title, author, price]);
    }
    console.log(`Seeded ${SEED_BOOKS.length} sample books`);
  }

  return db;
}

module.exports = { initDb };
