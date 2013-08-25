
var createContentAddressable = require('./content-addressable')
var createKeyValueStore = require('./key-value-store')
var createCommitStore = require('./commit-store')
var createRefStore = require('./ref-store')
var types = require('./types')

var createDB = function() {
  var commitStoreAdapter = createContentAddressable()
  var commitStore = createCommitStore(commitStoreAdapter)
  var refStoreAdapter = createKeyValueStore()
  var refStore = createRefStore(refStoreAdapter)
  var head = null

  var write = function(data, cb) {
    var ancestors = head ? [head] : []
    var commit = types.createCommit({data: data, ancestors: ancestors})
    commitStore.write(commit, function(err, hash) {
      refStore.setHead(hash, function(err) {
        head = hash
        cb(null, {head: hash})        
      })
    })
  }

  var read = function(cb) {
    readAtCommit(head, cb)
  }
  
  var readAtCommit = function(commitID, cb) {
    commitStore.read(commitID, function(err, commit) {
      cb(null, commit.data)
    })
  }

  return {
    write: write,
    read: read
  }
}

module.exports = {
  createDB: createDB
}