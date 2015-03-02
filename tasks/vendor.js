'use strict';

var request = require('request');
var fs = require('fs');
var url = require('url');
var traverse = require('traverse');

module.exports = function (grunt) {
    grunt.registerTask('vendor', 'Grab latest vendor files', function () {
        var opts = grunt.config.get('vendor');
        var done = this.async();
        var keys = Object.keys(opts);
        var numDone = 0;

        var assets = traverse(opts).reduce(function (acc, x) {
            if (this.isLeaf) {
                acc.push(x);
            }

            return acc;
        }, []);

        var length = assets.length;

        function onReqDone () {
            numDone = numDone + 1;

            if (length === numDone) {
                done();
            }
        }

        function getFileName (file, lib) {
            var path = url.parse(file).path.split('/');
            var filename = path[path.length - 1];
            var dirpath = './public/vendor/' + lib;
            var filepath = dirpath + '/' + filename;

            grunt.file.mkdir(dirpath);

            return filepath;
        }

        function fetchAsset (file, lib) {
            var filepath = getFileName(file, lib);
            var req = request(file, grunt.log.writeln('Fetching: ' + file)).pipe(fs.createWriteStream(filepath));
            req.on('finish', onReqDone);
        }

        keys.forEach(function (key) {
            var val = opts[key];

            if (val instanceof Array) {
                val.forEach(function (file) { fetchAsset(file, key); });
            } else {
                fetchAsset(val, key);
            }
        });
    });
};
