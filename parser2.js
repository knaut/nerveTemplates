function generateTag( selector ) {
	var parsed = peg.parse( selector );
	var string = '';
	var tagName;

	// first place in the object is the tag name
	if (parsed[0] === null) {
			// no el specified, default to div
			tagName = 'div';
			string += '<' + tagName;
	} else if ( typeof parsed[0] === 'string' ) {
		
		if (parsed[0][0].toUpperCase() === parsed[0][0]) {
			
			// if uppercase/PascalCase, it's a component
			console.log('component');
			return;
			// at this point we would evaluate the name as a component reference. the parent component would then apply this reference when it encounters a prop attribute with this key

		} else {
			// it's an element
			tagName = parsed[0];
			string += '<' + tagName;
		}
	}

	// second place in the object is the id
	if (parsed[1] !== null) {
		string += ' id="' + parsed[1].split('#')[1] + '"';
	}

	// third place could be classes or custom attributes (pseudo elements won't be supported, since we're generating elements, not selecting them)
	if (parsed[2].length) {
		
		var attrReg = /[a-z-]+/gi;

		classes = [];
		attrs = [];

		for (var p = 0; parsed[2].length > p; p++) {

			if (parsed[2][p].indexOf('.') > -1) {
				// if the string has a ., we will assume it's a css class
				var className = parsed[2][p].split('.')[1];
				classes.push( className );
			} 

			if (parsed[2][p].indexOf('[') > -1) {
				var attr = parsed[2][p];
				var attrKey = attr.match(attrReg)[0];
				var attrVal = attr.match(attrReg)[1];

				attr = attrKey + '="' + attrVal + '"';
				attrs.push(attr);
			}
		}

		if (classes.length) {
			classes = 'class="' + classes.join(' ') + '"';
			string += ' ' + classes;
		}

		if (attrs.length) {
			attrs = attrs.join(' ');
			string += ' ' + attrs;
		}
	}

	

	string += '>';
	
	return {
		string: string,
		tagName: tagName
	};
}