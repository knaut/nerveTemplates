(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var nerve = require('./core.js');

var Component = function( template ) {
	this.type = 'component';
	this.template = template;

	this.nerve = new Nerve();
}

module.exports = Component;



},{"./core.js":2}],2:[function(require,module,exports){
var parseFunctions = require('./modules/parseFunctions.js');
var parseCSSKey = require('./modules/parseCSSKey.js');
var normalize = require('./modules/normalize');
var stringify = require('./modules/stringify');
var toType = require('./modules/toType');

var Nerve = function( component ) {
	this.component = component;

	this.parse = {
		functions: parseFunctions( this ),
		css: parseCSSKey( this )
	}

	this.stringify = stringify( this );

	this.normalize = normalize( this );

	this.toType = toType;
}

if (typeof window !== "undefined") {
	window.Nerve = Nerve;
}

var Component = require('./component.js');

var testComponent = new Component({
	span: 'blah'
})

window.testTemp = {
	div: function() {
		return testComponent;
	}
}

exports.Nerve = Nerve;
},{"./component.js":1,"./modules/normalize":3,"./modules/parseCSSKey.js":4,"./modules/parseFunctions.js":5,"./modules/stringify":6,"./modules/toType":7}],3:[function(require,module,exports){
var normalize = function( nerve ) {
	// take a nerve template of static css selectors
	// and normalize it as a nested structure
	/*
	test structures:
	[{
		'div#blah': [
			{ 'span': '{{blah}}' },
			{ 'div': '{{blah}}' }
		]
	}]

	[{
		'div#blah': { 'span': '{{blah}}' }
	}]

	example:
	[	
		{
			type: 'html',
			attrs: [ { 
				attrKey: 'data-val'
				attrVal: 'value' } ],
			classes: [ 'className' ],
			id: 'string',
			tagName: 'string',
			inner: [
				{}
			]
		}
	]
	*/

	return function( struct ) {

		var normalized = [];

		switch( this.toType(struct) ) {
			case 'string':
				return struct;
			break;
			case 'array':
				for (var i = 0; struct.length > i; i++) {
					
					var obj = struct[i];

					for (var key in obj) {
						var parsed = nerve.parse.css.selector( key );
						parsed.inner = nerve.normalize( obj[key] );
					}

					normalized.push( parsed )
				}
			break;
			case 'object':
				var keys = Object.keys( struct );

				for (var k = 0; keys.length > k; k++) {
					var obj = {};
					var key = keys[k];
					var val = struct[key];

					obj[key] = val;

					for (var keyS in obj) {
						var parsed = nerve.parse.css.selector( keyS );
						parsed.inner = nerve.normalize( struct[keyS] );
					}

					normalized.push(parsed);
				}
			break;
			case 'function':
				normalized.push( nerve.parse.functions.normalize( struct ) );
			break;
			case 'component':

				struct['parent'] = nerve.component;

				nerve.component.children.push( struct );
			break;
		}

		return normalized;

	}
}

module.exports = normalize;
},{}],4:[function(require,module,exports){
var parseCSSKey = function( nerve ) {

	return {
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
};

module.exports = parseCSSKey
},{}],5:[function(require,module,exports){
var parseFunctions = function( nerve ) {

	return {
		normalize: function( func ) {
			var rgfuncHead = /^function\s*[(][)]\s*[{]\s*/;	// eg 'function() { …'
			var rgfuncTail = /\s*[}]{1}\s*$/;		// eg last } bracket of the function
			var rgfuncReturns = /return\s*/;

			var keyword = 'return';		// the string we look for when parsing return blocks

			var src = func.toString();
			src = src.split( src.match(rgfuncHead) )[1];
			src = src.split( src.match(rgfuncTail) )[0];

			var splitSrc = src.split('return');

			var srcHead = splitSrc[0];
			var srcBody = splitSrc;
			srcBody.shift();

			// loop through the function body and parse the return blocks
			// we skip the first item, which is the src head

			var parsedReturnBlocks = [];
			var slicedReturnBlocks = [];

			var normalizedReturnBlocks = [];

			for (var i = 0; srcBody.length > i; i++) {
				
				// we extract and normalize the returned blocks separate from the rest of the src
				normalizedReturnBlocks.push( this.sanitizeSrcBody(srcBody[i]) );

				// we re-use the src to extrapolate where the returned blocks should go
				var trimmedSrcBody = srcBody[i].replace(/\t|\s{2,}|\n/g, ' ');

				slicedReturnBlocks.push( this.sliceReturnBlock( trimmedSrcBody ) );
				parsedReturnBlocks.push( this.parseReturnBlock( trimmedSrcBody ) );
			}


			// normalized return blocks are inner properties of code blocks
			var script = func.toString();

			// lose the whitespace
			script = script.replace(/\t|\s{2,}|\n/g, ' ');
			script = script.split( rgfuncHead )[1];
			script = script.split( rgfuncTail )[0];

			for ( var n = 0; slicedReturnBlocks.length > n; n++) {
				script = script.replace( keyword + slicedReturnBlocks[n] , '%break%' );
			}

			var parsedFunc = {
				type: 'function',
				src: script,
				inner: normalizedReturnBlocks
			}

			return parsedFunc;
		},

		sanitizeSrcBody: function( string ) {
			// we take a block of src and clean it up of whitespace and quotes where appropriate
			// we must preserve whitespace and quotes in strings.
			// in vals where there were no quotes, assume we're attemping to evaluate something
			var sanitizeString = string;
			
			// remove tabs
			sanitizeString = sanitizeString.replace(/([\t|\n])/g,'')

			// remove any preceding whitespace
			sanitizeString = sanitizeString.replace(/\s*/,'');

			// we can re-use sliceReturnBlock to extract the returned object
			// while (hopefully) preserving the surrounding script
			var slicedBlocks = this.sliceReturnBlock( sanitizeString );

			// these are string types instead of real objects
			// we'll create a function that gives them to us -- eval workaround
			var destringifySrc = new Function('return ' + slicedBlocks);

			// from here we can hand the objects on as normal.
			// normalize returns an array by default, so we'll just return the contents
			return nerve.normalize( destringifySrc() )[0];
		},

		// separate the return block from the rest of the code and return it
		sliceReturnBlock: function( string ) {
			var enterBracesInt = 0;
			var exitBracesInt = 0;
			var sliceLength = 0;
			
			// cut out the object by finding when its number of opening/closing braces match
			for (var i = 0; string.length > i; i++) {
				if (string[i] === '{') {
					enterBracesInt++;
				}
				if (string[i] === '}') {
					exitBracesInt++;
				}
				if (i !== 0) {
					if (enterBracesInt === exitBracesInt) {
						sliceLength = i + 1;	// need an extra increment to catch the ending brace
						break;
					}	
				}
			}
			
			var slicedString = string.slice(0, sliceLength);
			return slicedString;
		},

		// take the return block as a string and return an object that can be normalized
		parseReturnBlock: function( string ) {
			var slicedString = this.sliceReturnBlock(string);
			slicedString = slicedString.replace('{', '');
			slicedString = slicedString.replace('}', '');

			var props = slicedString.split(',');
			var obj = {};

			for (var p = 0; props.length > p; p++) {

				var pair = props[p].split(':');

				pair[1] = pair[1].replace(/'*/g, "");

				obj[pair[0]] = pair[1];
			}

			return obj;
		}
	}
};

module.exports = parseFunctions;
},{}],6:[function(require,module,exports){
var stringify = function( nerve ) {

	return {
		normalized: function(normalized) {
			// let one do function do one thing:
			// take a normalized structure and recursively stringify it

			var string = '';
			for (var n = 0; normalized.length > n; n++) {
				var normalizedType = toType(normalized[n]);

				switch (normalizedType) {
					case 'object':
						string += this.object(normalized[n]);
						
					break;
					case 'string':
						console.log('let me know')
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

		func: function(obj) {
			// can be moved to a global config later
			var delimiters = {
				evaluate: ['<<', '>>'],
				interpolate: ['~~', '~~'],
				escape: ['--', '--'],
				srcBreak: '%break%'
			}

			var splitSrc = obj.src.split(delimiters.srcBreak);

			var string = '';

			// we loop based on the number of returned inner blocks
			for (var s = 0; obj.inner.length > s; s++) {
				// enclose the split src strings in evaluation brackets
				string += delimiters.evaluate[0] + splitSrc[s] + delimiters.evaluate[1];

				// we don't use stringify() here because that will cause unnecessary nested loops
				// we also know its type, so we can stringify it directly
				string += this.html(obj.inner[s]);
			}
			// we can assume there will be an ending bracket in most control structures
			string += delimiters.evaluate[0] + splitSrc[s] + delimiters.evaluate[1];

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

			if (obj.hasOwnProperty('inner') && obj.inner.length && toType(obj.inner) !== 'string') {
				string += this.normalized(obj.inner);
			} else if (toType(obj.inner) === 'string') {
				string += obj.inner;
			}

			string += '</' + obj.tagName + '>';

			return string;
		}
	}
};

module.exports = stringify;

},{}],7:[function(require,module,exports){
var toType = function(obj) {
	// better type checking
	// https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
	if (obj.hasOwnProperty('type') && obj.type === 'component') {
		return 'component';
	} else {
		return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
	}
}

module.exports = toType;
},{}]},{},[2]);
