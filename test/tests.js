QUnit.test("map", function (assert) {
    var data = [1, 2, 3, 4];

    var result =
        Stream(data)
            .map(function (num) {
                return "obj" + num;
            })
            .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 'obj1');
    assert.equal(result[1], 'obj2');
    assert.equal(result[2], 'obj3');
    assert.equal(result[3], 'obj4');
});

QUnit.test("filter", function (assert) {
    var data = [1, 2, 3, 4];

    var result =
        Stream(data)
            .filter(function (num) {
                return num % 2 === 1;
            })
            .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 1);
    assert.equal(result[1], 3);
});

QUnit.test("flatMap", function (assert) {
    var data = [1, 2, 3];

    var result =
        Stream(data)
            .flatMap(function (num) {
                return [num, num];
            })
            .toArray();

    assert.equal(result.length, 6);
    assert.equal(result[0], 1);
    assert.equal(result[1], 1);
    assert.equal(result[2], 2);
    assert.equal(result[3], 2);
    assert.equal(result[4], 3);
    assert.equal(result[5], 3);
});

QUnit.test("filter map", function (assert) {
    var data = [1, 2, 3, 4];

    var result =
        Stream(data)
            .filter(function (num) {
                return num % 2 === 1;
            })
            .map(function (num) {
                return "obj" + num;
            })
            .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 'obj1');
    assert.equal(result[1], 'obj3');
});

QUnit.test("filter map (correct invocation)", function (assert) {
    var numFilter = 0;
    var numMap = 0;

    var data = [1, 2, 3, 4];

    var result =
        Stream(data)
            .filter(function (num) {
                numFilter++;
                return num % 2 === 1;
            })
            .map(function (num) {
                numMap++;
                return "obj" + num;
            })
            .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 'obj1');
    assert.equal(result[1], 'obj3');
    assert.equal(numFilter, 4);
    assert.equal(numMap, 2);
});

QUnit.test("findFirst", function (assert) {
    var result =
        Stream([1, 2, 3, 4])
            .filter(function (num) {
                return num % 2 === 0;
            })
            .findFirst()
            .get();

    assert.equal(result, 2);
});

QUnit.test("findLast", function (assert) {
    var result =
        Stream([1, 2, 3, 4])
            .filter(function (num) {
                return num % 2 === 1;
            })
            .findLast()
            .get();

    assert.equal(result, 3);
});

QUnit.test("forEach", function (assert) {
    var data = [];

    Stream([1, 2, 3, 4])
        .forEach(function (num) {
            data.push(num);
        });

    assert.equal(data.length, 4);
    assert.equal(data[0], 1);
    assert.equal(data[1], 2);
    assert.equal(data[2], 3);
    assert.equal(data[3], 4);
});

QUnit.test("min", function (assert) {
    var result = Stream([1, 2, 3, 4]).min();
    assert.equal(result, 1);
});

QUnit.test("max", function (assert) {
    var result = Stream([1, 2, 3, 4]).max();
    assert.equal(result, 4);
});

QUnit.test("sum", function (assert) {
    var result = Stream([1, 2, 3, 4]).sum();
    assert.equal(result, 10);
});

QUnit.test("count", function (assert) {
    var result = Stream([1, 2, 3, 4]).count();
    assert.equal(result, 4);
});

QUnit.test("average", function (assert) {
    var result = Stream([1, 2, 3, 4]).average();
    assert.equal(result, 2.5);
});

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

QUnit.test("sorted", function (assert) {
    var result =
        Stream([4, 1, 3, 2])
            .sorted()
            .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
    assert.equal(result[2], 3);
    assert.equal(result[3], 4);
});

QUnit.test("sorted (comparator)", function (assert) {
    var result =
        Stream([4, 1, 3, 2])
            .sorted(function (num1, num2) {
                if (num1 == num2) return 0;
                return num1 < num2 ? 1 : -1
            })
            .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 4);
    assert.equal(result[1], 3);
    assert.equal(result[2], 2);
    assert.equal(result[3], 1);
});

QUnit.test("skip", function (assert) {
    var result =
        Stream([1, 2, 3, 4])
            .skip(2)
            .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 3);
    assert.equal(result[1], 4);
});

QUnit.test("limit", function (assert) {
    var result =
        Stream([1, 2, 3, 4])
            .limit(2)
            .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 1);
    assert.equal(result[1], 2);
});

QUnit.test("peek", function (assert) {
    var poke = [];
    var result =
        Stream([1, 2, 3, 4])
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

QUnit.test("distinct", function (assert) {
    var result =
        Stream([1, 3, 3, 1])
            .distinct()
            .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 1);
    assert.equal(result[1], 3)
});

QUnit.test("collect", function (assert) {
    var result =
        Stream([1, 2, 3, 4]).collect({
            supplier: function () {
                return "Data: ";
            },
            accumulator: function (val, num) {
                return val + num + " ";
            },
            finisher: function (val) {
                return val + "!";
            }
        });

    assert.equal(result, "Data: 1 2 3 4 !");
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
            result = "called"
        });
    assert.equal(result, "called");
});

QUnit.test("Optional ifPresent 2", function (assert) {
    var result = null;
    Stream.Optional.empty()
        .ifPresent(function () {
            result = "called"
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