var $ = require('gulp-load-plugins')({lazy: true});
var utilities = require('./utils');
var del = require('del');

exports.log = function (msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
};

exports.clean = function (path, done) {
  utilities.log('Cleaning: ' + $.util.colors.blue(path));
  del(path, done);
};