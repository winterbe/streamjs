// run this file via terminal:
//
// jjs test-nashorn.js

load('../stream.js');

var max = Stream({a: 1, b: 2, c: 3})
    .filter(function (num) {
        return num % 2 === 1;
    })
    .forEach(function (num) {
        print(num);
    });