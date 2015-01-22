QUnit.test("min", function (assert) {
    var result = Stream([1, 2, 3, 4]).min();
    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), true);
    assert.equal(result.get(), 1);
});

QUnit.test("min empty", function (assert) {
    var result = Stream([]).min();
    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), false);
});

QUnit.test("min (comparator)", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .min(function (a, b) {
            if (a === b) return 0;
            if (a > b) return -1;
            return 1;
        });

    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), true);
    assert.equal(result.get(), 4);
});

QUnit.test("min (path comparator)", function (assert) {
    var result = Stream([{a: 1}, {a: 2}, {a: 3}])
        .min("a");
    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), true);
    assert.equal(result.get().a, 1);
});