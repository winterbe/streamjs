QUnit.test("map", function (assert) {
    var data = [1, 2, 3, 4];

    var result =
        Stream(data)
            .map(function (num) {
                return "obj" + num;
            })
            .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 'obj1');
    assert.equal(result[1], 'obj2');
    assert.equal(result[2], 'obj3');
    assert.equal(result[3], 'obj4');
});

QUnit.test("filter", function (assert) {
    var data = [1, 2, 3, 4];

    var result =
        Stream(data)
            .filter(function (num) {
                return num % 2 === 1;
            })
            .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 1);
    assert.equal(result[1], 3);
});

QUnit.test("flatMap", function (assert) {
    var data = [1, 2, 3];

    var result =
        Stream(data)
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
});

QUnit.test("filter map", function (assert) {
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
});

QUnit.test("filter map (correct invocation)", function (assert) {
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

QUnit.test("findFirst", function (assert) {
    var result =
        Stream([1, 2, 3, 4])
            .filter(function (num) {
                return num % 2 === 0;
            })
            .findFirst();

    assert.equal(result, 2);
});

QUnit.test("findLast", function (assert) {
    var result =
        Stream([1, 2, 3, 4])
            .filter(function (num) {
                return num % 2 === 1;
            })
            .findLast();

    assert.equal(result, 3);
});

QUnit.test("forEach", function (assert) {
    var data = [];

    Stream([1, 2, 3, 4])
        .forEach(function (num) {
            data.push(num);
        });

    assert.equal(data.length, 4);
    assert.equal(data[0], 1);
    assert.equal(data[1], 2);
    assert.equal(data[2], 3);
    assert.equal(data[3], 4);
});