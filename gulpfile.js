'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var autoprefixer = require('autoprefixer-core');
var pngquant = require('imagemin-pngquant');

var paths = {
    scripts: ['assets/**/*.js'],
    styles: ['assets/**/*.scss'],
    fonts: ['assets/font/*'],
    images: ['assets/img/*']
};

//Translate SASS to CSS
gulp.task('sass', function () {
  return gulp.src(paths.styles)
    .pipe($.sass().on('error', $.sass.logError))
    .pipe(gulp.dest('./assets'))
    .on('error', error($.util.log));
});

//Minify all CSS files
gulp.task('minify-css', function() {
  return gulp.src(paths.styles)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.postcss([ autoprefixer({ browsers: ['last 2 version'] }) ]))
    .pipe($.minifyCss())
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('./public'))
    .pipe($.filesize());
});

// Minify and copy all JavaScript (except vendor scripts)
gulp.task('minify-js', function() {
  return gulp.src(paths.scripts)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.uglify())
    .pipe($.concat('main.min.js'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('public/js'))
    .pipe($.filesize());
});

//Move fonts to the fonts directory
gulp.task('copy-fonts', function() {
  return gulp.src(paths.fonts)
    .pipe($.plumber())
    .pipe(gulp.dest('./public'))
    .pipe($.filesize())
});

//Optimize images and move them to the public folder
gulp.task('copy-images', function() {
  return gulp.src(paths.images)
    .pipe($.plumber())
    .pipe($.imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }))
    .pipe(gulp.dest('./public/img'));
});

//Watch the SCSS and scripts folder
gulp.task('watch', function () {
    gulp.watch(paths.styles, ['minify-css']);
    gulp.watch(paths.scripts, ['minify-js']);
    gulp.watch(paths.fonts, ['copy-fonts']);
    gulp.watch(paths.images, ['copy-images']);
});

//Default task
gulp.task('default', ['minify-css', 'minify-js', 'copy-fonts', 'copy-images']);
