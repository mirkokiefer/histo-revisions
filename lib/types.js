
var stringify = require('canonical-json')

module.exports = {
  createRevision: function(obj) { return new Revison(obj) },
  deserializeRevision: deserializeRevision
}

function Revison(obj) {
  this.data = obj.data
  this.ancestors = obj.ancestors
}

Revison.prototype.serialize = function(commit) {
  return stringify(this)
}

function deserializeRevision(serialized) {
  return new Revison(JSON.parse(serialized))
}
