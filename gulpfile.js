var gulp = require('gulp'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    buildFolder = './build',
    sourceFolder = './source';

gulp.task('data', function () {
    return gulp.src('./data/*.*')
        .pipe(gulp.dest(buildFolder + '/data'))
});

gulp.task('pug', function () {
    return gulp.src(sourceFolder + '/template/pages/*.pug')
        .pipe(pug())
        .pipe(gulp.dest(buildFolder))
});

gulp.task('sass', function () {
    return gulp.src(sourceFolder + '/style/app.scss')
        .pipe(sass())
        .pipe(autoprefixer({ browsers: ['last 3 version', '> 1%', 'ie 8', 'ie 9', 'Opera 12.1'] }))
        .pipe(gulp.dest(buildFolder + '/css'))
});

gulp.task('js', function () {
    return gulp.src(sourceFolder + '/js/*.js')
        .pipe(gulp.dest(buildFolder + '/js'))
})

gulp.task('serve', function () {
    browserSync.init({
        server: buildFolder
    });

    browserSync.watch(buildFolder + '/**/*.*', browserSync.reload);
});

gulp.task('watch', function () {
    gulp.watch(sourceFolder + '/template/**/*.pug', gulp.series('pug'));
    gulp.watch(sourceFolder + '/style/**/*.scss', gulp.series('sass'));
    gulp.watch(sourceFolder + '/js/**/*.js', gulp.series('js'));
});

gulp.task('default', gulp.series(
    'data',
    'pug',
    'sass',
    'js',
    gulp.parallel(
        'watch',
        'serve'
    )
));