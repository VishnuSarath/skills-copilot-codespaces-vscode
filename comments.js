// Create web server
const http = require('http');
const fs = require('fs');
const url = require('url');
const comments = require('./comments.json');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;
  console.log(parsedUrl);

  if (pathname === '/api/comments' && req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(comments));
  } else if (pathname === '/api/comments' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const newComment = JSON.parse(body);
      comments.push(newComment);
      fs.writeFile('./comments.json', JSON.stringify(comments), (err) => {
        if (err) throw err;
      });
    });
    res.statusCode = 201;
    res.end('Created');
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});