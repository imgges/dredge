var dredge = require('./lib/dredge');

/**
 * @return promise
 * This module makes use of the node-promise API.
 * Operate on the singular data argument passed to a `then` callback, as follows:
 *
 * var dredge = require('dredge');
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