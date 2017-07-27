var should = require('should'), // jshint ignore:line
    sinon = require('sinon'),

// Stuff we are testing
    helpers = require('../../../server/helpers'),

    sandbox = sinon.sandbox.create();

describe('{{#has}} helper', function () {
    afterEach(function () {
        sandbox.restore();
    });

    it('should handle tag list that validates true', function () {
        var fn = sandbox.spy(),
            inverse = sandbox.spy();

        helpers.has.call(
            {tags: [{name: 'foo'}, {name: 'bar'}, {name: 'baz'}]},
            {hash: {tag: 'invalid, bar, wat'}, fn: fn, inverse: inverse}
        );

        fn.called.should.be.true();
        inverse.called.should.be.false();
    });

    it('should handle tags with case-insensitivity', function () {
        var fn = sandbox.spy(),
            inverse = sandbox.spy();

        helpers.has.call(
            {tags: [{name: 'ghost'}]},
            {hash: {tag: 'GhoSt'}, fn: fn, inverse: inverse}
        );

        fn.called.should.be.true();
        inverse.called.should.be.false();
    });

    it('should match exact tags, not superstrings', function () {
        var fn = sandbox.spy(),
            inverse = sandbox.spy();

        helpers.has.call(
            {tags: [{name: 'magical'}]},
            {hash: {tag: 'magic'}, fn: fn, inverse: inverse}
        );

        fn.called.should.be.false();
        inverse.called.should.be.true();
    });

    it('should match exact tags, not substrings', function () {
        var fn = sandbox.spy(),
            inverse = sandbox.spy();

        helpers.has.call(
            {tags: [{name: 'magic'}]},
            {hash: {tag: 'magical'}, fn: fn, inverse: inverse}
        );

        fn.called.should.be.false();
        inverse.called.should.be.true();
    });

    it('should handle tag list that validates false', function () {
        var fn = sandbox.spy(),
            inverse = sandbox.spy();

        helpers.has.call(
            {tags: [{name: 'foo'}, {name: 'bar'}, {name: 'baz'}]},
            {hash: {tag: 'much, such, wow'}, fn: fn, inverse: inverse}
        );

        fn.called.should.be.false();
        inverse.called.should.be.true();
    });

    it('should not do anything if there are no attributes', function () {
        var fn = sandbox.spy(),
            inverse = sandbox.spy();

        helpers.has.call(
            {tags: [{name: 'foo'}, {name: 'bar'}, {name: 'baz'}]},
            {fn: fn, inverse: inverse}
        );

        fn.called.should.be.false();
        inverse.called.should.be.false();
    });

    it('should not do anything when an invalid attribute is given', function () {
        var fn = sandbox.spy(),
            inverse = sandbox.spy();

        helpers.has.call(
            {tags: [{name: 'foo'}, {name: 'bar'}, {name: 'baz'}]},
            {hash: {invalid: 'nonsense'}, fn: fn, inverse: inverse}
        );

        fn.called.should.be.false();
        inverse.called.should.be.false();
    });

    it('should handle author list that evaluates to true', function () {
        var fn = sandbox.spy(),
            inverse = sandbox.spy();

        helpers.has.call(
            {author: {name: 'sam'}},
            {hash: {author: 'joe, sam, pat'}, fn: fn, inverse: inverse}
        );

        fn.called.should.be.true();
        inverse.called.should.be.false();
    });

    it('should handle author list that evaluates to false', function () {
        var fn = sandbox.spy(),
            inverse = sandbox.spy();

        helpers.has.call(
            {author: {name: 'jamie'}},
            {hash: {author: 'joe, sam, pat'}, fn: fn, inverse: inverse}
        );

        fn.called.should.be.false();
        inverse.called.should.be.true();
    });

    it('should handle authors with case-insensitivity', function () {
        var fn = sandbox.spy(),
            inverse = sandbox.spy();

        helpers.has.call(
            {author: {name: 'Sam'}},
            {hash: {author: 'joe, sAm, pat'}, fn: fn, inverse: inverse}
        );

        fn.called.should.be.true();
        inverse.called.should.be.false();
    });

    it('should handle tags and authors like an OR query (pass)', function () {
        var fn = sandbox.spy(),
            inverse = sandbox.spy();

        helpers.has.call(
            {author: {name: 'sam'}, tags: [{name: 'foo'}, {name: 'bar'}, {name: 'baz'}]},
            {hash: {author: 'joe, sam, pat', tag: 'much, such, wow'}, fn: fn, inverse: inverse}
        );

        fn.called.should.be.true();
        inverse.called.should.be.false();
    });

    it('should handle tags and authors like an OR query (pass)', function () {
        var fn = sandbox.spy(),
            inverse = sandbox.spy();

        helpers.has.call(
            {author: {name: 'sam'}, tags: [{name: 'much'}, {name: 'bar'}, {name: 'baz'}]},
            {hash: {author: 'joe, sam, pat', tag: 'much, such, wow'}, fn: fn, inverse: inverse}
        );

        fn.called.should.be.true();
        inverse.called.should.be.false();
    });

    it('should handle tags and authors like an OR query (fail)', function () {
        var fn = sandbox.spy(),
            inverse = sandbox.spy();

        helpers.has.call(
            {author: {name: 'fred'}, tags: [{name: 'foo'}, {name: 'bar'}, {name: 'baz'}]},
            {hash: {author: 'joe, sam, pat', tag: 'much, such, wow'}, fn: fn, inverse: inverse}
        );

        fn.called.should.be.false();
        inverse.called.should.be.true();
    });
});
