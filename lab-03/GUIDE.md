# Lab 3: Step-by-step guide (from zero to GitHub + Render)

Delete this file before submitting if you like. It is only for you.

---

## PART 0: Install these first (one time)

| Tool | Download | Check it works |
|------|----------|----------------|
| Node.js (LTS) | https://nodejs.org | `node -v` |
| Git | https://git-scm.com | `git --version` |
| VS Code | https://code.visualstudio.com | open it |
| Postman | https://www.postman.com/downloads | open it |
| GitHub account | https://github.com | log in |
| Render account | https://render.com (sign up with GitHub) | log in |

---

## PART 1: Open and run the project

1. Unzip `lab-03.zip`. You get a folder called `lab-03`.
2. Open VS Code > **File > Open Folder** > choose `lab-03`.
3. Open the terminal: **Terminal > New Terminal**.
4. Install packages:
   ```
   npm install
   ```
5. Create your `.env` file:
   - Windows: `copy .env.example .env`
   - Mac/Linux: `cp .env.example .env`
6. Start the server:
   ```
   npm start
   ```
   You should see `Seeded 12 sample books` and `Server running on port 3000`.

**Screenshot 01** `01-server-running.png`: VS Code terminal showing "Server running on port 3000".

7. Read `server.js` and `db.js` slowly. The lab says you may be asked to explain any part, so make sure you understand each route.

---

## PART 2: Test in Postman and take screenshots

Keep the server running. In Postman create a **Collection** named "Lab 3 Books API" and add the requests from `postman_tests.md`. Do tests 1 to 25 at least once.

**How to take a screenshot:**
- Windows: press `Win + Shift + S`, drag over the area, then paste into Paint and save as PNG (or open the Snipping Tool).
- Mac: press `Cmd + Shift + 4`, drag over the area. The file lands on your Desktop.
- Capture the **URL, method, body (for POST/PUT) and the response with status code** in one picture. The status code (200, 201, 400, 404) is what proves the result.

Save each file inside `lab-03/screenshots/` with exactly these names (the README already points to them):

| File name | What to capture | Postman request |
|-----------|-----------------|-----------------|
| `01-server-running.png` | Terminal: "Server running on port 3000" | n/a |
| `02-get-all-books.png` | List with defaults, status 200 | `GET /books` |
| `03-search.png` | Search result | `GET /books?search_q=sql` |
| `04-sort.png` | Sorted by price descending | `GET /books?order_by=price&order=DESC` |
| `05-pagination.png` | 3 books from the 4th | `GET /books?limit=3&offset=3` |
| `06-price-filter.png` | Price range result | `GET /books?min_price=300&max_price=450` |
| `07-get-by-id.png` | One book | `GET /books/1` |
| `08-post-201.png` | Status 201 | POST with valid body |
| `09-post-400-missing-title.png` | Status 400 + message | POST without title |
| `10-post-400-bad-price.png` | Status 400 + message | POST with `"price":"abc"` |
| `11-put-200.png` | Status 200 | `PUT /books/1` |
| `12-delete-200.png` | Status 200 | `DELETE /books/<new id>` |
| `13-get-404.png` | Status 404 | `GET /books/9999` |
| `14-database-view.png` | See below | n/a |

**Database view (screenshot 14):** In VS Code, install the extension **SQLite Viewer** (by Florian Klampfer). Stop the server is not required. Click `books.db` in the Explorer to see the table, then screenshot it. If the extension gives trouble, use a screenshot of `GET /books` after your changes instead and say so in the README notes.

**Tip:** do the POST first, then PUT and DELETE on the id it returns, so the screenshots tell a connected story.

---

## PART 3: Debugging exercise

The faculty will give you a broken project in class. To practise first, use `debugging-practice/broken-server.js`, which has the same 4 bugs. Answers are in `debugging-practice/FIXES.md` (try before you peek).

1. **Port conflict (EADDRINUSE):** keep `npm start` running in terminal 1. Open a second terminal (the **+** icon) and run `node debugging-practice/broken-server.js`. Screenshot the error as `15-debug-eaddrinuse.png`. Fix it by stopping the first server or changing the port.
2. **Wrong import path:** screenshot `Cannot find module '../database'` as `16-debug-import-path.png`. Fix it to `../db`.
3. **Table typo:** screenshot `no such table: book` as `17-debug-no-such-table.png`. Fix it to `books`.
4. **Missing await:** screenshot the wrong output (empty `{}` instead of books) as `18-debug-missing-await.png`. Add `await`.
5. When everything works, screenshot the correct output in the browser or Postman as `19-debug-fixed.png`.

Do the same 4 fixes on the faculty's project in class, then write them up in the README "Notes" section in your own words.

---

## PART 4: Fill in the README

Open `README.md` in VS Code and replace:
- `YOUR NAME`, `YOUR REG NO`, `YOUR SECTION`
- the live link line (after Part 6)
- the **Notes** section with 3 to 4 lines about the problems you faced

Press `Ctrl + Shift + V` in VS Code to preview the README.

---

## PART 5: Push to GitHub

The course uses **one repository** with one folder per lab (`lab-01` ... `lab-10`).

