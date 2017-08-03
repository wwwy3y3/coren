const gulp = require('gulp');
const babel = require('gulp-babel');
const changed = require('gulp-changed');
const watch = require('gulp-watch');
const file = require('gulp-file');

const index = `
// Application
exports.App = require('./server/app');
// ssr renderer
exports.SingleRouteRenderer = require('./server/ssrRenderers/singleRoute');
exports.MultiRoutesRenderer = require('./server/ssrRenderers/multiRoutes');

// collectors
exports.HeadCollector = require('./server/collectors/headCollector');
exports.ReduxCollector = require('./server/collectors/reduxCollector');
exports.RoutesCollector = require('./server/collectors/routesCollector');
exports.ScriptCollector = require('./server/collectors/scriptCollector');
exports.StyleCollector = require('./server/collectors/styleCollector');

// client
exports.collector = require('./client/collectorHoc');
`;

gulp.task('build', ['index'], () => {
  gulp.src(['server/*', 'server/**/*'])
    .pipe(babel())
    .pipe(gulp.dest('lib/server'));
  gulp.src('bin/*')
    .pipe(babel())
    .pipe(gulp.dest('lib/bin'));
  gulp.src('client/*')
    .pipe(babel())
    .pipe(gulp.dest('lib/client'));
  gulp.src('shared/*')
    .pipe(babel())
    .pipe(gulp.dest('lib/shared'));
});

gulp.task('build:watch', ['index'], () => {
  gulp.src(['server/*', 'server/**/*'])
    .pipe(watch(['server/*', 'server/**/*']))
    .pipe(babel())
    .pipe(gulp.dest('lib/server'));
  gulp.src('bin/*')
    .pipe(watch('bin/*'))
    .pipe(babel())
    .pipe(gulp.dest('lib/bin'));
  gulp.src('client/*')
    .pipe(watch('client/*'))
    .pipe(babel())
    .pipe(gulp.dest('lib/client'));
  gulp.src('shared/*')
    .pipe(watch('shared/*'))
    .pipe(babel())
    .pipe(gulp.dest('lib/shared'));
});

gulp.task('index', () => {
  file('index.js', index)
    .pipe(gulp.dest('lib'));
  })
