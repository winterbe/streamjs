/**
 * Stream.js 1.0.0
 * https://github.com/winterbe/streamjs
 * Copyright (c) 2014-2015 Benjamin Winterberg
 * Stream.js may be freely distributed under the MIT license.
 */
(function () {
    "use strict";

    var root = this,
        version = "1.0.0",
        ctx = {},
        nil = {};



    var Iterator = function () {

    };
    Iterator.of = function (data) {
        if (isArray(data)) {
            return new ArrayIterator(data);
        }
        if (isObject(data)) {
            return new ObjectIterator(data);
        }
        return new ValueIterator(data);
    };


    var ArrayIterator = function (array) {
        this.initialize(array);
    };
    ArrayIterator.prototype = new Iterator();
    ArrayIterator.prototype.next = function () {
        if (this.origin >= this.fence) {
            return nil;
        }

        try {
            return this.data[this.origin];
        }
        finally {
            this.origin++;
        }
    };
    ArrayIterator.prototype.initialize = function (array) {
        this.data = array || [];
        this.origin = 0;
        this.fence = this.data.length;
    };


    var ObjectIterator = function (object) {
        this.initialize(object);
    };
    ObjectIterator.prototype = new Iterator();
    ObjectIterator.prototype.initialize = function (object) {
        this.data = object || {};
        this.keys = Object.keys(object);
        this.origin = 0;
        this.fence = this.keys.length;
    };
    ObjectIterator.prototype.next = function () {
        if (this.origin >= this.fence) {
            return nil;
        }

        try {
            var key = this.keys[this.origin];
            return this.data[key];
        }
        finally {
            this.origin++;
        }
    };


    var ValueIterator = function (value) {
        this.initialize(value);
    };
    ValueIterator.prototype = new Iterator();
    ValueIterator.prototype.initialize = function (value) {
        this.value = value;
        this.done = false;
    };
    ValueIterator.prototype.next = function () {
        if (!this.done) {
            this.done = true;
            return this.value;
        }
        return nil;
    };



    var PipelineOp = function () {
        this.next = null;
        this.prev = null;
    };


    var IteratorOp = function (data) {
        this.iterator = Iterator.of(data);
    };
    IteratorOp.prototype = new PipelineOp();
    IteratorOp.prototype.advance = function () {
        var obj = this.iterator.next();
        if (obj === nil) {
            return obj;
        }
        if (this.next === null) {
            return obj;
        }
        return this.next.pipe(obj);
    };


    var MapOp = function (fn) {
        this.fn = fn;
    };
    MapOp.prototype = new PipelineOp();
    MapOp.prototype.advance = function () {
        return this.prev.advance();
    };
    MapOp.prototype.pipe = function (obj) {
        var result = this.fn.call(ctx, obj);
        if (this.next === null) {
            return result;
        }
        return this.next.pipe(result);
    };


    var FlatOp = function (fn) {
        this.fn = fn;
        this.iterator = null;
    };
    FlatOp.prototype = new PipelineOp();
    FlatOp.prototype.advance = function () {
        if (this.iterator === null) {
            return this.prev.advance();
        }
        var obj = this.iterator.next();
        if (obj === nil) {
            this.iterator = null;
            return this.prev.advance();
        }
        if (this.next === null) {
            return obj;
        }
        return this.next.pipe(obj);
    };
    FlatOp.prototype.pipe = function (obj) {
        this.iterator = Iterator.of(obj);
        var current = this.iterator.next();
        if (current === nil) {
            return this.prev.advance();
        }
        if (this.next === null) {
            return current;
        }
        return this.next.pipe(current);
    };


    var FilterOp = function (fn) {
        this.fn = fn;
    };
    FilterOp.prototype = new PipelineOp();
    FilterOp.prototype.advance = function () {
        return this.prev.advance();
    };
    FilterOp.prototype.pipe = function (obj) {
        var filtered = this.fn.call(ctx, obj);
        if (!filtered) {
            return this.prev.advance();
        }
        if (this.next === null) {
            return obj;
        }
        return this.next.pipe(obj);
    };


    var GeneratorOp = function (fn) {
        this.prev = null;
        this.next = null;
        this.fn = fn;
    };
    GeneratorOp.prototype.advance = function () {
        var val = this.fn.call(ctx);
        return this.next.pipe(val);
    };


    var StatefulOp = function (options) {
        this.prev = null;
        this.next = null;
        this.options = options;
        this.buffer = null;
        this.i = 0;
    };
    StatefulOp.prototype.advance = function () {
        var obj;
        if (this.buffer === null) {
            this.buffer = [];
            while ((obj = this.prev.advance()) !== nil) {
                // obj will be added to buffer via this.pipe
                this.i++;
                if (this.options.voter) {
                    var voted = this.options.voter.call(ctx, obj, this.i);
                    if (!voted) {
                        break;
                    }
                }
            }
            if (this.options.finisher) {
                this.options.finisher.call(ctx, this.buffer);
            }
        }

        if (this.buffer.length === 0) {
            return nil;
        }

        obj = this.buffer.shift();
        if (this.next !== null) {
            return this.next.pipe(obj);
        }

        return obj;
    };
    StatefulOp.prototype.pipe = function (obj) {
        if (this.options.voter) {
            var voted = this.options.voter.call(ctx, obj, this.i);
            if (!voted) {
                return;
            }
        }

        if (this.options.consumer) {
            this.options.consumer.call(ctx, obj, this.i);
        }

        var filtered = true;
        if (this.options.filter) {
            filtered = this.options.filter.call(ctx, obj, this.i, this.buffer);
        }
        if (filtered) {
            this.buffer.push(obj);
        }
    };

    var LimitOp = function (limit) {
        this.limit = limit;
        this.i = 0;
    };
    LimitOp.prototype = new PipelineOp();
    LimitOp.prototype.advance = function () {
        return this.prev.advance();
    };
    LimitOp.prototype.pipe = function (obj) {
        if (this.i >= this.limit) {
            return nil;
        }
        this.i++;
        if (this.next === null) {
            return obj;
        }
        return this.next.pipe(obj);
    };


    var SkipOp = function (skip) {
        this.skip = skip;
        this.i = 0;
    };
    SkipOp.prototype = new PipelineOp();
    SkipOp.prototype.advance = function () {
        return this.prev.advance();
    };
    SkipOp.prototype.pipe = function (obj) {
        if (this.i < this.skip) {
            this.i++;
            return this.prev.advance();
        }
        this.i++;
        if (this.next === null) {
            return obj;
        }
        return this.next.pipe(obj);
    };


    //
    // Internal Pipeline (doing all the work)
    //

    var Pipeline = function (input) {
        var pipeline = this, lastOp;

        // default op iterates over input elements

        if (isFunction(input)) {
            lastOp = new GeneratorOp(function () {
                return input.call(ctx);
            });
        }
        else if (isString(input)) {
            lastOp = new IteratorOp(input.split(''));
        }
        else {
            lastOp = new IteratorOp(input);
        }

        this.add = function (op) {
            if (lastOp !== null) {
                var prev = lastOp;
                op.prev = prev;
                prev.next = op;
            }

            lastOp = op;
        };

        this.next = function () {
            return lastOp.advance();
        };


        //
        // intermediate operations (stateless)
        //

        this.filter = function (predicate) {
            this.add(new FilterOp(predicate));
            return this;
        };

        this.map = function (mapper) {
            this.add(new MapOp(mapper));
            return this;
        };

        this.flatMap = function (mapper) {
            this.add(new MapOp(mapper));
            this.add(new FlatOp());
            return this;
        };


        //
        // intermediate operations (stateful)
        //

        this.sorted = function (comparator) {
            this.add(new StatefulOp({
                finisher: function (array) {
                    array.sort(comparator);
                }
            }));
            return this;
        };

        this.distinct = function () {
            this.add(new StatefulOp({
                filter: function (obj, i, array) {
                    return array.indexOf(obj) < 0;
                }
            }));
            return this;
        };

        this.skip = function (num) {
            this.add(new SkipOp(num));
            return this;
        };

        this.limit = function (num) {
            this.add(new LimitOp(num));
            return this;
        };

        this.peek = function (consumer) {
            this.add(new StatefulOp({
                consumer: consumer
            }));
            return this;
        };


        //
        // terminal operations
        //

        var terminal = {};

        terminal.toArray = function () {
            var current, result = [];
            while ((current = pipeline.next()) !== nil) {
                result.push(current);
            }
            return result;
        };

        terminal.findFirst = function () {
            var obj = pipeline.next();
            if (obj === nil) {
                return Optional.empty();
            }
            return Optional.ofNullable(obj);
        };

        terminal.forEach = function (fn) {
            var current;
            while ((current = pipeline.next()) !== nil) {
                fn.call(ctx, current);
            }
        };

        terminal.min = function (comparator) {
            comparator = comparator || defaultComparator;
            var current, result = null;
            while ((current = pipeline.next()) !== nil) {
                if (result === null || comparator.call(ctx, current, result) < 0) {
                    result = current;
                }
            }
            return Optional.ofNullable(result);
        };

        terminal.max = function (comparator) {
            comparator = comparator || defaultComparator;
            var current, result = null;
            while ((current = pipeline.next()) !== nil) {
                if (result === null || comparator.call(ctx, current, result) > 0) {
                    result = current;
                }
            }
            return Optional.ofNullable(result);
        };

        terminal.sum = function () {
            var current, result = 0;
            while ((current = pipeline.next()) !== nil) {
                result += current;
            }
            return result;
        };

        terminal.average = function () {
            var current, count = 0, sum = 0;
            while ((current = pipeline.next()) !== nil) {
                sum += current;
                count++;
            }
            if (sum === 0 || count === 0) {
                return Optional.empty();
            }
            return Optional.of(sum / count);
        };

        terminal.count = function () {
            var current, result = 0;
            while ((current = pipeline.next()) !== nil) {
                result++;
            }
            return result;
        };

        terminal.allMatch = function (fn) {
            var current;
            while ((current = pipeline.next()) !== nil) {
                var match = fn.call(ctx, current);
                if (!match) {
                    return false;
                }
            }
            return true;
        };

        terminal.anyMatch = function (fn) {
            var current;
            while ((current = pipeline.next()) !== nil) {
                var match = fn.call(ctx, current);
                if (match) {
                    return true;
                }
            }
            return false;
        };

        terminal.noneMatch = function (fn) {
            var current;
            while ((current = pipeline.next()) !== nil) {
                var match = fn.call(ctx, current);
                if (match) {
                    return false;
                }
            }
            return true;
        };

        terminal.collect = function (collector) {
            var identity = collector.supplier.call(ctx);
            var current, first = true;
            while ((current = pipeline.next()) !== nil) {
                identity = collector.accumulator.call(ctx, identity, current, first);
                first = false;
            }
            if (collector.finisher) {
                identity = collector.finisher.call(ctx, identity);
            }
            return identity;
        };

        terminal.reduce = function () {
            var arg0 = arguments[0];
            var arg1 = arguments[1];

            if (arg1) {
                return pipeline.collect({
                    supplier: function () {
                        return arg0;
                    },
                    accumulator: arg1
                });
            }

            return reduceFirst(arg0);
        };

        var reduceFirst = function (accumulator) {
            var current;

            var identity = pipeline.next();
            if (identity === nil) {
                return Optional.empty();
            }

            while ((current = pipeline.next()) !== nil) {
                identity = accumulator.call(ctx, identity, current);
            }

            return Optional.ofNullable(identity);
        };

        terminal.groupBy = function (keyMapper) {
            return pipeline.collect({
                supplier: function () {
                    return {};
                },
                accumulator: function (map, obj) {
                    var key = keyMapper.call(ctx, obj);
                    if (!map.hasOwnProperty(key)) {
                        map[key] = [];
                    }

                    if (map[key] === undefined) {
                        map[key] = [];
                    }

                    map[key].push(obj);
                    return map;
                }
            });
        };

        terminal.toMap = function (keyMapper, mergeFunction) {
            return pipeline.collect({
                supplier: function () {
                    return {};
                },
                accumulator: function (map, obj) {
                    var key = keyMapper.call(ctx, obj);
                    if (map.hasOwnProperty(key)) {
                        if (!mergeFunction) {
                            throw "duplicate mapping found for key: " + key;
                        }
                        map[key] = mergeFunction.call(ctx, map[key], obj);
                        return map;
                    }

                    map[key] = obj;
                    return map;
                }
            });
        };

        terminal.partitionBy = function () {
            var arg0 = arguments[0];
            if (isFunction(arg0)) {
                return partitionByPredicate(arg0);
            }
            if (isNumber(arg0)) {
                return partitionByNumber(arg0);
            }
            throw 'partitionBy requires argument of type function or number';
        };

        var partitionByPredicate = function (predicate) {
            return pipeline.collect({
                supplier: function () {
                    return {
                        "true": [], "false": []
                    };
                },
                accumulator: function (map, obj) {
                    var result = predicate.call(ctx, obj);
                    if (!map.hasOwnProperty(result)) {
                        map[result] = [];
                    }
                    map[result].push(obj);
                    return map;
                }
            });
        };

        var partitionByNumber = function (num) {
            return pipeline.collect({
                supplier: function () {
                    return [];
                },
                accumulator: function (array, obj) {
                    if (array.length === 0) {
                        array.push([obj]);
                        return array;
                    }

                    var partition = array[array.length - 1];
                    if (partition.length === num) {
                        array.push([obj]);
                        return array;
                    }

                    partition.push(obj);
                    return array;
                }
            });
        };

        terminal.joining = function (options) {
            var prefix = "", suffix = "", delimiter = "";
            if (options) {
                prefix = options.prefix || prefix;
                suffix = options.suffix || suffix;
                delimiter = options.delimiter || delimiter;
            }

            return pipeline.collect({
                supplier: function () {
                    return "";
                },
                accumulator: function (str, obj, first) {
                    var delim = first ? '' : delimiter;
                    return str + delim + String(obj);
                },
                finisher: function (str) {
                    return prefix + str + suffix;
                }
            });
        };


        //
        // assert stream can only be consumed once by proxing all terminal operations
        //

        var consumed = false;

        var terminalProxy = function (terminalFn) {
            return function () {
                try {
                    if (consumed) {
                        throw "stream has already been operated upon";
                    }
                    return terminalFn.apply(pipeline, arguments);
                } finally {
                    consumed = true;
                }
            };
        };

        for (var name in terminal) {
            if (terminal.hasOwnProperty(name)) {
                this[name] = terminalProxy(terminal[name]);
            }
        }


        //
        // aliases
        //

        this.indexBy = this.toMap;
        this.partitioningBy = this.partitionBy;
        this.groupingBy = this.groupBy;
        this.each = this.forEach;
        this.toList = this.toArray;
        this.join = this.joining;
        this.avg = this.average;
        this.sort = this.sorted;
        this.size = this.count;
        this.findAny = this.findFirst;
    };

    Pipeline.prototype.toString = function () {
        return "[object Stream]";
    };


    //
    // Optional type
    //

    var Optional = function (val) {
        this.isPresent = function () {
            return val !== null && val !== undefined;
        };

        this.get = function () {
            if (!this.isPresent()) {
                throw "optional value is not present";
            }
            return val;
        };

        this.ifPresent = function (consumer) {
            if (this.isPresent()) {
                consumer.call(val, val);
            }
        };

        this.orElse = function (otherVal) {
            if (this.isPresent()) {
                return val;
            }
            return otherVal;
        };

        this.orElseGet = function (supplier) {
            if (this.isPresent()) {
                return val;
            }
            return supplier.call(ctx);
        };

        this.orElseThrow = function (errorMsg) {
            if (this.isPresent()) {
                return val;
            }
            throw errorMsg;
        };

        this.filter = function (predicate) {
            if (this.isPresent()) {
                var filtered = predicate.call(ctx, val);
                if (filtered) {
                    return this;
                }
                return Optional.empty();
            }
            return this;
        };

        this.map = function (mapper) {
            if (this.isPresent()) {
                var mappedVal = mapper.call(ctx, val);
                return Optional.ofNullable(mappedVal);
            }
            return this;
        };

        this.flatMap = function (flatMapper) {
            if (this.isPresent()) {
                return flatMapper.call(ctx, val);
            }
            return this;
        };
    };

    Optional.prototype.toString = function () {
        return "[object Optional]";
    };

    Optional.of = function (val) {
        if (val === null || val === undefined) {
            throw "value must be present";
        }
        return new Optional(val);
    };

    Optional.ofNullable = function (val) {
        return new Optional(val);
    };

    Optional.empty = function () {
        return new Optional(undefined);
    };


    //
    // Common stuff
    //

    var defaultComparator = function (a, b) {
        if (a === b) {
            return 0;
        }
        return a > b ? 1 : -1;
    };

    var isString = function (obj) {
        return Object.prototype.toString.call(obj) === '[object String]';
    };

    var isFunction = function (obj) {
        return typeof obj === 'function' || false;
    };

    var isNumber = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Number]';
    };

    var isArray = Array.isArray || function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        };

    var isObject = function (obj) {
        return typeof obj === 'object' && !!obj;
    };


    //
    // Stream function grants access to pipeline
    //

    var Stream = function (input) {
        return new Pipeline(input);
    };

    Stream.range = function (startInclusive, endExclusive) {
        var array = [];
        for (var i = startInclusive; i < endExclusive; i++) {
            array.push(i);
        }
        return Stream(array);
    };

    Stream.rangeClosed = function (startInclusive, endInclusive) {
        return Stream.range(startInclusive, endInclusive + 1);
    };

    Stream.of = function () {
        var args = Array.prototype.slice.call(arguments);
        return Stream(args);
    };

    Stream.generate = function (supplier) {
        return Stream(supplier);
    };

    Stream.iterate = function (seed, fn) {
        var first = true, current = seed;
        return Stream(function () {
            if (first) {
                first = false;
                return seed;
            }
            current = fn.call(ctx, current);
            return current;
        });
    };

    Stream.empty = function () {
        return Stream([]);
    };


    Stream.VERSION = version;
    Stream.Optional = Optional;

    var previousStream = window.Stream;

    Stream.noConflict = function () {
        window.Stream = previousStream;
        return Stream;
    };


    //
    // expose Stream
    //

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Stream;
    }
    else if (typeof define === 'function' && define.amd) {
        define('streamjs', [], function () {
            return Stream;
        });
    }
    else {
        root.Stream = Stream;
    }

}.call(this));