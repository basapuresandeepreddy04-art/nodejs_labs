// Lab 1: Node.js and Express server
// Routes: GET /, GET /about, GET /time, and a 404 handler.

const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Log the method, path, and final HTTP status code for every request.
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode}`);
  });
  next();
});

// GET / - welcome message
app.get("/", (req, res) => {
  res.status(200).type("text").send("Welcome to my Lab 1 Node.js and Express server!");
});

// GET /about - return name and section as JSON
app.get("/about", (req, res) => {
  res.status(200).json({
    name: "Sandeep Reddy Basapure",
    section: "CSE GEN AI 104"
  });
});

// GET /time - return the current date and time
app.get("/time", (req, res) => {
  res.status(200).json({
    currentDateTime: new Date().toString()
  });
});

// Any path not matched above returns HTTP 404.
app.use((req, res) => {
  res.status(404).type("text").send("404 - Page not found");
});

app.listen(PORT, () => {
  console.log(`Express server is running at http://localhost:${PORT}`);
  console.log("Open /, /about, and /time in your browser.");
});
