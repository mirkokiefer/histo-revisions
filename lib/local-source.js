
var createSource = function(db) {
  var readHead = function(cb) {
    cb(null, db.head)
  }

  var revDifference = function(fromRev, toRev, cb) {
    db.revDifference(fromRev, toRev, cb)
  }

  return {
    head: readHead,
    revDifference: revDifference,
  }
}

module.exports = createSource
