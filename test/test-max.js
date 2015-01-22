QUnit.test("max", function (assert) {
    var result = Stream([1, 2, 3, 4]).max();
    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), true);
    assert.equal(result.get(), 4);
});

QUnit.test("max empty", function (assert) {
    var result = Stream([]).max();
    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), false);
});

QUnit.test("max (comparator)", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .max(function (a, b) {
            if (a === b) return 0;
            if (a > b) return -1;
            return 1;
        });

    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), true);
    assert.equal(result.get(), 1);
});

QUnit.test("max (path comparator)", function (assert) {
    var result = Stream([{a: 1}, {a: 2}, {a: 3}])
        .max("a");
    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), true);
    assert.equal(result.get().a, 3);
});