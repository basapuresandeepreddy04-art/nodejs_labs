const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const dbPath = path.join(__dirname, "database", "books.db");

app.use(express.json());

let db = null;

// Open the database first. Start the server only after the connection succeeds.
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
      console.log(`SQLite database connected: ${dbPath}`);
    });
  } catch (error) {
    console.error(`Unable to connect to SQLite database: ${error.message}`);
    process.exit(1);
  }
};

// GET /books/ — return all books.
app.get("/books/", async (request, response) => {
  try {
    const books = await db.all("SELECT * FROM book ORDER BY id;");
    response.status(200).json(books);
  } catch (error) {
    response.status(500).json({ error: "Unable to retrieve books." });
  }
});

// GET /books/:bookId/ — return one book.
app.get("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;
    const book = await db.get("SELECT * FROM book WHERE id = ?;", [bookId]);

    if (!book) {
      return response.status(404).json({ error: "Book not found." });
    }

    response.status(200).json(book);
  } catch (error) {
    response.status(500).json({ error: "Unable to retrieve the book." });
  }
});

// POST /books/ — add a book.
app.post("/books/", async (request, response) => {
  const { title, author, price, pages } = request.body;

  if (
    typeof title !== "string" || !title.trim() ||
    typeof author !== "string" || !author.trim() ||
    !Number.isInteger(price) || price < 0 ||
    !Number.isInteger(pages) || pages <= 0
  ) {
    return response.status(400).json({
      error: "Provide title and author as non-empty strings, price as a non-negative integer, and pages as a positive integer.",
    });
  }

  try {
    const result = await db.run(
      "INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?);",
      [title.trim(), author.trim(), price, pages]
    );

    const addedBook = await db.get("SELECT * FROM book WHERE id = ?;", [
      result.lastID,
    ]);
    response.status(201).json(addedBook);
  } catch (error) {
    response.status(500).json({ error: "Unable to add the book." });
  }
});

// PUT /books/:bookId/ — update a book's details.
app.put("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const { title, author, price, pages } = request.body;

  if (
    typeof title !== "string" || !title.trim() ||
    typeof author !== "string" || !author.trim() ||
    !Number.isInteger(price) || price < 0 ||
    !Number.isInteger(pages) || pages <= 0
  ) {
    return response.status(400).json({
      error: "Provide title and author as non-empty strings, price as a non-negative integer, and pages as a positive integer.",
    });
  }

  try {
    const existingBook = await db.get("SELECT id FROM book WHERE id = ?;", [
      bookId,
    ]);

    if (!existingBook) {
      return response.status(404).json({ error: "Book not found." });
    }

    await db.run(
      "UPDATE book SET title = ?, author = ?, price = ?, pages = ? WHERE id = ?;",
      [title.trim(), author.trim(), price, pages, bookId]
    );

    const updatedBook = await db.get("SELECT * FROM book WHERE id = ?;", [
      bookId,
    ]);
    response.status(200).json(updatedBook);
  } catch (error) {
    response.status(500).json({ error: "Unable to update the book." });
  }
});

// DELETE /books/:bookId/ — remove a book.
app.delete("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;
    const existingBook = await db.get("SELECT id FROM book WHERE id = ?;", [
      bookId,
    ]);

    if (!existingBook) {
      return response.status(404).json({ error: "Book not found." });
    }

    await db.run("DELETE FROM book WHERE id = ?;", [bookId]);
    response.status(200).json({ message: "Book deleted successfully." });
  } catch (error) {
    response.status(500).json({ error: "Unable to delete the book." });
  }
});

initializeDBAndServer();
