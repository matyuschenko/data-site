var gulp = require('gulp'),
    pug = require('gulp-pug'),
    browserSync = require('browser-sync').create(),
    buildFolder = './build',
    sourceFolder = './source';

gulp.task('pug', function () {
    return gulp.src(sourceFolder + '/template/pages/*.pug')
        .pipe(pug())
        .pipe(gulp.dest(buildFolder))
})

gulp.task('serve', function () {
    browserSync.init({
        server: buildFolder
    });

    browserSync.watch(buildFolder + '/*.*').on('change', browserSync.reload);
})

gulp.task('watch', function () {
    gulp.watch(sourceFolder + '/template/**/*.pug', gulp.series('pug'));
})

gulp.task('default', gulp.series(
    'pug',
    gulp.parallel(
        'watch',
        'serve',
        'reload'
    )
))