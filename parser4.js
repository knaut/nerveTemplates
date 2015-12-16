// the main object
// imagine this sole object being responsible for the transformation of template literals
// into template strings
tl = {
	transform: function( struct ) {
		// the main function, entry point for any template literal
	},

	toType: function(obj) {
		// better type checking
		// https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
		var type = ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
		
		// for components, we assume they will be capitalized or pascal cased
		if (type === 'string') {
			if (obj.toLowerCase() !== obj) {
				type = 'component'
			}
		}

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

				for (var key in obj) {

					var parsed = this.parse( obj, key );

					if (typeof parsed.inner === 'object' || typeof parsed.inner === 'array') {
						parsed.inner = this.normalize( parsed.inner );
					}

					if (typeof parsed.inner === 'function') {
						
						parsed.inner = [
							this.normalizeFunction( parsed.inner )
						];

						if ( parsed.inner[0].hasOwnProperty('inner') && parsed.inner[0].inner.length ) {

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
		console.log( typeof normalized, normalized )
		if (typeof normalized === 'string') return;
		
		for (var n = 0; normalized.length > n; n++) {

			var obj = normalized[n];

			if (obj.tagName === 'function') {
				console.log('stringify function', obj);
				var splitSrc = obj.src.split('%break%');
				
				for (var ss = 0; splitSrc.length > ss; ss++) {
					splitSrc[ss] = '<<' + splitSrc[ss] + '>>';

					if (obj[ss] !== undefined) {
						var stringifiedBlock = this.stringify( obj.inner[ss] );
						string = splitSrc[ss] + stringifiedBlock;
					}
					
				}
				
				// string = splitSrc.join('%break%');
				console.log(string);
				
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


			if (obj.tagName !== 'function') {
				string += '</' + obj.tagName + '>';	
			}
			

			console.log(string)
		}

		return string;

	},

	parseCSSKey: function( key ) {
		// parse a CSS key and normalize it as a a JS object
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
		*/

		console.log(key);

		var normal = {
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


		for (var d = 0; dom.length > d; d++) {
			// if indexOf is 0, we know we've matched the string at the very beginning. in css selectors, this is the tag name
			if ( key.indexOf( dom[d] ) === 0 ) {
				break;
			} else {
				// 'asdf' will match with 'a'
				normal.tagName = dom[d];
			}
		}

		

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
			slicedReturnBlocks.push( sliceReturnBlock( trimmedSrcBody ) );
			parsedReturnBlocks.push( parseReturnBlock( trimmedSrcBody ) );
		}

		var normalizedReturnBlocks = normalize(parsedReturnBlocks);

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
			tagName: 'function',
			src: script,
			inner: parsedReturnBlocks
		}

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
		var slicedString = sliceReturnBlock(string);
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





