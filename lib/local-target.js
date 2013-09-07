
function createTarget(db) {
  function readHead(cb) {
    cb(null, db.head())
  }

  function readRemoteHead(remoteName, cb) {
    db.remoteHead(remoteName, cb)
  }

  function writeRevisions(revIterator, cb) {
    db.writeRevisions(revIterator, cb)
  }

  function findCommonAncestor(rev1, rev2, cb) {

  }

  function setRemoteHead(remoteName, head, cb) {
    db.setRemoteHead(remoteName, head, cb)
  }

  return {
    head: readHead,
    remoteHead: readRemoteHead,
    writeRevisions: writeRevisions,
    commonAncestor: findCommonAncestor,
    setRemoteHead: setRemoteHead
  }
}

module.exports = createTarget