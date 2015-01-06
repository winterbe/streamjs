QUnit.test("Optional get 1", function (assert) {
    var result = Stream.Optional.of(1).get();
    assert.equal(result, 1);
});

QUnit.test("Optional get 2", function (assert) {
    assert.throws(function () {
        Stream.Optional.ofNullable(null).get();
    });

    assert.throws(function () {
        Stream.Optional.ofNullable(undefined).get();
    });
});

QUnit.test("Optional of", function (assert) {
    assert.throws(function () {
        Stream.Optional.of(null);
    });

    assert.throws(function () {
        Stream.Optional.of(undefined);
    });
});

QUnit.test("Optional ifPresent 1", function (assert) {
    var result = null;
    Stream.Optional.of(1)
        .ifPresent(function () {
            result = "called";
        });
    assert.equal(result, "called");
});

QUnit.test("Optional ifPresent 2", function (assert) {
    var result = null;
    Stream.Optional.empty()
        .ifPresent(function () {
            result = "called";
        });
    assert.equal(result, null);
});

QUnit.test("Optional orElse 1", function (assert) {
    var result = Stream.Optional.of(1).orElse(2);
    assert.equal(result, 1);
});

QUnit.test("Optional orElse 2", function (assert) {
    var result = Stream.Optional.empty().orElse(2);
    assert.equal(result, 2);
});

QUnit.test("Optional orElseGet 1", function (assert) {
    var result = Stream.Optional.of(1).orElseGet(function () {
        return 2;
    });
    assert.equal(result, 1);
});

QUnit.test("Optional orElseGet 2", function (assert) {
    var result = Stream.Optional.empty().orElseGet(function () {
        return 2;
    });
    assert.equal(result, 2);
});

QUnit.test("Optional orElseThrow 1", function (assert) {
    var result = Stream.Optional.of(1).orElseThrow("error");
    assert.equal(result, 1);
});

QUnit.test("Optional orElseThrow 2", function (assert) {
    assert.throws(function () {
        Stream.Optional.empty().orElseThrow("error");
    });
});

QUnit.test("Optional filter 1", function (assert) {
    var optional = Stream.Optional.of(3).filter(function (num) {
        return num > 2;
    });
    assert.equal(optional.isPresent(), true);
    assert.equal(optional.get(), 3);
});

QUnit.test("Optional filter 2", function (assert) {
    var optional = Stream.Optional.of(3).filter(function (num) {
        return num > 3;
    });
    assert.equal(optional.isPresent(), false);
});

QUnit.test("Optional filter 3", function (assert) {
    var optional = Stream.Optional.empty().filter(function (num) {
        return num > 3;
    });
    assert.equal(optional.isPresent(), false);
});

QUnit.test("Optional map 1", function (assert) {
    var optional = Stream.Optional.of(3).map(function (num) {
        return "num" + num;
    });
    assert.equal(optional.isPresent(), true);
    assert.equal(optional.get(), "num3");
});

QUnit.test("Optional map 2", function (assert) {
    var optional = Stream.Optional.empty().map(function (num) {
        return "num" + num;
    });
    assert.equal(optional.isPresent(), false);
});

QUnit.test("Optional flatMap 1", function (assert) {
    var optional = Stream.Optional.of(3).flatMap(function (num) {
        return Stream.Optional.of("num" + num);
    });
    assert.equal(optional.isPresent(), true);
    assert.equal(optional.get(), "num3");
});

QUnit.test("Optional flatMap 2", function (assert) {
    var optional = Stream.Optional.empty().map(function (num) {
        return Stream.Optional.of("num" + num);
    });
    assert.equal(optional.isPresent(), false);
});