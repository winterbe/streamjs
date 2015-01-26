QUnit.test("sum", function (assert) {
    var result = Stream([1, 2, 3, 4]).sum();
    assert.equal(result, 10);
});

QUnit.test("sum empty", function (assert) {
    var result = Stream([]).sum();
    assert.equal(result, 0);
});

QUnit.test("sum via path", function (assert) {
    var result = Stream.of({a: 1}, {a: 2}, {a: 3}).sum("a");
    assert.equal(result, 6);
});