
var stringify = require('canonical-json')

var Commit = function(obj) {
  this.data = obj.data
  this.ancestors = obj.ancestors
}

Commit.prototype.serialize = function(commit) {
  return stringify(this)
}

var deserializeCommit = function(serialized) {
  return new Commit(JSON.parse(serialized))
}

module.exports = {
  createCommit: function(obj) { return new Commit(obj) },
  deserializeCommit: deserializeCommit
}