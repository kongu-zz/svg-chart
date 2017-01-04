var webpackConfig = require('./webpack-karma.config');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'test/**/*.ts',
      'test/**/*.tsx'
    ],
    exclude: [
    ],
    preprocessors: {
      'test/**/*.ts': ['webpack'],
      'test/**/*.tsx': ['webpack']
    },
    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve,
      externals: webpackConfig.externals
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    concurrency: Infinity
  })
}