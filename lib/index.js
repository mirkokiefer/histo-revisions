
var createRevisionStore = require('./revision-store')
var createBranchStore = require('./branch-store')
var types = require('./types')
var graphDiff = require('graph-difference')
var streams = require('simple-stream')
var _ = require('underscore')
var uuid = require('node-uuid')
var findCommonAncestor = require('ancestor')

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
    refDifference: refDifference,
    readRevisions: readRevisions,
    writeRevisions: writeRevisions,
    commonAncestor: commonAncestor
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

  function put(data, ancestorRefs, cb) {
    if (!cb) {
      cb = ancestorRefs
      ancestorRefs = head ? [head] : []
    }
    var rev = types.createRevision({data: data, ancestors: ancestorRefs})
    revisionStore.put(rev, function(err, hash) {
      setHead(hash, cb)
    })
  }

  function get(ref, cb) {
    if (!cb) {
      cb = ref
      ref = head
    }
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
    return streams.mapAsync(streams.fromArray(refs), function(rev, cb) {
      revisionStore.read(rev, cb)
    })
  }

  function writeRevisions(revStream, cb) {
    revStream.read(function(err, rev) {
      if (rev === undefined) return cb()
      revisionStore.put(rev, function(err, hash) {
        writeRevisions(revStream, cb)
      })
    })
  }

  function commonAncestor(ref1, ref2, cb) {
    if (!cb) {
      cb = ref2
      ref2 = head
    }
    findCommonAncestor([ref1, ref2], readRefParents, cb)
  }
}
