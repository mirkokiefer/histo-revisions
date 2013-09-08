
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
    target.remoteHead(source.name, function(err, lastSyncedRev) {
      source.revisionHashDifference(lastSyncedRev, sourceHead, function(err, revHashsDiff) {
        var revDiff = source.readRevisions(revHashsDiff)
        target.writeRevisions(revDiff, function(cb) {
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
