'use strict';

// general
var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');

// images
var imagemin = require('gulp-imagemin');

// javascript
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

// sourcemaps
var sourcemaps = require('gulp-sourcemaps');

// environment flags
var env = 'dev'; // default
var gulpif = require('gulp-if');

//////////////////////////////////////////////////
// Variables
//////////////////////////////////////////////////

var sourceDir = 'public';
var destDir = 'dist';

var config = {
  jsSrcDir: sourceDir + '/js',
  imgSrcDir: sourceDir + '/assets'
};

//////////////////////////////////////////////////
// Base Tasks
//////////////////////////////////////////////////

gulp.task('build', function (cb) {
  runSequence('clean', ['scripts', 'images', 'copy'], cb);
});

gulp.task('deploy', function () {
  env = 'prod';
  gulp.start('build');
});

gulp.task('watch', ['build'], function () {
  gulp.watch(config.jsSrcDir+'/**/*.*', ['build']);
  gulp.watch(config.imgSrcDir+'/**/*.*', ['build']);
  gulp.watch(sourceDir+'/index.html', ['build']);
});

gulp.task('default', function () {
  console.log('');
  console.log('');
  console.log('To deploy for production, run "gulp build" or "gulp deploy"');
  console.log('- Sets up');
  console.log('  - Cleans dist folder');
  console.log('  - Generates final built files');
  console.log('');
  console.log('');
});

//////////////////////////////////////////////////
// Task Details
//////////////////////////////////////////////////

// Negated glob patterns with node-glob are tricky
// del (package) doesn't support the ignore pattern
// so we have to do some fun with negation to get it to
// work

gulp.task('clean', function () {
  return del(['dist/**/*']);
});

gulp.task('images', function () {
  var files = [
    config.imgSrcDir + '/**/*.*'
  ];

  return gulp.src(files)
    .pipe(imagemin())
    .pipe(gulp.dest(destDir + '/assets'));
});

gulp.task('scripts', function () {
  var files = [
    config.jsSrcDir + '/utils.js',
    config.jsSrcDir + '/consts.js',
    config.jsSrcDir + '/states/boot.js',
    config.jsSrcDir + '/states/preload.js',
    config.jsSrcDir + '/states/title.js',
    config.jsSrcDir + '/states/intro.js',
    config.jsSrcDir + '/states/battle.js',
    config.jsSrcDir + '/states/battle-audio.js',
    config.jsSrcDir + '/states/battle-input.js',
    config.jsSrcDir + '/states/battle-player.js',
    config.jsSrcDir + '/states/battle-enemies.js',
    config.jsSrcDir + '/states/defeat.js',
    config.jsSrcDir + '/states/victory.js'
  ];

  return gulp.src(files)
    .pipe(gulpif(env === 'dev', sourcemaps.init()))
    .pipe(concat('game.js'))
    .pipe(gulpif(env === 'dev', sourcemaps.write()))
    .pipe(gulpif(env === 'prod', uglify({compress: {drop_console: true}})))
    .pipe(gulp.dest(destDir + '/js'));
});

gulp.task('copy', function () {
  var files = ['public/lib/**/*', 'public/fonts/**/*', 'public/index.html'];

  gulp.src(files, { base: './public/'})
    .pipe(gulp.dest(destDir));
});
