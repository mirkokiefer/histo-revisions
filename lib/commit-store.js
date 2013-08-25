
var types = require('./types')

var createCommitStore = function(contentAddressable) {
  var write = function(commit, cb) {
    contentAddressable.write(commit.serialize(), function(err, hash) {
      head = hash
      cb(null, hash)
    })
  }

  var read = function(commitID, cb) {
    contentAddressable.read(commitID, function(err, serializedCommit) {
      var commit = types.deserializeCommit(serializedCommit)
      cb(null, commit)
    })
  }

  return {
    write: write,
    read: read
  }
}

module.exports = createCommitStore