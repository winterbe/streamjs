QUnit.test("sum", function (assert) {
    var result = Stream([1, 2, 3, 4]).sum();
    assert.equal(result, 10);
});

QUnit.test("sum empty", function (assert) {
    var result = Stream([]).sum();
    assert.equal(result, 0);
});