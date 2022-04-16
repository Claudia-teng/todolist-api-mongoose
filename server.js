const http = require('http');
const mongoose = require('mongoose');
const successHandle = require('./successHandle');
const errorHandle = require('./errorHandle');
const headers = require('./headers');
const Posts = require('./model/posts');

require('dotenv').config();

const DB = process.env.MONGO_URL;

mongoose
  .connect(DB)
  .then(() => console.log('MongoDB is ready!'))

const requestLisener = async(req, res) => {
  let body = "";
  req.on('data', (chunk) => {
    body += chunk;
  });

  if (req.url === "/posts" && req.method === 'GET') {
    const allPost = await Posts.find();
    successHandle(res, allPost);
  } else if (req.url === "/posts" && req.method === 'POST') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        if (data.content) {
          const newPost = await Posts.create({
            name: data.name,
            content: data.content,
            tags: data.tags,
            type: data.type
          })
          successHandle(res, newPost);
        } else {
          errorHandle(res);
        }
      } catch(err) {
        errorHandle(res, err);
      }
    })
  } else if (req.url === "/posts" && req.method === 'DELETE') {
    await Posts.deleteMany({});
    successHandle(res, []);
  } else if (req.url.startsWith("/posts/") && req.method === 'DELETE') {
    const id = req.url.split("/").pop();
    if (id) {
      await Posts.deleteOne({"_id": ObjectId(id)});
      res.writeHead(200, headers);
      successHandle(res, id);
    } else {
      errorHandle(res);
    }
  } else if (req.url.startsWith("/todos/") && req.method === 'PATCH') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const id = req.url.split("/").pop();
        if (data.content) {
          const editedPost = await Posts.updateOne(
            {"_id": ObjectId(id)},
            data
          );
          successHandle(res, editedPost);
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
