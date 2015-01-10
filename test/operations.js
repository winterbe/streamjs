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

QUnit.test("filter num array", function (assert) {
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

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0], 1);
    assert.equal(data[1], 2);
    assert.equal(data[2], 3);
    assert.equal(data[3], 4);
});

QUnit.test("filter object array", function (assert) {
    var data = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];

    var result =
        Stream(data)
            .filter(function (obj) {
                return obj.a % 2 === 1;
            })
            .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0].a, 1);
    assert.equal(result[1].a, 3);

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0].a, 1);
    assert.equal(data[1].a, 2);
    assert.equal(data[2].a, 3);
    assert.equal(data[3].a, 4);
});

QUnit.test("filter object", function (assert) {
    var data = {a: 1, b: 2, c: 3, d: 4};

    var result =
        Stream(data)
            .filter(function (num) {
                return num % 2 === 1;
            })
            .toArray();

    assert.equal(result.length, 2);
    assert.equal(result[0], 1);
    assert.equal(result[1], 3);

    // assert original data is untouched
    assert.equal(data.a, 1);
    assert.equal(data.b, 2);
    assert.equal(data.c, 3);
    assert.equal(data.d, 4);
});

QUnit.test("filter empty", function (assert) {
    var result = Stream([])
        .filter(function () {
            return true;
        })
        .toArray();

    assert.equal(result.length, 0);
});

QUnit.test("filter with null", function (assert) {
    var result = Stream([1, null, undefined, 2])
        .filter(function () {
            return true;
        })
        .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 1);
    assert.equal(result[1], null);
    assert.equal(result[2], undefined);
    assert.equal(result[3], 2);
});

QUnit.test("map num array", function (assert) {
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

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0], 1);
    assert.equal(data[1], 2);
    assert.equal(data[2], 3);
    assert.equal(data[3], 4);
});

QUnit.test("map object array", function (assert) {
    var data = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];

    var result =
        Stream(data)
            .map(function (obj) {
                return {b: obj.a};
            })
            .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0].b, 1);
    assert.equal(result[1].b, 2);
    assert.equal(result[2].b, 3);
    assert.equal(result[3].b, 4);

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0].a, 1);
    assert.equal(data[1].a, 2);
    assert.equal(data[2].a, 3);
    assert.equal(data[3].a, 4);
});

QUnit.test("map empty array", function (assert) {
    var result =
        Stream([])
            .map(function (num) {
                return "obj" + num;
            })
            .toArray();

    assert.equal(result.length, 0);
});

QUnit.test("map with null", function (assert) {
    var data = [1, null, undefined, 4];

    var result =
        Stream(data)
            .map(function (val) {
                return "map_" + val;
            })
            .toArray();

    assert.equal(result.length, 4);
    assert.equal(result[0], 'map_1');
    assert.equal(result[1], 'map_null');
    assert.equal(result[2], 'map_undefined');
    assert.equal(result[3], 'map_4');

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0], 1);
    assert.equal(data[1], null);
    assert.equal(data[2], undefined);
    assert.equal(data[3], 4);
});

QUnit.test("flatMap num array", function (assert) {
    var data = [1, 2, 3];

    var result = Stream(data)
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

    // assert original data is untouched
    assert.equal(data.length, 3);
    assert.equal(data[0], 1);
    assert.equal(data[1], 2);
    assert.equal(data[2], 3);
});

QUnit.test("flatMap object array", function (assert) {
    var data = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];

    var result =
        Stream(data)
            .flatMap(function (obj) {
                return [{b: obj.a}, {b: obj.a}];
            })
            .toArray();

    assert.equal(result.length, 8);
    assert.equal(result[0].b, 1);
    assert.equal(result[1].b, 1);
    assert.equal(result[2].b, 2);
    assert.equal(result[3].b, 2);
    assert.equal(result[4].b, 3);
    assert.equal(result[5].b, 3);
    assert.equal(result[6].b, 4);
    assert.equal(result[7].b, 4);

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0].a, 1);
    assert.equal(data[1].a, 2);
    assert.equal(data[2].a, 3);
    assert.equal(data[3].a, 4);
});

QUnit.test("flatMap empty array", function (assert) {
    var result = Stream([])
        .flatMap(function (num) {
            return [num, num];
        })
        .toArray();

    assert.equal(result.length, 0);
});

