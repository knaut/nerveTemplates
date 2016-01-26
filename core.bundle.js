(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
nerve = {};
nerve.type = 'nerve';

nerve.parse = {};
nerve.parse.css = require('./modules/parse/css.js');

nerve.toType = require('./modules/toType.js')
nerve.normalize = require('./modules/normalize.js');
nerve.stringify = require('./modules/stringify.js');

module.exports = nerve;
},{"./modules/normalize.js":2,"./modules/parse/css.js":3,"./modules/stringify.js":4,"./modules/toType.js":5}],2:[function(require,module,exports){
module.exports = function(struct) {
	var normalized = [];

	switch (this.toType(struct)) {
		case 'string':
			return struct;
			break;
		case 'number':
			return struct;
			break;
		case 'array':

			// for component based library (Ulna), check if we're mixed into the component
			// prototype, and depend on its api
			if (this.type === 'component') {
				// this is uninintuitive but works because of recursion
				// when we loop, we push to the normalized struct (component's) children	
				for (var x = 0; struct.length > x; x++) {
					normalized.push = this.normalize(struct[x]);
				}

				// by setting normalized to the struct, we return the array for normalized templates
				normalized = struct;
			} else {
				// code where we assume every array holds another nerve template object
				// still want to test
				for (var i = 0; struct.length > i; i++) {

					var obj = struct[i];

					for (var key in obj) {
						var parsed = this.parse.css.selector(key);
						parsed.inner = this.normalize(obj[key]);
					}

					normalized.push(parsed)
				}
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
					var parsed = this.parse.css.selector(keyS);
					parsed.inner = this.normalize(struct[keyS]);
				}

				normalized.push(parsed);
			}
			break;
		case 'function':
			// console.log('found a function', struct);

			// here we set the returned object as the result of whatever the function ran,
			// resulting in a structure that should also be normalized

			// we call this as the current context, assuming that this is a component
			normalized = this.normalize(struct.call(this));

			break;
		case 'component':
			// console.log('found a component');

			// for components we push a parent reference
			struct['parent'] = this;

			// assuming refactored Ulna api
			// we push to a children array for convenient references
			this.children.push(struct);

			// we push to the normalized template
			// or, we could just set the normalized array as the next component structure
			// depends if we want the component's api in normalized object
			normalized = struct.normalized;
			// normalized.push( struct );

			break;
	}

	return normalized;
}
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
module.exports = {
	normalized: function(normalized) {
		// let one do function do one thing:
		// take a normalized structure and recursively stringify it

		var string = '';
		for (var n = 0; normalized.length > n; n++) {
			var normalizedType = nerve.toType(normalized[n]);

			switch (normalizedType) {
				case 'object':
					string += this.object(normalized[n]);
					break;
				case 'component':
					// seriously
					string += this.normalized( normalized[n].normalized );
					break;
			}
		}
		return string;
	},

	object: function(obj) {
		// helps split up the control logic
		// we can stringify based on the type of object we normalized
		// or easily add more type cases in the future
		var string = '';
		switch (obj.type) {
			case 'html':
				string = this.html(obj);
				break;
			case 'function':
				string = this.func(obj);
				break;
		}
		return string;
	},

	html: function(obj) {
		var string = '<' + obj.tagName;

		// id
		if (obj.id) {
			string += ' id="' + obj.id + '"';
		}

		// classes
		if (obj.hasOwnProperty('classes') && obj.classes.length) {
			string += ' class="' + obj.classes.join(' ') + '"';
		}

		// custom attrs
		if (obj.hasOwnProperty('attrs') && obj.attrs.length) {

			// loop through array of key/vals
			for (var a = 0; obj.attrs.length > a; a++) {
				var attr = obj.attrs[a];

				// for each pair, concatenate them as a single string
				var pair = []

				for (var key in attr) {
					pair.push(attr[key])
				}

				pair[1] = '"' + pair[1] + '"';
				pair = pair.join('=');

				// we add to the string each time in the loop, accounting for each attr in the array
				string += ' ' + pair;
			}
		}

		// end the opening tag
		string += '>';
		var innerType = nerve.toType(obj.inner);
		if (obj.hasOwnProperty('inner') && innerType === 'array' && innerType !== 'string') {
			string += this.normalized(obj.inner);
		} else if (innerType === 'string' || innerType === 'number') {
			string += obj.inner;
		}

		string += '</' + obj.tagName + '>';

		return string;
	}
}
},{}],5:[function(require,module,exports){
module.exports = function(obj) {
	// better type checking
	// https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
	if (obj.hasOwnProperty('type') && obj.type === 'component') {
		return 'component';
	} else {
		return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
	}
}
},{}]},{},[1]);
