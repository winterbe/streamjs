QUnit.test("average", function (assert) {
    var result = Stream([1, 2, 3, 4]).average();
    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), true);
    assert.equal(result.get(), 2.5);
});

QUnit.test("average empty", function (assert) {
    var result = Stream([]).average();
    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), false);
});