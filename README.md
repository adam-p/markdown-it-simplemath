[![Build Status](https://travis-ci.org/adam-p/markdown-it-simplemath.svg?branch=master)](https://travis-ci.org/adam-p/markdown-it-simplemath)
[![NPM version](https://img.shields.io/npm/v/markdown-it-simplemath.svg?style=flat)](https://www.npmjs.org/package/markdown-it-simplemath)
[![Coverage Status](https://coveralls.io/repos/adam-p/markdown-it-simplemath/badge.svg)](https://coveralls.io/r/adam-p/markdown-it-simplemath)


# markdown-it-simplemath

This is a [markdown-it](https://github.com/markdown-it/markdown-it) plugin that adds simple math support. It is up to the caller to supply a rendering function.

**NOTE:** For fully featured math rendering, you should use [runarberg/markdown-it-math](https://github.com/runarberg/markdown-it-math). This plugin was created for a particular need to render to images. It really just passes off whatever is inside `$...$` to an external renderer.

Originally developed for use with [Markdown Here](https://github.com/adam-p/markdown-here).

## Installation

```
$ npm install markdown-it-simplemath
```

## Usage

```js
var md = require('markdown-it')();
var mathRenderer = function(mathStr) {
  return '<img src="https://chart.googleapis.com/chart?cht=tx&chl={urlmathcode}" alt="{mathcode}">'
    .replace(/\{mathcode\}/ig, mathcode)
    .replace(/\{urlmathcode\}/ig, encodeURIComponent(mathcode));
};
md.use(require('markdown-it-simplemath'), {inlineRenderer: mathRenderer});
console.log(md.render('$x \over y$'));
```
