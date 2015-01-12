QUnit.test("anyMatch true", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .anyMatch(function (num) {
            return num === 4;
        });
    assert.equal(result, true);
});

QUnit.test("anyMatch false", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .anyMatch(function (num) {
            return num === 5;
        });
    assert.equal(result, false);
});

QUnit.test("anyMatch empty", function (assert) {
    var result = Stream([])
        .anyMatch(function (num) {
            return num > 1;
        });
    assert.equal(result, false);
});