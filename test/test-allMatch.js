QUnit.test("allMatch true", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .allMatch(function (num) {
            return num > 0;
        });
    assert.equal(result, true);
});

QUnit.test("allMatch false", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .allMatch(function (num) {
            return num > 1;
        });
    assert.equal(result, false);
});

QUnit.test("allMatch empty", function (assert) {
    var result = Stream([])
        .allMatch(function (num) {
            return num > 1;
        });
    assert.equal(result, true);
});

QUnit.test("allMatch regexp true", function (assert) {
    var result = Stream(["a1", "a2", "a3"])
        .allMatch(/a.*/);
    assert.equal(result, true);
});

QUnit.test("allMatch regexp false", function (assert) {
    var result = Stream(["a1", "a2", "b3"])
        .allMatch(/a.*/);
    assert.equal(result, false);
});

QUnit.test("allMatch regexp empty", function (assert) {
    var result = Stream([])
        .allMatch(/a.*/);
    assert.equal(result, true);
});