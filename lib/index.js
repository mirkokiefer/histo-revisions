
var createRevisionStore = require('./revision-store')
var createBranchStore = require('./branch-store')
var types = require('./types')

var createDB = function(opts) {
  var revisionStore = createRevisionStore(opts.revisionStore)
  var branchStore = createBranchStore(opts.branchStore)
  var head = null

  var put = function(data, cb) {
    var ancestors = head ? [head] : []
    var commit = types.createCommit({data: data, ancestors: ancestors})
    revisionStore.put(commit, function(err, hash) {
      branchStore.setHead(hash, function(err) {
        head = hash
        cb(null, {head: hash})        
      })
    })
  }

  var read = function(cb) {
    readAtRevision(head, cb)
  }

  var readAtRevision = function(commitID, cb) {
    revisionStore.read(commitID, function(err, commit) {
      cb(null, commit.data)
    })
  }

  var setHead = function(hash, cb) {
    branchStore.setHead(hash, function(err) {
      head = hash
      cb()
    })
  }

  return {
    put: put,
    read: read,
    readAtRevision: readAtRevision,
    setHead: setHead
  }
}

module.exports = {
  createDB: createDB
}