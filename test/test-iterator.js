QUnit.test("iterator", function (assert) {
    var data = [1, 2, 3, 4];

    var iterator = Stream(data)
        .map(function (num) {
            return "obj" + num;
        })
        .iterator();

    var result = [], current = iterator.next();
    while (true) {
        result.push(current.value);
        if (current.done) {
            break;
        }
        current = iterator.next();
    }

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

QUnit.test("iterator consumes stream", function (assert) {
    assert.throws(function () {
        var stream = Stream([1, 2, 3, 4])
            .map(function (num) {
                return "obj" + num;
            });

        var iterator = stream.iterator();
        iterator.next();
        stream.toArray();
    });
});