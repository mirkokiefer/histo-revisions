
var assert = require('assert')
var histo = require('../lib/index')
var async = require('async')

var createContentAddressable = require('./mock-stores/content-addressable')
var createKeyValueStore = require('./mock-stores/key-value-store')

var cas = createContentAddressable()
var kvStore = createKeyValueStore()
var db = histo.createDB({commitStore: cas, refStore: kvStore})

var commits1 = [
  {data: 'abc'},
  {data: 'def'},
  {data: 'ghi'},
  {data: 'jkl'},
  {data: 'mno'},
  {data: 'pqr'}
]

var forkCommit = commits1[2]

var commits2 = [
  {data: 'stu'},
  {data: 'vwx'},
  {data: 'yz'}
]

var writeCommits = function(commits, cb) {
  async.forEach(commits, function(each, cb) {
    db.put(each.data, function(err, res) {
      each.hash = res.head
      cb()
    })
  }, cb)
}

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
    writeCommits(commits, done)
  })
  it('should read the head', function(done) {
    db.read(function(err, res) {
      assert.equal(res, commits1[5].data)
      done()
    })
  })
  it('should read the data of a previous put', function(done) {
    db.readAtCommit(commits1[0].hash, function(err, res) {
      assert.deepEqual(res, commits1[0].data)
      done()
    })
  })
  it('should set the head to a previous rev', function(done) {
    db.setHead(forkCommit.hash, function() {
      db.read(function(err, res) {
        assert.equal(res, forkCommit.data)
        done()
      })
    })
  })
  it('should write more data creating a fork', function(done) {
    writeCommits(commits2, done)
  })
})
