Stream.js [![Travic CI](https://travis-ci.org/winterbe/streamjs.svg?branch=master)](https://travis-ci.org/winterbe/streamjs)
========================

**ATTENTION: Stream.js is no longer maintained in favor of it's successor library [Sequency](https://github.com/winterbe/sequency). If you already use Stream.js in your project I recommend switching to [Sequency](https://github.com/winterbe/sequency). But don't worry, Stream.js still works fine so no hurry. 😉**

> Lazy Object Streaming Pipeline for JavaScript - inspired by the [Java 8 Streams API](http://winterbe.com/posts/2014/07/31/java8-stream-tutorial-examples/)

```js
Stream(people)
   .filter({age: 23})
   .flatMap("children")
   .map("firstName")
   .distinct()
   .filter(/a.*/i)
   .join(", ");
```

<p align="center">
   <i>Follow on <a href="https://twitter.com/winterbe_">Twitter</a> for Updates</i>
</p>

# Getting started

Stream.js is a lightweight (**2.6 KB minified, gzipped**), intensely tested (**700+ assertions, 97% coverage**) functional programming library for operating upon collections of in-memory data. It requires EcmaScript 5+, has built-in support for [ES6 features](https://github.com/lukehoban/es6features) and works in all current browsers, [Node.js](http://nodejs.org/) and Java 8 [Nashorn](http://openjdk.java.net/projects/nashorn/).

Download the [latest release](https://github.com/winterbe/streamjs/releases) from GitHub or install Stream.js via [NPM](https://www.npmjs.com/package/streamjs) or [Bower](http://bower.io/):

```bash
npm install streamjs

# or

bower install streamjs
```

<p align="center">
   <i>Read the <a href="https://github.com/winterbe/streamjs/blob/master/APIDOC.md">APIDOC</a></i>
</p>

# Examples

Before explaining how Stream.js works in detail, here's a few real world code samples.

Filter and sort a collection of persons, then group everything by age.

```js
Stream(people)
   .filter({married: true, gender: 'male'})
   .sorted("lastName")
   .groupBy("age");
```

Filter and transform a collection of tweets to its text content, then limit the tweets to a maximum of 100 and partition the results into 10 tweets per page:

```js
Stream(tweets)
   .filter(function (tweet) {
      return tweet.author !== me;
   })
   .map("text")
   .filter(/.*streamjs.*/i)
   .limit(100)
   .partitionBy(10);
```

Create an array of 100 odd random numbers between 1 and 1000:

```js
Stream
   .generate(function() {
      return Math.floor(Math.random() * 1000) + 1;
   })
   .filter(function (num) {
      return num % 2 === 1;
   })
   .limit(100)
   .toArray();
```

Create an infinite iterator, generating an odd random number between 1 and 1000 on each call to `next()`:

```js
var iterator = Stream
   .generate(function() {
      return Math.floor(Math.random() * 1000) + 1;
   })
   .filter(function (num) {
      return num % 2 === 1;
   })
   .iterator();

iterator.next();
iterator.next();
```

Create an array of 100 parent objects, each holding an array of 10 children:

```js
Stream
    .range(0, 100)
    .map(function (num) {
        return {
            parentId: num,
            type: 'parent',
            children: []
        };
    })
    .peek(function (parent) {
        parent.children = Stream
            .range(0, 10)
            .map(function (num) {
                return {
                    childId: num,
                    type: 'child',
                    parent: parent
                };
            })
            .toArray();
    })
    .toArray();
```

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

# [API Documentation](https://github.com/winterbe/streamjs/blob/master/APIDOC.md)

The Stream.js API is described in detail [here](https://github.com/winterbe/streamjs/blob/master/APIDOC.md). For more information about Java 8 Streams I recommend reading the official [Javadoc](http://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html) and this [blog post](http://winterbe.com/posts/2014/07/31/java8-stream-tutorial-examples/).

A type definition for using Stream.js with **Typescript** is available [here](https://github.com/borisyankov/DefinitelyTyped/tree/master/streamjs).

# Contributing

Found a bug or missing feature? Please open an [issue](https://github.com/winterbe/streamjs/issues)! Your feedback and help is highly appreciated. Please refer to the [contributing rules](https://github.com/winterbe/streamjs/blob/master/CONTRIBUTING.md) before sending a pull request. I would also love to hear your feedback via [Twitter](https://twitter.com/benontherun).

# Copyright and license

Created and copyright (c) 2014-2016 by Benjamin Winterberg.

Stream.js may be freely distributed under the [MIT license](https://github.com/winterbe/streamjs/blob/master/LICENSE).
