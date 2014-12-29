(function (window) {
    "use strict";

    var eop = "END_OF_PIPE",
        ctx = {};


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
            if (this.next != null) {
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
                filtered = options.filter.call(ctx, obj, i);
            }
            if (filtered) {
                buffer.push(obj);
            }
        };
    };

    var StatelessOp = function (fn, data) {
        this.prev = null;
        this.next = null;

        var buffer = data ? data : [];

        this.advance = function () {
            if (buffer.length === 0 && this.prev == null) {
                return eop;
            }

            if (buffer.length === 0) {
                return this.prev.advance();
            }

            var obj = buffer.shift();
            if (this.next != null) {
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
            if (this.next != null) {
                return this.next.pipe(obj);
            }
            return obj;
        };
    };

    var Pipeline = function (array) {
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

        this.min = function () {
            var result = null;
            var current;
            while ((current = this.next()) !== eop) {
                if (result === null || current < result) {
                    result = current;
                }
            }
            return result;
        };

        this.max = function () {
            var result = null;
            var current;
            while ((current = this.next()) !== eop) {
                if (result === null || current > result) {
                    result = current;
                }
            }
            return result;
        };

        this.sum = function () {
            var result = 0;
            var current;
            while ((current = this.next()) !== eop) {
                result += current;
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
            var subject = collector.supplier.call(ctx);
            var current;
            while ((current = this.next()) !== eop) {
                subject = collector.accumulator.call(ctx, subject, current);
            }
            return collector.finisher.call(ctx, subject);
        };
    };

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

    Stream.Optional = Optional;

    window.Stream = Stream;

}(window));