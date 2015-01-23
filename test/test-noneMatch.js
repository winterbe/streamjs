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

QUnit.test("noneMatch regexp true", function (assert) {
    var result = Stream(["a1", "a2", "a3"])
        .noneMatch(/b.*/);
    assert.equal(result, true);
});

QUnit.test("noneMatch regexp false", function (assert) {
    var result = Stream(["b1", "a2", "b3"])
        .noneMatch(/a.*/);
    assert.equal(result, false);
});

QUnit.test("noneMatch regexp empty", function (assert) {
    var result = Stream([])
        .noneMatch(/a.*/);
    assert.equal(result, true);
});