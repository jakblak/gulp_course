var gulp = require('gulp');
var config = require('./gulp.config')();
var del = require('del');
var utilities = require('./utils');
var $ = require('gulp-load-plugins')({lazy: true});

gulp.task('vet', function() {
  return gulp
    .src(config.alljs)
    .pipe($.jscs())
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish', {
      verbose: true
    }))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('styles', ['clean-styles'], function(done) {
  utilities.logger('Cleaning Less --> CSS');
  return gulp
    .src(config.less)
    .pipe($.less())
    .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
    .pipe(gulp.dest(config.temp));
});

gulp.task('clean-styles', function() {
  var files = config.temp + '**/*.css';
  clean(files);
});


function clean(path, done) {
  utilities.logger('Cleaning: ' + $.util.colors.blue(path));
  del(path, done);
}

