
var createContentAddressable = require('./content-addressable')
var types = require('./types')

var createDB = function() {
  var cas = createContentAddressable()
  var head = null

  var write = function(data, cb) {
    var ancestors = head ? [head] : []
    var commit = types.createCommit({data: data, ancestors: ancestors})
    cas.write(commit.serialize(), function(err, hash) {
      head = hash
      cb(null, {head: hash})
    })
  }

  var read = function(commitID, cb) {
    cas.read(commitID, function(err, serializedCommit) {
      var commit = types.deserializeCommit(serializedCommit)
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