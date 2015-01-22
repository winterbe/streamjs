QUnit.test("toMap", function (assert) {
    var data = [
        {firstName: "Peter", lastName: "Parker"},
        {firstName: "John", lastName: "Doe"}
    ];

    var map = Stream(data)
        .toMap(function (obj) {
            return obj["lastName"];
        });

    assert.equal(map.hasOwnProperty("Parker"), true);
    assert.equal(map.hasOwnProperty("Doe"), true);
    assert.equal(map["Parker"], data[0]);
    assert.equal(map["Doe"], data[1]);
});

QUnit.test("toMap path", function (assert) {
    var data = [
        {firstName: "Peter", lastName: "Parker"},
        {firstName: "John", lastName: "Doe"}
    ];

    var map = Stream(data)
        .toMap("lastName");

    assert.equal(map.hasOwnProperty("Parker"), true);
    assert.equal(map.hasOwnProperty("Doe"), true);
    assert.equal(map["Parker"], data[0]);
    assert.equal(map["Doe"], data[1]);
});

QUnit.test("toMap empty", function (assert) {
    var map = Stream([])
        .toMap(function (obj) {
            return obj["lastName"];
        });

    assert.equal(Object.keys(map).length, 0);
});

QUnit.test("toMap duplicate key", function (assert) {
    var data = [
        {firstName: "Peter", lastName: "Parker"},
        {firstName: "Sandra", lastName: "Parker"},
        {firstName: "John", lastName: "Doe"}
    ];

    assert.throws(function () {
        Stream(data)
            .toMap(function (obj) {
                return obj["lastName"];
            });
    });
});

QUnit.test("toMap duplicate key merge", function (assert) {
    var data = [
        {firstName: "Peter", lastName: "Parker"},
        {firstName: "Sandra", lastName: "Parker"},
        {firstName: "John", lastName: "Doe"}
    ];

    var map = Stream(data)
        .indexBy(function (obj) {
            return obj["lastName"];
        }, function (val1) {
            return val1;
        });

    assert.equal(map.hasOwnProperty("Parker"), true);
    assert.equal(map.hasOwnProperty("Doe"), true);
    assert.equal(map["Parker"], data[0]);
    assert.equal(map["Doe"], data[2]);
});