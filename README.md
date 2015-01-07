Stream.js [![Travic CI](https://travis-ci.org/winterbe/streamjs.svg?branch=master)](https://travis-ci.org/winterbe/streamjs)
========================

> An Object Streaming Pipeline for JavaScript - inspired by the Java 8 Streams API

```javascript
Stream([5, 9, 2, 4, 8, 1])
   .filter(function (num) {
      return num % 2 === 1;
   })
   .sorted()
   .map(function (num) {
      return "obj" + num;
   })
   .toArray();
```

<p align="center">
   <a href="https://twitter.com/benontherun">Twitter</a> - <a href="https://plus.google.com/105973259367211176218/posts">Google+</a> - <a href="http://winterbe.com">Blog</a>
</p>

# Introduction

Stream.js is an object streaming pipeline for JavaScript. The API is very similar to the [Java 8 Streams API](http://winterbe.com/posts/2014/07/31/java8-stream-tutorial-examples/), however the implementation is completely rewritten in JavaScript. The main goal of this project is to provide a pendant to Java 8 Streams usable in modern browsers, so Java developers can reuse their knowledge when working on web frontends.

# Installation

Stream.js can be installed manually by downloading the [latest release](https://github.com/winterbe/streamjs/releases) from GitHub. The `dist` folder contains both the minified script and a source map file. Alternatively you can install Stream.js with [Bower](http://bower.io/):

```bash
$ bower install streamjs
```

# How Streams work

Stream.js defines a single namespace `Stream` with various constructors to create new streams from different input sources like arrays, maps or number ranges. Streams are monadic types with a bunch of useful operations. Those functions can be chained to perform complex operations upon the input elements. Operations are either *intermediate* or *terminal*. Intermediate operations return the stream itself to construct operation chains. Terminal operations return a single result (or nothing). Some terminal operations return a special `Optional` type which is described later.

# Why Stream.js?

What's the difference between Stream.js and other functional libraries like Underscore.js?

Stream.js is built around a lazily evaluated operation pipeline. Instead of performing each operation  on the whole input collection consecutively, each object will be passed vertically upon the chain. Interim results will not be stored in internal collections (except for some stateful operations like `sorted`). Instead objects will just be passed along the pipeline. This results in **minimized memory consumption** and internal state.

Stream operations are lazily evaluated to avoid examining all the data when it's not necessary. Streams always perform the minimal amount of operations to gain results. E.g. in a `filter -> map -> findFirst` stream you don't have to filter and map the whole data. Instead `map` and `findFirst` will only executed once before returning a single result. This results in **increased performance** when operation apon large amounts of input elements.

```js
Stream([1, 2, 3, 4])
   .filter(function(num) {   // called twice
      return num % 2 === 0;
   })
   .map(function(even) {     // called once
      return "even" + even;
   })
   .findFirst();             // called once
```

# API Doc

## Constructors

- Stream
- Stream.range
- Stream.rangeClosed

## Intermediate Operations

- filter
- map
- flatMap
- sorted
- distinct
- limit
- skip
- peek

#### Terminal Operations

- toArray
- forEach
- findFirst
- min
- max
- sum
- average
- count
- allMatch
- anyMatch
- noneMatch
- collect
- reduce
- groupBy
- indexBy
- partitionBy
- joining
 
## Optional

- Optional.of
- Optional.ofNullable
- Optional.empty
- get
- isPresent
- ifPresent
- orElse
- orElseGet
- orElseThrow
- filter
- map
- flatMap


# Copyright and license

Created and copyright (c) 2014-2015 by Benjamin Winterberg. Stream.js may be freely distributed under the MIT license.
