
var async = require('async')

var createSynchronizer = function(remoteSource, localTarget) {
  var readHeads = function(cb) {
    async.map([remoteSource, localTarget], function(each, cb) {
      each.readHead(cb)
    }, function(err, heads) {
      cb(err, heads[0], heads[1])
    })
  }

  var synchronize = function(done) {
    readHead(function(err, sourceHead, targetHead) {
      localTarget.remoteHead(remoteSource.name, function(err, lastSyncedRev) {
        remoteSource.revDifference(lastSyncedRev, sourceHead, function(err, revDiff) {
          localTarget.writeRevisions(revDiff, function(cb) {
            localTarget.setRemoteHead(remoteSource.name, sourceHead, done)
          })
        })
      })
    })
  } 
}

module.exports = createSynchronizer
