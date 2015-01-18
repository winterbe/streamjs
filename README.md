Stream.js [![Travic CI](https://travis-ci.org/winterbe/streamjs.svg?branch=master)](https://travis-ci.org/winterbe/streamjs)
========================

> An Object Streaming Pipeline for JavaScript - inspired by the [Java 8 Streams API](http://winterbe.com/posts/2014/07/31/java8-stream-tutorial-examples/)

```js
Stream([5, 9, 2, 4, 8, 1])
   .filter(function (num) {
      return num % 2 === 1;
   })
   .sorted()
   .map(function (num) {
      return "odd" + num;
   })
   .toArray();
```

<p align="center">
   <i>Follow on <a href="https://twitter.com/benontherun">Twitter</a> for Updates</i>
</p>

# Getting started

Stream.js is based on ECMAScript 5 and works in all modern browsers as well as [Node.js](http://nodejs.org/) and [Nashorn](http://openjdk.java.net/projects/nashorn/). In order to get started you can install Stream.js manually by downloading the [latest release](https://github.com/winterbe/streamjs/releases) from GitHub. The root folder contains the minified script and a source map file for debugging. Alternatively you can install Stream.js with [Bower](http://bower.io/) or [NPM](https://www.npmjs.com/package/streamjs).

##### Bower

```bash
$ bower install streamjs
```

##### Node

```bash
$ npm install streamjs
```

<p align="center">
   <i>Read the <a href="https://github.com/winterbe/streamjs/wiki">API Doc</a></i>
</p>

# How Streams work

Stream.js defines a single function `Stream` to create new streams from different input collections like _arrays_, _maps_ or _number ranges_:

```js
Stream([1, 2, 3]);
Stream({a: 1, b: 2, c: 3});
Stream.of(1, 2, 3);
Stream.range(1, 4);
```

Streams are monadic types with a bunch of useful operations. Those functions can be chained one after another to make complex computations upon the input elements. Operations are either *intermediate* or *terminal*. Intermediate operations are lazy and return the stream itself to enable method chaining. Terminal operations return a single result (or nothing at all). Some terminal operations return a special monadic `Optional` type which is described later.

Streams are not limited to finite data sources like collections. You can also create *infinite* streams of elements by utilizing generator or iterator functions.

```js
Stream.generate(function() {
   return 1337 * Math.random();
);
```

```js
Stream.iterate(1, function (seed) {
   return seed * 2;
});
```

# Why Stream.js?

What's so different between Stream.js and other functional libraries like Underscore.js?

Stream.js is built around a lazily evaluated operation pipeline. Instead of consecutively performing each operation on the whole input collection, objects are passed vertically and one by one upon the chain. Interim results will _not_ be stored in internal collections (except for some stateful operations like `sorted`). Instead objects are directly piped into the resulting object as specified by the terminal operation. This results in **minimized memory consumption** and internal state.

Stream operations are lazily evaluated to avoid examining all of the input data when it's not necessary. Streams always perform the minimal amount of operations to gain results. E.g. in a `filter - map - findFirst` stream you don't have to filter and map the whole data. Instead `map` and `findFirst` are executed just one time before returning the single result. This results in **increased performance** when operation upon large amounts of input elements.

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

# [API Documentation](https://github.com/winterbe/streamjs/wiki)

The Stream.js API is described in detail in the [project wiki](https://github.com/winterbe/streamjs/wiki). For more information about Java 8 Streams I recommend reading the official [Javadoc](http://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html) and this [blog post](http://winterbe.com/posts/2014/07/31/java8-stream-tutorial-examples/).

# Copyright and license

Created and copyright (c) 2014-2015 by Benjamin Winterberg. Stream.js may be freely distributed under the [MIT license](https://github.com/winterbe/streamjs/blob/master/LICENSE).
