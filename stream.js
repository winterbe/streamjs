/**
 * Stream.js v1.6.4
 * https://github.com/winterbe/streamjs
 * Copyright (c) 2014-2015 Benjamin Winterberg
 * Stream.js may be freely distributed under the MIT license.
 */
(function () {
    "use strict";

    var root = (typeof global === 'object' && global) || this,
        version = "1.6.4",
        ctx = {},
        nil = {};


    function Iterator() {

    }

    Iterator.of = function (data) {
        if (data === null || data === undefined) {
            return new EmptyIterator(data);
        }
        if (isArrayLike(data)) {
            return new ArrayIterator(data);
        }
        if (isMap(data) || isSet(data)) {
            return new IteratorIterator(data.values());
        }
        if (isIterator(data)) {
            return new IteratorIterator(data);
        }
        if (isObject(data)) {
            return new ObjectIterator(data);
        }
        return new ValueIterator(data);
    };


    function ArrayIterator(array) {
        this.initialize(array);
    }

    ArrayIterator.prototype = new Iterator();
    ArrayIterator.prototype.next = function () {
        if (this.origin >= this.fence) {
            return nil;
        }

        try {
            return this.data[this.origin];
        } finally {
            this.origin++;
        }
    };
    ArrayIterator.prototype.initialize = function (array) {
        this.data = array || [];
        this.origin = 0;
        this.fence = this.data.length;
    };


    function IteratorIterator(iterator) {
        this.iterator = iterator;
    }

    IteratorIterator.prototype = new Iterator();
    IteratorIterator.prototype.next = function () {
        if (this.iterator) {
            var obj = this.iterator.next();
            if (obj.done) {
                delete this.iterator;
            }
            return obj.value;
        }
        else {
            return nil;
        }
    };


    function ObjectIterator(object) {
        this.initialize(object);
    }

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
        } finally {
            this.origin++;
        }
    };


    function ValueIterator(value) {
        this.initialize(value);
    }

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

    function EmptyIterator(value) {
        this.initialize(value);
    }

    EmptyIterator.prototype = new Iterator();
    EmptyIterator.prototype.initialize = function (value) {
        this.value = value;
        this.done = true;
    };
    EmptyIterator.prototype.next = function () {
        return nil;
    };


    function PipelineOp() {
        this.next = null;
        this.prev = null;
    }


    function IteratorOp(data) {
        this.iterator = Iterator.of(data);
    }

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


    function MapOp(fn) {
        this.fn = fn;
    }

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


    function FlatOp(fn) {
        this.fn = fn;
        this.iterator = null;
    }

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


    function FilterOp(fn) {
        this.fn = fn;
    }

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


    function GeneratorOp(fn) {
        this.prev = null;
        this.next = null;
        this.fn = fn;
    }

    GeneratorOp.prototype.advance = function () {
        var val = this.fn.call(ctx);
        return this.next.pipe(val);
    };


    function StatefulOp(options) {
        this.prev = null;
        this.next = null;
        this.filter = options.filter;
        this.finisher = options.finisher;
        this.merger = options.merger;
        this.customMerge = isFunction(this.merger);
        this.buffer = null;
        this.i = 0;
    }

    StatefulOp.prototype.advance = function () {
        var obj;

        if (this.buffer === null) {
            this.buffer = [];
            while ((obj = this.prev.advance()) !== nil) {
                // obj will be added to buffer via this.pipe
                this.i++;
            }
            if (this.finisher) {
                this.finisher.call(ctx, this.buffer);
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
        if (this.filter && this.filter.call(ctx, obj, this.i, this.buffer) === false) {
            return;
        }

        if (!this.customMerge) {
            this.buffer.push(obj);
        } else {
            this.merger.call({}, obj, this.buffer);
        }
    };

    function SliceOp(begin, end) {
        this.begin = begin;
        this.end = end;
        this.i = 0;
    }

    SliceOp.prototype = new PipelineOp();
    SliceOp.prototype.advance = function () {
        return this.prev.advance();
    };
    SliceOp.prototype.pipe = function (obj) {
        if (this.i >= this.end) {
            return nil;
        }
        this.i++;
        if (this.i <= this.begin) {
            return this.prev.advance();
        }
        if (this.next === null) {
            return obj;
        }
        return this.next.pipe(obj);
    };

    function PeekOp(consumer) {
        this.consumer = consumer;
        this.consoleFn = isConsoleFn(consumer);
    }

    PeekOp.prototype = new PipelineOp();
    PeekOp.prototype.advance = function () {
        return this.prev.advance();
    };
    PeekOp.prototype.pipe = function (obj) {
        this.consumer.call(this.consoleFn ? console : ctx, obj);
        if (this.next === null) {
            return obj;
        }
        return this.next.pipe(obj);
    };

    function TakeWhileOp(predicate) {
        this.predicate = predicate;
    }

    TakeWhileOp.prototype = new PipelineOp();
    TakeWhileOp.prototype.advance = function () {
        return this.prev.advance();
    };
    TakeWhileOp.prototype.pipe = function (obj) {
        var filtered = this.predicate.call(ctx, obj);
        if (filtered !== true) {
            return nil;
        }
        if (this.next === null) {
            return obj;
        }
        return this.next.pipe(obj);
    };

    function DropWhileOp(predicate) {
        this.predicate = predicate;
        this.border = false;
    }

    DropWhileOp.prototype = new PipelineOp();
    DropWhileOp.prototype.advance = function () {
        return this.prev.advance();
    };
    DropWhileOp.prototype.pipe = function (obj) {
        if (!this.border) {
            var filtered = this.predicate.call(ctx, obj);
            if (filtered === true) {
                return this.prev.advance();
            }
            this.border = true;
        }
        if (this.next === null) {
            return obj;
        }
        return this.next.pipe(obj);
    };


    //
    // Internal Pipeline (doing all the work)
    //

    function Pipeline(input) {
        var pipeline = this, lastOp;

        // default op iterates over input elements

        if (isFunction(input)) {
            lastOp = new GeneratorOp(function () {
                return input.call(ctx);
            });
        } else if (isString(input)) {
            lastOp = new IteratorOp(input.split(''));
        } else {
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

        this.filter = function () {
            var arg = arguments[0];
            if (isRegExp(arg)) {
                this.add(new FilterOp(function (obj) {
                    return arg.test(obj);
                }));
            } else if (isObject(arg)) {
                this.add(new FilterOp(function (obj) {
                    return deepEquals(arg, obj);
                }));
            } else {
                this.add(new FilterOp(arg));
            }
            return this;
        };

        this.map = function () {
            var arg = arguments[0];
            if (isString(arg)) {
                this.add(new MapOp(pathMapper(arg)));
            } else {
                this.add(new MapOp(arg));
            }
            return this;
        };

        this.flatMap = function () {
            var arg = arguments[0];
            if (isString(arg)) {
                this.add(new MapOp(pathMapper(arg)));
            } else {
                this.add(new MapOp(arg));
            }
            this.add(new FlatOp());
            return this;
        };


        //
        // intermediate operations (stateful)
        //

        this.sorted = function (arg) {
            var comparator;
            if (isFunction(arg)) {
                comparator = arg;
            } else if (isString(arg)) {
                comparator = pathComparator(arg);
            } else {
                comparator = defaultComparator;
            }
            this.add(new StatefulOp({
                finisher: function (array) {
                    array.sort(comparator);
                }
            }));
            return this;
        };

        this.shuffle = function () {
            this.add(new StatefulOp({
                merger: function (obj, array) {
                    if (array.length === 0) {
                        array.push(obj);
                    } else {
                        var i = Math.floor(Math.random() * array.length);
                        var tmp = array[i];
                        array[i] = obj;
                        array.push(tmp);
                    }
                }
            }));
            return this;
        };

        this.reverse = function () {
            this.add(new StatefulOp({
                merger: function (obj, array) {
                    array.unshift(obj);
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

        this.slice = function (begin, end) {
            if (begin > end) {
                throw "slice(): begin must not be greater than end";
            }
            this.add(new SliceOp(begin, end));
            return this;
        };

        this.skip = function (num) {
            this.add(new SliceOp(num, Number.MAX_VALUE));
            return this;
        };

        this.limit = function (num) {
            this.add(new SliceOp(0, num));
            return this;
        };

        this.peek = function (consumer) {
            this.add(new PeekOp(consumer));
            return this;
        };

        this.takeWhile = function () {
            var arg = arguments[0];
            if (isRegExp(arg)) {
                this.add(new TakeWhileOp(function (obj) {
                    return arg.test(obj);
                }));
            } else if (isObject(arg)) {
                this.add(new TakeWhileOp(function (obj) {
                    return deepEquals(arg, obj);
                }));
            } else {
                this.add(new TakeWhileOp(arg));
            }
            return this;
        };

        this.dropWhile = function () {
            var arg = arguments[0];
            if (isRegExp(arg)) {
                this.add(new DropWhileOp(function (obj) {
                    return arg.test(obj);
                }));
            } else if (isObject(arg)) {
                this.add(new DropWhileOp(function (obj) {
                    return deepEquals(arg, obj);
                }));
            } else {
                this.add(new DropWhileOp(arg));
            }
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
            var current, consoleFn = isConsoleFn(fn);
            while ((current = pipeline.next()) !== nil) {
                fn.call(consoleFn ? console : ctx, current);
            }
        };

        terminal.min = function (arg) {
            var comparator;
            if (isFunction(arg)) {
                comparator = arg;
            } else if (isString(arg)) {
                comparator = pathComparator(arg);
            } else {
                comparator = defaultComparator;
            }
            var current, result = null;
            while ((current = pipeline.next()) !== nil) {
                if (result === null || comparator.call(ctx, current, result) < 0) {
                    result = current;
                }
            }
            return Optional.ofNullable(result);
        };

        terminal.max = function (arg) {
            var comparator;
            if (isFunction(arg)) {
                comparator = arg;
            } else if (isString(arg)) {
                comparator = pathComparator(arg);
            } else {
                comparator = defaultComparator;
            }
            var current, result = null;
            while ((current = pipeline.next()) !== nil) {
                if (result === null || comparator.call(ctx, current, result) > 0) {
                    result = current;
                }
            }
            return Optional.ofNullable(result);
        };

        terminal.sum = function (path) {
            var fn = path ? pathMapper(path) : function (obj) {
                return obj;
            };
            var current, result = 0;
            while ((current = pipeline.next()) !== nil) {
                result += fn.call(ctx, current);
            }
            return result;
        };

        terminal.average = function (path) {
            var fn = path ? pathMapper(path) : function (obj) {
                return obj;
            };
            var current, count = 0, sum = 0;
            while ((current = pipeline.next()) !== nil) {
                sum += fn.call(ctx, current);
                count++;
            }
            if (sum === 0 || count === 0) {
                return Optional.empty();
            }
            return Optional.of(sum / count);
        };

        terminal.count = function () {
            var result = 0;
            while (pipeline.next() !== nil) {
                result++;
            }
            return result;
        };

        terminal.allMatch = function () {
            var current, arg = arguments[0], fn = arg;
            if (isRegExp(arg)) {
                fn = function (obj) {
                    return arg.test(obj);
                };
            } else if (isObject(arg)) {
                fn = function (obj) {
                    return deepEquals(arg, obj);
                };
            }
            while ((current = pipeline.next()) !== nil) {
                var match = fn.call(ctx, current);
                if (!match) {
                    return false;
                }
            }
            return true;
        };

        terminal.anyMatch = function () {
            var current, arg = arguments[0], fn = arg;
            if (isRegExp(arg)) {
                fn = function (obj) {
                    return arg.test(obj);
                };
            } else if (isObject(arg)) {
                fn = function (obj) {
                    return deepEquals(arg, obj);
                };
            }
            while ((current = pipeline.next()) !== nil) {
                var match = fn.call(ctx, current);
                if (match) {
                    return true;
                }
            }
            return false;
        };

        terminal.noneMatch = function () {
            var current, arg = arguments[0], fn = arg;
            if (isRegExp(arg)) {
                fn = function (obj) {
                    return arg.test(obj);
                };
            } else if (isObject(arg)) {
                fn = function (obj) {
                    return deepEquals(arg, obj);
                };
            }
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

        terminal.groupBy = function () {
            var arg = arguments[0];
            if (isString(arg)) {
                arg = pathMapper(arg);
            }
            return pipeline.collect({
                supplier: function () {
                    return {};
                },
                accumulator: function (map, obj) {
                    var key = arg.call(ctx, obj);
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

        terminal.toMap = function () {
            var arg0 = arguments[0];
            if (isString(arg0)) {
                arg0 = pathMapper(arg0);
            }
            var arg1 = false;
            if (arguments.length > 1) {
                arg1 = arguments[1];
            }
            return pipeline.collect({
                supplier: function () {
                    return {};
                },
                accumulator: function (map, obj) {
                    var key = arg0.call(ctx, obj);
                    if (map.hasOwnProperty(key)) {
                        if (!arg1) {
                            throw "duplicate mapping found for key: " + key;
                        }
                        map[key] = arg1.call(ctx, map[key], obj);
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
            if (isRegExp(arg0)) {
                return partitionByPredicate(function (obj) {
                    return arg0.test(obj);
                });
            }
            if (isObject(arg0)) {
                return partitionByPredicate(function (obj) {
                    return deepEquals(arg0, obj);
                });
            }
            throw 'partitionBy requires argument of type function, object, regexp or number';
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

        terminal.joining = function (arg) {
            var prefix = "", suffix = "", delimiter = "";
            if (arg) {
                if (isString(arg)) {
                    delimiter = arg;
                } else {
                    prefix = arg.prefix || prefix;
                    suffix = arg.suffix || suffix;
                    delimiter = arg.delimiter || delimiter;
                }
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


        var StreamIterator = function () {
            this.value = pipeline.next();
        };
        StreamIterator.prototype = new Iterator();
        StreamIterator.prototype.next = function () {
            if (this.value === nil) {
                return {
                    value: undefined,
                    done: true
                };
            }
            var nextValue = pipeline.next(),
                done = nextValue === nil,
                result = {
                    value: this.value,
                    done: done
                };
            this.value = nextValue;
            return result;
        };

        terminal.iterator = function () {
            return new StreamIterator();
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
    }

    Pipeline.prototype.toString = function () {
        return "[object Stream]";
    };


    //
    // Optional type
    //

    function Optional(val) {
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
    }

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

    var pathComparator = function (path) {
        var fn = pathMapper(path);
        return function (obj1, obj2) {
            var a = fn(obj1),
                b = fn(obj2);
            return defaultComparator(a, b);
        };
    };

    var pathMapper = function (path) {
        if (path.indexOf('.') < 0) {
            return function (obj) {
                return obj[path];
            };
        }

        var paths = path.split('.');
        return function (obj) {
            var current = obj;
            for (var i = 0; i < paths.length; i++) {
                var path = paths[i];
                current = current[path];
            }
            return current;
        };
    };

    var deepEquals = function (a, b) {
        if (!isObject(a)) {
            return a === b;
        }

        if (!isObject(b)) {
            return false;
        }

        for (var prop in a) {
            if (!a.hasOwnProperty(prop)) {
                continue;
            }

            if (!b.hasOwnProperty(prop)) {
                return false;
            }

            var val1 = a[prop];
            var val2 = b[prop];
            var propEquals = deepEquals(val1, val2);

            if (!propEquals) {
                return false;
            }
        }

        return true;
    };

    var ObjToString = Object.prototype.toString;

    function isString(obj) {
        return ObjToString.call(obj) === '[object String]';
    }

    function isFunction(obj) {
        return typeof obj === 'function' || false;
    }

    function isNumber(obj) {
        return ObjToString.call(obj) === '[object Number]';
    }

    var isArrayLike = function (obj) {
        var length = obj.length;
        return typeof length === 'number' && length >= 0;
    };

    function isSet(obj) {
        return Boolean(root.Set) && obj instanceof Set && isFunction(obj.values);
    }

    function isMap(obj) {
        return Boolean(root.Map) && obj instanceof Map && isFunction(obj.values);
    }

    function isIterator(obj) {
        return Boolean(obj) && isFunction(obj.next);
    }

    function isObject(obj) {
        return Boolean(obj) && typeof obj === 'object';
    }

    function isRegExp(obj) {
        return ObjToString.call(obj) === '[object RegExp]';
    }

    function isConsoleFn(fn) {
        if (!root.console) {
            return false;
        }
        return console.log === fn || console.warn === fn || console.error === fn || console.trace === fn;
    }


    //
    // Stream function grants access to pipeline
    //

    function Stream(input) {
        return new Pipeline(input);
    }

    Stream.from = function (input) {
        return Stream(input);
    };

    Stream.range = function (startInclusive, endExclusive) {
        return Stream.iterate(startInclusive, function (num) {
            return num + 1;
        }).limit(endExclusive - startInclusive);
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
    Stream.NAME = "STREAMJS";
    Stream.Optional = Optional;

    var previousStream;
    if (Boolean(root.Stream) && root.Stream.NAME !== Stream.NAME) {
        previousStream = root.Stream;
    }

    Stream.noConflict = function () {
        root.Stream = previousStream;
        return Stream;
    };


    //
    // expose Stream
    //

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Stream;
    } else if (typeof define === 'function' && define.amd) {
        define('streamjs', [], function () {
            return Stream;
        });
    } else {
        root.Stream = Stream;
    }

}.call(this));
