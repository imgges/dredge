var should = require('should');

var fs = require('fs');
var dredge = require('../lib/dredge');

describe('dredge#compareItems', function () {
    it('should throw error if A and B are undefined', function () {
        dredge.compareItems.should.throw();
    });
    it('should throw error if A or B are not the expected type', function () {
        dredge.compareItems.bind(dredge, 'abc', { data: { name: 'def' } }).should.throw();
        dredge.compareItems.bind(dredge, { data: { name: 'abc' } }, 'def').should.throw();
    });
    it('should throw error if A and B are not the expected type', function () {
        dredge.compareItems.bind(dredge, 'abc', 'def').should.throw();
    });
    it('should throw error if A or B does not have the data property', function () {
        dredge.compareItems.bind(dredge, { name: 'abc' }, { data: { name: 'def' } }).should.throw();
        dredge.compareItems.bind(dredge, { data: { name: 'abc' } }, { name: 'def' }).should.throw();
    });
    it('should throw error if A and B do not have the data property', function () {
        dredge.compareItems.bind(dredge, { name: 'abc' }, { name: 'def' }).should.throw();
    });
    it('should throw error if A or B does not have the name property', function () {
        dredge.compareItems.bind(dredge, { data: { foo: 'abc' } }, { data: { name: 'def' } }).should.throw();
        dredge.compareItems.bind(dredge, { data: { name: 'abc' } }, { data: { foo: 'def' } }).should.throw();
    });
    it('should throw error if A and B do not have the name property', function () {
        dredge.compareItems.bind(dredge, { data: { foo: 'abc' } }, { data: { foo: 'def' } }).should.throw();
    });
    it('should return -1 if A.name < B.name', function () {
        dredge.compareItems({ data: { name: 'abc' } }, { data: { name: 'def' } }).should.be.equal(-1);
    });
    it('should return 1 if A.name > B.name', function () {
        dredge.compareItems({ data: { name: 'def' } }, { data: { name: 'abc' } }).should.be.equal(1);
    });
    it('should return 0 if A.name == B.name', function () {
        dredge.compareItems({ data: { name: 'abc' } }, { data: { name: 'abc' } }).should.be.equal(0);
    });
    it('should correctly sort an array of valid objects', function () {
        [
            { data: { name: 'jeanmichel' } },
            { data: { name: 'kiril1' } },
            { data: { name: 'quidmonkey' } },
            { data: { name: 'chronicles' } },
            { data: { name: 'brophdawg' } },
            { data: { name: 'trashton' } },
            { data: { name: 'kiril0' } },
            { data: { name: 'tim' } },
            { data: { name: 'huntaur' } },
            { data: { name: 'tudes' } },
            { data: { name: 'ryan' } }
        ].sort(dredge.compareItems).should.eql([
            { data: { name: 'brophdawg' } },
            { data: { name: 'chronicles' } },
            { data: { name: 'huntaur' } },
            { data: { name: 'jeanmichel' } },
            { data: { name: 'kiril0' } },
            { data: { name: 'kiril1' } },
            { data: { name: 'quidmonkey' } },
            { data: { name: 'ryan' } },
            { data: { name: 'tim' } },
            { data: { name: 'trashton' } },
            { data: { name: 'tudes' } }
        ]);
    });
});

describe('dredge#flattenResults', function () {
    it('should throw error if a param is passed of an unexpected type', function () {
        dredge.flattenResults.bind(dredge, 'abc').should.throw();
    });
    it('should throw error if no param is passed', function () {
        dredge.flattenResults.bind(dredge).should.throw();
    });
    it('should throw error if the param passed an empty array', function () {
        dredge.flattenResults.bind(dredge, []).should.throw();
    });
    it('should return a flattened array', function () {
        var flattened = dredge.flattenResults([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
        flattened.should.eql([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
});

describe('dredge#processRequests', function () {
    var Promise = require('native-or-bluebird');
    var bodies = ['<div><a href="foo.gif">foo</a></div>'];
    var sites = [{
        url: 'http://stephentudor.com',
        selector: 'a[href$=".gif"]'
    }];

    it('should return an array', function (done) {
        dredge.processRequests(sites, bodies)
            .then(function (links) {
                links[0].should.be.an.Array;
                links[0].length.should.eql(1);
                done();
            })
    });

    it('should return an array of properly formatted link objects', function (done) {
        dredge.processRequests(sites, bodies)
            .then(function (links) {
                var link = links[0][0];
                // link.id.should.be.ok;
                link.url.should.equal('http://cdn.imgg.es/stephentudor.com_foo.gif');
                link.data.should.be.ok;
                link.data.domain.should.equal('stephentudor.com');
                link.data.name.should.equal('foo.gif');
                link.data.origUrl.should.equal('http://stephentudor.com/foo.gif');
                done();
            });
    });
});
