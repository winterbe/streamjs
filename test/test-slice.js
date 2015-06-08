QUnit.test("slice", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .slice(1, 3)
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 2);
    assert.equal(result[1], 3);
});

QUnit.test("slice empty", function (assert) {
    var result = Stream([])
        .slice(1, 2)
        .toArray();

    assert.equal(result.length, 0);
});

QUnit.test("slice high", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .skip(10, 20)
        .toArray();

    assert.equal(result.length, 0);
});

QUnit.test("slice wrong args", function (assert) {
    assert.throws(function () {
        Stream.of(1, 2).slice(2, 1).toArray();
    });
});