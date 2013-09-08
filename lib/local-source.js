
function createSource(db) {
  function readHead(cb) {
    cb(null, db.head())
  }

  function revisionHashDifference(fromRev, toRev, cb) {
    db.revisionHashDifference(fromRev, toRev, cb)
  }

  function readRevisions(revHashs) {
    return db.readRevisions(revHashs)
  }

  return {
    head: readHead,
    revisionHashDifference: revisionHashDifference,
    readRevisions: readRevisions
  }
}

module.exports = createSource
