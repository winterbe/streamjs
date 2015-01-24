QUnit.test("filter - flatMap - map - distinct - filter - join", function (assert) {
    var people = [];

    var names = Stream(people)
        .filter({married: true})
        .flatMap("children")
        .map("firstName")
        .distinct()
        .filter(/a.*/i)
        .join(", ");

    assert.equal(names, "");
});

QUnit.test("filter - map - toArray", function (assert) {
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

    // assert original data is untouched
    assert.equal(data.length, 4);
    assert.equal(data[0], 1);
    assert.equal(data[1], 2);
    assert.equal(data[2], 3);
    assert.equal(data[3], 4);
});

var createParents = function (numParents, numChildren) {
    return Stream
        .range(0, numParents)
        .map(function (num) {
            return {
                parentId: num,
                type: 'parent',
                children: []
            };
        })
        .peek(function (parent) {
            parent.children = Stream
                .range(0, numChildren)
                .map(function (num) {
                    return {
                        childId: num,
                        type: 'child',
                        parent: parent
                    };
                })
                .toArray();
        })
        .toArray();
};

QUnit.test("parent / children 1", function (assert) {
    var parents = createParents(5, 3);

    assert.equal(parents.length, 5);

    for (var i = 0; i < parents.length; i++) {
        var parent = parents[i];
        assert.equal(parent.parentId, i);
        assert.equal(parent.type, 'parent');
        assert.equal(parent.children.length, 3);
        for (var j = 0; j < parent.children.length; j++) {
            var child = parent.children[j];
            assert.equal(child.childId, j);
            assert.equal(child.type, 'child');
            assert.equal(child.parent, parent);
        }
    }
});

QUnit.test("parent / children 2", function (assert) {
    var parents = createParents(5, 3);

    var children = Stream(parents)
        .filter(function (p) {
            return p.parentId > 2;
        })
        .flatMap(function (p) {
            return p.children;
        })
        .toArray();

    assert.equal(children.length, 6);
    assert.equal(children[0].childId, 0);
    assert.equal(children[1].childId, 1);
    assert.equal(children[2].childId, 2);
    assert.equal(children[3].childId, 0);
    assert.equal(children[4].childId, 1);
    assert.equal(children[5].childId, 2);
});