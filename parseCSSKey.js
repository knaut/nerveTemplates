parseCSSKey = function( string ) {
	// parse a CSS key and normalizedize it as a a JS object
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
		attrs: /(\[\S*\])/,
		'class': /(\.[a-zA-Z]*)/
	}

	// start with the tag name, which appears first in valid css selectors
	for (var d = 0; dom.length > d; d++) {
		// if indexOf is 0, we know we've matched the string at the very beginning. in css selectors, this is the tag name
		
		if ( key.indexOf( dom[d] ) === 0 ) {
			// assign the tag name to the normalized object
			normalized.tagName = dom[d];

			// get rid of the tag name in our key
			key = key.substring( dom[d].length );
			
		} else {
			// default to div
			normalized.tagName = 'div';
			// 'asdf' will match with 'a'
			break;
		}
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

	console.log(normalized)

}



















