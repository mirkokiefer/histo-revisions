
var types = require('./types')

function createRevisionStore(contentAddressable) {
  function put(rev, cb) {
    contentAddressable.put(rev.serialize(), function(err, hash) {
      head = hash
      cb(null, hash)
    })
  }

  function read(revID, cb) {
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
