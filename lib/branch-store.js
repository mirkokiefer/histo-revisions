
var createBranchStore = function(store) {
  return {
    setHead: setHead,
    readHead: readHead
  }
  
  function setHead(branch, hash, cb) {
    store.put(branch, hash, cb)
  }

  function readHead(branch, cb) {
    store.get(branch, cb)
  }
}

module.exports = createBranchStore
