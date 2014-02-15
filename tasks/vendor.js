'use strict';

module.exports = function (grunt) {

    /*jshint unused: false */
    grunt.registerTask('vendor', 'Grab latest vendor files', function () {
        var opts = grunt.config.get('vendor'),
            done = this.async(),
            keys = Object.keys(opts),
            request = require('request'),
            fs = require('fs'),
            url = require('url'),
            traverse = require('traverse'),
            numDone = 0,
            assets, length;

        assets = traverse(opts).reduce(function (acc, x) {
            if (this.isLeaf) {
                acc.push(x);
            }

            return acc;
        }, []);

        length = assets.length;

        function onReqDone(e) {
            numDone = numDone + 1;

            if (length === numDone) {
                done();
            }
        }

        function fetchAsset(file, lib, done) {
            var filepath = getFileName(file, lib),
                req;

            req = request(file, grunt.log.writeln('Fetching: ' + file)).pipe(fs.createWriteStream(filepath));
            req.on('finish', onReqDone);
        }

        function getFileName(file, lib) {
            var path = url.parse(file).path.split('/'),
                filename = path[path.length - 1],
                dirpath = './public/vendor/' + lib,
                filepath = dirpath + '/' + filename;

            grunt.file.mkdir(dirpath);

            return filepath;
        }


        keys.forEach(function (key) {
            var val = opts[key];

            if (val instanceof Array) {
                val.forEach(function (file) { fetchAsset(file, key, done); });
            } else {
                fetchAsset(val, key, done);
            }
        });
    });
};