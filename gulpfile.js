var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var mainBowerFiles = require('main-bower-files');
var templateCache = require('gulp-angular-templatecache');
var clean = require("gulp-clean");
var run = require('gulp-run');
var sourcemaps = require('gulp-sourcemaps');


var paths = {
  appStyles: ['./app/styles/**/*.scss', './app/styles/**/*.css','./lib/jquery-ui/themes/base/all.css'],
  vendorStyles: ['./lib/ionic/scss/ionic.scss','./external/jQueryComps/jquery-ui.css'],
  appScripts: ['./app/js/**/*.js'],
  vendorScripts : ['./external/jQueryComps/jquery-ui.min.js','./external/jQueryComps/jquery.signature.js','./external/jQueryComps/jquery.ui.touch-punch.js'],
  fonts: ['./lib/ionic/fonts/ionicons.*','./app/fonts/**/*.otf','./app/fonts/**/*.ttf'],
  templates: ['app/templates/**/*.html'],
  images: ['./app/img/**/*.*']
};

/* compiles all ionic or other framework relates styles to vendor.css */
gulp.task('vendor-styles', function (done) {
  gulp.src(paths.vendorStyles)
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({ keepSpecialComments: 0 }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

/* compiles all app related styles to styles.css*/
gulp.task('app-styles', function (done) {
  gulp.src(paths.appStyles)
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({ keepSpecialComments: 0 }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

/* compiles all vendor scripts - frameworks & plugins to vendors.js*/
gulp.task('vendor-scripts', function () {
  var bowerFiles = mainBowerFiles({ filter: new RegExp('.*js$', 'i') });
  var vendorScripts = bowerFiles.concat(paths.vendorScripts) 
  return gulp.src(vendorScripts)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('www/js'))
});

/* compiles all app scripts - frameworks & plugins to app.js*/
gulp.task('app-scripts', function () {
  return gulp.src(paths.appScripts)
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('www/js'))
});



/* compiles all app scripts app.js*/
gulp.task('templates', function () {
  gulp.src(paths.templates)
    .pipe(templateCache({ standalone: false, module: 'beam' }))
    .pipe(gulp.dest('www/js/'));
});

/*copies fonts to css/fonts*/
gulp.task('fonts', function () {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('www/fonts/'));
});

/*copies images*/
gulp.task('images', function () {
  return gulp.src(paths.images)
    .pipe(gulp.dest('www/img/'));
});

/*watches to re run tasks upon changes*/
gulp.task('watch', function () {
  gulp.watch(paths.appStyles, ['app-styles']);
  gulp.watch(paths.appScripts, ['app-scripts']);
  gulp.watch(paths.templates, ['templates']);
});

/*cleans up*/
gulp.task('clean', function () {
  return gulp.src(['www/css/*.css', 'www/fonts/*.*', 'www/js/*.*', 'www/img/'], { read: false }).pipe(clean());
});

/*default*/
gulp.task('default', ['vendor-styles', 'app-styles', 'vendor-scripts', 'app-scripts', 'fonts', 'templates', 'images']);

gulp.task('android', function () {
  run('mfp cordova emulate -p android')
})

