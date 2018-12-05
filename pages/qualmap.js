// Base Page of application "Qualmap"

// import {ControlFlow as browser} from "selenium-webdriver";

const Page = require('astrolabe').Page,
    _ = require('lodash'),
    login = require('./login'),
    navbar = require('./navbar'),
    dashboard = require('./dashboard'),
    moment = require('moment'),
    path = require('path'),
    secrets = require('../secrets');

module.exports = Page.create({

    url: {value: browser.params.url},
    //API_TIMEOUT:  { value: 45000},
    SETUP_TIMEOUT: {value: 90000},
    DEFAULT_TIMEOUT_INTERVAL: {value: 90000},

    // UI components

    popupLoading: {
        get: function () {
            return $('.loading-dialog');
        }
    },

    navbar: {
        get: function () {
            return navbar;
        }
    },

    login: {
        get: function () {
            return login;
        }
    },

    dashboard: {
        get: function () {
            return dashboard;
        }
    },

    loginPage: {
        value: function () {
            return login;
        }
    },

    // Base actions
    // `get:` is for page fields, `value:` signifies a function for the page object.
    login: {
        value: function (userObject) {
            this.go();
            browser.driver.sleep(1000);
            //browser.driver.manage().window().maximize();
            browser.driver.manage().window().setSize(browser.params.browserWidth, browser.params.browserHeight);
            login.login();
        }
    },

    logout: {
        value: function () {
            navbar.logout();
            login.isLoggedOut();
        }
    },

    log: {
        value: function (msg) {
            console.log(msg);
        }
    },

    // Utility functions
    userQA: {
        get: function () {
            return browser.params.userAdmin;
        }
    },

    getCurrentDate: {
        get: function (format) {
            const _format = format || "DD MMM YYYY";
            return moment().format(_format)
        }
    },
    getCurrentDateTime: {
        get: function (format) {
            const _format = format || "YYYY MM DD";
            //2016-11-03T00:29:14.254+0530
            return moment().format(_format)
        }
    },

    getCallerFilePath: {
        get: function () {
            return arguments.callee.caller.arguments[2].id;
        }
    },
    getTestDataFilePath: {
        value: function () {
            const testFileFullPath = arguments.callee.caller.arguments[2].id;
            return "./" + path.basename(testFileFullPath, ".spec.js") + ".json";
        }
    },
    getSetupDataFilePath: {
        value: function () {
            const testFileFullPath = arguments.callee.caller.arguments[2].id;
            return "./" + path.basename(testFileFullPath, ".spec.js") + "_setup.json";
        }
    },
    getTestName: {
        value: function (testFileFullPath) {
            const _testFileFullPath = testFileFullPath || arguments.callee.caller.arguments[2].id;
            const name = path.basename(_testFileFullPath, ".spec.js");
            console.log(name);
            return name;
        }
    },

    scrollIntoView: {
        value: function (ele) {
            browser.executeScript('arguments[0].scrollIntoView()', ele.getWebElement());
        }
    },

    scrollToElement: {
        value: function (ele) {
            ele.getWebElement().getLocation()
                .then(function (location) {
                    return browser.executeScript('window.scrollTo(' + location.x + ', ' + location.y + ');')
                })
                .then(function () {
                    return ele.getWebElement().click();
                });
        }
    },

    waitUntilReady: {
        value: function (elm) {
            browser.wait(function () {
                return elm.isVisible();
            }, 10000);
            browser.wait(function () {
                return elm.isDisplayed();
            }, 10000);
        }
    },

    //Gets a random number between min and max
    getRandomNum: {
        value: function (min, max) {
            return parseInt(Math.random() * (max - min) + min);
        }
    },

    clickElement: {
        value: function (element, numberOfClicks) {
            numberOfClicks = numberOfClicks === undefined ? 1 : numberOfClicks;
            while (numberOfClicks) {
                element.click();
                numberOfClicks -= 1;
            }
        }
    },

    resetDb: {
        value: function () {
            var cmd = '"C:\\Users\\Ashish Raina\\Downloads\\apps\\putty.exe" -ssh dmin@10.151.100.59 -pw  -m "c:\\Users\\Ashish Raina\\Desktop\\cmd2.txt"';
            //var sys = require('util');
            var exec = require('child_process').execSync;
            var child;
            // executes `cmd`
            child = exec(cmd, function (error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
        }
    }

});
