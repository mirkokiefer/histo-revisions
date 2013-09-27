
var sha1 = require('sha1')
var createKeyValueStore = require('./key-value-store')

module.exports = createCAS

function createCAS() {
  var store = createKeyValueStore()

  return {
    data: store.data,
    put: put,
    read: read
  }

  function put(data, cb) {
    var hash = sha1(data)
    store.put(hash, data, function() {
      cb(null, hash)
    })
  }

  function read(hash, cb) {
    store.get(hash, cb)
  }
}
