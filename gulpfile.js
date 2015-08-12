var gulp = require('gulp'),
	mocha = require('gulp-mocha'),
	eslint = require('gulp-eslint'),
	uglify = require('gulp-uglify'),
	sourcemaps = require('gulp-sourcemaps'),
	rename = require('gulp-rename'),
	jsonminify = require('gulp-jsonminify');

gulp.task('lint', function() {
	return gulp.src(['src/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

gulp.task('test', ['lint'], function() {
	return gulp.src(['test/*.js'], { read: false })
		.pipe(mocha({ reporter: 'spec' }));
});

gulp.task('compress-js', ['clean'], function() {
	return gulp.src(['src/touton.js'])
		.pipe(gulp.dest('dist'))
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(rename('touton.min.js'))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('dist'));
});

gulp.task('compress-json', ['clean'], function() {
	return gulp.src(['src/operators.json'])
		.pipe(rename('operators.min.json'))
		.pipe(jsonminify())
		.pipe(gulp.dest('dist'));
})

gulp.task('copy-static-content', ['clean'], function() {
	return gulp.src(['src/**/*.html', 'src/**/*.css'])
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['lint', 'test', 'clean', 'compress-js', 'compress-json', 'copy-static-content']);