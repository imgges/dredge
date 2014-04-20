/**
 * @list dependencies
 */

var async = require('async'),
    fetch = require('./fetch').fetch,
    Promise = require('node-promise').Promise;

var promise = new Promise();

/**
 *
 */

var start = exports.start = function start(sites) {
    // console.log('dredge#start');
    if (!(typeof sites === 'object' && sites && sites.length >>> 0)) throw new TypeError();
    async.map(sites, fetch, mapDone);
    return promise;
};

/**
 *
 */

var compareItems = exports.compareItems = function compareItems(a, b) {
    if ((typeof a !== 'object' || typeof b !== 'object') ||
        (!a.hasOwnProperty('data') || !b.hasOwnProperty('data')) ||
        (!a.data.hasOwnProperty('name') || !b.data.hasOwnProperty('name')))
        throw new Error('compareItems expects two objects, each with a name property');
    if (a.data.name < b.data.name) return -1;
    if (a.data.name > b.data.name) return 1;
    return 0;
};

/**
 *
 */

var flattenResults = exports.flattenResults = function flattenResults(results) {
    // console.log('dredge#flattenResults');
    if (typeof results !== 'object' || results.length < 1)
        throw new Error('flattenResults expects an array of arrays');
    return Array.prototype.concat.apply([], results);
};

/**
 *
 */

var mapDone = exports.mapDone = function mapDone(err, results) {
    // console.log('dredge#mapDone');
    if (err || !results || !results.length) return console.log('async.map: %s - %s', err, results);
    return async.parallel(results, parallelDone);
};

/**
 *
 */

var parallelDone = exports.parallelDone = function parallelDone(err, results) {
    // console.log('dredge#parallelDone');
    if (err || !results || !results.length) return console.log('async.parallel: %s - %s', err, results);
    var images = flattenResults(results).sort(compareItems);
    // console.dir(images);
    console.log('Processed ' + images.length + ' images');

    promise.resolve({
        images: images
    });
};

