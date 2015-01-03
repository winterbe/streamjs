(function (window) {

    "use strict";


    //
    // Internal Pipeline (doing all the work)
    //

    var Pipeline = function (array) {
        var that = this;

        // default op iterates over input array
        var lastOp = new StatelessOp(function (arg) {
            return [arg];
        }, array.slice());

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

        this.filter = function (fn) {
            this.add(new StatelessOp(function (arg) {
                var filtered = fn.call(ctx, arg);
                if (filtered) {
                    return [arg];
                } else {
                    return [];
                }
            }));
            return this;
        };

        this.map = function (fn) {
            this.add(new StatelessOp(function (arg) {
                var transformed = fn.call(ctx, arg);
                return [transformed];
            }));
            return this;
        };

        this.flatMap = function (fn) {
            // TODO flatMap must return monadic Stream
            this.add(new StatelessOp(function (arg) {
                return fn.call(ctx, arg);
            }));
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

        this.toArray = function () {
            var current;
            var result = [];
            while ((current = this.next()) !== eop) {
                result.push(current);
            }
            return result;
        };

        this.findFirst = function () {
            var obj = this.next();
            if (obj === eop) {
                return Optional.empty();
            }
            return Optional.ofNullable(obj);
        };

        this.findLast = function () {
            var current, last;
            while ((current = this.next()) !== eop) {
                last = current;
            }
            if (last === eop) {
                return Optional.empty();
            }
            return Optional.ofNullable(last);
        };

        this.forEach = function (fn) {
            var current;
            while ((current = this.next()) !== eop) {
                fn.call(ctx, current);
            }
        };

        this.min = function (comparator) {
            comparator = comparator || defaultComparator;

            var current, result = null;
            while ((current = this.next()) !== eop) {
                if (result === null || comparator.call(ctx, current, result) < 0) {
                    result = current;
                }
            }
            return result;
        };

        this.max = function (comparator) {
            comparator = comparator || defaultComparator;

            var current, result = null;
            while ((current = this.next()) !== eop) {
                if (result === null || comparator.call(ctx, current, result) > 0) {
                    result = current;
                }
            }
            return result;
        };

        this.sum = function () {
            var current, result = 0;
            while ((current = this.next()) !== eop) {
                result += current;
            }
            return result;
        };

        this.average = function () {
            var current, count = 0, sum = 0;
            while ((current = this.next()) !== eop) {
                sum += current;
                count++;
            }
            return sum / count;
        };

        this.count = function () {
            var current, result = 0;
            while ((current = this.next()) !== eop) {
                result++;
            }
            return result;
        };

        this.allMatch = function (fn) {
            var current;
            while ((current = this.next()) !== eop) {
                var match = fn.call(ctx, current);
                if (!match) {
                    return false;
                }
            }
            return true;
        };

        this.anyMatch = function (fn) {
            var current;
            while ((current = this.next()) !== eop) {
                var match = fn.call(ctx, current);
                if (match) {
                    return true;
                }
            }
            return false;
        };

        this.noneMatch = function (fn) {
            var current;
            while ((current = this.next()) !== eop) {
                var match = fn.call(ctx, current);
                if (match) {
                    return false;
                }
            }
            return true;
        };

        this.collect = function (collector) {
            var identity = collector.supplier.call(ctx);
            var current, first = true;
            while ((current = this.next()) !== eop) {
                identity = collector.accumulator.call(ctx, identity, current, first);
                first = false;
            }
            if (collector.finisher) {
                identity = collector.finisher.call(ctx, identity);
            }
            return identity;
        };

        this.reduce = function () {
            var arg0 = arguments[0];
            var arg1 = arguments[1];

            if (arg1) {
                return this.collect({
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

            var identity = that.next();
            if (identity === eop) {
                return Optional.empty();
            }

            while ((current = that.next()) !== eop) {
                identity = accumulator.call(ctx, identity, current);
            }

            return Optional.ofNullable(identity);
        };

        this.groupBy = function (keyMapper, map) {
            return this.collect({
                supplier: function () {
                    return map || {};
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

        this.indexBy = function (keyMapper, mergeFunction, map) {
            return this.collect({
                supplier: function () {
                    return map || {};
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

        this.partitionBy = function () {
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
            return that.collect({
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
            return that.collect({
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

        this.joining = function (options) {
            var prefix = "", suffix = "", delimiter = "";
            if (options) {
                prefix = options.prefix || prefix;
                suffix = options.suffix || suffix;
                delimiter = options.delimiter || delimiter;
            }

            return this.collect({
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
    };


    //
    // Generic Pipeline operations
    //

    var StatelessOp = function (fn, data) {
        this.prev = null;
        this.next = null;

        var buffer = data ? data : [];

        this.advance = function () {
            if (buffer.length === 0 && this.prev === null) {
                return eop;
            }

            if (buffer.length === 0) {
                return this.prev.advance();
            }

            var obj = buffer.shift();
            if (this.next !== null) {
                return this.next.pipe(obj);
            }
            return obj;
        };

        this.pipe = function (obj) {
            buffer = fn.call(ctx, obj);
            if (buffer.length === 0) {
                return this.advance();
            }

            obj = buffer.shift();
            if (this.next !== null) {
                return this.next.pipe(obj);
            }
            return obj;
        };
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

    var isFunction = function (obj) {
        return typeof obj === 'function' || false;
    };

    var isNumber = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Number]';
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

    Stream.Optional = Optional;

    window.Stream = Stream;

}(window));