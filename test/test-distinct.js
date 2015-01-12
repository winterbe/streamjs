QUnit.test("distinct", function (assert) {
    var result = Stream([1, 3, 3, 1])
        .distinct()
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 1);
    assert.equal(result[1], 3);
});

QUnit.test("distinct empty", function (assert) {
    var result = Stream([])
        .distinct()
        .toArray();

    assert.equal(result.length, 0);
});