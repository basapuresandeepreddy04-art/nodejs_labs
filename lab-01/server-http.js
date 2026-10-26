// Lab 1, Task 3: A basic server using Node.js's built-in http module.

const http = require("http");

const server = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Hello");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Basic HTTP server is running at http://localhost:${PORT}`);
});
