QUnit.test("sorted", function (assert) {
    var result = Stream([4, 1, 3, 2])
        .sorted()
        .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 3);
    assert.equal(result[3], 4);
});

QUnit.test("sorted (comparator)", function (assert) {
    var result = Stream([4, 1, 3, 2])
        .sorted(function (num1, num2) {
            if (num1 === num2) return 0;
            return num1 < num2 ? 1 : -1;
        })
        .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 4);
    assert.equal(result[1], 3);
    assert.equal(result[2], 2);
    assert.equal(result[3], 1);
});

QUnit.test("sorted empty", function (assert) {
    var result = Stream([])
        .sorted()
        .toArray();

    assert.equal(result.length, 0);
});

QUnit.test("sorted by path", function (assert) {
    var data = [{a: 4}, {a: 1}, {a: 3}, {a: 2}];
    var result = Stream(data)
        .sorted("a")
        .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0].a, 1);
    assert.equal(result[1].a, 2);
    assert.equal(result[2].a, 3);
    assert.equal(result[3].a, 4);

    // assert input data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0].a, 4);
    assert.equal(data[1].a, 1);
    assert.equal(data[2].a, 3);
    assert.equal(data[3].a, 2);
});