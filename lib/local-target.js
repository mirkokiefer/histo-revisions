
function createTarget(db) {
  function readHead(cb) {
    cb(null, db.head())
  }

  function readRemoteHead(remoteName, cb) {
    db.remoteHead(remoteName, cb)
  }

  function writeRevisions(revs, cb) {

  }

  function findCommonAncestor(rev1, rev2, cb) {

  }

  function setRemoteTrackingHead(remoteName, head, cb) {

  }

  return {
    head: readHead,
    remoteHead: readRemoteHead,
    writeRevisions: writeRevisions,
    commonAncestor: findCommonAncestor,
    setRemoteHead: setRemoteTrackingHead
  }
}

module.exports = createTarget