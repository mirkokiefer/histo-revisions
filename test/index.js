
var assert = require('assert')
var histo = require('../lib/index')
var async = require('async')
var iterators = require('async-iterators')

var createContentAddressable = require('./mock-stores/content-addressable')
var createKeyValueStore = require('./mock-stores/key-value-store')

var revs1 = [
  {data: 'abc'},
  {data: 'def'},
  {data: 'ghi'},
  {data: 'jkl'},
  {data: 'mno'},
  {data: 'pqr'}
]

var forkAHead = revs1[5]
var commonAncestor = revs1[2]

var revs2 = [
  {data: 'stu'},
  {data: 'vwx'},
  {data: 'yz'}
]

var forkBHead = revs2[2]

var writeRevs = function(db, revs, cb) {
  async.forEach(revs, function(each, cb) {
    db.put(each.data, function(err, res) {
      each.hash = res.head
      cb()
    })
  }, cb)
}

describe('HistoDB', function() {
  describe('local interfaces', function() {
    var cas = createContentAddressable()
    var kvStore = createKeyValueStore()
    var db = histo.createDB({revisionStore: cas, branchStore: kvStore})
    it('should write some data', function(done) {
      var rev = revs1[0]
      db.put(rev.data, function(err, res) {
        assert.ok(res.head)
        rev.hash = res.head
        done()
      })
    })
    it('should read the data', function(done) {
      var rev = revs1[0]
      db.read(function(err, res) {
        assert.equal(res, rev.data)
        done()
      })
    })
    it('should write more data', function(done) {
      var revs = revs1.slice(1)
      writeRevs(db, revs, done)
    })
    it('should read the head', function(done) {
      db.read(function(err, res) {
        assert.equal(res, revs1[5].data)
        done()
      })
    })
    it('should read the data of a previous revision', function(done) {
      db.readAtRevision(revs1[0].hash, function(err, res) {
        assert.deepEqual(res, revs1[0].data)
        done()
      })
    })
    it('should set the head to a previous rev leaving a fork A', function(done) {
      db.setHead(commonAncestor.hash, function() {
        db.read(function(err, res) {
          assert.equal(res, commonAncestor.data)
          done()
        })
      })
    })
    it('should write more data creating a fork B', function(done) {
      writeRevs(db, revs2, done)
    })
    var revs
    var expectedRevs = revs1.slice(3)
    it('should find the missing revs to get from fork B to fork A', function(done) {
      db.revDifference(db.head(), forkAHead.hash, function(err, res) {
        var expectedDiff = expectedRevs.map(function(each) { return each.hash }).reverse()
        assert.deepEqual(res, expectedDiff)
        revs = res
        done()
      })
    })
    it('should create an iterator for bulk-reading rev data', function(done) {
      var revIterator = db.readRevisions(revs)
      iterators.toArray(revIterator, function(err, res) {
        res.reverse().map(function(each, i) {
          assert.equal(each.data, expectedRevs[i].data)
          assert.equal(each.ancestors[0], revs1[i+2].hash)
        })
        done()
      })
    })
  })
  describe('synchronization', function() {
    var db1 = histo.createDB({
      revisionStore: createContentAddressable(),
      branchStore: createKeyValueStore()
    })
    var db2 = histo.createDB({
      revisionStore: createContentAddressable(),
      branchStore: createKeyValueStore()
    })

    it('should populate db1', function(done) {
      writeRevs(db1, revs1.slice(0, 2), done)
    })

    var source = histo.createSource(db1)
    var target = histo.createTarget(db2)
    var synchronizer = histo.createSynchronizer(source, target)
    
    it('should pull changes from db1 to db2', function(done) {
      synchronizer.synchronize(done)
    })
  })
})
