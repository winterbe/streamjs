QUnit.test("skip", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .skip(2)
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 3);
    assert.equal(result[1], 4);
});

QUnit.test("skip empty", function (assert) {
    var result = Stream([])
        .skip(1)
        .toArray();

    assert.equal(result.length, 0);
});

QUnit.test("skip high", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .skip(10)
        .toArray();

    assert.equal(result.length, 0);
});

QUnit.test("skip zero", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .skip(0)
        .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 3);
    assert.equal(result[3], 4);
});

QUnit.test("skip negative", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .skip(-1)
        .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 3);
    assert.equal(result[3], 4);
});