const { series, watch, src, pipe, dest } = require('gulp');
const path = require('path');
const webpack = require('webpack-stream');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const ts = require('gulp-typescript');
const uglify = require('gulp-uglify');
const pipeline = require('readable-stream').pipeline;
const wait = require('gulp-wait');

var tsProject = ts.createProject('tsconfig.core.json');

async function makeGlobal(cb) {
  return tsProject.src()
    .pipe(tsProject())
    .pipe(dest("dist"))
}

async function makeModule(cb) {
  return src('./dist/liefs-layout-managerV3.0.0.GLOBALS.full.js')
    .pipe(concat('./ts/_makeExports.txt'))
    .pipe(rename('liefs-layout-managerV3.0.0.full.module.js'))
    .pipe(dest('./dist'));
};

async function copyDeclare(cb) {
  return src('./dist/liefs-layout-managerV3.0.0.GLOBALS.full.d.ts')
    .pipe(dest('./dist/declarations'));
};

async function deleteDeclare(cb) {
  return src('./dist/liefs-layout-managerV3.0.0.GLOBALS.full.d.ts')
    .pipe(wait(1500))
    .pipe(clean());
};

async function makeScoped(cb) {
  return src('./dist/liefs-layout-managerV3.0.0.full.module.js')
    .pipe(webpack({
      mode: 'development',
    }))
    .pipe(rename('liefs-layout-managerV3.0.0.SCOPED.full.js'))
    .pipe(dest('./dist'));
};

async function minify(cb) {
  return src('./dist/*.full.js')
      .pipe(uglify())
      .pipe(rename({
        extname: ".min.js"
      }))
      .pipe(dest('./dist'));
}

async function watchTS(cb) {
  watch('ts/*.ts', series(makeGlobal));
}

exports.makeGlobal = makeGlobal;
exports.makeModule = makeModule;
// exports.copyDeclare = copyDeclare;
// exports.deleteDeclare = deleteDeclare;
exports.makeScoped = makeScoped;
exports.minify = minify;
// exports.watch = watchTS;
// exports.move = series(copyDeclare, deleteDeclare);
exports.default = series(makeGlobal, makeModule, makeScoped, minify);

