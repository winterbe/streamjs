// I'm using Babel.js and Intellij IDEA File Watcher to automatically transpile es6 to js:
// --source-maps --out-file $FileNameWithoutExtension$-compiled.js $FilePath$ --blacklist useStrict
//
// useStrict is blacklisted to prevent global use-strict for jshint

QUnit.test("sample 1", function (assert) {
    let myList = ["a1", "a2", "b1", "c2", "c1"];

    let result = Stream(myList)
        .filter(s => s.indexOf("c") === 0)
        .map(s => s.toUpperCase())
        .sorted()
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], "C1");
    assert.equal(result[1], "C2");
});

QUnit.test("sample 2", function (assert) {
    Stream(["a1", "a2", "a3"])
        .findFirst()
        .ifPresent(first => assert.equal(first, "a1"));

    Stream.of("a1", "a2", "a3")
        .findFirst()
        .ifPresent(first => assert.equal(first, "a1"));

    let result = Stream
        .range(1, 4)
        .toArray();

    assert.equal(result.length, 3);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 3);
});

QUnit.test("sample 3", function (assert) {
    Stream.of(1, 2, 3)
        .map(n => 2 * n + 1)
        .average()
        .ifPresent(avg => assert.equal(avg, 5.0));
});

QUnit.test("sample 4", function (assert) {
    Stream.of("a1", "a2", "a3")
        .map(s => s.slice(1))
        .map(s => parseInt(s, 10))
        .max()
        .ifPresent(max => assert.equal(max, 3));
});

QUnit.test("sample 5", function (assert) {
    Stream.of("a1", "b2", "c3")
        .filter(s => {
            console.log("filtering: %s", s);
            assert.ok(false);
            return true;
        });

    assert.ok(true);
});

QUnit.test("sample 6", function (assert) {
    let ops = [];

    Stream.of("a1", "b2", "c3")
        .filter(s => {
            ops.push("filter: " + s);
            return true;
        })
        .forEach(s => ops.push("forEach: " + s));

    assert.equal(ops.length, 6);
    assert.equal(ops[0], "filter: a1");
    assert.equal(ops[1], "forEach: a1");
    assert.equal(ops[2], "filter: b2");
    assert.equal(ops[3], "forEach: b2");
    assert.equal(ops[4], "filter: c3");
    assert.equal(ops[5], "forEach: c3");
});

QUnit.test("sample 6", function (assert) {
    let ops = [];

    Stream.of("d2", "a2", "b1", "b3", "c")
        .map(s => {
            ops.push("map: " + s);
            return s.toUpperCase();
        })
        .anyMatch(s => {
            ops.push("anyMatch: " + s);
            return s.startsWith("A");
        });

    assert.equal(ops.length, 4);
    assert.equal(ops[0], "map: d2");
    assert.equal(ops[1], "anyMatch: D2");
    assert.equal(ops[2], "map: a2");
    assert.equal(ops[3], "anyMatch: A2");
});

QUnit.test("sample 7", function (assert) {
    let ops = [];

    Stream.of("d2", "a2", "b1", "b3", "c")
        .filter(s => {
            ops.push("filter: " + s);
            return s.indexOf("a") === 0;
        })
        .map(s => {
            ops.push("map: " + s);
            return s.toUpperCase();
        })
        .forEach(s => ops.push("forEach: " + s));

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
        let stream = Stream.of(1, 2, 3)
            .filter(n => n % 2 === 1);

        stream.anyMatch(n => true);     // ok
        stream.toArray();               // error
    });
});

QUnit.test("sample 9", function (assert) {
    let odd = array =>
        Stream(array).filter(n => n % 2 === 1);

    assert.equal(odd([1, 2, 3]).anyMatch(n => true), true);
    assert.equal(odd([1, 2, 3]).toArray().length, 2);
});