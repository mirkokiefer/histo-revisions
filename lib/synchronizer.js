
var async = require('async')

module.exports = createSynchronizer

function createSynchronizer(source, target) {
  return {
    run: run
  }

  function run(done) {
    readHeads(function(err, sourceHead, targetHead) {
      synchronizeRevisions(sourceHead, done)
    })
  }

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
}
