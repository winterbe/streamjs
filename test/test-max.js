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