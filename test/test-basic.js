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

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0], 1);
    assert.equal(data[1], 2);
    assert.equal(data[2], 3);
    assert.equal(data[3], 4);
});

QUnit.test("map: wrong args", function (assert) {
    assert.throws(function () {
        Stream([]).map();
    });

    assert.throws(function () {
        Stream([]).map(123);
    });

    assert.throws(function () {
        Stream([]).map({});
    });
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

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0], 1);
    assert.equal(data[1], 2);
    assert.equal(data[2], 3);
    assert.equal(data[3], 4);
});

QUnit.test("filter: wrong args", function (assert) {
    assert.throws(function () {
        Stream([]).filter();
    });

    assert.throws(function () {
        Stream([]).filter(123);
    });

    assert.throws(function () {
        Stream([]).filter({});
    });
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

    // assert original data is untouched
    assert.equal(data.length, 3);
    assert.equal(data[0], 1);
    assert.equal(data[1], 2);
    assert.equal(data[2], 3);
});

QUnit.test("flatMap: wrong args", function (assert) {
    assert.throws(function () {
        Stream([]).flatMap();
    });

    assert.throws(function () {
        Stream([]).flatMap(123);
    });

    assert.throws(function () {
        Stream([]).flatMap({});
    });
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

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0], 1);
    assert.equal(data[1], 2);
    assert.equal(data[2], 3);
    assert.equal(data[3], 4);
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

QUnit.test("min (comparator)", function (assert) {
    var result = Stream([1, 2, 3, 4]).min(function (a, b) {
        if (a === b) return 0;
        if (a > b) return -1;
        return 1;
    });
    assert.equal(result, 4);
});

QUnit.test("max", function (assert) {
    var result = Stream([1, 2, 3, 4]).max();
    assert.equal(result, 4);
});

QUnit.test("max (comparator)", function (assert) {
    var result = Stream([1, 2, 3, 4]).max(function (a, b) {
        if (a === b) return 0;
        if (a > b) return -1;
        return 1;
    });
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
        })
        .get();
    assert.equal(result, 24);
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

QUnit.test("groupBy 2", function (assert) {
    var data = [
        {firstName: "Peter", lastName: "Parker"},
        {firstName: "Sandra", lastName: "Parker"},
        {firstName: "John", lastName: "Doe"}
    ];

    var map = Stream(data)
        .groupBy(function (obj) {
            return obj["lastName"];
        }, {customMap: true});

    assert.equal(map.hasOwnProperty("Parker"), true);
    assert.equal(map.hasOwnProperty("Doe"), true);
    assert.equal(map.hasOwnProperty("customMap"), true);
    assert.equal(map["customMap"], true);
    assert.equal(map["Parker"].length, 2);
    assert.equal(map["Doe"].length, 1);
    assert.equal(map["Parker"][0], data[0]);
    assert.equal(map["Parker"][1], data[1]);
    assert.equal(map["Doe"][0], data[2]);
});

QUnit.test("indexBy 1", function (assert) {
    var data = [
        {firstName: "Peter", lastName: "Parker"},
        {firstName: "John", lastName: "Doe"}
    ];

    var map = Stream(data)
        .indexBy(function (obj) {
            return obj["lastName"];
        });

    assert.equal(map.hasOwnProperty("Parker"), true);
    assert.equal(map.hasOwnProperty("Doe"), true);
    assert.equal(map["Parker"], data[0]);
    assert.equal(map["Doe"], data[1]);
});

QUnit.test("indexBy 2", function (assert) {
    var data = [
        {firstName: "Peter", lastName: "Parker"},
        {firstName: "Sandra", lastName: "Parker"},
        {firstName: "John", lastName: "Doe"}
    ];

    assert.throws(function () {
        Stream(data)
            .indexBy(function (obj) {
                return obj["lastName"];
            });
    });
});

QUnit.test("indexBy 3", function (assert) {
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

QUnit.test("indexBy 4", function (assert) {
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
        }, {customMap: true});

    assert.equal(map.hasOwnProperty("Parker"), true);
    assert.equal(map.hasOwnProperty("Doe"), true);
    assert.equal(map["Parker"], data[0]);
    assert.equal(map["Doe"], data[2]);
    assert.equal(map["customMap"], true);
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

QUnit.test("version", function (assert) {
    assert.equal(Stream.VERSION, "0.1.0");
});

QUnit.test("noConflict", function (assert) {
    var ArrayStream = Stream.noConflict();
    assert.equal(window.Stream, undefined);
    assert.equal(ArrayStream.VERSION, "0.1.0");
});