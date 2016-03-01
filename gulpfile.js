var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var del = require('del');
var runSequence = require('run-sequence');

//const
var assets_url = 'app/assets';

gulp.task('sass', function(){
	return gulp.src(assets_url + '/scss/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest(assets_url + '/css'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('watch',['browserSync', 'sass'], function(){
	gulp.watch(assets_url + '/scss/**/*.scss', ['sass']);
	gulp.watch('app/**/*.html', browserSync.reload);
	gulp.watch('app/**/*.js', browserSync.reload);
});

gulp.task('browserSync', function(){
	browserSync.init({
		server: {
			baseDir: 'app'
		},
		port: 8080
	});
});

gulp.task('useref', function(){
	gulp.src('app/*.html')
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('dist'));
});

gulp.task('fonts', function(){
	return gulp.src(assets_url + '/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('components:html', function(){
	return gulp.src('app/components/**/*.html')
		.pipe(gulp.dest('dist/components'));
});

gulp.task('clean:dist', function(){
	return del.sync('dist');
});

gulp.task('build', function(callback){
	runSequence('clean:dist', ['sass', 'useref', 'fonts', 'components:html'], callback);
});

gulp.task('default', function(callback){
	runSequence(['sass', 'browserSync', 'watch'], callback);
});
