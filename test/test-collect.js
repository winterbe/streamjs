QUnit.test("collect", function (assert) {
    var result = Stream([1, 2, 3, 4]).collect({
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

QUnit.test("collect without finisher", function (assert) {
    var result = Stream([1, 2, 3, 4]).collect({
        supplier: function () {
            return "Data: ";
        },
        accumulator: function (val, num) {
            return val + num + " ";
        }
    });

    assert.equal(result, "Data: 1 2 3 4 ");
});

QUnit.test("collect empty", function (assert) {
    var result = Stream([]).collect({
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

    assert.equal(result, "Data: !");
});