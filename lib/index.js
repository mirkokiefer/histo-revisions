
var createCommitStore = require('./commit-store')
var createRefStore = require('./ref-store')
var types = require('./types')

var createDB = function(opts) {
  var commitStore = createCommitStore(opts.commitStore)
  var refStore = createRefStore(opts.refStore)
  var head = null

  var put = function(data, cb) {
    var ancestors = head ? [head] : []
    var commit = types.createCommit({data: data, ancestors: ancestors})
    commitStore.put(commit, function(err, hash) {
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
    put: put,
    read: read,
    readAtCommit: readAtCommit
  }
}

module.exports = {
  createDB: createDB
}