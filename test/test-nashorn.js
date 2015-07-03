// manually run this file via terminal:
//
// jjs test-nashorn.js

load('../stream.js');

var list = new java.util.ArrayList();
list.add(1);
list.add(2);
list.add(3);

Stream(list)
    .filter(function (num) {
        return num % 2 === 1;
    })
    .forEach(function (num) {
        print(num);
    });