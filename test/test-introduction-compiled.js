// I'm using Babel.js and Intellij IDEA File Watcher to automatically transpile es6 to js:
// --source-maps --out-file $FileNameWithoutExtension$-compiled.js $FilePath$

"use strict";

QUnit.test("sample 1", function (assert) {
    var myList = ["a1", "a2", "b1", "c2", "c1"];

    var result = Stream(myList).filter(function (s) {
        return s.indexOf("c") === 0;
    }).map(function (s) {
        return s.toUpperCase();
    }).sorted().toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], "C1");
    assert.equal(result[1], "C2");
});

QUnit.test("sample 2", function (assert) {
    Stream(["a1", "a2", "a3"]).findFirst().ifPresent(function (first) {
        return assert.equal(first, "a1");
    });

    Stream.of("a1", "a2", "a3").findFirst().ifPresent(function (first) {
        return assert.equal(first, "a1");
    });

    var result = Stream.range(1, 4).toArray();

    assert.equal(result.length, 3);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 3);
});

QUnit.test("sample 3", function (assert) {
    Stream.of(1, 2, 3).map(function (n) {
        return 2 * n + 1;
    }).average().ifPresent(function (avg) {
        return assert.equal(avg, 5);
    });
});

QUnit.test("sample 4", function (assert) {
    Stream.of("a1", "a2", "a3").map(function (s) {
        return s.slice(1);
    }).map(function (s) {
        return parseInt(s, 10);
    }).max().ifPresent(function (max) {
        return assert.equal(max, 3);
    });
});

QUnit.test("sample 5", function (assert) {
    Stream.of("a1", "b2", "c3").filter(function (s) {
        console.log("filtering: %s", s);
        assert.ok(false);
        return true;
    });

    assert.ok(true);
});

QUnit.test("sample 6", function (assert) {
    var ops = [];

    Stream.of("a1", "b2", "c3").filter(function (s) {
        ops.push("filter: " + s);
        return true;
    }).forEach(function (s) {
        return ops.push("forEach: " + s);
    });

    assert.equal(ops.length, 6);
    assert.equal(ops[0], "filter: a1");
    assert.equal(ops[1], "forEach: a1");
    assert.equal(ops[2], "filter: b2");
    assert.equal(ops[3], "forEach: b2");
    assert.equal(ops[4], "filter: c3");
    assert.equal(ops[5], "forEach: c3");
});

QUnit.test("sample 6", function (assert) {
    var ops = [];

    Stream.of("d2", "a2", "b1", "b3", "c").map(function (s) {
        ops.push("map: " + s);
        return s.toUpperCase();
    }).anyMatch(function (s) {
        ops.push("anyMatch: " + s);
        return s.indexOf("A") === 0;
    });

    assert.equal(ops.length, 4);
    assert.equal(ops[0], "map: d2");
    assert.equal(ops[1], "anyMatch: D2");
    assert.equal(ops[2], "map: a2");
    assert.equal(ops[3], "anyMatch: A2");
});

QUnit.test("sample 7", function (assert) {
    var ops = [];

    Stream.of("d2", "a2", "b1", "b3", "c").filter(function (s) {
        ops.push("filter: " + s);
        return s.indexOf("a") === 0;
    }).map(function (s) {
        ops.push("map: " + s);
        return s.toUpperCase();
    }).forEach(function (s) {
        return ops.push("forEach: " + s);
    });

    assert.equal(ops.length, 7);
    assert.equal(ops[0], "filter: d2");
    assert.equal(ops[1], "filter: a2");
    assert.equal(ops[2], "map: a2");
    assert.equal(ops[3], "forEach: A2");
    assert.equal(ops[4], "filter: b1");
    assert.equal(ops[5], "filter: b3");
    assert.equal(ops[6], "filter: c");
});

