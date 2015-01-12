QUnit.test("count", function (assert) {
    var result = Stream([1, 2, 3, 4]).count();
    assert.equal(result, 4);
});

QUnit.test("count empty", function (assert) {
    var result = Stream([]).count();
    assert.equal(result, 0);
});