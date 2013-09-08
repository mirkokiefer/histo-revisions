
var async = require('async')

function createSynchronizer(source, target) {
  function readHeads(cb) {
    async.map([source, target], function(each, cb) {
      each.head(cb)
    }, function(err, heads) {
      cb(err, heads[0], heads[1])
    })
  }

  function synchronizeRevisions(sourceHead, done) {
    target.remoteHead(source.name, function(err, lastSyncedRef) {
      source.refDifference(lastSyncedRef, sourceHead, function(err, refDiff) {
        var revisionDiff = source.readRevisions(refDiff)
        target.writeRevisions(revisionDiff, function(cb) {
          target.setRemoteHead(source.name, sourceHead, done)
        })
      })
    })
  }

  function synchronize(done) {
    readHeads(function(err, sourceHead, targetHead) {
      synchronizeRevisions(sourceHead, done)
    })
  }

  return {
    synchronize: synchronize
  }
}

module.exports = createSynchronizer
