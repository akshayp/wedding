'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        vendor: {
            pure: 'http://yui.yahooapis.com/pure/0.5.0/pure-min.css',
            puregrids: 'http://yui.yahooapis.com/pure/0.5.0/grids-responsive-min.css',
            html5shiv: 'http://html5shiv.googlecode.com/svn/trunk/html5.js',
            zepto: 'http://zeptojs.com/zepto.min.js',
            mapbox: 'https://api.tiles.mapbox.com/mapbox.js/v2.0.0/mapbox.js',
            mapboxcss: 'https://api.tiles.mapbox.com/mapbox.js/v2.0.0/mapbox.css'
        },
        concat: {
            js: {
                src: ['public/vendor/**/*.js'],
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
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('assets', ['vendor', 'concat', 'uglify']);
};
