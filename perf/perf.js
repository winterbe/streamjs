(function () {
    "use strict";

    var measure = function (name, input, fn) {
        var t0 = Date.now();
        fn.call({}, input);
        var time = Date.now() - t0;
        console.log("%s - took: %oms", name, time);
    };

    var createInput = function (size) {
        return Stream.range(0, size)
            .map(function () {
                return Math.floor(Math.random() * size) + 1;
            })
            .toArray();
    };


    var input = createInput(1000000);
    console.log("input.length: %o", input.length);

    measure("Stream.js [filter - map - toArray]", input, function () {
        return Stream(input)
            .filter(function (num) {
                return num % 2 === 1;
            })
            .map(function (num) {
                return {num: num};
            })
            .toArray();
    });

    measure("Underscore.js [filter - map - value]", input, function () {
        return _.chain(input)
            .filter(function (num) {
                return num % 2 === 1;
            })
            .map(function (num) {
                return {num: num};
            })
            .value();
    });

    measure("Stream.js [filter - map - findFirst]", input, function () {
        return Stream(input)
            .filter(function (num) {
                return num % 2 === 1;
            })
            .map(function (num) {
                return {num: num};
            })
            .findFirst();
    });

    measure("Underscore.js [filter - map - first - value]", input, function () {
        return _.chain(input)
            .filter(function (num) {
                return num % 2 === 1;
            })
            .map(function (num) {
                return {num: num};
            })
            .first()
            .value();
    });


}());