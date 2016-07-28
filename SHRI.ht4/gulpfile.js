var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var clean = require("gulp-clean");

var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var vendors = [
    'node_modules/indexeddbshim/dist/indexeddbshim.min.js'
];

const clientPath = 'client-src';
const img = "images";
const clientDestPath = 'phonegap/www';
const resource = [
    `${clientPath}/**/*.{html,css}`,
    `${clientPath}/{${img},font,attachment}/*.*`
];
// Static server
gulp.task('browser-sync', function () {

});
gulp.task('vendor-copy', function() {
    return gulp.src(vendors)
        .pipe(gulp.dest(`${clientDestPath}/js/vendor`));
});
gulp.task('watch', function () {
    // browserSync.init({
    //     server: {
    //         baseDir: `./${clientDestPath}`
    //     }
    // });
    gulp.watch(`${clientPath}/**/*.js`, ['build-js']);
    gulp.watch(resource, ['resource']);
    gulp.watch(`${clientDestPath}/**/*.{html,js,css}`).on('change', browserSync.reload);
    gulp.watch(`${clientDestPath}/${img}/*.*`).on('change', browserSync.reload);
});
gulp.task('build-js', function () {
    return browserify({ entries: `${clientPath}/js/table-tv.js`, extensions: ['.js'], debug: true })
        .transform('babelify', { presets: ['es2015'] })
        .bundle()
        .on('error', function (err) {
            console.log(err.message);
            this.emit('end');
        })
        .pipe(source('table-tv.js'))
        .pipe(gulp.dest(`${clientDestPath}/js`));
});
gulp.task('resource', function () {
    return gulp.src(resource)
        .pipe(gulp.dest(`${clientDestPath}/`));
});
gulp.task('default', ['build-js', 'resource', 'vendor-copy']);
gulp.task('clean', function () {
    return gulp.src(`${clientDestPath}`)
        .pipe(clean());
});
