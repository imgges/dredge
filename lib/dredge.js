/**
 * @list dependencies
 */

var harvest = require('./harvest'),
    rp = require('request-promise'),
    transform = require('./transform').transform,
    Promise = require('native-or-bluebird');

/**
 *
 */

var start = exports.start = function start(sites) {
    // console.log('dredge#start');
    if (!(typeof sites === 'object' && sites && sites.length >>> 0)) throw new TypeError();
    return new Promise(function (resolve, reject) {
        fetch(sites)
        .then(processRequests.bind(null, sites))
        .then(processImages)
        .then(resolve);
    });
};

/**
 *
 */

var fetch = exports.fetch = function fetch(sites) {
    var fetchPromises = [];
    sites.forEach(function (site) {
        fetchPromises.push(rp(site.url));
    });
    return Promise.all(fetchPromises);
};

/**
 *
 */

var processRequests = exports.processRequests = function processRequests(sites, bodies) {
    var requestPromises = [];
    sites.forEach(function (site, idx) {
        var body = bodies[idx];
        requestPromises.push(new Promise(function (resolve, reject) {
            // console.log('fetch#processRequest - ' + site.url);
            var links = [];
            var elements = harvest(body, site.selector);
            elements.each(function () {
                var link = transform(site.url, this.attribs.href);
                links.push(link);
            });
            resolve(links);
        }));
    });
    return Promise.all(requestPromises)
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

var processImages = exports.processImages = function processImages(results) {
    // console.log('dredge#processImages');
    return new Promise(function (resolve, reject) {
      if (!results || !results.length) throw new Error();
      var images = flattenResults(results).sort(compareItems);
      // console.dir(images);
      console.log('Processed ' + images.length + ' images');

      resolve({ images: images });
    });
};

