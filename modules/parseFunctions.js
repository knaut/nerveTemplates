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
				// console.log(srcBody[i]);
				var trimmedSrcBody = srcBody[i].replace(/\t|\s{2,}|\n/g, ' ');
				// console.log(trimmedSrcBody)

				slicedReturnBlocks.push( this.sliceReturnBlock( trimmedSrcBody ) );
				parsedReturnBlocks.push( this.parseReturnBlock( trimmedSrcBody ) );
			}


			// normalized return blocks are inner properties of code blocks
			var script = func.toString();

			// lose the whitespace
			// console.log(script)
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
			// console.log(slicedString)
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

			// console.log(obj)
			return obj;
		}
	}
};

module.exports = parseFunctions;