/**
 * Created by Ashish Raina on 8/28/2016.
 */

var Page = require('astrolabe').Page;
var navbar = require('./navbar');

module.exports = Page.create({
    url: {value: '/#/dash'},
    navbar: {
        get: function () {
            return navbar
        }
    },
    /**
     * returns Protractor ($) / Webdriver(FindElement) Page UI field objects
     * @return {Object} various Page UI Field Objects
     */

    btn: {
        get: function () {
            return $('.md-primary');
        }
    },

    chart: {
        get: function () {
            return $('.chart');
        }
    },

    btnFilterDrawer: {
        get: function () {
            return $$('[aria-label="Filter Drawer"]').get(0);
        }
    }

});