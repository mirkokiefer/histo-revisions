
var createRemoteSource = function(opts) {
  var readHead = function(cb) {

  }

  var readRemoteTrackingHeads = function(cb) {

  }

  var revDifference = function(fromRev, toRev, cb) {

  }

  return {
    head: readHead,
    remoteHeads: readRemoteTrackingHeads,
    revDifference: revDifference,
  }
}

module.exports = createRemoteSource
