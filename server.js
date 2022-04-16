const http = require('http');
const { v4: uuid } = require('uuid');
const errorHandle = require('./errorHandle');
const headers = require('./headers');
const todos = [];

const requestLisener = (req, res) => {
  let body = "";
  req.on('data', (chunk) => {
    body += chunk;
  });

  if (req.url === "/todos" && req.method === 'GET') {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "sucess",
      "data": todos
    }));
    res.end();
  } else if (req.url === "/todos" && req.method === 'POST') {
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title;
        if (title !== undefined) {
          const todo = {
            title: title,
            id: uuid()
          }
          todos.push(todo);
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            "status": "sucess",
            "data": todos
          }));
          res.end();
        } else {
          errorHandle(res);
        }
      } catch(err) {
        errorHandle(res);
      }
    })
  } else if (req.url === "/todos" && req.method === 'DELETE') {
    todos.length = 0;
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "sucess",
      "data": todos
    }));
    res.end();
  } else if (req.url.startsWith("/todos/") && req.method === 'DELETE') {
    const id = req.url.split("/").pop();
    const index = todos.findIndex(element => element.id === id);
    if (index !== -1) {
      todos.splice(index, 1);
      res.writeHead(200, headers);
      res.write(JSON.stringify({
        "status": "sucess",
        "data": todos,
      }));
      res.end();
    } else {
      errorHandle(res);
    }
  } else if (req.url.startsWith("/todos/") && req.method === 'PATCH') {
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title;
        const id = req.url.split("/").pop();
        const index = todos.findIndex(element => element.id === id);
        if (title !== undefined && index !== -1) {
          todos[index].title = title;
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            "status": "sucess",
            "data": todos,
          }));
          res.end();
        } else {
          errorHandle(res);
        }
      } catch (err) {
        errorHandle(res);
      }
    })
  } else if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(JSON.stringify({
      "status": "failed",
      "message": "no route"
    }));
    res.end();
  }
}

const server = http.createServer(requestLisener)
server.listen(process.env.PORT || 3005)
