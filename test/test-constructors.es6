// I'm using Babel.js and Intellij IDEA File Watcher to automatically transpile es6 to js:
// --source-maps --out-file $FileNameWithoutExtension$-compiled.js $FilePath$ --blacklist useStrict
//
// useStrict is blacklisted to prevent global use-strict for jshint

QUnit.test("input ES6 iterator", function (assert) {
    function* iterator() {
        yield 1;
        yield 2;
        yield 3;
        yield 4;
        yield 5;
        yield 6;
    }

    var result = Stream(iterator())
      .filter(function(i) {
          return i % 2;
      })
      .toArray();

    assert.equal(result.length, 3);
    assert.equal(result[0], 1);
    assert.equal(result[1], 3);
    assert.equal(result[2], 5);
});
