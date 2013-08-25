
var types = require('./types')

var createRevisionStore = function(contentAddressable) {
  var put = function(rev, cb) {
    contentAddressable.put(rev.serialize(), function(err, hash) {
      head = hash
      cb(null, hash)
    })
  }

  var read = function(revID, cb) {
    contentAddressable.read(revID, function(err, serializedRevision) {
      var rev = types.deserializeRevision(serializedRevision)
      cb(null, rev)
    })
  }

  return {
    put: put,
    read: read
  }
}

module.exports = createRevisionStore
