
function createTarget(db) {
  function readHead(cb) {
    cb(null, db.head)
  }

  function readRemoteTrackingHead(remoteName, cb) {
    cb(null, db.remoteHead(remoteName))
  }

  function writeRevisions(revs, cb) {

  }

  function findCommonAncestor(rev1, rev2, cb) {

  }

  function setRemoteTrackingHead(remoteName, head, cb) {

  }

  return {
    head: readHead,
    remoteHead: readRemoteTrackingHead,
    writeRevisions: writeRevisions,
    commonAncestor: findCommonAncestor,
    setRemoteHead: setRemoteTrackingHead
  }
}

module.exports = createTarget