QUnit.test("sample 8", function (assert) {
    assert.throws(function () {
        var stream = Stream.of(1, 2, 3).filter(function (n) {
            return n % 2 === 1;
        });

        stream.anyMatch(function (n) {
            return true;
        }); // ok
        stream.toArray(); // error
    });
});

QUnit.test("sample 9", function (assert) {
    var odd = function odd(array) {
        return Stream(array).filter(function (n) {
            return n % 2 === 1;
        });
    };

    assert.equal(odd([1, 2, 3]).anyMatch(function (n) {
        return true;
    }), true);
    assert.equal(odd([1, 2, 3]).toArray().length, 2);
});

var persons = [{ name: "Max", age: 18 }, { name: "Peter", age: 23 }, { name: "Pamela", age: 23 }, { name: "David", age: 12 }];

QUnit.test("sample 10", function (assert) {
    var groups = Stream(persons).groupBy(function (p) {
        return p.age;
    });

    assert.equal(groups[18].length, 1);
    assert.equal(groups[23].length, 2);
    assert.equal(groups[12].length, 1);
});

QUnit.test("sample 10", function (assert) {
    var avg = Stream(persons).map(function (p) {
        return p.age;
    }).average().get();

    assert.equal(avg, 19);
});

QUnit.test("sample 11", function (assert) {
    var phrase = Stream(persons).filter(function (p) {
        return p.age >= 18;
    }).map(function (p) {
        return p.name;
    }).join({
        prefix: "In Germany ",
        suffix: " are of legal age.",
        delimiter: " and "
    });

    assert.equal(phrase, "In Germany Max and Peter and Pamela are of legal age.");
});

QUnit.test("sample 12", function (assert) {
    var result = Stream(persons).collect({
        supplier: function supplier() {
            return "[";
        },
        accumulator: function accumulator(s, p) {
            return s + " " + p.name.toUpperCase();
        },
        finisher: function finisher(s) {
            return s + " ]";
        }
    });

    assert.equal(result, "[ MAX PETER PAMELA DAVID ]");
});

QUnit.test("sample 13", function (assert) {
    var oldest = Stream(persons).reduce(function (p1, p2) {
        return p1.age > p2.age ? p1 : p2;
    }).get();

    assert.equal(oldest.name, "Pamela");
});

QUnit.test("sample 13", function (assert) {
    var result = Stream(persons).sort("age").reverse().reduce({ names: [], sumOfAges: 0 }, function (res, p) {
        res.names.push(p.name);
        res.sumOfAges += p.age;
        return res;
    });

    assert.equal(result.names.length, 4);
    assert.equal(result.names[0], "Pamela");
    assert.equal(result.names[1], "Peter");
    assert.equal(result.names[2], "Max");
    assert.equal(result.names[3], "David");
    assert.equal(result.sumOfAges, 76);
});

QUnit.test("sample 14", function (assert) {
    var marked1$0 = [fibonacci].map(regeneratorRuntime.mark);

    function fibonacci() {
        var prev, cur, _ref;

        return regeneratorRuntime.wrap(function fibonacci$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    prev = 0;
                    cur = 1;

                case 2:
                    if (!true) {
                        context$2$0.next = 10;
                        break;
                    }

                    _ref = [cur, prev + cur];
                    prev = _ref[0];
                    cur = _ref[1];
                    context$2$0.next = 8;
                    return cur;

                case 8:
                    context$2$0.next = 2;
                    break;

                case 10:
                case "end":
                    return context$2$0.stop();
            }
        }, marked1$0[0], this);
    }

    var fib = Stream(fibonacci()).filter(function (n) {
        return n % 2;
    }).takeWhile(function (n) {
        return n < 50;
    }).toArray();

    assert.equal(fib.length, 5);
    assert.equal(fib[0], 1);
    assert.equal(fib[1], 3);
    assert.equal(fib[2], 5);
    assert.equal(fib[3], 13);
    assert.equal(fib[4], 21);
});

//# sourceMappingURL=test-introduction-compiled.js.map