### Case A: you already have the course repo (from Lab 1 or 2)

1. Clone it somewhere (not inside `lab-03`):
   ```
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
   ```
2. Copy your whole `lab-03` folder into the cloned repo folder. **Do not copy `node_modules`** (delete it from the copy; `.gitignore` also protects you).
3. Open the cloned repo folder in VS Code, then go to Step 4 below.

### Case B: this is your first lab repo

1. On github.com click **New repository**. Name: `backend-development-fundamentals`. Choose **Public**. Do not tick "Add a README". Click **Create repository**.
2. Make a new folder on your computer with the same name and put the `lab-03` folder inside it.
3. Open that folder in VS Code and run:
   ```
   git init
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/backend-development-fundamentals.git
   ```

### Then, for both cases

4. Check what will be committed:
   ```
   git status
   ```
   Make sure **`.env` and `node_modules` are NOT listed**. If they are, stop and check `lab-03/.gitignore`.
5. Commit and push (use meaningful messages, commit more than once):
   ```
   git add lab-03
   git commit -m "Lab 3: add REST API with search, sorting, filters and validation"
   git push -u origin main
   ```
   The first push opens a browser window to sign in to GitHub. Approve it.
6. Open your repo on github.com and check that `lab-03/` shows `server.js`, `db.js`, `README.md` and so on.

**No terminal alternative:** in VS Code click the **Source Control** icon (left bar), type a message, click **Commit**, then **Sync Changes** (or **Publish Branch**).

---

## PART 6: Deploy on Render

Render needs the code on GitHub first (Part 5).

1. Go to https://dashboard.render.com and click **New + > Web Service**.
2. Choose **Build and deploy from a Git repository**, connect GitHub and select your repo.
3. Fill the form:

   | Field | Value |
   |-------|-------|
   | Name | `lab3-books-api` (becomes part of your URL) |
   | Region | any (Singapore is close to India) |
   | Branch | `main` |
   | **Root Directory** | `lab-03` (important, because your code is in a subfolder) |
   | Runtime | Node |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Instance Type | **Free** |

4. You do not need to set `PORT`. Render sets it and the code reads `process.env.PORT`.
5. Click **Create Web Service**. Wait 2 to 5 minutes. The log should end with `Server running on port ...` and the status turns **Live**.
6. Copy your URL at the top, like `https://lab3-books-api.onrender.com`.
7. Test it in the browser: `https://lab3-books-api.onrender.com/books`

**Screenshots:**
- `20-render-live.png`: Render dashboard showing **Live** and the URL, plus the browser showing `/books`.
- `21-postman-live.png`: a Postman request using your Render URL, with the response.

**Good to know:**
- The free plan sleeps after inactivity. The first request after a break can take about 50 seconds. Open the URL a minute before showing your faculty.
- The free plan's disk is temporary. The SQLite database resets on each redeploy or restart, and the app re-adds the 12 sample books automatically. This is fine for the lab. Mention it in your README notes.
- If the build fails with a `sqlite3` error, open Render **Environment** and add the variable `NODE_VERSION` = `20`, then redeploy.

Now put the live URL at the top of `README.md`.

---

## PART 7: Push the screenshots and final README to the same GitHub repo

1. Make sure all 21 PNG files are inside `lab-03/screenshots/` and the file names match the README exactly (lowercase, same spelling).
2. In the terminal, from the repo folder:
   ```
   git add lab-03
   git commit -m "Lab 3: add screenshots, live link and README notes"
   git push
   ```
3. Open `https://github.com/YOUR-USERNAME/YOUR-REPO/tree/main/lab-03` and click `README.md`. The images should show. A broken image icon means the file name or folder does not match, so rename the file and push again.
4. Render redeploys automatically on every push. That is normal.

---

## PART 8: Final checklist before submitting

- [ ] Repo is **public** (or shared with faculty)
- [ ] Code is in `lab-03/` and `lab-03/README.md` exists
- [ ] Name, registration number and section are in the README
- [ ] Live link is at the top of the README and opens
- [ ] Screenshots show in the README on GitHub
- [ ] `.env` and `node_modules` are NOT in the repo
- [ ] `.gitignore` is present
- [ ] You pushed at least 2 to 3 commits with meaningful messages
- [ ] Postman test list (`postman_tests.md`) is included
- [ ] Submit the **GitHub repository link**

---

## Viva answers (short)

**Query parameter vs path parameter?**
A path parameter identifies one specific resource and is part of the route (`/books/5`). A query parameter is optional and adjusts the request, such as filtering, sorting or paging (`/books?search_q=sql&limit=5`).

**What does stateless mean?**
The server keeps no memory of earlier requests. Every request carries everything needed to process it, so any server instance can answer it and the API scales easily.

**Which status code for bad input vs a missing record?**
Bad input is **400 Bad Request**. A record that does not exist is **404 Not Found**. Also: 201 Created after a POST, 200 OK for a successful read, update or delete.

**Why do we use `?` placeholders in SQL?**
Parameterised queries stop SQL injection, because user input is treated as data and never as part of the SQL command.

**Why is `order_by` checked against a list?**
Column names cannot be passed as `?` placeholders, so we only allow known column names. That keeps sorting safe.
