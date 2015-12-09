var gulp = require('gulp');
var config = require('./gulp.config')();
var utilities = require('./utils');
var del = require('del');
var $ = require('gulp-load-plugins')({lazy: true});
var port = process.env.PORT || config.defaultPort;

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

gulp.task('vet', function() {
  utilities.log('Checking for JS syntax issues');
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
    .pipe($.autoprefixer({
      browsers: ['last 2 version', '> 5%']
    }))
    .pipe(gulp.dest(config.temp));
});

gulp.task('fonts', ['clean-fonts'], function() {
  utilities.log('Copying fonts ');
  return gulp
    .src(config.fonts)
    .pipe(gulp.dest(config.build + 'fonts'));
});

gulp.task('images', ['clean-images'], function() {
  utilities.log('Copying & compressing the images ');
  return gulp
    .src(config.images)
    .pipe($.imagemin({optimizationLevel: 4}))
    .pipe(gulp.dest(config.build + 'images'));
});

gulp.task('clean', function(done) {
  var delconfig = [].concat(config.build, config.temp);
  utilities.log('Cleaning: ' + $.util.colors.blue(delconfig));
  del(delconfig, done);
});

gulp.task('clean-fonts', function(done) {
  utilities.clean(config.build + 'fonts/**/*.*', done);
});

gulp.task('clean-images', function(done) {
  utilities.clean(config.build + 'images/**/*.*', done);
});

gulp.task('clean-styles', function(done) {
  utilities.clean(config.temp + '**/*.css', done);
});

gulp.task('wiredep', function() {
  utilities.log('Add bower css, jss and app js files into index.html');
  var options = config.getWiredepDefaultOptions();
  var wiredep = require('wiredep').stream;
  var jsFiles = gulp.src(config.js);

  return gulp
    .src(config.index)
    .pipe(wiredep(options))
    .pipe($.inject(jsFiles))
    .pipe(gulp.dest(config.client));
});

gulp.task('inject', ['wiredep', 'styles'], function() {
  utilities.log('Wire up the app css into the html, and call wiredep ');
  return gulp
    .src(config.index)
    .pipe($.inject(gulp.src(config.css)))
    .pipe(gulp.dest(config.client));
});

gulp.task('serve-dev', ['inject'], function() {
  var isDev = true;
  var nodeOptions = {
    script: config.nodeServer,
    delayTime: 1,
    env: {
      'PORT': port,
      'NODE_ENV': isDev ? 'dev' : 'build'
    },
    watch: [config.server]
  };

  return $.nodemon(nodeOptions)
    .on('restart', function(ev) {
      utilities.log('*** files changed on restart:\n' + ev);
    })
    .on('start', function() {
      utilities.log('*** nodemon started');
      // utilities.startBrowserSync();
    });

});