QUnit.test("input array", function (assert) {
    var input = [1, 2, 3];
    var result = Stream(input).toArray();
    assert.equal(result.length, 3);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 3);
});

QUnit.test("input object", function (assert) {
    var input = {
        foo: 1, bar: 2, foobar: 3
    };

    var result = Stream(input).toArray();
    assert.equal(result.length, 3);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 3);
});

QUnit.test("input string", function (assert) {
    var result = Stream("abcd")
        .filter(function (c) {
            return c !== 'b';
        })
        .map(function (c) {
            return c.toUpperCase();
        })
        .joining();

    assert.equal(result, "ACD");
});

QUnit.test("of", function (assert) {
    var result = Stream.of(1, 2, 3, 4)
        .filter(function (num) {
            return num % 2 === 1;
        })
        .map(function (num) {
            return "odd" + num;
        })
        .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], "odd1");
    assert.equal(result[1], "odd3");
});

QUnit.test("empty", function (assert) {
    var result = Stream.empty().toArray();
    assert.equal(result.length, 0);
});

QUnit.test("range", function (assert) {
    var result = Stream.range(0, 4).toArray();
    assert.equal(result.length, 4);
    assert.equal(result[0], 0);
    assert.equal(result[1], 1);
    assert.equal(result[2], 2);
    assert.equal(result[3], 3);
});

QUnit.test("rangeClosed", function (assert) {
    var result = Stream.rangeClosed(0, 4).toArray();
    assert.equal(result.length, 5);
    assert.equal(result[0], 0);
    assert.equal(result[1], 1);
    assert.equal(result[2], 2);
    assert.equal(result[3], 3);
    assert.equal(result[4], 4);
});

QUnit.test("generate", function (assert) {
    var result = Stream
        .generate(Math.random)
        .limit(10)
        .toArray();

    assert.equal(result.length, 10);
});

QUnit.test("iterate", function (assert) {
    var result = Stream
        .iterate(1, function (seed) {
            return seed * 2;
        })
        .limit(11)
        .toArray();

    assert.equal(result.length, 11);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 4);
    assert.equal(result[3], 8);
    assert.equal(result[4], 16);
    assert.equal(result[5], 32);
    assert.equal(result[6], 64);
    assert.equal(result[7], 128);
    assert.equal(result[8], 256);
    assert.equal(result[9], 512);
    assert.equal(result[10], 1024);
});