QUnit.test("map", function (assert) {
    var data = [1, 2, 3, 4];
    var result = new Pipe(data)
        .map(function (num) {
            return "obj" + num;
        })
        .collect();

    assert.equal(result.length, 4);
    assert.equal(result[0], 'obj1');
    assert.equal(result[1], 'obj2');
    assert.equal(result[2], 'obj3');
    assert.equal(result[3], 'obj4');
});

QUnit.test("filter", function (assert) {
    var data = [1, 2, 3, 4];
    var result = new Pipe(data)
        .filter(function (num) {
            return num % 2 === 1;
        })
        .collect();

    assert.equal(result.length, 2);
    assert.equal(result[0], 1);
    assert.equal(result[1], 3);
});

QUnit.test("flatMap", function (assert) {
    var data = [1, 2, 3];
    var result = new Pipe(data)
        .flatMap(function (num) {
            return [num, num];
        })
        .collect();

    assert.equal(result.length, 6);
    assert.equal(result[0], 1);
    assert.equal(result[1], 1);
    assert.equal(result[2], 2);
    assert.equal(result[3], 2);
    assert.equal(result[4], 3);
    assert.equal(result[5], 3);
});