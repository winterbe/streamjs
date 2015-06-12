QUnit.test("toArray twice", function (assert) {
    assert.throws(function () {
        var stream = Stream([1, 2, 3, 4]);
        stream.toArray();
        stream.toArray();
    });
});

QUnit.test("aliases", function (assert) {
    var stream = Stream([]);
    assert.strictEqual(stream.toMap, stream.indexBy);
    assert.strictEqual(stream.partitioningBy, stream.partitionBy);
    assert.strictEqual(stream.groupingBy, stream.groupBy);
    assert.strictEqual(stream.each, stream.forEach);
    assert.strictEqual(stream.toList, stream.toArray);
    assert.strictEqual(stream.sorted, stream.sort);
    assert.strictEqual(stream.count, stream.size);
    assert.strictEqual(stream.avg, stream.average);
    assert.strictEqual(stream.join, stream.joining);
    assert.strictEqual(stream.findAny, stream.findFirst);
});

QUnit.test("toString", function (assert) {
    var stream = Stream([]);
    assert.equal(stream.toString(), "[object Stream]");
});

QUnit.test("version", function (assert) {
    assert.equal(Stream.VERSION, "1.4.0");
});

QUnit.test("noConflict", function (assert) {
    var ArrayStream = Stream.noConflict();
    assert.equal(window.Stream, undefined);
    assert.ok(ArrayStream !== undefined);
    window.Stream = ArrayStream;
});