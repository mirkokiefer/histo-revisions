
var createBranchStore = function(store) {

  function setHead(branch, hash, cb) {
    store.put(branch, hash, cb)
  }

  function readHead(branch, cb) {
    store.get(branch, cb)
  }

  return {
    setHead: setHead,
    readHead: readHead
  }
}

module.exports = createBranchStore
