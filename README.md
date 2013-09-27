#histo-refs

A database that is able to track changing revisions of data.
Each revision is accessible through a unique `ref` which is based on a hash of the data's content and history.
A `ref` is similar to a git commit hash.

##Documentation

###require('histo-refs') -> histoRefs

###histoRefs.createDB(opts) -> db
`opts` is expected to be:

``` js
{
  revisionStore: revStore,
  branchStore: branchStore
}
```

With `revStore` being an object with a content-addressable store interface:

- `put(data, cb)`: should write some data and responds with a unique identifier of the data in the callback
- `get(identifier, cb)`: should respond with the data in the callback
- `del(identifier, cb)`: should delete the data for the specified identifier

`branchStore` is expected to be a simple key-value store interface:

- `put(key, value, cb)`
- `get(key, cb)`
- `del(key, cb)`

###db.head() -> ref
Returns the ref of the current head of the store.
The head changes every time new data is written or the head was explicitly set through `setHead`.

###db.setHead(ref)
Explicitly sets the head to a known ref.

###db.remoteHead(remoteName, cb)
Responds with the head ref of a remote database that is known to `db`.

###db.setRemoteHead(remoteName, ref, cb)
Updates the remote head of a remote database.
This function is usually not called directly but by a synchronizer.

###db.put(data, [ancestorRefs], cb)
Writes some data to the db. If `ancestorRefs is not specified the current head is used as the ancestor.
On success a ref to the written data is passed to the callback.

###db.get([ref], cb)
Reads the data for a given ref. If `ref` is not specified the current head is used.

###db.refDifference(fromRef, toRef, cb)
Responds with the list of refs that is required to get from `ref1` to `ref2`.

###db.readRevisions(refs) -> stream
Returns a [simple-stream](https://github.com/mirkokiefer/simple-stream) source for reading the data for a given list of refs.

###db.writeRevisions(stream, cb)
Writes the `stream` source of data to the database.

###db.commonAncestor(ref1, ref2, cb)
Responds with the common ancestor ref of two refs.

###histoRefs.createSynchronizer(sourceDB, targetDB) -> synchronizer
`sourceDB` is expected to be an object with the subset of db functions:

- `head(cb)`
- `refDifference(fromRef, toRef, cb)`
- `readRevisions(refs)` -> `stream`

`targetDB` requires the following set of functions:

- `head(cb)`
- `remoteHead(remoteName, cb)`
- `writeRevisions(stream, cb)`
- `setRemoteHead(remoteName, ref, cb)`

###synchronizer.run(cb)
On success the synchronizer will have written all new data to `targetDB` which is determined by the ref difference from `sourceDB` to `targetDB`.

##Contributors
This project was created by Mirko Kiefer ([@mirkokiefer](https://github.com/mirkokiefer)).
