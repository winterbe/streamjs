QUnit.test("findFirst", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .filter(function (num) {
            return num % 2 === 0;
        })
        .findFirst();

    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), true);
    assert.equal(result.get(), 2);
});

QUnit.test("findFirst empty", function (assert) {
    var result = Stream([]).findFirst();

    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), false);
});

QUnit.test("findFirst object", function (assert) {
    var result = Stream({a: 1, b: 2}).findFirst();

    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), true);
    assert.equal(result.get(), 1);
});