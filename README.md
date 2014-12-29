Stream.js
========================

> A Collection Pipeline for JavaScript - inspired by the Java 8 Streams API.

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

## About this project

Stream.js is currently under heavy development, not yet ready for production. The main goal of Stream.js is to create a pendant of the Java 8 Streams API so you can use the same stream operations both on the backend and on the web frontend.

Although the API is very similar to Java 8, implementations are completely rewritten in JavaScript.