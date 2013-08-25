
var createLocalTarget = function(db) {
  var readHead = function(cb) {

  }

  var readRemoteTrackingHead = function(remoteName, cb) {

  }

  var writeRevisions = function(revs, cb) {

  }

  var findCommonAncestor = function(rev1, rev2, cb) {

  }

  var setRemoteTrackingHead = function(remoteName, head, cb) {

  }

  return {
    head: readHead,
    remoteHead: readRemoteTrackingHead,
    writeRevisions: writeRevisions,
    commonAncestor: findCommonAncestor,
    setRemoteHead: setRemoteTrackingHead
  }
}
