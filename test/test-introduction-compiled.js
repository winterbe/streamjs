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

//# sourceMappingURL=test-introduction-compiled.js.map