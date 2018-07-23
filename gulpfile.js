const gulp = require('gulp'),
    sass = require('gulp-sass'),
    filter = require('gulp-filter'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    imageResize = require('gulp-image-resize'),
    pump = require('pump');

const config = {
    stylesPath: 'styles/sass',
    jsPath: 'styles/js',
    imagesPath: 'images',
    outputDir: 'assets'
};

gulp.task('site-images', function (cb) {
    pump([
        gulp.src(config.imagesPath + '/*'),
        imageResize({
            width : 1000,
            height : 1000,
            crop : false,
            upscale : false
        }),
        gulp.dest(config.outputDir + '/images')
    ], cb);
});

gulp.task('style-images', function (cb) {
    pump([
        gulp.src(config.imagesPath + '/style/*'),
        imagemin(),
        gulp.dest(config.outputDir + '/images/style')
    ], cb);
});

gulp.task('images', gulp.parallel('site-images', 'style-images'));

gulp.task('fa-css', function (cb) {
    pump([
        gulp.src('./node_modules/@fortawesome/fontawesome-pro/css/all.css'),
        concat('font-awesome.css'),
        gulp.dest(config.outputDir + '/css')
    ], cb);
});

gulp.task('fa-fonts', function (cb) {
    pump([
        gulp.src('./node_modules/@fortawesome/fontawesome-pro/webfonts/*'),
        gulp.dest(config.outputDir + '/webfonts')
    ], cb);
});

gulp.task('fa', gulp.parallel('fa-css', 'fa-fonts'));

gulp.task('css', function (cb) {
    pump([
        gulp.src(config.stylesPath + '/**/*.scss'),
        sass({
            outputStyle: 'compressed',
            includePaths: [
                config.stylesPath,
            ]
        }).on('error', sass.logError),
        autoprefixer(),
        gulp.dest(config.outputDir + '/css')
    ], cb);
});

gulp.task('fonts', function (cb) {
    pump([
        gulp.src(config.stylesPath + '/fonts/*'),
        gulp.dest(config.outputDir + '/fonts')
    ], cb);
});

gulp.task('js', function (cb) {
    pump([
            gulp.src(config.jsPath + '/*'),
            filter('**/*.js'),
            uglify(),
            gulp.dest(config.outputDir + '/js')
        ],
        cb
    );
});


gulp.task('watch', function () {
    gulp.watch([config.stylesPath + '**/*.scss', config.stylesPath + '**/*.sass', config.stylesPath + '**/*.css'], ['css']);
    gulp.watch([config.jsPath + '**/*.js'], ['js']);
    gulp.watch([config.imagesPath + '/**/*'], ['images']);
});

gulp.task('build', gulp.parallel('images', 'css', 'fa', 'js'));

gulp.task('default', gulp.parallel('build'));
