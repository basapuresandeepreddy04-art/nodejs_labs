# Debugging practice: answers

Run the broken file from the lab-03 folder: `node debugging-practice/broken-server.js`
Fix one bug, run again, and screenshot each error and the final working result.

| # | Error you will see | Cause | Fix |
|---|--------------------|-------|-----|
| 1 | `Error: listen EADDRINUSE: address already in use :::3000` | Another program (for example your main server) is already using port 3000. To trigger it, start `npm start` in one terminal, then run the broken file in a second terminal. | Stop the other process (Ctrl+C), or use a different port: `const PORT = process.env.PORT \|\| 3001;` |
| 2 | `Error: Cannot find module '../database'` | Wrong import path. The real file is `db.js`, and it sits in the parent folder. | `require('../db')` |
| 3 | `SQLITE_ERROR: no such table: book` | Typo in the table name. The table is called `books`. | `SELECT * FROM books` |
| 4 | Response shows `{"data":{}}` (or a Promise) instead of the books | `db.all()` returns a Promise and `await` is missing. | `const books = await db.all('SELECT * FROM books');` |

Tip: to free a busy port on Windows, run `netstat -ano | findstr :3000` and then `taskkill /PID <pid> /F`.
On Mac/Linux: `lsof -i :3000` and then `kill -9 <pid>`.
