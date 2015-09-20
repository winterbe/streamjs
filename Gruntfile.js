module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! Stream.js v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>) */',
                sourceMap: true,
                sourceMapName: 'stream-min.map'
            },
            dist: {
                files: {
                    'stream-min.js': ['stream.js']
                }
            }
        },
        qunit: {
            files: ['test/index.html']
        },
        eslint: {
            target: ['stream.js', 'test']
        }
    });

    grunt.registerTask('test', ['eslint', 'qunit']);
    grunt.registerTask('default', ['eslint', 'qunit', 'uglify']);
};
