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

QUnit.test("forEach empty", function (assert) {
    var called = false;

    Stream([])
        .forEach(function () {
            called = true;
        });

    assert.equal(called, false);
});

QUnit.test("forEach console.log", function (assert) {
    Stream(["forEach"])
        .forEach(console.log);

    assert.ok(true);    // assert no error
});