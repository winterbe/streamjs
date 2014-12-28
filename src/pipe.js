(function (window) {
    "use strict";

    var eop = "END_OF_PIPE";

    var Operation = function (fn) {
        this.fn = fn;
        this.buffer = [];

        this.prev = null;
        this.next = null;

        this.advance = function () {
            if (this.buffer.length === 0 && this.prev == null) {
                return eop;
            }

            if (this.buffer.length === 0) {
                return this.prev.advance();
            }

            var obj = this.buffer.shift();
            if (this.next != null) {
                return this.next.pipe(obj);
            }
            return obj;
        };

        this.pipe = function (obj) {
            this.buffer = this.fn.call({}, obj);
            if (this.buffer.length === 0) {
                return this.advance();
            }

            obj = this.buffer.shift();
            if (this.next != null) {
                return this.next.pipe(obj);
            }
            return obj;
        };
    };

    var Pipeline = function (array) {
        var ops = [];

        this.add = function (op) {
            ops.push(op);

            if (ops.length > 1) {
                var prev = ops[ops.length - 2];
                op.prev = prev;
                prev.next = op;
            }
        };

        this.next = function () {
            return ops[ops.length - 1].advance();
        };

        // default op
        this.add(new Operation(function (arg) {
            return [arg];
        }));
        ops[0].buffer = array.slice();
    };

    var Pipe = function (array) {
        var pipeline = new Pipeline(array);
        var that = this;

        this.filter = function (fn) {
            pipeline.add(new Operation(function (arg) {
                var filtered = fn.call({}, arg);
                if (filtered) {
                    return [arg];
                } else {
                    return [];
                }
            }));
            return that;
        };

        this.map = function (fn) {
            pipeline.add(new Operation(function (arg) {
                var transformed = fn.call({}, arg);
                return [transformed];
            }));
            return that;
        };

        this.flatMap = function (fn) {
            pipeline.add(new Operation(function (arg) {
                return fn.call({}, arg);
            }));
            return that;
        };

        this.collect = function () {
            var current;
            var result = [];
            while ((current = pipeline.next()) !== eop) {
                result.push(current);
            }
            return result;
        };
    };

    window.Stream = function (array) {
        return new Pipe(array);
    };

}(window));