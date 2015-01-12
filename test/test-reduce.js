QUnit.test("reduce", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .reduce(1000, function (identity, num) {
            return identity + num;
        });
    assert.equal(result, 1010);
});

QUnit.test("reduce empty", function (assert) {
    var result = Stream([])
        .reduce(1000, function (identity, num) {
            return identity + num;
        });
    assert.equal(result, 1000);
});

QUnit.test("reduce first", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .reduce(function (identity, num) {
            return identity * num;
        });
    assert.equal(result, "[object Optional]");
    assert.equal(result.get(), 24);
});

QUnit.test("reduce first empty", function (assert) {
    var result = Stream([])
        .reduce(function (identity, num) {
            return identity * num;
        })
        .orElse("NOTHING");
    assert.equal(result, "NOTHING");
});