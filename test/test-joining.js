QUnit.test("joining", function (assert) {
    var result = Stream([1, 2, 3, 4]).joining();
    assert.equal(result, "1234");
});

QUnit.test("joining empty", function (assert) {
    var result = Stream([]).joining();
    assert.equal(result, "");
});

QUnit.test("joining with options", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .joining({
            prefix: "PREFIX_",
            suffix: "_SUFFIX",
            delimiter: ","
        });
    assert.equal(result, "PREFIX_1,2,3,4_SUFFIX");
});

QUnit.test("joining empty with options", function (assert) {
    var result = Stream([])
        .joining({
            prefix: "PREFIX_",
            suffix: "_SUFFIX",
            delimiter: ","
        });
    assert.equal(result, "PREFIX__SUFFIX");
});