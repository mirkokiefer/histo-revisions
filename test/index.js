
var assert = require('assert')
var histo = require('../lib/index')

var createContentAddressable = require('./mock-stores/content-addressable')
var createKeyValueStore = require('./mock-stores/key-value-store')

var cas = createContentAddressable()
var kvStore = createKeyValueStore()
var db = histo.createDB({commitStore: cas, refStore: kvStore})

var commits = [
  {data: '123'},
  {data: '456'},
  {data: '789'}
]

describe('HistoDB', function() {
  it('should write some data', function(done) {
    var commit = commits[0]
    db.put(commit.data, function(err, res) {
      assert.ok(res.head)
      commit.hash = res.head
      done()
    })
  })
  it('should read the data', function(done) {
    var commit = commits[0]
    db.read(function(err, res) {
      assert.equal(res, commit.data)
      done()
    })
  })
})