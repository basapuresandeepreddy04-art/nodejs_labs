// DEBUGGING PRACTICE: this file has 4 deliberate bugs. Fix them one by one.
// Run:  node debugging-practice/broken-server.js
// Take a screenshot of each error BEFORE fixing it, and one after the fix.
const express = require('express');
const { initDb } = require('../database');            // BUG 2 (hint: check the real file name)

const app = express();
app.use(express.json());
const PORT = 3000;                                      // BUG 1 (see FIXES.md for how to trigger it)

let db;

app.get('/books', async (req, res) => {
  const books = db.all('SELECT * FROM book');           // BUG 3 (table name) and BUG 4 (missing await)
  res.status(200).json({ data: books });
});

(async () => {
  db = await initDb();
  app.listen(PORT, () => console.log(`Broken server on port ${PORT}`));
})();
