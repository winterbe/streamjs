QUnit.test("groupBy", function (assert) {
    var data = [
        {firstName: "Peter", lastName: "Parker"},
        {firstName: "Sandra", lastName: "Parker"},
        {firstName: "John", lastName: "Doe"}
    ];

    var map = Stream(data)
        .groupBy(function (obj) {
            return obj["lastName"];
        });

    assert.equal(map.hasOwnProperty("Parker"), true);
    assert.equal(map.hasOwnProperty("Doe"), true);
    assert.equal(map["Parker"].length, 2);
    assert.equal(map["Doe"].length, 1);
    assert.equal(map["Parker"][0], data[0]);
    assert.equal(map["Parker"][1], data[1]);
    assert.equal(map["Doe"][0], data[2]);
});

QUnit.test("groupBy empty", function (assert) {
    var map = Stream([])
        .groupBy(function (obj) {
            return obj["lastName"];
        });

    assert.equal(Object.keys(map).length, 0);
});