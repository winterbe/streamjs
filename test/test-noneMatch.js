QUnit.test("noneMatch true", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .noneMatch(function (num) {
            return num < 0;
        });
    assert.equal(result, true);
});

QUnit.test("noneMatch false", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .noneMatch(function (num) {
            return num > 3;
        });
    assert.equal(result, false);
});

QUnit.test("noneMatch empty", function (assert) {
    var result = Stream([])
        .noneMatch(function (num) {
            return num > 1;
        });
    assert.equal(result, true);
});