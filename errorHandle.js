const headers = require('./headers');

function errorHandle(res, err) {
  res.writeHead(400, headers);
  let message = '';
  if (err) {
    message = err.message;
  } else {
    message = 'Wrong data type, or id not found!'
  }
  res.write(JSON.stringify({
    "status": "failed",
    message
  }));
  res.end();
}

module.exports = errorHandle;