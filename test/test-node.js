var Stream = require("../src/stream.js");

var result = Stream([5, 9, 2, 4, 8, 1])
    .filter(function (num) {
        return num % 2 === 1;
    })
    .sorted()
    .map(function (num) {
        return "odd" + num;
    })
    .toArray();

console.log(result);