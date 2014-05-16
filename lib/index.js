
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
  createLocalSource: require('./local-source'),
  createLocalTarget: require('./local-target'),
  createSynchronizer: require('./synchronizer')
}

function createDB(opts) {
  var revisionStore = createRevisionStore(opts.revisionStore)
  var branchStore = createBranchStore(opts.branchStore)
  var head = null
  var name = opts.name || uuid.v4()

  return {
    name: name,
    head: readHead,
    setHead: setHead,
    remoteHead: readRemoteHead,
    setRemoteHead: setRemoteHead,
    put: put,
    get: get,
    refDifference: refDifference,
    createStream: createStream,
    writeStream: writeStream,
    ancestors: readRefAncestors,
    commonAncestor: commonAncestor
  }

  function readHead(cb) {
    return branchStore.readHead('local', cb)
  }

  function setHead(ref, cb) {
    branchStore.setHead('local', ref, function(err) {
      head = ref
      cb(null, {head: head})
    })
  }

  function readRemoteHead(name, cb) {
    branchStore.readHead(name, cb)
  }

  function setRemoteHead(name, ref, cb) {
    branchStore.setHead(name, ref, cb)
  }

  function put(data, ancestorRefs, cb) {
    if (!cb) {
      cb = ancestorRefs
      ancestorRefs = head ? [head] : []
    }
    var rev = types.createRevision({data: data, ancestors: ancestorRefs})
    revisionStore.put(rev, function(err, ref) {
      setHead(ref, cb)
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

  function readRefAncestors(ref, cb) {
    revisionStore.read(ref, function(err, revObj) {
      if (err) return cb(err)
      cb(null, revObj.ancestors)
    })
  }

  function refDifference(ref1, ref2, cb) {
    graphDiff(ref1, ref2, readRefAncestors, cb)
  }

  function createStream(refs) {
    return streams.mapAsync(streams.fromArray(refs), function(rev, cb) {
      revisionStore.read(rev, cb)
    })
  }

  function writeStream(revStream, cb) {
    revStream.read(function(err, rev) {
      if (rev === undefined) return cb()
      revisionStore.put(rev, function(err, ref) {
        writeStream(revStream, cb)
      })
    })
  }

  function commonAncestor(ref1, ref2, cb) {
    if (!cb) {
      cb = ref2
      ref2 = head
    }
    findCommonAncestor([ref1, ref2], readRefAncestors, cb)
  }
}
