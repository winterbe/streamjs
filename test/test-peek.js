QUnit.test("peek", function (assert) {
    var poke = [];
    var result = Stream([1, 2, 3, 4])
        .peek(function (num) {
            poke.push(num);
        })
        .toArray();

    assert.equal(result.length, poke.length);
    assert.equal(result[0], poke[0]);
    assert.equal(result[1], poke[1]);
    assert.equal(result[2], poke[2]);
    assert.equal(result[3], poke[3]);
});

QUnit.test("peek empty", function (assert) {
    var poke = [];
    var result = Stream([])
        .peek(function (num) {
            poke.push(num);
        })
        .toArray();

    assert.equal(poke.length, 0);
    assert.equal(result.length, 0);
});