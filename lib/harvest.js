var cheerio = require('cheerio');

/**
 *
 */

module.exports = function harvest(body, selector) {
    var $ = cheerio.load(body);
    return $(selector);
};

