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

QUnit.test("average via path", function (assert) {
    var result = Stream.of({a: 1}, {a: 2}, {a: 3}, {a: 4})
        .average("a");
    assert.equal(result, "[object Optional]");
    assert.equal(result.get(), 2.5);
});

QUnit.test("average via path (empty)", function (assert) {
    var result = Stream
        .empty()
        .average("a");
    assert.equal(result, "[object Optional]");
    assert.equal(result.isPresent(), false);
});