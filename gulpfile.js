var gulp = require('gulp');
var config = require('./gulp.config')();
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
  utilities.log('Cleaning Less --> CSS');

  return gulp
    .src(config.less)
    .pipe($.less())
    .pipe($.plumber())
    .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
    .pipe(gulp.dest(config.temp));
});

gulp.task('clean-styles', function() {
  var files = config.temp + '**/*.css';
  utilities.clean(files);
});

gulp.task('wiredep', function() {
  var options = config.getWiredepDefaultOptions();
  var wiredep = require('wiredep').stream;
  var jsFiles = gulp.src(config.js);

  return gulp
    .src(config.index)
    .pipe(wiredep(options))
    .pipe($.inject(jsFiles))
    .pipe(gulp.dest(config.client));
});

gulp.task('less-watcher', function() {
    gulp.watch([config.less], ['styles']);
});