QUnit.test("flatMap no array return", function (assert) {
    var result = Stream([1, 2, 3])
        .flatMap(function (num) {
            return String(num);
        })
        .toArray();

    assert.equal(result.length, 3);
    assert.equal(result[0], "1");
    assert.equal(result[1], "2");
    assert.equal(result[2], "3");
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
    assert.equal(result, "[object Optional]");
    assert.equal(result.get(), 1);
});

QUnit.test("min (comparator)", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .min(function (a, b) {
            if (a === b) return 0;
            if (a > b) return -1;
            return 1;
        })
        .get();
    assert.equal(result, 4);
});

QUnit.test("max", function (assert) {
    var result = Stream([1, 2, 3, 4]).max();
    assert.equal(result, "[object Optional]");
    assert.equal(result.get(), 4);
});

QUnit.test("max (comparator)", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .max(function (a, b) {
            if (a === b) return 0;
            if (a > b) return -1;
            return 1;
        })
        .get();
    assert.equal(result, 1);
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
    assert.equal(result, "[object Optional]");
    assert.equal(result.get(), 2.5);
});

QUnit.test("average", function (assert) {
    var result = Stream([]).average();
    assert.equal(result.isPresent(), false);
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
                if (num1 === num2) return 0;
                return num1 < num2 ? 1 : -1;
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
    assert.equal(result[1], 3);
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

QUnit.test("reduce", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .reduce(1000, function (identity, num) {
            return identity + num;
        });
    assert.equal(result, 1010);
});

QUnit.test("reduce first", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .reduce(function (identity, num) {
            return identity * num;
        });
    assert.equal(result, "[object Optional]");
    assert.equal(result.get(), 24);
});

QUnit.test("reduce first empty", function (assert) {
    var result = Stream([])
        .reduce(function (identity, num) {
            return identity * num;
        })
        .orElse("NOTHING");
    assert.equal(result, "NOTHING");
});

QUnit.test("groupBy 1", function (assert) {
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

QUnit.test("toMap 1", function (assert) {
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

QUnit.test("toMap 2", function (assert) {
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

QUnit.test("toMap 3", function (assert) {
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

QUnit.test("partitionBy 1", function (assert) {
    var data = [
        {firstName: "Peter", lastName: "Parker"},
        {firstName: "Sandra", lastName: "Parker"},
        {firstName: "John", lastName: "Doe"}
    ];

    var result = Stream(data)
        .partitionBy(function (person) {
            return person.lastName === 'Parker';
        });

    assert.equal(result[true].length, 2);
    assert.equal(result[false].length, 1);
    assert.equal(result[true][0], data[0]);
    assert.equal(result[true][1], data[1]);
    assert.equal(result[false][0], data[2]);
});


QUnit.test("partitionBy 2", function (assert) {
    var data = Stream
        .range(0, 25)
        .toArray();

    var result = Stream(data)
        .partitionBy(10);

    assert.equal(result.length, 3);
    assert.equal(result[0].length, 10);
    assert.equal(result[1].length, 10);
    assert.equal(result[2].length, 5);

    for (var i = 0; i < result.length; i++) {
        var partition = result[i];
        for (var j = 0; j < partition.length; j++) {
            var obj = partition[j];
            assert.equal(obj, j + (i * 10));
        }
    }
});

QUnit.test("partitionBy 3", function (assert) {
    assert.throws(function () {
        Stream([]).partitionBy();
    });

    assert.throws(function () {
        Stream([]).partitionBy("wrong_arg");
    });
});

QUnit.test("joining 1", function (assert) {
    var result = Stream([1, 2, 3, 4]).joining();
    assert.equal(result, "1234");
});

QUnit.test("joining 2", function (assert) {
    var result = Stream([1, 2, 3, 4])
        .joining({
            prefix: "PREFIX_",
            suffix: "_SUFFIX",
            delimiter: ","
        });
    assert.equal(result, "PREFIX_1,2,3,4_SUFFIX");
});

QUnit.test("toArray twice", function (assert) {
    assert.throws(function () {
        var stream = Stream([1, 2, 3, 4]);
        stream.toArray();
        stream.toArray();
    });
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

QUnit.test("of", function (assert) {
    var result =
        Stream.of(1, 2, 3, 4)
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
    assert.equal(Stream.VERSION, "0.4.1");
});

QUnit.test("noConflict", function (assert) {
    var ArrayStream = Stream.noConflict();
    assert.equal(window.Stream, undefined);
    assert.ok(ArrayStream !== undefined);
    window.Stream = ArrayStream;
});