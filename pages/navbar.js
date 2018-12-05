/**
 * Created by Ashish Raina on 8/28/2016.
 */
var _ = require('lodash'),
    Page = require('astrolabe').Page;

module.exports = Page.create({
    url: {value: browser.params.url},

    // UI elements
    btnNavbarMenu: {
        get: function () {
            return $('.header-menu-button button')
        }
    },
    // btnFilterDrawer: { get: function () { return $('[aria-label="Filter Drawer"]'); }},
    lblFullName: {
        get: function () {
            return $('.side-nav-username')
        }
    },
    btnUserMenu: {
        get: function () {
            return $('md-icon[role="button"]')
        }
    },

    btnSignOut: {
        get: function () {
            return $('button[aria-label="Sign Out"]')
        }
    },

    btnHelpAndSupport: {
        get: function () {
            return $('button[aria-label="Help & Support"]')
        }
    },



    // Notifications / popups
    eleNotification: {
        get: function () {
            return $('.ui-pnotify-text');
        }
    },
    btnCloseNotification: {
        get: function () {
            return $('.ui-pnotify-closer');
        }
    },

    // lblLogoutNotification: {
    //     get: function () {
    //         return $('.h2-override');
    //     }
    // },


    // Actions
    navToHelpDesk: {
        value: function () {
            this.btnNavbarMenu.click();
            this.btnUserMenu.click();
            this.btnHelpAndSupport.click();

        }
    },

    logout: {
        value: function () {
            this.btnNavbarMenu.click();
            this.btnUserMenu.click();
            this.btnSignOut.click();
        }
    },

    goHome: {
        value: function () {
            this.lnkHome.click();
        }
    },


    lnkHome: {
        get: function () {
            return $('.lnkHome');
        }
    },

    // Assertions
    isLoggedIn: {
        value: function (fullname) {
            fullname = fullname === undefined ? this.driver.params.userQA.fullname : fullname;
            this.btnNavbarMenu.click();
            return this.lblFullName.getText().then(function (buttonText) {
                return buttonText === fullname;
            });
        }
    },

    // `get:` is for page fields `value:` signifies a function for the page object.

    /*
     * http://www.protractortest.org/#/locators
     * When using CSS Selectors as a locator, you can use the shortcut $() notation:
     *
     * element(by.css('some-css'));   =>     $('some-css');
     *
     * ElementFinder.prototype.$$
     * http://www.protractortest.org/#/api?view=ElementFinder.prototype.$$
     *
     * @param {string} a css selector
     * @returns {ElementArrayFinder}
     *
     * ElementArrayFinder extends Promise, and once an action is performed on
     * an ElementArrayFinder, the latest result can be accessed using ""then"",
     * and will be returned as an array of the results.
     *
     * Selenium does not require findElement function calls to unwrap. However,
     * findElements resolves to a list of web elements, so call .then on the result first.
     (.then resolves the promise.)
     */

    cssTabs: { // This is used by `getTabByName` and `tblTabs`.
        get: function () {
            //return this.findElement(this.by.repeater('menu in menuItems'))  // returns a promise
            //return $$('[class^="ng-scope collapse-item collapse-item-"]:not(.collapse-item-hidden)')  // resolves promise, returns element(s)!!
            this.moreMenuItems.click();
            return $$('.collapse-item.ng-scope')  // resolves promise, returns element(s)!!
                .filter(function (listTabs) {
                    return listTabs.isDisplayed();
                });
        }
    },

    cssAllTabs: { // This is used by `getTabByName` and `tblTabs`.
        get: function () {
            //return this.findElement(this.by.repeater('menu in menuItems'))  // returns a promise
            return $$('.collapse-item.ng-scope');  // resolves promise, returns element(s)!!
        }
    },

    cssInnerTabs: { // This is used by both `getTabByName` and `tblTabs`.
        get: function () {
            return $$('li[id^=patBnr_link]')
                .filter(function (listTabs) {
                    return listTabs.isDisplayed();
                });
        }
    },

    tblTabs: {
        get: function () {
            return $$(this.cssTabs);
        }
    },

    /*
     Dynamic objects: Dynamic tabs object/function explained:-
     What "tabs()" does is:
     Iterate over all of the tabs we currently have
     Get some attribute X that uniquely identifies that tab ex: name
     Name the tab that attribute X  ex: tabs[name] //Tabs Object; property= name
     Assign the tab itself to that name
     */
    tabs: {
        get: function () {
            // First, we need to create a reference to `this`. Since we're using functions inside of other functions,
            // the scope of the `this` keyword changes. By copying the original scope, we can use it as we'd expect.
            var page = this;
            var tabs = {}; // new empty object
            return this.cssTabs.then(function (tabElements) {
                _.forEach(tabElements, function (tabElement) {
                    var tab = page.tabFromElement(tabElement);
                    return tab.name().then(function (name) {
                        tabs[name] = tab;
                    });
                });
                return tabs;
            });
        }
    },

    tabsByIndex: {
        get: function () {
            // First, we need to create a reference to `this`. Since we're using functions inside of other functions,
            // the scope of the `this` keyword changes. By copying the original scope, we can use it as we'd expect.
            var page = this;
            var tabs = {}; // new empty object
            return this.cssTabs.then(function (tabElements) {
                _.forEach(tabElements, function (tabElement, idx) {
                    //var tab = page.tabFromElement(tabElement);
                    //return tab.name().then(function (name) {
                    tabs[idx] = page.tabFromElement(tabElement);
                    //});
                });
                return tabs;
            });
        }
    },

    tabCareServices: {
        get: function () {
            return $$('[class="ng-scope collapse-item collapse-item-7"] a[href$="hcsList"]').get(0);
        }
    },

    tabResults: {
        get: function () {
            return this.tab('Results').then(function (recordsTab) {
                return recordsTab;
            });
        }
    },

    tab2: {
        value: function (tabName) {
            var page = this;
            var tabHref = tabName.toLowerCase();
            tabHref = tabHref === 'system settings' ? 'sysSettings' : tabHref;
            console.log(tabCss);
            var tabs = $(tabCss);
            if (tabHref === 'care services') {
                tabs = $$('[class^="ng-scope collapse-item collapse-item-"]:not(.collapse-item-hidden)').get(7);
            }
            if (tabHref === 'appointments') {
                tabs = $$('[class^="ng-scope collapse-item collapse-item-"]:not(.collapse-item-hidden)').get(8);
            }

            if (tabs) {
                return page.tabFromElement(tabs);
            } else {
                page.NoSuchTabException.thro(tabName);
            }
            //});
        }
    },

    tab: {
        value: function (tabName) {
            var page = this;
            var tabHref = tabName.toLowerCase();
            tabHref = tabHref === 'system settings' ? 'sysSettings' : tabHref;
            tabHref = tabHref === 'results' ? 'records' : tabHref;
            tabHref = tabHref === 'questionnaires' ? 'questionnaireResponses' : tabHref;
            var tabCss = '.collapse-item ' + '[href="#/' + tabHref + '"].ng-binding';
            //Navbar indexes For sys_admin - Trigger Manager 8, care services 9,Task Center 10, My Care Plans -11
            if (tabHref === 'care services') {
                if (browser.params.url === 'https://leap-test.edgeshelf.com/dashboard') {
                    tabCss = '[class="ng-scope collapse-item collapse-item-7"] a[href$="hcsList"]';
                }
                else {
                    tabCss = '[class="ng-scope collapse-item collapse-item-8"] a[href$="hcsList"]';
                }
            }
            return $$(tabCss).then(function (tabs) {
                if (tabs.length) {
                    return page.tabFromElement(tabs[0]);
                } else {
                    page.NoSuchTabException.thro(tabName);
                }
            });
        }
    },

// findElement will return a raw webelement object from webdriver  protractor will sync with angular before it
// gets that webelement, but will not sync on any actions you execute from the webelement.
// (i.e. var webelement = Protractor.findElement(by.id(...)) will sync with angular,
// but actions from that webelement will not (i.e.webelement.getText() and webelement.findElement(by.id(...)) will not)
//
// On the other hand element will return a protractor version of webelement called an ElementFinder.
// Any action using an ElementFinder will sync. For example var elementfinder = element(by.id(...))
// will sync with angular, AND actions from that elementfinder will as well (i.e. elementfinder.getText()
// and elementfinder.element(by.id(...))` will)

    //   When in doubt, use element(by.X) and element.all(by.X) instead of findElement and findElements


    // Instead of returning just a normal tab, we pass this result of tabFromElement,
    // a constructor builds us additional functionality.
    tabFromElement: {
        value: function (tabElement) {
            var page = this;
            return {
                name: function () {
                    return page.tabNameFromElement(tabElement);
                },
                isActive: function () {
                    return page.tabIsActiveFromElement(tabElement);
                },
                isDisplayed: function () {
                    return tabElement.isDisplayed();
                },
                visit: function () {
                    return tabElement.isDisplayed().then(function (isDisplayed) {
                        if (isDisplayed) {
                            tabElement.click();
                        }
                        else {
                            page.moreMenuItems.isDisplayed().then(function (isDisplayed) {
                                if (isDisplayed) {
                                } else {
                                    browser.sleep(4000);
                                }
                                page.moreMenuItems.click();
                                return page.tabNameFromElement(tabElement).then(function (tab) {
                                    page.tab(tab).then(function (tab) {
                                        tab.visit();
                                    })
                                });
                            });
                        }
                    });
                },
                visitIndex: function (i) {
                    return tabElement.isDisplayed().then(function (isDisplayed) {
                        if (isDisplayed) {
                            tabElement.click();
                        }
                        else {
                            page.moreMenuItems.isDisplayed().then(function (isDisplayed) {
                                if (isDisplayed) {
                                } else {
                                    browser.sleep(4000);
                                }
                                page.moreMenuItems.click();
                                return page.tabNameFromElement(tabElement).then(function (tab) {
                                    page.tab(tab).then(function (tab) {
                                        tab.visit();
                                    });
                                });
                            });
                        }
                    });
                }
            };
        }
    },

    tabIsActiveFromElement: {
        value: function (tabElement) {
            return tabElement.getText().then(function (name) {
                return tabElement.getCssValue('color').then(function (fontColor) {
                    return tabElement.getCssValue('background-color').then(function (backgroundColor) {
                        var expectedFontColor = 'rgba(255, 255, 255, 1)'; // White font for active tabs
                        var expectedBackGroundColor = 'rgba(35, 105, 166, 1)'; // Blue background for active tabs
                        return (fontColor === expectedFontColor) && (backgroundColor === expectedBackGroundColor);
                    });
                });
            });
        }
    },

    tabNameFromElement: {
        value: function (tabElement) {
            return tabElement.getText().then(function (name) {
                return name;
            });
        }
    },

    NoSuchTabException: {
        get: function () {
            return this.exception('No such tab');
        }
    },


    // ***************************Inner Tabs *********************************
    innerTabs: {
        get: function () {
            var page = this;
            var innerTabs = {}; // new empty object
            return this.cssInnerTabs.then(function (innerTabsElements) {
                _.forEach(innerTabsElements, function (innerTabElement) {
                    var innerTab = page.innerTabFromElement(innerTabElement);
                    return innerTab.name().then(function (name) {
                        innerTabs[name] = innerTab;
                    });
                });
                return innerTabs;
            });
        }
    },

    innerTab: {
        value: function (innerTabName) {
            var page = this;
            var tabCss = '[title~="' + innerTabName + '"]';

            var tabHref = innerTabName.toLowerCase();
            switch (tabHref) {
                case "overview" :
                    var tabCss = '[href^="#/' + 'patientDetails' + '"]';
                    break;
                case "family history-backup" :
                    var tabCss = '[href$="' + 'familyMembers' + '"]';
                    break;
                case "documents" :
                    var tabCss = '[title~="' + 'Document' + '"]';
                    break;
                case "results" :
                    var tabCss = '[title="Records"]';
                    break;
            }


            // We use `this.find.all` because it might return an empty list
            return $$(tabCss).then(function (innerTabs) {
                if (innerTabs.length) {
                    // If there is a list, we accept the first one as our tab
                    return page.innerTabFromElement(innerTabs[0]);
                } else {
                    // otherwise, the list is empty, and there is no such tab
                    page.NoSuchTabException.thro(innerTabName);
                }
            });
        }
    },

    innerTabFromElement: {
        value: function (tabElement) {
            var page = this;
            return {
                name: function () {
                    return page.tabNameFromElement(tabElement);
                },
                isActive: function () {
                    return page.innerTabIsActiveFromElement(tabElement);
                },
                visit: function () {
                    tabElement.isPresent().then(function (isPresent) {
                        if (isPresent) {
                            tabElement.click();
                        }
                        else {
                            page.moreMenuItems.click();
                            tabElement.click();
                        }
                    });
                }
            };
        }
    },

    innerTabIsActiveFromElement: {
        value: function (tabElement) {
            return tabElement.getCssValue('color').then(function (fontColor) {
                return tabElement.getCssValue('background-color').then(function (backgroundColor) {
                    var expectedFontColor = 'rgba(35, 105, 166, 1)'; // White font for active tabs
                    var expectedBackGroundColor = 'rgba(0, 0, 0, 0)'; // Blue background for active tabs
                    return (fontColor === expectedFontColor) && (backgroundColor === expectedBackGroundColor);
                });
            });
        }
    },

    // Navbar Right Corner lst = Selection list

    moreMenuItems: {
        get: function () {
            return $$('#more-menu-1').get(0);
        }
    },

    selUserReminders: {
        get: function () {
            return $$('[class="dropdown mega-dropdown"]');
        }
    },
    selUserLanguage: {
        get: function () {
            return $$('[class="dropdown"]').get(0);
        }
    },
    selUserHelp: {
        get: function () {
            return $$('[class="dropdown"]').get(1);
        }
    },
    selUserProfile: {
        get: function () {
            return $$('.userName').get(0);
        }
    },
    btnHelpDesk: {
        get: function () {
            return $('[href="#/helpdesk"]');
        }
    },
    btnAboutUs: {
        get: function () {
            return $('[ng-click="openAboutUsForm()"]');
        }
    },
    btnLogout: {
        get: function () {
            return $('[ng-click="logout()"]');
        }
    },

});
