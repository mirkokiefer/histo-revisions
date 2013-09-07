
var createBranchStore = function(store) {

  function setHead(hash, cb) {
    store.put('head', hash, cb)
  }

  function readHead(cb) {
    store.read('head', cb)
  }

  return {
    setHead: setHead,
    readHead: readHead
  }
}

module.exports = createBranchStore
