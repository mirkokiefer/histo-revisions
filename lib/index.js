
var createRevisionStore = require('./revision-store')
var createBranchStore = require('./branch-store')
var types = require('./types')
var graphDiff = require('graph-difference')
var iterators = require('async-iterators')
var _ = require('underscore')
var uuid = require('node-uuid')

var createDB = function(opts) {
  var revisionStore = createRevisionStore(opts.revisionStore)
  var branchStore = createBranchStore(opts.branchStore)
  var head = null
  var name = uuid.v4()

  var head = function() {
    return head
  }

  var put = function(data, cb) {
    var ancestors = head ? [head] : []
    var rev = types.createRevision({data: data, ancestors: ancestors})
    revisionStore.put(rev, function(err, hash) {
      branchStore.setHead(hash, function(err) {
        head = hash
        cb(null, {head: hash})        
      })
    })
  }

  var read = function(cb) {
    readAtRevision(head, cb)
  }

  var readAtRevision = function(rev, cb) {
    revisionStore.read(rev, function(err, rev) {
      cb(null, rev.data)
    })
  }

  var setHead = function(hash, cb) {
    branchStore.setHead(hash, function(err) {
      head = hash
      cb()
    })
  }

  var readRevParents = function(rev, cb) {
    revisionStore.read(rev, function(err, revObj) {
      cb(null, revObj.ancestors)
    })
  }

  var revDifference = function(rev1, rev2, cb) {
    graphDiff(rev1, rev2, readRevParents, cb)
  }

  var readRevisions = function(revs) {
    return iterators.mapAsync(iterators.fromArray(revs), function(err, rev, cb) {
      revisionStore.read(rev, cb)
    })
  }

  return {
    head: head,
    put: put,
    read: read,
    readAtRevision: readAtRevision,
    setHead: setHead,
    revDifference: revDifference,
    readRevisions: readRevisions
  }
}

module.exports = {
  createDB: createDB,
  createSource: require('./local-source'),
  createTarget: require('./local-target'),
  createSynchronizer: require('./synchronizer')
}
