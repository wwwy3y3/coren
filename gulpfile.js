const gulp = require('gulp');
const babel = require('gulp-babel');
const changed = require('gulp-changed');
const watch = require('gulp-watch');
const file = require('gulp-file');

const index = `
// ssr collector
exports.head = require('./client/ssr/head');
exports.headParams = require('./client/ssr/headParams');
exports.route = require('./client/ssr/route');
exports.routeParams = require('./client/ssr/routeParams');
exports.reduxStore = require('./client/ssr/reduxStore');
exports.preloadedState = require('./client/ssr/preloadedState');
exports.wrapDOM = require('./client/ssr/wrapDOM');
exports.wrapSSR = require('./client/ssr/wrapSSR');
exports.ssr = require('./client/ssr/ssr');

// collectors
exports.HeadCollector = require('./server/collectors/head-collector');
exports.ReduxCollector = require('./server/collectors/redux-collector');
exports.RoutesCollector = require('./server/collectors/routes-collector');
exports.ScriptCollector = require('./server/collectors/script-collector');
exports.StyleCollector = require('./server/collectors/style-collector');

// client
exports.collector = require('./client/collector-hoc');
`;

const argv = require('yargs').argv;
const path = require('path');

gulp.task('build', ['index'], () => {
  gulp.src(['server/*', 'server/**/*'])
    .pipe(babel())
    .pipe(gulp.dest('lib/server'));
  gulp.src('bin/*')
    .pipe(babel())
    .pipe(gulp.dest('lib/bin'));
  gulp.src(['client/*', 'client/**/*'])
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
    .on('error', console.error.bind(console))
    .pipe(gulp.dest('lib/server'));
  gulp.src('bin/*')
    .pipe(watch('bin/*'))
    .pipe(babel())
    .on('error', console.error.bind(console))
    .pipe(gulp.dest('lib/bin'));
  gulp.src(['client/*', 'client/**/*'])
    .pipe(watch(['client/*', 'client/**/*']))
    .pipe(babel())
    .on('error', console.error.bind(console))
    .pipe(gulp.dest('lib/client'));
  gulp.src('shared/*')
    .pipe(watch('shared/*'))
    .pipe(babel())
    .on('error', console.error.bind(console))
    .pipe(gulp.dest('lib/shared'));
});

gulp.task('index', () => {
  file('index.js', index)
    .pipe(gulp.dest('lib'));
  })
