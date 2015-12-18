// the main object
// imagine this sole object being responsible for the transformation of template literals
// into template strings
tl = {
	transform: function( struct ) {
		// the main function, entry point for any template literal
		// console.log(struct);

		var type = this.toType( struct );
		var normalized = [];

		if (type === 'object') {
			var keys = Object.keys( struct );

			for (var k = 0; keys.length > k; k++) {
				var obj = {};
				var key = keys[k];
				var val = struct[key];

				obj[key] = val;

				normalized.push(obj);
			}
		}

		// console.log(type, normalized);

		for (var i = 0; normalized.length > i; i++) {

			var obj = normalized[i];

			for ( var key in obj ) {

				var parsed = this.parseCSSKey( key );
				parsed.inner = obj[key]

				// console.log(parsed)
			}
		}

		var innerType = this.toType( parsed.inner );

		console.log(innerType, parsed.inner)

		if (innerType === 'function') {
			parsed.inner = [ this.parseFunction( parsed.inner ) ]

			for ( var p = 0; parsed.inner[0].inner.length > p; p++ ) {
				parsed.inner[0].inner[p] = this.transform( parsed.inner[0].inner[p] )[0];
			}
		}

		if (innerType === 'array') {
			for (var p = 0; parsed.inner.length > p; p++) {
				console.log( parsed.inner[p] )
				parsed.inner[p] = this.transform( parsed.inner[p] );
			}
		}
		
		if (innerType === 'object') {
		// 	var innerKeys = Object.keys(parsed.inner);

		// 	var normalizedInner = []
		// 	for (var n = 0; innerKeys.length > n; n++) {
		// 		console.log( parsed.inner[ innerKeys[n] ] )
		// 	}

			parsed.inner = this.transform( parsed.inner );
		}



		console.log(parsed)

		return [ parsed ];

	},

	toType: function(obj) {
		// better type checking
		// https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
		var type = ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
		
		// for components, we assume they will be capitalized or pascal cased
		// if (type === 'string') {
		// 	if (obj.toLowerCase() !== obj) {
		// 		type = 'component'
		// 	}
		// }

		return type;
	},

	normalize: function( struct ) {
		// recursively take a nested object where the keys are selectors
		// and the vals are objects, arrays, or text nodes (strings)
		// and normalize it into a consistently nested pattern of
		// arrayed objects that map easily to DOM nodes

		/* 
		normalized DOM:
			{
				type: 'dom',
				attrs: [ { data-val: 'value' } ],
				classes: [ 'className' ],
				id: 'string',
				inner: [],
				tagName: 'string'
			}

		normalized function:
			{
				type: 'function',
				inner: [ //more normalized objects ],
				src: 'functionSrc'
			}
		*/

		var type = this.toType( struct );
		var normalized = []; // normalize objects as arrays

		if (type === 'object') {
			var keys = Object.keys( struct );

			for (var k = 0; keys.length > k; k++) {
				var obj = {};
				var key = keys[k];
				var val = struct[key];

				obj[key] = val;

				normalized.push(obj);
			}
		}

		if (type === 'array') {
			for (var a = 0; struct.length > a; a++) {
				var ai = struct[a];
				
				if (typeof ai === 'string') {
					var obj = {};
					var key = ai.split(/:/)[0];
					var val = ai.split(/:/)[1];

					obj[key] = val;

					normalized.push(obj);
				} else {
					normalized.push(ai);
				}
			}
		}

		// scope an array to push parsed objects to later
		var newStruct = [];

		if (type === 'object' || type === 'array') {

			// we loop through all structs at the root level
			for (var i = 0; normalized.length > i; i++) {

				var obj = normalized[i];

				// cycle through the keys
				for (var key in obj) {

					// parse keys as css selectors
					var parsed = this.parseCSSKey( key );

					// set inner as this key's value
					// console.log(key, obj[key])
					// if (parsed)
					parsed.inner = obj[key];

					if (typeof parsed.inner === 'object' || typeof parsed.inner === 'array') {
						parsed.inner = this.normalize( parsed.inner );
					}

					if (typeof parsed.inner === 'function') {
						// console.log(parsed.inner)
						
						parsed.inner = [
							this.parseFunction( parsed.inner )
						];

						// console.log(parsed.inner)
						
						// if ( parsed.inner[0].hasOwnProperty('inner') && parsed.inner[0].inner.length ) {
						if ( parsed.inner[0].hasOwnProperty('inner') ) {
						
							// console.log(parsed.inner[0].inner)
							for ( var p = 0; parsed.inner[0].inner.length > p; p++ ) {
								parsed.inner[0].inner[p] = this.normalize( parsed.inner[0].inner[0] )[0];
							}
						}
					}
				}

				newStruct.push(parsed)
			}
		}

		// the final returned structure should be a normalized pattern,
		// where every tag is an object whose inner content is either a 
		// plain string (text), null, or an array of one or more tags…
		return newStruct;
	},

	// take the normalized, nested array of objects and output a string that can
	// be used as a template
	stringify: function(normalized) {

		var string = '';
		var innerChildren = [];

		// iterate through the parsed object and
		// modify the string
		// console.log( typeof normalized, normalized )
		if (typeof normalized === 'string') return;
		
		for (var n = 0; normalized.length > n; n++) {

			var obj = normalized[n];

			if (obj.type === 'function') {
				// console.log('stringify function', obj);
				var splitSrc = obj.src.split('%break%');
				
				for (var ss = 0; splitSrc.length > ss; ss++) {
					splitSrc[ss] = '<<' + splitSrc[ss] + '>>';

					if (obj[ss] !== undefined) {
						var stringifiedBlock = this.stringify( obj.inner[ss] );
						string = splitSrc[ss] + stringifiedBlock;
					}
					
				}
				
				string = splitSrc.join('%break%');
				// console.log(string);
				
			} else {


				string += '<' + obj.tagName;

				// id attribute
				if (obj.id) {
					string += ' id="' + obj.id + '"';
				}

				// class attributes
				if (obj.hasOwnProperty('classes') && obj.classes.length) {
					string += ' class="' + obj.classes.join(' ') + '"';
				}

				// custom attributes
				if (obj.hasOwnProperty('attrs') && obj.attrs.length) {
					// loop through array of key/vals
					for (var a = 0; obj.attrs.length > a; a++) {
						var attr = obj.attrs[a];
						for (var attrKey in attr) {
							string += ' ' + attrKey + '="' + attr[attrKey] + '"'
						}
					}
				}

				// end the root tag
				string += '>';

			}

			if (obj.hasOwnProperty('inner') && obj.inner.length && typeof obj.inner !== 'string') {
				// console.log(obj)
				string += this.stringify(obj.inner);
			} else if (typeof obj.inner === 'string') {
				string += obj.inner;
			}


			if (obj.type !== 'function') {
				string += '</' + obj.tagName + '>';	
			}
			

			// console.log(string)
		}

		return string;

	},

	parseCSSKey: function( string ) {
		// parse a CSS key and normalized it as a a JS object
		/* 
		normalized DOM example:
			{
				type: 'dom',
				attrs: [ { data-val: 'value' } ],
				classes: [ 'className' ],
				id: 'string',
				inner: [],
				tagName: 'string'
			}
		*/
		// console.log(string);

		// we'll reassign the incoming string and whittle it down until there's nothing left to iterate over
		var key = string;

		// create a blank normalized object
		var normalized = {
			type: 'dom',
			attrs: [],
			classes: [],
			id: undefined,
			inner: [],
			tagName: undefined
		};

		// list of all possible dom tags
		var dom = [
			'div', 'a', 'p', 'span', 'ul', 'li', 'header', 'article', 'section', 'nav', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre'
		];

		var delimit = {
			'class': '.',
			id: '#',
			attr: [ '[', ']' ]
		};

		var regx = {
			id: /(#[^\s|\.]*)/,
			attrs: /(\[\S*\])/,
			'class': /(\.[^\.|\[|#]*)/
		}

		// start with the tag name, which appears first in valid css selectors
		for (var d = 0; dom.length > d; d++) {
			// if indexOf is 0, we know we've matched the string at the very beginning. in css selectors, this is the tag name
			
			if ( key.indexOf( dom[d] ) === 0 ) {
				// assign the tag name to the normalized object
				normalized.tagName = dom[d];

				// get rid of the tag name in our key
				key = key.substring( dom[d].length );
				
			}
		}

		// default to div if no tagname, and we're not a blank string
		if (normalized.tagName === undefined && key.length) {
			normalized.tagName = 'div'
		}

		// parse id
		if (key.indexOf( '#' ) > -1) {
			var id = key.match( regx.id )[0];
			id = id.split('#')[1];

			normalized.id = id;

			// reassign the key as a substring based on the length of the
			// id, adding one for the '#'
			key = key.substring( id.length + 1 );
		}

		// parse classes
		if (key.indexOf( delimit.class ) > -1) {
			// we split with a regex because it matches only relevent substrings
			// string delimiters can catch trailing attribute selectors, etc.
			var classSplit = key.split( regx.class );
			
			// a sanitized classes array
			var classes = [];

			for (var c = 0; classSplit.length > c; c++) {

				// push to a sanitized array with only our class substrings
				if (classSplit[c].indexOf('.') > -1) {

					// replace the '.' part of the selector while we're at it
					classes.push( classSplit[c].replace('.','') );

					// get rid of the class substring in our key
					key = key.replace( classSplit[c], '' );
				}
			}

			// assign our sanitized classes array to the normalized object
			normalized.classes = classes;
			// console.log('normalized classes', normalized);
		}

		// parse custom attributes
		if (regx.attrs.test( key )) {

			var attrsArr = key.split('[');

			// check for blanks
			for (var v = 0; attrsArr.length > v; v++) {
				if (attrsArr[v].length === 0) {
					attrsArr.splice(v, 1);
				}
			}

			// parse the key/val pairs
			for (var a = 0; attrsArr.length > a; a++) {
				
				// clean up the attr declaration
				var attrString = attrsArr[a].replace(']', '');

				var attrPair = attrString.split('=');

				var attr = {
					attrKey: attrPair[0],
					// get rid of any extra quotes
					attrVal: attrPair[1].replace(/["']/g, "")
				};

				// push to normalized
				normalized.attrs.push(attr);
			}
		}

		
		return normalized;
	},

	parseFunction: function( func ) {
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
		for (var i = 0; srcBody.length > i; i++) {
			var trimmedSrcBody = srcBody[i].replace(/\s/g, "");
			slicedReturnBlocks.push( this.sliceReturnBlock( trimmedSrcBody ) );
			parsedReturnBlocks.push( this.parseReturnBlock( trimmedSrcBody ) );
		}

		// console.log(parsedReturnBlocks)

		var normalizedReturnBlocks = this.normalize(parsedReturnBlocks);
		
		// console.log(normalizedReturnBlocks)

		// normalized return blocks are inner properties of code blocks
		var script = func.toString();
		// lose the whitespace
		script = script.replace(/\s/g, "");
		script = script.split( rgfuncHead )[1];
		script = script.split( rgfuncTail )[0];

		for ( var n = 0; slicedReturnBlocks.length > n; n++) {
			script = script.replace( keyword + slicedReturnBlocks[n] , '%break%' );
		}

		var parsedFunc = {
			type: 'function',
			src: script,
			inner: parsedReturnBlocks
		}

		// console.log(parsedFunc)

		return parsedFunc;
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
			if (enterBracesInt === exitBracesInt) {
				sliceLength = i + 1;	// need an extra increment to catch the ending brace
				break;
			}
		}
		
		var slicedString = string.slice(0, sliceLength);
		
		return slicedString;
	},

	// take the return block as a string and return an object that can be normalized
	parseReturnBlock: function( string ) {
		// console.log(string)
		var slicedString = this.sliceReturnBlock(string);
		slicedString = slicedString.replace('{', '');
		slicedString = slicedString.replace('}', '');

		var props = slicedString.split(',');
		var obj = {};

		// console.log(props)

		for (var p = 0; props.length > p; p++) {

			var pair = props[p].split(':');

			pair[1] = pair[1].replace(/'*/g, "");

			obj[pair[0]] = pair[1];
		}

		// console.log(obj)

		return obj;
	}
}





