
function createSource(db) {
  function readHead(cb) {
    cb(null, db.head())
  }

  function revDifference(fromRev, toRev, cb) {
    db.revDifference(fromRev, toRev, cb)
  }

  function readRevisions(revHashs) {
    return db.readRevisions(revHashs)
  }

  return {
    head: readHead,
    revDifference: revDifference,
    readRevisions: readRevisions
  }
}

module.exports = createSource
