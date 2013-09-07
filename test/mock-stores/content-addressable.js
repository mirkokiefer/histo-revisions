
var sha1 = require('sha1')
var createKeyValueStore = require('./key-value-store')

function createCAS() {
  var store = createKeyValueStore()

  function put(data, cb) {
    var hash = sha1(data)
    store.put(hash, data, function() {
      cb(null, hash)
    })
  }

  function read(hash, cb) {
    store.get(hash, cb)
  }

  return {
    data: store.data,
    put: put,
    read: read
  }
}

module.exports = createCAS
