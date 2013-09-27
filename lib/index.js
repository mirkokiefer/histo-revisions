
var createRevisionStore = require('./revision-store')
var createBranchStore = require('./branch-store')
var types = require('./types')
var graphDiff = require('graph-difference')
var iterators = require('async-iterators')
var _ = require('underscore')
var uuid = require('node-uuid')

module.exports = {
  createDB: createDB,
  createSource: require('./local-source'),
  createTarget: require('./local-target'),
  createSynchronizer: require('./synchronizer')
}

function createDB(opts) {
  var revisionStore = createRevisionStore(opts.revisionStore)
  var branchStore = createBranchStore(opts.branchStore)
  var head = null
  var name = uuid.v4()

  return {
    head: readHead,
    setHead: setHead,
    remoteHead: readRemoteHead,
    setRemoteHead: setRemoteHead,
    put: put,
    get: get,
    getAtRef: getAtRef,
    refDifference: refDifference,
    readRevisions: readRevisions,
    writeRevisions: writeRevisions
  }

  function readHead() {
    return head
  }

  function setHead(hash, cb) {
    branchStore.setHead('local', hash, function(err) {
      head = hash
      cb(null, {head: head})
    })
  }

  function readRemoteHead(name, cb) {
    branchStore.readHead(name, cb)
  }

  function setRemoteHead(name, hash, cb) {
    branchStore.setHead(name, hash, cb)
  }

  function put(data, cb) {
    var ancestors = head ? [head] : []
    var rev = types.createRevision({data: data, ancestors: ancestors})
    revisionStore.put(rev, function(err, hash) {
      setHead(hash, cb)
    })
  }

  function get(cb) {
    getAtRef(head, cb)
  }

  function getAtRef(ref, cb) {
    revisionStore.read(ref, function(err, rev) {
      cb(null, rev.data)
    })
  }

  function readRefParents(ref, cb) {
    revisionStore.read(ref, function(err, revObj) {
      if (err) return cb(err)
      cb(null, revObj.ancestors)
    })
  }

  function refDifference(ref1, ref2, cb) {
    graphDiff(ref1, ref2, readRefParents, cb)
  }

  function readRevisions(refs) {
    return iterators.mapAsync(iterators.fromArray(refs), function(err, rev, cb) {
      revisionStore.read(rev, cb)
    })
  }

  function writeRevisions(revIterator, cb) {
    revIterator.next(function(err, rev) {
      if (rev === undefined) return cb()
      revisionStore.put(rev, function(err, hash) {
        writeRevisions(revIterator, cb)
      })
    })
  }
}
