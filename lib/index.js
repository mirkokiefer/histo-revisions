
var createContentAddressable = require('./content-addressable')
var createCommitStore = require('./commit-store')
var types = require('./types')

var createDB = function() {
  var cas = createContentAddressable()
  var commitStore = createCommitStore(cas)
  var head = null

  var write = function(data, cb) {
    var ancestors = head ? [head] : []
    var commit = types.createCommit({data: data, ancestors: ancestors})
    commitStore.write(commit, function(err, hash) {
      head = hash
      cb(null, {head: hash})
    })
  }

  var read = function(commitID, cb) {
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