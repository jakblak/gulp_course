var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: true});
var utilities = require('./utils');
var config = require('./gulp.config')();
var del = require('del');
var browserSync = require('browser-sync');

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

exports.startBrowserSync = function() {
  if(browserSync.active) {
    return;
  }
  utilities.log('Starting browser-sync on port ' + port);

  gulp.watch([config.less], ['styles'])
    .on('change', function(event) {
      utilities.changeEvent(event);
    });

  var options = {
    proxy: 'localhost: ' + port,
    port: 3000,
    files: [
      config.client + '**/*.*',
      '!' + config.less,
      config.temp + '**/*.css'
      ],
    ghostMode: {
      clicks: true,
      location: false,
      forms: true,
      scroll: true
    },
    injectChanges: true ,
    logFileChanges: true,
    logLevel: 'debug',
    logPrefix: 'gulp-patterns',
    notify: true,
    reloadDelay: 0 // 1000
  };

  browserSync(options);
};

exports.changeEvent = function(event){
  var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
  utilities.log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}