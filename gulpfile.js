const gulp = require('gulp');
const pug = require('gulp-pug');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync');

// sass + postcss plugins
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const lost = require('lost')
const cssnano = require('cssnano');

// Starts server, live reload
gulp.task('serve', function() {
	browserSync({
		server: {
			baseDir: "dist",
		}
	});
});

// Compiles pug
gulp.task('pug', function() {  
	return gulp.src('src/pug/*.pug')
	.pipe(pug()) 
	.pipe(gulp.dest('dist')) 
	.pipe(browserSync.reload({stream:true}));
});

// Postcss plugins + output sass styles to css. Creates sourcemap
gulp.task('styles', function() {
	

	// PostCSS plugins
	var processors = [
		autoprefixer({browsers: ['last 1 version']}),
		cssnano(),
		lost(),
	];

	// Compile Sass, Pipe out CSS
	return gulp.src('src/sass/styles.scss')
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(sass({ includePaths: require('node-normalize-scss').includePaths}))
	.pipe(postcss(processors))
	.pipe(sourcemaps.write('maps', {sourceRoot: '/src/sass'}))
	.pipe(gulp.dest('dist/css'))
	.pipe(browserSync.reload({stream:true}));

});

// Compiles + minifies all local javascript files. Creates sourcemap
gulp.task('js', function() {
	gulp.src([
		'node_modules/jquery/dist/jquery.js',
		'src/js/*.js'

		])
	.pipe(sourcemaps.init({largeFile: true}))
	.pipe(uglify())
	.pipe(concat('main.js'))
        .pipe(sourcemaps.write('maps', {sourceRoot: '/src/js'})) // includeContent: false, 
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({stream:true}));
    });

// Optimizes images
gulp.task('images', function(){
	gulp.src('src/imgs/*')
	.pipe(imagemin())
	.pipe(gulp.dest('dist/imgs'))
	.pipe(browserSync.reload({stream:true}));
});


// Watches files for any updates
gulp.task('watch', function () {
	gulp.watch('src/pug/*.pug', ['pug']);
	gulp.watch('src/sass/*.scss', ['styles']);
	gulp.watch('src/js/*.js', ['js']);
	gulp.watch('src/images/*', ['images']);
});


// Run all tasks with 'gulp' on command line
gulp.task('default',['pug', 'styles', 'js', 'images', 'serve', 'watch']);
