Stream.js [![Travic CI](https://travis-ci.org/winterbe/streamjs.svg?branch=master)](https://travis-ci.org/winterbe/streamjs)
========================

> An Object Streaming Pipeline for JavaScript - inspired by the [Java 8 Streams API](http://winterbe.com/posts/2014/07/31/java8-stream-tutorial-examples/)

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

## Introduction

Stream.js is an object streaming pipeline for JavaScript. The API is very similar to the [Java 8 Streams API](http://winterbe.com/posts/2014/07/31/java8-stream-tutorial-examples/), however the implementation is completely rewritten in JavaScript. The main goal of this project is to provide a pendant to Java 8 Streams usable in modern browsers, so Java developers can reuse their knowledge when working on web frontends.

## Installation

Stream.js can be installed manually by downloading the [latest release](https://github.com/winterbe/streamjs/releases) from GitHub. The `dist` folder contains both the minified script and a source map file. Alternatively you can install Stream.js with [Bower](http://bower.io/):

```bash
$ bower install streamjs
```

## API Doc

Stream.js defines a single namespace `Stream` with various constructors to create new streams from different input sources like arrays, maps or number ranges. Streams are monadic types with a bunch of useful operations which can be chained to perform complex operations upon the input elements. Operations are either intermediate or terminal. Intermediate operations return the stream itself to construct operation chains. Terminal operations return a single result. Some terminal operations return a special `Optional` type which is described later.

#### Constructors

- Stream
- Stream.range

#### Intermediate Operations

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
 
#### Optional

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

## Creator

Benjamin Winterberg

* http://winterbe.com
* https://twitter.com/benontherun
* https://plus.google.com/u/0/105973259367211176218


## Copyright and license

Code is released under MIT license and copyright (c) 2014 by Benjamin Winterberg.
