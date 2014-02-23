/*
|--------------------------------------------------------------------------
| Dependencies
|--------------------------------------------------------------------------
*/
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr();

/*
|--------------------------------------------------------------------------
| Html
|--------------------------------------------------------------------------
*/
gulp.task('html', function() {
  return gulp.src('*.html')  
    .pipe(livereload(server))
    .pipe(notify({ message: 'HTML task complete' }));
});

/*
|--------------------------------------------------------------------------
| Styles
|--------------------------------------------------------------------------
*/
gulp.task('styles', function() {
  return gulp.src('scss/main.scss')
    .pipe(sass({ style: 'expanded', }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(livereload(server))
    .pipe(gulp.dest('css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

/*
|--------------------------------------------------------------------------
| JavaScript
|--------------------------------------------------------------------------
*/
gulp.task('scripts', function() {
  return gulp.src('js/main.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(livereload(server))
    .pipe(gulp.dest('js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

/*
|--------------------------------------------------------------------------
| Images
|--------------------------------------------------------------------------
*/
gulp.task('images', function() {
  return gulp.src('img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(livereload(server))
    .pipe(gulp.dest('img'))
    .pipe(notify({ message: 'Images task complete' }));
});

/*
|--------------------------------------------------------------------------
| Cleanup
|--------------------------------------------------------------------------
*/
gulp.task('clean', function() {
  return gulp.src(['html', 'styles', 'scripts', 'images'], {read: false})
    .pipe(clean());z
});

/*
|--------------------------------------------------------------------------
| Watch
|--------------------------------------------------------------------------
*/
gulp.task('watch', function() {
  return server.listen(35729, function (err) {
    if (err) return console.log(err);
    gulp.watch('*.html', ['html']);
    gulp.watch('scss/**/*.scss', ['styles']);
    gulp.watch('js/*.js', ['scripts']);
  });
});

/*
|--------------------------------------------------------------------------
| Default
|--------------------------------------------------------------------------
*/
gulp.task('default', ['clean'], function() {
    gulp.start('html', 'styles', 'scripts', 'watch');
});