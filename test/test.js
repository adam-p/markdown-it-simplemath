/*
 * Copyright Adam Pritchard 2015
 * MIT License : http://adampritchard.mit-license.org/
 */

'use strict';
/*jshint node:true*/
/* global describe, it, before, beforeEach, after, afterEach */
/*eslint-env mocha*/

var expect = require('chai').expect;

describe('markdown-it-simplemath', function () {

  it('should require a renderer', function() {
    expect(function() {
        require('markdown-it')().use(require('../'));
    }).to.throw(Error);
  });

  it('should render inline math', function() {
    // Use an inline renderer that's fake but covers the same ground as Markdown Here's.
    var inlineRenderer = function(mathStr) {
        return '<img src="' + encodeURIComponent(mathStr) + '" title="' + mathStr + '">';
    };

    var s, target;
    var md = require('markdown-it')().use(require('../'), {inlineRenderer: inlineRenderer});

    s = '$x$';
    target = '<p><img src="x" title="x"></p>\n';
    expect(md.render(s)).to.equal(target);

    s = 'left $x + y$ right';
    target = '<p>left <img src="x%20%2B%20y" title="x + y"> right</p>\n';
    expect(md.render(s)).to.equal(target);
  });

  it('should not render over-aggressively', function() {
    // Use an inline renderer that's fake but covers the same ground as Markdown Here's.
    var inlineRenderer = function(mathStr) {
        return 'xxx';
    };

    var s, target;
    var md = require('markdown-it')().use(require('../'), {inlineRenderer: inlineRenderer});

    // Shouldn't render empty content
    s = 'aaa $$ bbb';
    target = '<p>aaa $$ bbb</p>\n';
    expect(md.render(s)).to.equal(target);

    s = 'aaa $5.99 bbb';
    target = '<p>aaa $5.99 bbb</p>\n';
    expect(md.render(s)).to.equal(target);

    s = 'aaa 5.99$ bbb';
    target = '<p>aaa 5.99$ bbb</p>\n';
    expect(md.render(s)).to.equal(target);
  });
});
