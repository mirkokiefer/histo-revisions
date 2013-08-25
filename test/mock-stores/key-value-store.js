
var createKeyValueStore = function() {
  var store = {}

  var put = function(key, value, cb) {
    store[key] = value
    cb(null)
  }

  var get = function(key, cb) {
    if (store[key]) {
      cb(null, store[key])
    } else {
      cb(new Error('value does not exist'))
    }
  }

  var del = function(key, cb) {
    delete store[key]
    cb(null)
  }

  return {
    put: put,
    get: get,
    del: del
  }
}

module.exports = createKeyValueStore
