module.exports = function (grunt) {

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
        jshint: {
            files: ['stream.js', 'test/**/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'qunit']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('test', ['jshint', 'qunit']);
    grunt.registerTask('default', ['jshint', 'qunit', 'uglify']);
};