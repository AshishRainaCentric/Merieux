const qualmap = require('../pages/qualmap');
/**
 *  The describe and it syntax is from the Jasmine framework.
 *  browser is a global created by Protractor, which is used
 *  for browser-level commands such as with browser.WaitForAngular
 */
const loginPage = require('../pages/login.js');

describe('Smoke Tests: QA user Login, Logout test', () => {

    it("Should login as QA User ", () => {
        qualmap.login();
        expect(loginPage.isLoggedIn()).toBeTruthy();
    });

    it("Should display dashboard", () => {
        qualmap.login();
        expect(qualmap.dashboard.chart.isDisplayed()).toBeTruthy();
    });

    it("Should logout", () => {
        qualmap.login();
        qualmap.logout();
        browser.ignoreSynchronization = true;
        expect(loginPage.lblToastAlert.getText()).toBe("Successfully logged out!");
        browser.ignoreSynchronization = false; // Important!
        expect(loginPage.isLoggedOut()).toBeTruthy();

    });

    it("Should display toast alert on logout ", () => {
        qualmap.login();
        qualmap.logout();
        browser.sleep(1000);
        browser.ignoreSynchronization = true;
        expect(loginPage.lblToastAlert.getText()).toBe("Successfully logged out!");
        browser.ignoreSynchronization = false; // Important!

    });
});
