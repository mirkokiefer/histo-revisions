
var async = require('async')

function createSynchronizer(remoteSource, localTarget) {
  function readHeads(cb) {
    async.map([remoteSource, localTarget], function(each, cb) {
      each.head(cb)
    }, function(err, heads) {
      cb(err, heads[0], heads[1])
    })
  }

  function synchronize(done) {
    readHeads(function(err, sourceHead, targetHead) {
      localTarget.remoteHead(remoteSource.name, function(err, lastSyncedRev) {
        remoteSource.revDifference(lastSyncedRev, sourceHead, function(err, revDiff) {
          localTarget.writeRevisions(revDiff, function(cb) {
            localTarget.setRemoteHead(remoteSource.name, sourceHead, done)
          })
        })
      })
    })
  }

  return {
    synchronize: synchronize
  }
}

module.exports = createSynchronizer
