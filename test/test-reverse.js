QUnit.test("reverse", function (assert) {
    var data = [1, 2, 3, 4];

    var result = Stream(data)
        .reverse()
        .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 4);
    assert.equal(result[1], 3);
    assert.equal(result[2], 2);
    assert.equal(result[3], 1);

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0], 1);
    assert.equal(data[1], 2);
    assert.equal(data[2], 3);
    assert.equal(data[3], 4);
});
