
module.exports = createTarget

function createTarget(db) {
  return {
    head: readHead,
    remoteHead: readRemoteHead,
    writeStream: writeStream,
    commonAncestor: findCommonAncestor,
    setRemoteHead: setRemoteHead
  }

  function readHead(cb) {
    setImmediate(function() {
      cb(null, db.head())      
    })
  }

  function readRemoteHead(remoteName, cb) {
    db.remoteHead(remoteName, cb)
  }

  function writeStream(revIterator, cb) {
    db.writeStream(revIterator, cb)
  }

  function findCommonAncestor(rev1, rev2, cb) {

  }

  function setRemoteHead(remoteName, head, cb) {
    db.setRemoteHead(remoteName, head, cb)
  }
}
