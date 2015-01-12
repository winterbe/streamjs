QUnit.test("limit", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .limit(2)
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
});

QUnit.test("limit empty", function (assert) {
    var result = Stream([])
        .limit(1)
        .toArray();

    assert.equal(result.length, 0);
});

QUnit.test("limit high", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .limit(10)
        .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 3);
    assert.equal(result[3], 4);
});

QUnit.test("limit zero", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .limit(0)
        .toArray();

    assert.equal(result.length, 0);
});

QUnit.test("limit negative", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .limit(-1)
        .toArray();

    assert.equal(result.length, 0);
});