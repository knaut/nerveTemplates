parseCSSKey = function( string ) {
	// parse a CSS key and normalize it as a a JS object
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
		tagName: undefined
	};

	// list of all possible dom tags
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
	var needle = false;
	for (var d = 0; dom.length > d; d++) {

		// quick check to see if this valid dom element is in the key
		// make sure we start at the beginning
		
		if (key.indexOf( dom[d] ) > -1 || key.indexOf( dom[d] ) === 0) {
			
			var index = key.indexOf(dom[d]);
			var length = dom[d].length;

			// if the index of the place we found the dom el and the l
			var cutKey = key.substr( index, length );
			key = key.substring(0, length);
			
			console.log(cutKey, key)

			if (dom[d].length === cutKey.length) {
				needle = true;
				normalized.tagName = cutKey;
				break;
			}
		}
	}

	if (!needle) {
		normalized.tagName = 'div';
	}

	console.log(normalized.tagName)

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

	// // parse custom attributes
	// if (regx.attrs.test( key )) {

	// 	var attrsArr = key.split('[');

	// 	console.log(attrsArr)

	// 	// check for blanks
	// 	for (var v = 0; attrsArr.length > v; v++) {
	// 		if (attrsArr[v].length === 0) {
	// 			attrsArr.splice(v, 1);
	// 		}
	// 	}

	// 	// parse the key/val pairs
	// 	for (var a = 0; attrsArr.length > a; a++) {
			
	// 		// clean up the attr declaration of ] and ' "
	// 		if (attrsArr[a].indexOf(']')) {
	// 			attrsArr[a] = attrsArr[a].replace(']', '');
	// 		}
			
	// 		if (attrsArr[a].indexOf('"')) {
	// 			attrsArr[a] = attrsArr[a].replace('"', '');
	// 		}
			
	// 		if (attrsArr[a].indexOf('\'')) {
	// 			attrsArr[a] = attrsArr[a].replace('\'', '');
	// 		}
			
	// 		// var attrPair = attrString.split('=');
			
	// 		var attr = {
	// 			attrKey: attrPair[0],
	// 			// get rid of any extra quotes
	// 			attrVal: attrPair[1].replace(/["']/g, "")
	// 		};

	// 		// push to normalized
	// 		normalized.attrs.push(attr);
	// 	}
	// }

	if (normalized.id === undefined) {
		normalized.id = null;
	}

	return normalized;
}



















