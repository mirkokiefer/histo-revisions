
var createBranchStore = function(store) {

  var setHead = function(hash, cb) {
    store.put('head', hash, cb)
  }

  var readHead = function(cb) {
    store.read('head', cb)
  }

  return {
    setHead: setHead,
    readHead: readHead
  }
}

module.exports = createBranchStore
