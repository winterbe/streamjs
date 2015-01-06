QUnit.test("filter - map - toArray", function (assert) {
    var data = [1, 2, 3, 4];

    var result =
        Stream(data)
            .filter(function (num) {
                return num % 2 === 1;
            })
            .map(function (num) {
                return "obj" + num;
            })
            .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 'obj1');
    assert.equal(result[1], 'obj3');

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0], 1);
    assert.equal(data[1], 2);
    assert.equal(data[2], 3);
    assert.equal(data[3], 4);
});

QUnit.test("filter - map - toArray (correct invocation)", function (assert) {
    var numFilter = 0;
    var numMap = 0;

    var data = [1, 2, 3, 4];

    var result =
        Stream(data)
            .filter(function (num) {
                numFilter++;
                return num % 2 === 1;
            })
            .map(function (num) {
                numMap++;
                return "obj" + num;
            })
            .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 'obj1');
    assert.equal(result[1], 'obj3');
    assert.equal(numFilter, 4);
    assert.equal(numMap, 2);
});