
var createContentAddressable = require('./content-addressable')
var stringify = require('canonical-json')

var deserializeCommit = function(serialized) {
  return new Commit(JSON.parse(serialized))
}

var Commit = function(obj) {
  this.data = obj.data
  this.ancestors = obj.ancestors
}

Commit.prototype.serialize = function() {
  return stringify(this)
}

var createDB = function() {
  var cas = createContentAddressable()
  var head = null

  var write = function(data, cb) {
    var ancestors = head ? [head] : []
    var commit = new Commit({data: data, ancestors: ancestors})
    cas.write(commit.serialize(), function(err, hash) {
      head = hash
      cb(null, {head: hash})
    })
  }

  var read = function(commitID, cb) {
    cas.read(commitID, function(err, serializedCommit) {
      var commit = deserializeCommit(serializedCommit)
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