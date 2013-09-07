
var sha1 = require('sha1')

function createCAS() {
  var store = {}

  function put(data, cb) {
    var hash = sha1(data)
    store[hash] = data
    cb(null, hash)
  }

  function read(hash, cb) {
    cb(null, store[hash])
  }

  return {
    put: put,
    read: read
  }
}

module.exports = createCAS
