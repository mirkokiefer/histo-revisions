
module.exports = createSource

function createSource(db) {
  return {
    name: db.name,
    head: readHead,
    refDifference: refDifference,
    createStream: createStream
  }

  function readHead(cb) {
    setImmediate(function() {
      cb(null, db.head())      
    })
  }

  function refDifference(fromRef, toRef, cb) {
    db.refDifference(fromRef, toRef, cb)
  }

  function createStream(refs) {
    return db.createStream(refs)
  }
}
