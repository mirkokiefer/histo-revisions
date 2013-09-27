
var types = require('./types')

module.exports = createRevisionStore

function createRevisionStore(contentAddressable) {
  return {
    put: put,
    read: read
  }

  function put(rev, cb) {
    contentAddressable.put(rev.serialize(), function(err, hash) {
      head = hash
      cb(null, hash)
    })
  }

  function read(revID, cb) {
    contentAddressable.read(revID, function(err, serializedRevision) {
      if (err) return cb(new Error('rev not found'))
      var rev = types.deserializeRevision(serializedRevision)
      cb(null, rev)
    })
  }
}
