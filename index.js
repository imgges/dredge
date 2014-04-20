var dredge = require('./lib/dredge');

/**
 * @param Array siteConfig
 * @return promise
 * This module's use of promises conforms to the Promises/A+ standard.
 * Operate on the singular data argument passed to a `then` callback, as follows:
 *
 * dredge([{
 *   url: 'http://stephentudor.com',
 *   selector: 'img[src$=".png"]'
 * }]).then(function (data) {
 *   // Operate on the data
 * }, function (error) {
 *   // Handle errors
 * })
 */
module.exports = function (siteCfg) {
  return dredge.start(siteCfg);
};
