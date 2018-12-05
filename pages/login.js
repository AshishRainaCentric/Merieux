/**
 * Created by Ashish Raina on 8/28/2016.
 */
const Page = require('astrolabe').Page;
const navbar = require('./navbar');
const until = protractor.ExpectedConditions;
const qualmap = require('../pages/qualmap');

module.exports = Page.create({
    // Assertions
    isUDisplayed: {
        // Like `get:` was for page fields, `value:` signifies a function for the page object.
        value: function () {
            return this.btnAcceptAgreement.isPresent();
        }
    },
    isLoginVisible: {
        value: function () {
            return this.btnLogin.isPresent();
        }
    },
    isLoggedOut: {
        value: function () {
            return this.btnLogin.isDisplayed();
        }
    },

    // Base actions
    logout: {
        value: function () {
            this.navbar.logout();
        }
    },
    goHome: {
        value: function () {
            this.navbar.goHome();
        }
    },
    go: {
        value: function () {
            this.navbar.go();
        }
    },

    // Base assertions
    isLoggedIn: {
        value: function () {
            return this.navbar.isLoggedIn();
        }
    },

    //Actions

    klick: {
        value: function (elem, logName) {
                elem.click().then(function () {
                    browser.logger.info('Performed click for  ', logName);
                }, function (err) {
                    browser.logger.warn('Failed to performed click for  ', logName);
                    expect(false).toBe(true);
                });
            }
    },

    url: {value: '/#/'},
    navbar: {
        get: function () {
            return navbar
        }
    },
    /**
     * returns Protractor ($) / Webdriver(FindElement) Page UI field objects
     * @return {Object} various Page UI Field Objects
     */

    btnLogin: {
        get: function () {
            return $('.md-primary');
        }
    },
    txtUsername: {
        get: function () {
            return $('#usernmid');
        }
    },
    txtPassword: {
        get: function () {
            return $('#pwd');
        }
    },
    // lblToastAlert:          { get: function () { return $('.md-toast-success').get(0); }},
    lblToastAlert: {
        get: function () {
            browser.sleep(1000);
            return $('.md-toast-open-bottom .md-toast-text');
        }
    },

    toastAlert: {
        value: function () {
            browser.sleep(1000);
            return this.lblToastAlert;
        }
    },

    // $('.md-toast-text').getText

// btnFindServicesInput:               { get: function () { return $$('[ng-model$="searchService.serviceTest"] input').get(0); }},

    /**
     * Login function for the page object.
     * @param {string=} opt_username
     * @param {string=} opt_password
     */
    login: {
        // Like `get:` was for page fields, `value:` signifies a function for the page object.
        // This is where the arguments for your page function are supplied.
        value: function (userObject) {
            // Astrolabe provides `this.driver`, which maps to the protractor instance.
            // With this code, successful logins can be shortened to `loginPage.login();`
            username = userObject === undefined ? this.driver.params.userQA.username : userObject.username;
            password = userObject === undefined ? this.driver.params.userQA.password : userObject.password;
            this.txtUsername.clear();
            browser.logger.info("Testing Log4js");
            this.txtUsername.sendKeys(username);
            this.txtPassword.clear();
            this.txtPassword.sendKeys(password);
            this.klick(this.btnLogin, "Login button");
            browser.wait(until.presenceOf(navbar.btnNavbarMenu), 20000, 'Navbar taking too long (>20 secs)to appear in the DOM');
            browser.logger.info('Displayed URL is:', browser.getCurrentUrl());
        }
    }



});
