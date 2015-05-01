/*! markdown-it-simplemath 1.0.0 https://github.com//adam-p/markdown-it-simplemath @license MIT */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.markdownitSimpleMath = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * Copyright Adam Pritchard 2015
 * MIT License : http://adampritchard.mit-license.org/
 */

/*
This is basically a stripped down, simplified version of:
https://github.com/runarberg/markdown-it-math
The extra math libraries included by that project were too onerous for use in
Markdown Here, so this has been altered specifically for the needs of MDH.
*/

'use strict';
/*jshint node:true*/


function scanDelims(state, start) {
  var pos = state.pos, lastChar, nextChar, count,
      isLastWhiteSpace, isLastPunctChar,
      isNextWhiteSpace, isNextPunctChar,
      can_open = true,
      can_close = true,
      max = state.posMax,
      isWhiteSpace = state.md.utils.isWhiteSpace,
      isPunctChar = state.md.utils.isPunctChar,
      isMdAsciiPunct = state.md.utils.isMdAsciiPunct;
  // treat beginning of the line as a whitespace
  lastChar = start > 0 ? state.src.charCodeAt(start - 1) : 0x20;
  if (pos >= max) {
    can_open = false;
  }
  count = pos - start;
  // treat end of the line as a whitespace
  nextChar = pos < max ? state.src.charCodeAt(pos) : 0x20;
  isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
  isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));
  isLastWhiteSpace = isWhiteSpace(lastChar);
  isNextWhiteSpace = isWhiteSpace(nextChar);
  if (isNextWhiteSpace) {
    can_open = false;
  } else if (isNextPunctChar) {
    if (!(isLastWhiteSpace || isLastPunctChar)) {
      can_open = false;
    }
  }
  if (isLastWhiteSpace) {
    can_close = false;
  } else if (isLastPunctChar) {
    if (!(isNextWhiteSpace || isNextPunctChar)) {
      can_close = false;
    }
  }
  return {
    can_open: can_open,
    can_close: can_close,
    delims: count
  };
}


function makeMath_inline(open, close) {
  return function math_inline(state, silent) {
    var startCount,
        found,
        res,
        token,
        closeDelim,
        max = state.posMax,
        start = state.pos,
        openDelim = state.src.slice(start, start + open.length);

    if (openDelim !== open) { return false; }
    if (silent) { return false; }    // Don’t run any pairs in validation mode

    res = scanDelims(state, start + open.length);
    startCount = res.delims;

    if (!res.can_open) {
      state.pos += startCount;
      // Earlier we checked !silent, but this implementation does not need it
      state.pending += state.src.slice(start, state.pos);
      return true;
    }

    state.pos = start + open.length;

    while (state.pos < max) {
      closeDelim = state.src.slice(state.pos, state.pos + close.length);
      if (closeDelim === close) {
        res = scanDelims(state, state.pos + close.length);
        if (res.can_close) {
          found = true;
          break;
        }
      }

      state.md.inline.skipToken(state);
    }

    if (!found) {
      // Parser failed to find ending tag, so it is not a valid math
      state.pos = start;
      return false;
    }

    if (start + close.length === state.pos) {
      // There is nothing between the delimiters -- don't match.
      state.pos = start;
      return false;
    }

    // Found!
    state.posMax = state.pos;
    state.pos = start + close.length;

    // Earlier we checked !silent, but this implementation does not need it
    token = state.push('math_inline', 'math', 0);
    token.content = state.src.slice(state.pos, state.posMax);
    token.markup = open;

    state.pos = state.posMax + close.length;
    state.posMax = max;

    return true;
  };
}

module.exports = function math_plugin(md, options) {
  var inlineOpen = '$',
      inlineClose = '$';
  if (!options || !options.inlineRenderer) {
    throw new Error('options.inlineRender is required');
  }
  var inlineRenderer = function(tokens, idx) {
    return options.inlineRenderer(tokens[idx].content);
  };

  var math_inline = makeMath_inline(inlineOpen, inlineClose);

  md.inline.ruler.before('escape', 'math_inline', math_inline);
  md.renderer.rules.math_inline = inlineRenderer;
};

},{}]},{},[1])(1)
});