QUnit.test("flatMap num array", function (assert) {
    var data = [1, 2, 3];

    var result = Stream(data)
        .flatMap(function (num) {
            return [num, num];
        })
        .toArray();

    assert.equal(result.length, 6);
    assert.equal(result[0], 1);
    assert.equal(result[1], 1);
    assert.equal(result[2], 2);
    assert.equal(result[3], 2);
    assert.equal(result[4], 3);
    assert.equal(result[5], 3);

    // assert original data is untouched
    assert.equal(data.length, 3);
    assert.equal(data[0], 1);
    assert.equal(data[1], 2);
    assert.equal(data[2], 3);
});

QUnit.test("flatMap object array", function (assert) {
    var data = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];

    var result = Stream(data)
        .flatMap(function (obj) {
            return [{b: obj.a}, {b: obj.a}];
        })
        .toArray();

    assert.equal(result.length, 8);
    assert.equal(result[0].b, 1);
    assert.equal(result[1].b, 1);
    assert.equal(result[2].b, 2);
    assert.equal(result[3].b, 2);
    assert.equal(result[4].b, 3);
    assert.equal(result[5].b, 3);
    assert.equal(result[6].b, 4);
    assert.equal(result[7].b, 4);

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0].a, 1);
    assert.equal(data[1].a, 2);
    assert.equal(data[2].a, 3);
    assert.equal(data[3].a, 4);
});

QUnit.test("flatMap empty array", function (assert) {
    var result = Stream([])
        .flatMap(function (num) {
            return [num, num];
        })
        .toArray();

    assert.equal(result.length, 0);
});

QUnit.test("flatMap no array return", function (assert) {
    var result = Stream([1, 2, 3])
        .flatMap(function (num) {
            return String(num);
        })
        .toArray();

    assert.equal(result.length, 3);
    assert.equal(result[0], "1");
    assert.equal(result[1], "2");
    assert.equal(result[2], "3");
});

QUnit.test("flatMap returns object", function (assert) {
    var result = Stream([1])
        .flatMap(function (num) {
            return {a: num, b: num};
        })
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 1);
    assert.equal(result[1], 1);
});

QUnit.test("flatMap via path (depth 1)", function (assert) {
    var data = [{a: [1]}, {a: [2]}, {a: [3]}, {a: [4]}];

    var result = Stream(data)
        .flatMap("a")
        .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 3);
    assert.equal(result[3], 4);

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0].a, 1);
    assert.equal(data[1].a, 2);
    assert.equal(data[2].a, 3);
    assert.equal(data[3].a, 4);
});

QUnit.test("flatMap via path (depth 2)", function (assert) {
    var data = [{a: {b: [1]}}, {a: {b: [2]}}, {a: {b: [3]}}, {a: {b: [4]}}];

    var result = Stream(data)
        .flatMap("a.b")
        .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 3);
    assert.equal(result[3], 4);

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0].a.b, 1);
    assert.equal(data[1].a.b, 2);
    assert.equal(data[2].a.b, 3);
    assert.equal(data[3].a.b, 4);
});

QUnit.test("flatMap via path (depth 3)", function (assert) {
    var data = [{a: {b: {c: [1]}}}, {a: {b: {c: [2]}}}, {a: {b: {c: [3]}}}, {a: {b: {c: [4]}}}];

    var result = Stream(data)
        .flatMap("a.b.c")
        .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 3);
    assert.equal(result[3], 4);

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0].a.b.c, 1);
    assert.equal(data[1].a.b.c, 2);
    assert.equal(data[2].a.b.c, 3);
    assert.equal(data[3].a.b.c, 4);
});