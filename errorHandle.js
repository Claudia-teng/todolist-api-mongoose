const headers = require('./headers');

function errorHandle(res) {
  res.writeHead(400, headers);
  res.write(JSON.stringify({
    "status": "failed",
    "message": "wrong data type, or todo id not found!"
  }));
  res.end();
}

module.exports = errorHandle;