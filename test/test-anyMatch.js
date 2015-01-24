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

QUnit.test("anyMatch regexp true", function (assert) {
    var result = Stream(["a1", "a2", "a3"])
        .anyMatch(/a.*/);
    assert.equal(result, true);
});

QUnit.test("anyMatch regexp false", function (assert) {
    var result = Stream(["b1", "b2", "b3"])
        .anyMatch(/a.*/);
    assert.equal(result, false);
});

QUnit.test("anyMatch regexp empty", function (assert) {
    var result = Stream([])
        .anyMatch(/a.*/);
    assert.equal(result, false);
});

QUnit.test("anyMatch sample true", function (assert) {
    var result = Stream([{a: 1, b: 5}, {a: 2, b: 5}, {a: 3, b: 5}])
        .anyMatch({a: 1});
    assert.equal(result, true);
});

QUnit.test("anyMatch sample false", function (assert) {
    var result = Stream([{a: 1, b: 5}, {a: 2, b: 5}, {a: 3, b: 5}])
        .anyMatch({a: 4});
    assert.equal(result, false);
});

QUnit.test("anyMatch sample empty", function (assert) {
    var result = Stream([])
        .anyMatch({a: 1});
    assert.equal(result, false);
});