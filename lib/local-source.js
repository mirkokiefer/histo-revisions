
function createSource(db) {
  function readHead(cb) {
    cb(null, db.head())
  }

  function revDifference(fromRev, toRev, cb) {
    db.revDifference(fromRev, toRev, cb)
  }

  return {
    head: readHead,
    revDifference: revDifference,
  }
}

module.exports = createSource
