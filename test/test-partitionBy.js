QUnit.test("partitionBy predicate", function (assert) {
    var data = [
        {firstName: "Peter", lastName: "Parker"},
        {firstName: "Sandra", lastName: "Parker"},
        {firstName: "John", lastName: "Doe"}
    ];

    var result = Stream(data)
        .partitionBy(function (person) {
            return person.lastName === 'Parker';
        });

    assert.equal(result[true].length, 2);
    assert.equal(result[false].length, 1);
    assert.equal(result[true][0], data[0]);
    assert.equal(result[true][1], data[1]);
    assert.equal(result[false][0], data[2]);
});

QUnit.test("partitionBy regexp", function (assert) {
    var result = Stream(["a1", "a2", "b1"])
        .partitionBy(/a.*/);

    assert.equal(result[true].length, 2);
    assert.equal(result[false].length, 1);
    assert.equal(result[true][0], "a1");
    assert.equal(result[true][1], "a2");
    assert.equal(result[false][0], "b1");
});

QUnit.test("partitionBy predicate empty", function (assert) {
    var result = Stream([])
        .partitionBy(function (person) {
            return person.lastName === 'Parker';
        });

    assert.equal(result[true].length, 0);
    assert.equal(result[false].length, 0);
});

QUnit.test("partitionBy size", function (assert) {
    var data = Stream
        .range(0, 25)
        .toArray();

    var result = Stream(data)
        .partitionBy(10);

    assert.equal(result.length, 3);
    assert.equal(result[0].length, 10);
    assert.equal(result[1].length, 10);
    assert.equal(result[2].length, 5);

    for (var i = 0; i < result.length; i++) {
        var partition = result[i];
        for (var j = 0; j < partition.length; j++) {
            var obj = partition[j];
            assert.equal(obj, j + (i * 10));
        }
    }
});

QUnit.test("partitionBy size empty", function (assert) {
    var result = Stream([])
        .partitionBy(10);

    assert.equal(Object.keys(result).length, 0);
});