// Karma configuration
// Generated on Fri May 30 2014 15:44:45 GMT-0400 (EDT)

module.exports = function (config) {
  const configuration = {
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "",

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["mocha", "sinon-chai"],

    // list of files / patterns to load in the browser
    files: [
      "node_modules/leaflet/dist/leaflet.css",
      "node_modules/leaflet/dist/leaflet-src.js",
      "node_modules/esri-leaflet/dist/esri-leaflet-debug.js",
      "dist/esri-leaflet-vector-debug.js",
      "spec/**/*Spec.js",
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      "dist/**/*.js": ["sourcemap", "coverage"],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["mocha", "coverage"],

    // web server port
    port: 9876,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ["Chrome1280x1024"],

    customLaunchers: {
      Chrome1280x1024: {
        base: "ChromeHeadless",
        // increased viewport is required for some tests (TODO fix tests)
        // https://github.com/Leaflet/Leaflet/issues/7113#issuecomment-619528577
        flags: ["--window-size=1280,1024"],
      },
      FirefoxTouch: {
        base: "FirefoxHeadless",
        prefs: {
          "dom.w3c_touch_events.enabled": 1,
        },
      },
      FirefoxNoTouch: {
        base: "FirefoxHeadless",
        prefs: {
          "dom.w3c_touch_events.enabled": 0,
        },
      },
    },

    concurrency: 1,

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // Timeout for the client socket connection [ms].
    browserSocketTimeout: 30000,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    client: {
      mocha: {
        forbidOnly: process.env.CI || false,
      },
    },

    // Configure the coverage reporters
    coverageReporter: {
      reporters: [
        {
          type: "html",
          dir: "coverage/",
        },
        {
          type: "text",
        },
      ],
    },
  };

  config.set(configuration);
};
