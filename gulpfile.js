var argv = require('yargs').argv,
    babel = require('gulp-babel'),
    del = require('del'),
    eslint = require('gulp-eslint'),
    gulp = require('gulp'),
    gulpif = require('gulp-if'),
    notifier = require('node-notifier'),
    plumber = require('gulp-plumber'),
    relativeSourcemapsSource = require('gulp-relative-sourcemaps-source'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    path = require('path'),
    run = require('run-sequence');

// Do not stop gulp.watch after the first  build error
var _gulpsrc = gulp.src;
gulp.src = function () {
  return _gulpsrc.apply(gulp, arguments)
      .pipe(plumber({
        errorHandler: function (error) {
          var title = error.name + ' from ' + error.plugin;
          notifier.notify({
            title: title,
            message: error.message
          });
          gutil.log(gutil.colors.red(title), error.message);
          gutil.beep();
          this.emit('end');
        }
      }));
};

gulp.task('clean-node', function () {
  return del(['dist/node']);
});

gulp.task('eslint-node', function () {
  return gulp.src(['src/**/*.js', '!src/browser/**/*.js', 'gulpfile.js'])
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
});

gulp.task('babel-node', function () {
  return gulp.src(['src/**/*.js', '!src/browser/**/*.js'])
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(gulpif(argv.release, uglify().on('error', gutil.log)))
      .pipe(relativeSourcemapsSource({dest: 'dist/node'}))
      .pipe(sourcemaps.write('.', {
        includeContent: false,
        sourceRoot: '.'
      }))
      .pipe(gulp.dest('dist/node'));
});

gulp.task('watch-node-assets', function () {
  gulp.watch(['src/**/*.js', '!src/browser/**/*.js'],
      ['eslint-node', 'babel-node']);
});

gulp.task('clean', ['clean-node']);

gulp.task('build-node', function (done) {
  run('clean-node', 'eslint-node', 'babel-node', done);
});
gulp.task('build', ['build-node']);

gulp.task('watch-node', function (done) {
  run('clean-node', 'eslint-node', 'babel-node',
      'watch-node-assets', done);
});

gulp.task('default', ['build']);
