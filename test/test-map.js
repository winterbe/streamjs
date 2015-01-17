QUnit.test("map num array", function (assert) {
    var data = [1, 2, 3, 4];

    var result = Stream(data)
        .map(function (num) {
            return "obj" + num;
        })
        .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 'obj1');
    assert.equal(result[1], 'obj2');
    assert.equal(result[2], 'obj3');
    assert.equal(result[3], 'obj4');

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0], 1);
    assert.equal(data[1], 2);
    assert.equal(data[2], 3);
    assert.equal(data[3], 4);
});

QUnit.test("map object array", function (assert) {
    var data = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];

    var result = Stream(data)
        .map(function (obj) {
            return {b: obj.a};
        })
        .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0].b, 1);
    assert.equal(result[1].b, 2);
    assert.equal(result[2].b, 3);
    assert.equal(result[3].b, 4);

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0].a, 1);
    assert.equal(data[1].a, 2);
    assert.equal(data[2].a, 3);
    assert.equal(data[3].a, 4);
});

QUnit.test("map empty array", function (assert) {
    var result = Stream([])
        .map(function (num) {
            return "obj" + num;
        })
        .toArray();

    assert.equal(result.length, 0);
});

QUnit.test("map with null", function (assert) {
    var data = [1, null, undefined, 4];

    var result = Stream(data)
        .map(function (val) {
            return "map_" + val;
        })
        .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 'map_1');
    assert.equal(result[1], 'map_null');
    assert.equal(result[2], 'map_undefined');
    assert.equal(result[3], 'map_4');

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0], 1);
    assert.equal(data[1], null);
    assert.equal(data[2], undefined);
    assert.equal(data[3], 4);
});

QUnit.test("map via path (depth 1)", function (assert) {
    var data = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];

    var result = Stream(data)
        .map("a")
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

QUnit.test("map via path (depth 3)", function (assert) {
    var data = [{a: {b: 1}}, {a: {b: 2}}, {a: {b: 3}}, {a: {b: 4}}];

    var result = Stream(data)
        .map("a.b")
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

QUnit.test("map via path (depth 3)", function (assert) {
    var data = [{a: {b: {c: 1}}}, {a: {b: {c: 2}}}, {a: {b: {c: 3}}}, {a: {b: {c: 4}}}];

    var result = Stream(data)
        .map("a.b.c")
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