
var types = require('./types')

var createRevisionStore = function(contentAddressable) {
  var put = function(commit, cb) {
    contentAddressable.put(commit.serialize(), function(err, hash) {
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
    put: put,
    read: read
  }
}

module.exports = createRevisionStore