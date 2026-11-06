require('dotenv').config();
const express = require('express');
const { initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
let db;

app.use(express.json());

// ---------- helpers ----------
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const ALLOWED_ORDER_BY = ['id', 'title', 'author', 'price'];

function parseId(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function isNumeric(value) {
  if (typeof value === 'number') return Number.isFinite(value);
  if (typeof value === 'string' && value.trim() !== '') return Number.isFinite(Number(value));
  return false;
}

// Returns an array of error strings (empty array = valid)
function validateBook(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return ['Request body must be a JSON object'];
  }
  const errors = [];
  if (typeof body.title !== 'string' || body.title.trim() === '') {
    errors.push('title is required and must be a non-empty string');
  }
  if (typeof body.author !== 'string' || body.author.trim() === '') {
    errors.push('author is required and must be a non-empty string');
  }
  if (body.price === undefined || body.price === null || body.price === '') {
    errors.push('price is required');
  } else if (!isNumeric(body.price)) {
    errors.push('price must be a number');
  } else if (Number(body.price) < 0) {
    errors.push('price cannot be negative');
  }
  return errors;
}

// ---------- routes ----------
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Books API is running',
    endpoints: [
      'GET /books',
      'GET /books/:id',
      'POST /books',
      'PUT /books/:id',
      'DELETE /books/:id'
    ]
  });
});

// GET /books?search_q=&order_by=&order=&limit=&offset=&min_price=&max_price=
app.get('/books', asyncHandler(async (req, res) => {
  const {
    search_q = '',
    order_by = 'id',
    order = 'ASC',
    limit = '10',
    offset = '0',
    min_price,
    max_price
  } = req.query;

  // --- validate query parameters ---
  if (!ALLOWED_ORDER_BY.includes(order_by)) {
    return res.status(400).json({ message: `order_by must be one of: ${ALLOWED_ORDER_BY.join(', ')}` });
  }
  const orderDir = String(order).toUpperCase();
  if (orderDir !== 'ASC' && orderDir !== 'DESC') {
    return res.status(400).json({ message: 'order must be ASC or DESC' });
  }
  const limitNum = Number(limit);
  if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 100) {
    return res.status(400).json({ message: 'limit must be an integer between 1 and 100' });
  }
  const offsetNum = Number(offset);
  if (!Number.isInteger(offsetNum) || offsetNum < 0) {
    return res.status(400).json({ message: 'offset must be an integer 0 or greater' });
  }
  if (min_price !== undefined && !isNumeric(min_price)) {
    return res.status(400).json({ message: 'min_price must be a number' });
  }
  if (max_price !== undefined && !isNumeric(max_price)) {
    return res.status(400).json({ message: 'max_price must be a number' });
  }
  if (min_price !== undefined && max_price !== undefined && Number(min_price) > Number(max_price)) {
    return res.status(400).json({ message: 'min_price cannot be greater than max_price' });
  }

  // --- build the query with parameters (never join user input into SQL) ---
  const conditions = [];
  const params = [];

  if (search_q) {
    conditions.push('title LIKE ?');
    params.push(`%${search_q}%`);
  }
  if (min_price !== undefined && max_price !== undefined) {
    conditions.push('price BETWEEN ? AND ?');
    params.push(Number(min_price), Number(max_price));
  } else if (min_price !== undefined) {
    conditions.push('price >= ?');
    params.push(Number(min_price));
  } else if (max_price !== undefined) {
    conditions.push('price <= ?');
    params.push(Number(max_price));
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  // order_by and orderDir are safe: they were checked against a whitelist above
  const totalRow = await db.get(`SELECT COUNT(*) AS total FROM books ${where}`, params);
  const books = await db.all(
    `SELECT * FROM books ${where} ORDER BY ${order_by} ${orderDir} LIMIT ? OFFSET ?`,
    [...params, limitNum, offsetNum]
  );

  res.status(200).json({
    total: totalRow.total,
    count: books.length,
    limit: limitNum,
    offset: offsetNum,
    data: books
  });
}));

// GET /books/:id
app.get('/books/:id', asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: 'id must be a positive integer' });

  const book = await db.get('SELECT * FROM books WHERE id = ?', [id]);
  if (!book) return res.status(404).json({ message: `Book with id ${id} not found` });

  res.status(200).json({ data: book });
}));

// POST /books
app.post('/books', asyncHandler(async (req, res) => {
  const errors = validateBook(req.body);
  if (errors.length) return res.status(400).json({ message: errors.join('; ') });

  const { title, author, price } = req.body;
  const result = await db.run(
    'INSERT INTO books (title, author, price) VALUES (?, ?, ?)',
    [title.trim(), author.trim(), Number(price)]
  );
  const created = await db.get('SELECT * FROM books WHERE id = ?', [result.lastID]);

  res.status(201).json({ message: 'Book created', data: created });
}));

// PUT /books/:id
app.put('/books/:id', asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: 'id must be a positive integer' });

  const errors = validateBook(req.body);
  if (errors.length) return res.status(400).json({ message: errors.join('; ') });

  const existing = await db.get('SELECT id FROM books WHERE id = ?', [id]);
  if (!existing) return res.status(404).json({ message: `Book with id ${id} not found` });

  const { title, author, price } = req.body;
  await db.run(
    'UPDATE books SET title = ?, author = ?, price = ? WHERE id = ?',
    [title.trim(), author.trim(), Number(price), id]
  );
  const updated = await db.get('SELECT * FROM books WHERE id = ?', [id]);

  res.status(200).json({ message: 'Book updated', data: updated });
}));

// DELETE /books/:id
app.delete('/books/:id', asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: 'id must be a positive integer' });

  const result = await db.run('DELETE FROM books WHERE id = ?', [id]);
  if (result.changes === 0) return res.status(404).json({ message: `Book with id ${id} not found` });

  res.status(200).json({ message: `Book ${id} deleted` });
}));

// ---------- 404 + error handlers ----------
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request body' });
  }
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

// ---------- start ----------
async function start() {
  db = await initDb();
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Stop the other process or change PORT in .env`);
    } else {
      console.error(err);
    }
    process.exit(1);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
