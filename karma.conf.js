module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', "karma-typescript"],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
			require('karma-coverage-istanbul-reporter'),
			require('karma-typescript')
		], 
		files: [
			"src/**/*.ts"
		],
		exclude: [
			'node_modules'
		],
		preprocessors: {
			"src/**/*.ts": ['karma-typescript'],
			"src/**/*.spec.ts": ['karma-typescript']
		},
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml', /*'coverage-istanbul'*/], //	uncomment to get coverage info
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    singleRun: false,
    restartOnFileChange: true
  });
};
