
module.exports = createSource

function createSource(db) {
  return {
    head: readHead,
    refDifference: refDifference,
    readRevisions: readRevisions
  }

  function readHead(cb) {
    cb(null, db.head())
  }

  function refDifference(fromRef, toRef, cb) {
    db.refDifference(fromRef, toRef, cb)
  }

  function readRevisions(refs) {
    return db.readRevisions(refs)
  }
}
