
var stringify = require('canonical-json')

var Revison = function(obj) {
  this.data = obj.data
  this.ancestors = obj.ancestors
}

Revison.prototype.serialize = function(commit) {
  return stringify(this)
}

var deserializeRevision = function(serialized) {
  return new Revison(JSON.parse(serialized))
}

module.exports = {
  createRevision: function(obj) { return new Revison(obj) },
  deserializeRevision: deserializeRevision
}