'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['Gruntfile.js', '{conf,public,tasks,test}/**/*.js', 'app.js', 'index.js', '!public/vendor/**/*.js', '!public/js/vendor.js']
        },
        vendor: {
            pure: 'http://yui.yahooapis.com/pure/0.4.2/pure-min.css',
            html5shiv: 'http://html5shiv.googlecode.com/svn/trunk/html5.js'
        },
        concat: {
            js: {
                src: ['public/vendor/rainbow/rainbow.js', 'public/vendor/**/*.js'],
                dest: 'public/js/vendor.js'
            },
            css: {
                src: ['public/vendor/**/*.css'],
                dest: 'public/css/vendor.css'
            }
        },
        uglify: {
            js: {
                files: {
                    'public/js/vendor.js': ['public/js/vendor.js']
                }
            }
        }
    });

    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('assets', ['vendor', 'concat', 'uglify']);
};