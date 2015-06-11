(function () {
    "use strict";

    var buffer = [];

    var measure = function (name, input, fn) {
        var i,
            t0,
            time,
            repeat = 5,
            runs = [],
            min = null,
            max = null,
            sum = 0;

        for (i = 0; i < repeat; i++) {
            t0 = Date.now();
            var val = fn.call({}, input);
            buffer.push(val);
            time = Date.now() - t0;
            runs.push({
                name: name,
                time: time
            });
        }

        for (i = 0; i < runs.length; i++) {
            var run = runs[i];
            sum += run.time;
            if (min === null || min > run.time) {
                min = run.time;
            }
            if (max === null || max < run.time) {
                max = run.time;
            }
        }

        return {
            name: name,
            min: min,
            max: max,
            avg: sum / repeat
        };
    };

    var createInput = function (size) {
        return Stream.range(0, size)
            .map(function () {
                return Math.floor(Math.random() * size) + 1;
            })
            .toArray();
    };


    var input = createInput(100000);
    console.log("input.length: %o", input.length);

    var result;

    result = measure("Stream.js [filter - map - toArray]", input, function () {
        return Stream(input)
            .filter(function (num) {
                return num % 2 === 1;
            })
            .map(function (num) {
                return {num: num};
            })
            .toArray();
    });

    console.log(result);

    result = measure("Underscore.js [filter - map - value]", input, function () {
        return _.chain(input)
            .filter(function (num) {
                return num % 2 === 1;
            })
            .map(function (num) {
                return {num: num};
            })
            .value();
    });

    console.log(result);

    result = measure("Iterative [filter - map - array]", input, function () {
        var result = [];
        for (var i = 0; i < input.length; i++) {
            if (i % 2 === 1) {
                result.push({num: i});
            }
        }
        return result;
    });

    console.log(result);

    result = measure("Stream.js [filter - map - findFirst]", input, function () {
        return Stream(input)
            .filter(function (num) {
                return num % 2 === 1;
            })
            .map(function (num) {
                return {num: num};
            })
            .findFirst();
    });

    console.log(result);

    result = measure("Underscore.js [filter - map - first - value]", input, function () {
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

    console.log(result);

    result = measure("Iterative [filter - map - return first]", input, function () {
        for (var i = 0; i < input.length; i++) {
            if (i % 2 === 1) {
                return {num: i};
            }
        }
        return null;
    });

    console.log(result);


}());