CREATE TABLE IF NOT EXISTS book (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  pages INTEGER NOT NULL CHECK (pages > 0)
);

INSERT INTO book (title, author, price, pages) VALUES
  ('Wings of Fire', 'A. P. J. Abdul Kalam', 250, 180),
  ('The Guide', 'R. K. Narayan', 220, 240),
  ('Malgudi Days', 'R. K. Narayan', 300, 240),
  ('The Discovery of India', 'Jawaharlal Nehru', 450, 600),
  ('The Alchemist', 'Paulo Coelho', 299, 208),
  ('Atomic Habits', 'James Clear', 399, 320),
  ('Ikigai', 'Hector Garcia', 275, 194),
  ('The Hobbit', 'J. R. R. Tolkien', 350, 310),
  ('Ponniyin Selvan', 'Kalki Krishnamurthy', 500, 400),
  ('A Brief History of Time', 'Stephen Hawking', 325, 256);
