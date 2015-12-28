var functionParser = (function() {
	
	return {
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

			

			var normalizedReturnBlocks = normalize(parsedReturnBlocks);
			
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
				inner: normalizedReturnBlocks
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
})();