/**
 * Stream.js 0.3.0
 * https://github.com/winterbe/streamjs
 * Copyright (c) 2014-2015 Benjamin Winterberg
 * Stream.js may be freely distributed under the MIT license.
 */
(function (window) {
    "use strict";


    var VERSION = "0.3.0";


    //
    // Internal Pipeline (doing all the work)
    //

    var Pipeline = function (collection) {
        var pipeline = this;

        // default op iterates over input array
        var lastOp = new StatelessOp(function (arg) {
            return arg;
        }, true, collection);

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
            assertFn(predicate, "predicate function argument required for filter");
            this.add(new StatelessOp(function (arg) {
                var filtered = predicate.call(ctx, arg);
                if (filtered) {
                    return arg;
                } else {
                    return null;
                }
            }));
            return this;
        };

        this.map = function (mapper) {
            assertFn(mapper, "mapper function argument required for map");
            this.add(new StatelessOp(function (arg) {
                return mapper.call(ctx, arg);
            }));
            return this;
        };

        this.flatMap = function (mapper) {
            assertFn(mapper, "mapper function argument required for flatMap");
            this.add(new StatelessOp(function (arg) {
                return mapper.call(ctx, arg);
            }, true));
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

        this.skip = function (num) {
            this.add(new StatefulOp({
                filter: function (obj, i) {
                    return i >= num;
                }
            }));
            return this;
        };

        this.limit = function (num) {
            this.add(new StatefulOp({
                voter: function (obj, i) {
                    return i < num;
                }
            }));
            return this;
        };

        this.peek = function (consumer) {
            this.add(new StatefulOp({
                consumer: consumer
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


        //
        // terminal operations
        //

        var terminal = {};

        terminal.toArray = function () {
            var current;
            var result = [];
            while ((current = pipeline.next()) !== eop) {
                result.push(current);
            }
            return result;
        };

        terminal.findFirst = function () {
            var obj = pipeline.next();
            if (obj === eop) {
                return Optional.empty();
            }
            return Optional.ofNullable(obj);
        };

        terminal.findLast = function () {
            var current, last;
            while ((current = pipeline.next()) !== eop) {
                last = current;
            }
            if (last === eop) {
                return Optional.empty();
            }
            return Optional.ofNullable(last);
        };

        terminal.forEach = function (fn) {
            var current;
            while ((current = pipeline.next()) !== eop) {
                fn.call(ctx, current);
            }
        };

        terminal.min = function (comparator) {
            comparator = comparator || defaultComparator;

            var current, result = null;
            while ((current = pipeline.next()) !== eop) {
                if (result === null || comparator.call(ctx, current, result) < 0) {
                    result = current;
                }
            }
            return Optional.ofNullable(result);
        };

        terminal.max = function (comparator) {
            comparator = comparator || defaultComparator;

            var current, result = null;
            while ((current = pipeline.next()) !== eop) {
                if (result === null || comparator.call(ctx, current, result) > 0) {
                    result = current;
                }
            }
            return Optional.ofNullable(result);
        };

        terminal.sum = function () {
            var current, result = 0;
            while ((current = pipeline.next()) !== eop) {
                result += current;
            }
            return result;
        };

        terminal.average = function () {
            var current, count = 0, sum = 0;
            while ((current = pipeline.next()) !== eop) {
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
            while ((current = pipeline.next()) !== eop) {
                result++;
            }
            return result;
        };

        terminal.allMatch = function (fn) {
            var current;
            while ((current = pipeline.next()) !== eop) {
                var match = fn.call(ctx, current);
                if (!match) {
                    return false;
                }
            }
            return true;
        };

        terminal.anyMatch = function (fn) {
            var current;
            while ((current = pipeline.next()) !== eop) {
                var match = fn.call(ctx, current);
                if (match) {
                    return true;
                }
            }
            return false;
        };

        terminal.noneMatch = function (fn) {
            var current;
            while ((current = pipeline.next()) !== eop) {
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
            while ((current = pipeline.next()) !== eop) {
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
            if (identity === eop) {
                return Optional.empty();
            }

            while ((current = pipeline.next()) !== eop) {
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

        terminal.indexBy = function (keyMapper, mergeFunction) {
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
                    return {};
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

        var assertNotConsumed = function () {
            if (consumed) {
                throw "stream has already been operated upon";
            }
        };

        var terminalProxy = function (terminalFn) {
            return function () {
                try {
                    assertNotConsumed();
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
    };


    //
    // Generic Pipeline operations
    //

    var StatelessOp = function (fn, flat, data) {
        this.prev = null;
        this.next = null;

        this.advance = function () {
            if (!isStashed() && this.prev === null) {
                return eop;
            }

            if (!isStashed()) {
                return this.prev.advance();
            }

            var obj = unstash();
            if (this.next !== null) {
                return this.next.pipe(obj);
            }
            return obj;
        };

        this.pipe = function (obj) {
            var val = fn.call(ctx, obj);
            stash(val, flat);

            if (!isStashed()) {
                return this.advance();
            }

            obj = unstash();
            if (this.next !== null) {
                return this.next.pipe(obj);
            }
            return obj;
        };


        // internal data buffering

        var buffer = null,
            flatten = false,    // if true buffer array will be iterated
            keys = null,        // in case we iterate over object hash
            origin = 0,         // current buffer index (if flatten)
            fence = 0;          // max buffer size (if flatten)

        var isStashed = function () {
            if (buffer === null) {
                return false;
            }
            if (flatten) {
                return origin < fence;
            }
            return true;
        };

        var unstash = function () {
            var bufferedVal;
            if (!flatten) {
                bufferedVal = buffer;
                buffer = null;
                return bufferedVal;
            }

            bufferedVal = nextBufferedVal();
            origin++;
            if (origin >= fence) {
                buffer = null;
                keys = null;
                flatten = false;
                origin = 0;
                fence = 0;
            }
            return bufferedVal;
        };

        var nextBufferedVal = function () {
            if (isArray(buffer)) {
                return buffer[origin];
            }
            var key = keys[origin];
            return buffer[key];
        };

        var stash = function (val, flat) {
            buffer = val;
            flatten = flat;

            if (!flatten) {
                return;
            }

            if (isArray(buffer)) {
                fence = buffer.length;
            } else if (isObject(buffer)) {
                keys = Object.keys(buffer);
                fence = keys.length;
            }
        };


        if (data) {
            stash(data, flat);
        }
    };

    Pipeline.prototype.toString = function () {
        return "[object Stream]";
    };

    var StatefulOp = function (options) {
        this.prev = null;
        this.next = null;

        var buffer = null, i = 0;

        this.advance = function () {
            var obj;
            if (buffer === null) {
                buffer = [];
                while ((obj = this.prev.advance()) !== eop) {
                    // obj will be added to buffer via this.pipe
                    i++;
                    if (options.voter) {
                        var voted = options.voter.call(ctx, obj, i);
                        if (!voted) {
                            break;
                        }
                    }
                }
                if (options.finisher) {
                    options.finisher.call(ctx, buffer);
                }
            }

            if (buffer.length === 0) {
                return eop;
            }

            obj = buffer.shift();
            if (this.next !== null) {
                return this.next.pipe(obj);
            }

            return obj;
        };

        this.pipe = function (obj) {
            if (options.consumer) {
                options.consumer.call(ctx, obj, i);
            }

            var filtered = true;
            if (options.filter) {
                filtered = options.filter.call(ctx, obj, i, buffer);
            }
            if (filtered) {
                buffer.push(obj);
            }
        };
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

    var eop = "END_OF_PIPE",
        ctx = {};

    var defaultComparator = function (a, b) {
        if (a === b) {
            return 0;
        }
        return a > b ? 1 : -1;
    };

    var assertFn = function (obj, errorMsg) {
        if (!isFunction(obj)) {
            throw errorMsg;
        }
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

    var Stream = function (array) {
        return new Pipeline(array);
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


    //
    // public variables
    //

    Stream.VERSION = VERSION;

    Stream.Optional = Optional;

    var previousStream = window.Stream;

    Stream.noConflict = function () {
        window.Stream = previousStream;
        return Stream;
    };

    window.Stream = Stream;

}(window));