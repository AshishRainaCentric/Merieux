/**
 * This file contains the configuration options passed to Protractor.
 * For details see Readme.md http://www.protractortest.org/#/tutorial

 // ---------------------------------------------------------------------------
 // ----- How to connect to Browser Drivers -----------------------------------
 // ---------------------------------------------------------------------------
 //

 // ---------------------------------------------------------------------------
 // ----- What tests to run ---------------------------------------------------
 // ---------------------------------------------------------------------------


 // ---------------------------------------------------------------------------
 // ----- How to set up browsers ----------------------------------------------
 // ---------------------------------------------------------------------------

 */
const log4js = require('log4js');

let SpecReporter = require('jasmine-spec-reporter').SpecReporter;
let AllureReporter = require('jasmine-allure-reporter');
let fs = require('fs');
let secret = require('./secrets');
let moment = require('moment');
let HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
let timeStamp;
timeStamp = moment().format("MMDDYY_HHmmss");

let reporter = new HtmlScreenshotReporter({
    preserveDirectory: true,//  each report will be created separate directory
    takeScreenshotsOnlyOnFailures: true,
    dest: 'target/',
    filename: timeStamp+'_shaman-report.html',
    //filePrefix: 'index -'+today,
    showSummary: true,
    showQuickLinks: true,
    showConfiguration: false
});

exports.config = {
    // ----- Connect to Browser Drivers ------------------------------------------
    // useBlockingProxy: true,
    // highlightDelay: 3000,
    // webDriverLogDir: 'logs',

    //debugMode: true,
    directConnect: true,
    //seleniumServer: webdriver-manager start

    // seleniumAddress: 'http://192.168.99.100:4444/wd/hub',
    // seleniumAddress: 'http://localhost:4444/wd/hub',
    // noGlobals: false,
    suites: {    },

    // Spec patterns are relative to the location of this config.
     specs:[
       'spec/*UI*.js',
       // 'spec/logis.selfTest.js'*/
      ],


    // ----- Set up browsers -----------------------------------------------------
    capabilities: {
        browserName: 'chrome',
        logName: 'Chrome',
        //shardTestFiles: true,
        //maxInstances: 5,
       //restartBrowserBetweenTests: true
       'loggingPrefs': {
         'driver': 'WARNING',
         'server': 'WARNING',
         'browser': 'INFO'
       }
    },
    params: {
        max_wait_for_notification_popup:4000,
        url: 'https://qa.qualmap.mxns.com/',
        userQA: secret.credentialsQA,
        browserWidth:1280,
        browserHeight:720
    },

    // ----- Set up Runner, reporters -----------------------------------------------------
    // TIMEOUTS
    // https://github.com/angular/protractor/blob/master/docs/timeouts.md
    getPageTimeout: 60000,         // Waiting for (Angular on) Page to Load

    // allScriptsTimeout: Before performing any action, Protractor waits until there are no pending asynchronous tasks
    // in your Angular application. This means that all timeouts and http requests are finished.
    allScriptsTimeout: 90000,      // Waiting for Asynchronous tasks

    // browser.ignoreSynchronization, // to disable waiting for Angular

    // resultJsonOutputFile:'result.json',
    // restartBrowserBetweenTests: true,

    framework: 'jasmine2',

    // Options to be passed to jasmine.
    // See https://github.com/jasmine/jasmine-npm/blob/master/lib/jasmine.js for the exact options available.
    jasmineNodeOpts: {
        showColors: true,  // If true, print colors to the terminal.
        isVerbose: true,
        realTimeFailure: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 45000,
        pageLoadTimeout:30000,
        print: function() {}, // Function called to print jasmine results. //Removes protractor dot reporter
    },

    // Setup the report before any tests start
    beforeLaunch: function() {

        if (fs.existsSync('./logs/ExecutionLog.log')) {
            fs.unlink('./logs/ExecutionLog.log')
        }
        log4js.configure({
            appenders: {
                qual: {
                    type: 'log4js-protractor-appender',
                    category: 'protractorLog4js',
                    filename: './logs/ExecutionLog.log'
                },
                console: {type: 'console'}
            },
            categories: {
                qual: {appenders: ['qual'], level: 'info'},
                default: {appenders: ['qual'], level: 'info'},

            }
        });

        return new Promise(function(resolve){
            reporter.beforeLaunch(resolve);
        });
    },

    onPrepare: function() {
        browser.logger = log4js.getLogger('protractorLog4js');

        jasmine.getEnv().addReporter(new AllureReporter({
            resultsDir: 'allure-results'
        }));

        jasmine.getEnv().addReporter(new SpecReporter({
            displayStacktrace: true,
            displayFailuresSummary: true,
            displayFailedSpec: true,
            displaySuiteNumber: true,
            displaySpecDuration: true,
              prefixes: {
                  success: ' 🍻  ' },
            customProcessors: [TimeProcessor]
        }));

    },

    // Close the report after all tests finish
    afterLaunch: function(exitCode) {
        return new Promise(function (resolve) {
            reporter.afterLaunch(resolve.bind(this, exitCode));
        })
    },

};


let DisplayProcessor = require('jasmine-spec-reporter').DisplayProcessor;

function TimeProcessor(configuration) {
}

function getTime() {
    var now = new Date();
    return now.getHours() + ':' +
        now.getMinutes() + ':' +
        now.getSeconds()
}

TimeProcessor.prototype = new DisplayProcessor();

TimeProcessor.prototype.displaySuite = function (suite, log) {
    return getTime() + ' - ' + log;
};

TimeProcessor.prototype.displaySuccessfulSpec = function (spec, log) {
    return getTime() + ' - ' + log;
};

TimeProcessor.prototype.displayFailedSpec = function (spec, log) {
    return getTime() + ' - ' + log;
};

TimeProcessor.prototype.displayPendingSpec = function (spec, log) {
    return getTime() + ' - ' + log;
};