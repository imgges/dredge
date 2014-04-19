var should = require('should');

var harvest = require('../lib/harvest');

describe('harvest', function () {
    var body = '<div><span data-foo="xxx">foo</span>';
    body += '<span data-foo="yyy">bar</span>';
    body += '<span data-foo="zzz">baz</span></div>';
    it('should return an array-like object of DOM elements, simple selector', function () {
        var harvested = harvest(body, 'span')
        harvested.should.be.an.Object;
        harvested.length.should.eql(3);
    });
    it('should return an array-like object of DOM elements, nth-child selector', function () {
        var harvested = harvest(body, 'div > span:nth-child(2)')
        harvested.should.be.an.Object;
        harvested.length.should.eql(1);
        harvested.eq(0).text().should.eql('bar');
    });
    it('should return an array-like object of DOM elements, regex selector', function () {
        var harvested = harvest(body, 'div > span[data-foo$="z"]')
        harvested.should.be.an.Object;
        harvested.length.should.eql(1);
        harvested.eq(0).text().should.eql('baz');
    });
});

