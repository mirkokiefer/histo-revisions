
var assert = require('assert')
var histo = require('../lib/index')
var async = require('async')

var createContentAddressable = require('./mock-stores/content-addressable')
var createKeyValueStore = require('./mock-stores/key-value-store')

var cas = createContentAddressable()
var kvStore = createKeyValueStore()
var db = histo.createDB({commitStore: cas, refStore: kvStore})

var commits1 = [
  {data: '123'},
  {data: '456'},
  {data: '789'}
]

describe('HistoDB', function() {
  it('should write some data', function(done) {
    var commit = commits1[0]
    db.put(commit.data, function(err, res) {
      assert.ok(res.head)
      commit.hash = res.head
      done()
    })
  })
  it('should read the data', function(done) {
    var commit = commits1[0]
    db.read(function(err, res) {
      assert.equal(res, commit.data)
      done()
    })
  })
  it('should write more data', function(done) {
    var commits = commits1.slice(1)
    async.forEach(commits, function(each, cb) {
      db.put(each.data, function(err, res) {
        each.hash = res.head
        cb()
      })
    }, done)
  })
  it('should read the head', function(done) {
    db.read(function(err, res) {
      assert.equal(res, commits1[2].data)
      done()
    })
  })
  it('should read the data of a previous put', function(done) {
    db.readAtCommit(commits1[0].hash, function(err, res) {
      assert.deepEqual(res, commits1[0].data)
      done()
    })
  })
})