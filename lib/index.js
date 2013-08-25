
var createRevisionStore = require('./revision-store')
var createBranchStore = require('./branch-store')
var types = require('./types')
var graphDiff = require('graph-difference')
var _ = require('underscore')

var createDB = function(opts) {
  var revisionStore = createRevisionStore(opts.revisionStore)
  var branchStore = createBranchStore(opts.branchStore)
  var head = null

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

  var revDifference = function(rev, cb) {
    graphDiff(head, rev, readRevParents, cb)
  }

  var createIterator = function(revs) {
    var revsStack = _.clone(revs)
    return {
      next: function(cb) {
        var nextRev = revsStack.shift()
        if (!nextRev) return cb(null, undefined)
        revisionStore.read(nextRev, function(err, revObj) {
          cb(null, revObj)
        })
      }
    }
  }

  return {
    put: put,
    read: read,
    readAtRevision: readAtRevision,
    setHead: setHead,
    revDifference: revDifference,
    createIterator: createIterator
  }
}

module.exports = {
  createDB: createDB
}