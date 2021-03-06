#histo-revisions
[![Build Status](https://travis-ci.org/mirkokiefer/histo-revisions.png?branch=master)](https://travis-ci.org/mirkokiefer/histo-revisions)

[![NPM](https://nodei.co/npm/histo-revisions.png)](https://nodei.co/npm/histo-revisions/)

A database that tracks changing revisions of data.

Each revision is accessible through a unique **ref** which is based on a cryptographic hash of the data's content and history.
A **ref** is similar to a git commit hash.

Each written data object is combined with a link to its ancestors - the combination is called a **revision**.
A revision can be compared to a git commit object.

Revisions look like this:

``` js
{
  ancestors: ['someref'],
  data: 'some data'
}
```

The cryptographic hash of the revision is its **ref**.

##Documentation

- [`revisions.createDB(opts) -> db`](#createDB)
- [`db.put(data, [ancestorRefs], cb)`](#put)
- [`db.get([ref], cb)`](#get)
- [`db.head(cb) -> ref`](#head)
- [`db.setHead(ref, [previousHead], cb)`](#setHead)
- [`db.remoteHead(remoteName, cb)`](#remoteHead)
- [`db.setRemoteHead(remoteName, ref, cb)`](#setRemoteName)
- [`db.refDifference(fromRef, toRef, cb)`](#refDifference)
- [`db.ancestors(ref, cb)`](#ancestors)
- [`db.commonAncestor(ref1, ref2, cb)`](#commonAncestor)
- [`db.createStream(refs) -> stream`](#createStream)
- [`db.writeStream(stream, cb)`](#writeStream)
- [`revisions.createSynchronizer(sourceDB, targetDB) -> synchronizer`](#createSynchronizer)
- [`synchronizer.run(cb)`](#syncRun)
- [Merging synchronized data](#merging)

###require('histo-revisions') -> revisions

<a name="createDB" />
###revisions.createDB(opts) -> db
`opts` is expected to be:

``` js
{
  name: 'your-db-name', // will generate uuid if omitted
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

<a name="put" />
###db.put(data, [ancestorRefs], cb)
Writes some data to the db. If `ancestorRefs is not specified the current head is used as the ancestor.
On success a ref to the written data is passed to the callback.

<a name="get" />
###db.get([ref], cb)
Reads the data for a given ref. If `ref` is not specified the current head is used.

<a name="head" />
###db.head(cb) -> ref
The ref of the current head of the store is passed to the callback.
The head changes every time new data is written or the head was explicitly set through `setHead`.

<a name="setHead" />
###db.setHead(ref, [previousHead], cb)
Explicitly sets the head to a known ref.
You can pass in the previous head if you want to use optimistic locking. If the head has been updated in the meantime, the function will callback with an error.

<a name="remoteHead" />
###db.remoteHead(remoteName, cb)
Responds with the head ref of a remote database that is known to `db`.

<a name="setRemoteHead" />
###db.setRemoteHead(remoteName, ref, cb)
Updates the remote head of a remote database.
This function is usually not called directly but by a synchronizer.

<a name="refDifference" />
###db.refDifference(fromRef, toRef, cb)
Responds with the list of refs that is required to get from `ref1` to `ref2`.

The difference is computed using the [graph-difference](https://github.com/mirkokiefer/graph-difference) module.

<a name="commonAncestor" />
###db.commonAncestor(ref1, ref2, cb)
Responds with the common ancestor ref of two refs.

The common ancestor is computed using the [ancestor](https://github.com/mirkokiefer/ancestor) module.

<a name="ancestors" />
###db.ancestors(ref, cb)
Responds with the ancestors of `ref`.

<a name="createStream" />
###db.createStream(refs) -> stream
Returns a [simple-stream](https://github.com/mirkokiefer/simple-stream) source for reading the revisions for a given list of refs.

<a name="writeStream" />
###db.writeStream(stream, cb)
Writes the `stream` source of revisions to the database.

<a name="createSynchronizer" />
###revisions.createSynchronizer(sourceDB, targetDB) -> synchronizer
`sourceDB` is expected to be an object with the subset of db functions and properties:

- `name`
- `head(cb)`
- `refDifference(fromRef, toRef, cb)`
- `createStream(refs)` -> `stream`

`targetDB` requires the following set of functions:

- `head(cb)`
- `remoteHead(remoteName, cb)`
- `writeStream(stream, cb)`
- `setRemoteHead(remoteName, ref, cb)`

<a name="syncRun" />
###synchronizer.run(cb)
On success the synchronizer will have written all new revisions to `targetDB` which is determined by the ref difference from `sourceDB` to `targetDB`.

<a name="merging" />
###Merging synchronized data
Synchronizing two databases does not update the target databases' head.
It will only write all revisions to the target.
To merge the data you need to read the remote head of the source database, get the corresponding data, merge the data and write a new revision:

``` js
function readRemoteRev(db, remoteName, cb) {
  db.remoteHead(remoteName, function(err, remoteHead) {
    db.get(remoteHead, function(err, remoteData) {
      cb(null, {head: remoteHead, data: remoteData});
    });
  });
}

function readLocalRev(db, cb) {
  db.head(function(err, localHead) {
    db.get(localHead, function(localData) {
      cb(null, {head: localHead, data: remoteData});
    });
  });
}

readRemoteRev(targetDB, 'your-remote-name', function(err, remoteRev) {
  readLocalRev(targetDB, function(err, localRev) {
    var mergedData = yourMergeFunction(remoteRev.data, localRev.data);
    var ancestors = [remoteRev.head, localRev.head];
    targetDB.put(mergedData, ancestors, function(err, mergedRef) {
      targetDB.setHead(mergedRef, localRev.head, function(err) {
        // on err repeat merging with new local head
      });
    });
  });
});
```

##Todo
- list of remotes
- garbage collect history 

##Contributors
This project was created by Mirko Kiefer ([@mirkokiefer](https://github.com/mirkokiefer)).
