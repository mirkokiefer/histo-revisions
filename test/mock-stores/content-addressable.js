
var sha1 = require('sha1')

var createCAS = function() {
  var store = {}

  var put = function(data, cb) {
    var hash = sha1(data)
    store[hash] = data
    cb(null, hash)
  }

  var read = function(hash, cb) {
    cb(null, store[hash])
  }

  return {
    put: put,
    read: read
  }
}

module.exports = createCAS
