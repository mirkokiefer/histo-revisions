
module.exports = createKeyValueStore

function createKeyValueStore() {
  var store = {}

  return {
    data: store,
    put: put,
    get: get,
    del: del
  }
  
  function put(key, value, cb) {
    store[key] = value
    cb(null)
  }

  function get(key, cb) {
    if (store[key]) {
      cb(null, store[key])
    } else {
      cb(new Error('value does not exist'))
    }
  }

  function del(key, cb) {
    delete store[key]
    cb(null)
  }
}
