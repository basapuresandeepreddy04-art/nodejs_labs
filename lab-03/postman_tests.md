# Postman test list (Lab 3)

Base URL: `http://localhost:3000` locally, or your Render URL when deployed.
For POST and PUT: Body > raw > JSON.

## Success cases

| # | Method | URL | Body | Expected status | Expected result |
|---|--------|-----|------|-----------------|-----------------|
| 1 | GET | `/books` | none | 200 | First 10 books, with `total`, `count`, `limit`, `offset` |
| 2 | GET | `/books?search_q=sql` | none | 200 | Only titles containing "sql" |
| 3 | GET | `/books?order_by=price&order=DESC` | none | 200 | Books sorted by price, highest first |
| 4 | GET | `/books?limit=3&offset=3` | none | 200 | 3 books, starting from the 4th |
| 5 | GET | `/books?min_price=300&max_price=450` | none | 200 | Only books priced 300 to 450 |
| 6 | GET | `/books?search_q=js&order_by=title&order=ASC&min_price=200` | none | 200 | Filters and sorting combined |
| 7 | GET | `/books/1` | none | 200 | Single book |
| 8 | POST | `/books` | `{"title":"My Book","author":"Me","price":199}` | 201 | `Book created` plus the new record |
| 9 | PUT | `/books/1` | `{"title":"Updated","author":"Me","price":250}` | 200 | `Book updated` |
| 10 | DELETE | `/books/<id from test 8>` | none | 200 | `Book <id> deleted` |

## Failure cases

| # | Method | URL | Body | Expected status | Expected message |
|---|--------|-----|------|-----------------|------------------|
| 11 | POST | `/books` | `{"author":"Me","price":199}` | 400 | title is required... |
| 12 | POST | `/books` | `{"title":"X","price":199}` | 400 | author is required... |
| 13 | POST | `/books` | `{"title":"X","author":"Me","price":"abc"}` | 400 | price must be a number |
| 14 | POST | `/books` | `{"title":"X","author":"Me"}` | 400 | price is required |
| 15 | POST | `/books` | `{bad json` | 400 | Invalid JSON in request body |
| 16 | GET | `/books?order_by=hack` | none | 400 | order_by must be one of... |
| 17 | GET | `/books?order=SIDEWAYS` | none | 400 | order must be ASC or DESC |
| 18 | GET | `/books?limit=abc` | none | 400 | limit must be an integer... |
| 19 | GET | `/books?min_price=500&max_price=100` | none | 400 | min_price cannot be greater than max_price |
| 20 | GET | `/books/9999` | none | 404 | Book with id 9999 not found |
| 21 | GET | `/books/abc` | none | 400 | id must be a positive integer |
| 22 | PUT | `/books/9999` | valid body | 404 | Book with id 9999 not found |
| 23 | PUT | `/books/1` | `{"title":"","author":"Me","price":10}` | 400 | title is required... |
| 24 | DELETE | `/books/9999` | none | 404 | Book with id 9999 not found |
| 25 | GET | `/nothing` | none | 404 | Route GET /nothing not found |
