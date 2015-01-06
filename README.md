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

## About

Stream.js is currently under heavy development, but not yet ready for production. The main goal is to create a pendant of the Java 8 Streams API for the browser so you can use the same stream operations both on the backend and on the frontend. Although the API is very similar to Java 8, implementations are completely rewritten in JavaScript.

## Creator

Benjamin Winterberg

* http://winterbe.com
* https://twitter.com/benontherun
* https://plus.google.com/u/0/105973259367211176218


## Copyright and license

Code is released under MIT license and copyright (c) 2014 by Benjamin Winterberg.
