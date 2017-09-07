var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var es = require('event-stream');

gulp.task('nodemon', function(cb){
  var called = false;
  return nodemon({
    script: 'app.js',
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ]
  })
  .on('start', function(){
    if(!called){
      called = true;
      cb();
    }
  })
  .on('restart', function(){
    setTimeout(function(){
      reload({stream: false});
    }, 1000);
  })
});

gulp.task('browser-sync', ['nodemon'], function(){
  browserSync({
    proxy: "localhost:3000",
    port: 5000,
    notify: true
  });
});

gulp.task('sass', function(){
  return gulp.src('public/sass/**/*.scss')
  .pipe(sass())
  .pipe(cssnano())
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('public/css'))
  .pipe(browserSync.reload({
    stream: true
  }));
});

gulp.task('watch', ['browser-sync', 'sass'], function(){
  gulp.watch('public/*.html', reload);
  gulp.watch('public/sass/**/*.scss', ['sass']);
  gulp.watch('public/js/**/*.js', reload);
  gulp.watch('./views/**/*.ejs', reload);
});


gulp.task('dist', function(){
  return es.merge(
    gulp.src('app.js').pipe(gulp.dest('dist/')),
    gulp.src('package.json').pipe(gulp.dest('dist/')),
    gulp.src('views/**/*').pipe(gulp.dest('dist/views/')),
    gulp.src('public/css/**/*').pipe(gulp.dest('dist/public/css/')),
    gulp.src('public/js/**/*').pipe(gulp.dest('dist/public/js/')),
    gulp.src('public/images/**/*').pipe(gulp.dest('dist/public/images/'))
  );
});
