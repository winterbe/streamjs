QUnit.test("filter num array", function (assert) {
    var data = [1, 2, 3, 4];

    var result = Stream(data)
        .filter(function (num) {
            return num % 2 === 1;
        })
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 1);
    assert.equal(result[1], 3);

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0], 1);
    assert.equal(data[1], 2);
    assert.equal(data[2], 3);
    assert.equal(data[3], 4);
});

QUnit.test("filter object array", function (assert) {
    var data = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];

    var result = Stream(data)
        .filter(function (obj) {
            return obj.a % 2 === 1;
        })
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0].a, 1);
    assert.equal(result[1].a, 3);

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0].a, 1);
    assert.equal(data[1].a, 2);
    assert.equal(data[2].a, 3);
    assert.equal(data[3].a, 4);
});

QUnit.test("filter object", function (assert) {
    var data = {a: 1, b: 2, c: 3, d: 4};

    var result = Stream(data)
        .filter(function (num) {
            return num % 2 === 1;
        })
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 1);
    assert.equal(result[1], 3);

    // assert original data is untouched
    assert.equal(data.a, 1);
    assert.equal(data.b, 2);
    assert.equal(data.c, 3);
    assert.equal(data.d, 4);
});

QUnit.test("filter empty", function (assert) {
    var result = Stream([])
        .filter(function () {
            return true;
        })
        .toArray();

    assert.equal(result.length, 0);
});

QUnit.test("filter with null", function (assert) {
    var result = Stream([1, null, undefined, 2])
        .filter(function () {
            return true;
        })
        .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 1);
    assert.equal(result[1], null);
    assert.equal(result[2], undefined);
    assert.equal(result[3], 2);
});