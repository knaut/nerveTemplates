(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
nerve = {};

nerve.parse = {};
nerve.parse.css = require('./modules/parse/css.js');

nerve.toType = function(obj) {
	// better type checking
	// https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
	if (obj.hasOwnProperty('type') && obj.type === 'component') {
		return 'component';
	} else {
		return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
	}
}

nerve.normalize = function(struct) {
	var normalized = [];

	switch (this.toType(struct)) {
		case 'string':
			return struct;
			break;
		case 'array':
			for (var i = 0; struct.length > i; i++) {

				var obj = struct[i];

				for (var key in obj) {
					var parsed = nerve.parse.css.selector(key);
					parsed.inner = nerve.normalize(obj[key]);
				}

				normalized.push(parsed)
			}
			break;
		case 'object':
			var keys = Object.keys(struct);

			for (var k = 0; keys.length > k; k++) {
				var obj = {};
				var key = keys[k];
				var val = struct[key];

				obj[key] = val;

				for (var keyS in obj) {
					var parsed = nerve.parse.css.selector(keyS);
					parsed.inner = nerve.normalize(struct[keyS]);
				}

				normalized.push(parsed);
			}
			break;
		case 'function':
			// console.log('found a function', struct)
			// normalized.push(nerve.parse.functions.normalize(struct));
			break;
		case 'component':

			struct['parent'] = nerve.component;

			nerve.component.children.push(struct);
			break;
	}

	return normalized;
}


},{"./modules/parse/css.js":2}],2:[function(require,module,exports){
module.exports = {
	selector: function(string) {
		// parse a CSS selector and normalize it as a a JS object
		/* 
		example:
			{
				type: 'dom',
				attrs: [ { 
					attrKey: 'data-val'
					attrVal: 'value' } ],
				classes: [ 'className' ],
				id: 'string',
				tagName: 'string'
			}
		*/

		var parsed = {
			type: 'html',
			tagName: 'div', // default element
			attrs: [],
			classes: [],
			id: ''
		};

		// check for attributes
		if (string.indexOf('[') > -1) {
			parsed.attrs = this.attrs(string);
		}

		// check for classes
		if (string.indexOf('.') > -1) {
			parsed.classes = this.classes(string);
		}

		// check for id
		if (string.indexOf('#') > -1) {
			parsed.id = this.id(string);
		}

		// check for tag name
		if (this.tagName(string)) {
			parsed.tagName = this.tagName(string);
		}

		return parsed;
	},

	tagName: function(string) {
		// parse a selector with an element name
		var reg = /^\w*/;

		var tag = string.match(reg)[0];

		if (!tag) {
			return false;
		} else {
			// list of supported dom tags
			var dom = [
				'div',
				'a',
				'p',
				'span',
				'ul',
				'li',
				'header',
				'article',
				'section',
				'nav',
				'footer',
				'h1',
				'h2',
				'h3',
				'h4',
				'h5',
				'h6',
				'pre',
				'em'
			];

			for (var d = 0; dom.length > d; d++) {
				if (dom[d] === tag) {
					return tag;
				}
			}
		}
	},

	id: function(string) {
		// parse a selector with an id
		// and extract the id
		var reg = /#[\w|-]*/;

		var id = string.match(reg)[0].substring(1);

		return id;
	},

	classes: function(string) {
		// parse a selector with at least one class
		var reg = /\.[\w|-]*/g;

		var classes = string.match(reg);

		var parsed = [];
		for (var c = 0; classes.length > c; c++) {
			// chop off the .
			var classString = classes[c].substring(1);
			parsed.push(classString)
		}

		return parsed;
	},

	attrs: function(string) {
		var reg = /\[.+\]/g;

		// we will only accept attributes grouped together in the selector
		var attrs = string.match(reg);

		// treat the attrs as an array, even if there's only one
		if (attrs[0].indexOf('][') > -1) {
			attrs = attrs[0].split('][');
		}

		// push the parsed pairs to an array for later
		var parsed = [];

		for (var i = 0; attrs.length > i; i++) {

			// clean up everything
			var attr = attrs[i].replace(/'|"|\[|\]/g, '');

			// only assume the attr has a key
			var pair = {};
			if (attr.indexOf('=') > -1) {
				var split = attr.split('=');
				pair = {
					attrKey: split[0],
					attrVal: split[1]
				};
				parsed.push(pair);
			} else {
				pair = {
					attrKey: attr,
					attrVal: null
				}
				parsed.push(pair);
			}
		}

		return parsed;
	}
}
},{}]},{},[1]);
