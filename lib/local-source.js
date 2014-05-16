
module.exports = createSource

function createSource(db) {
  return {
    name: db.name,
    head: db.head,
    refDifference: refDifference,
    createStream: createStream
  }

  function refDifference(fromRef, toRef, cb) {
    db.refDifference(fromRef, toRef, cb)
  }

  function createStream(refs) {
    return db.createStream(refs)
  }
}
