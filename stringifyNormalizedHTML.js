stringifyHTMLObj = function( obj ) {
	// take an object representing a DOM element and stringify it as HTML

	var string = '<' + obj.tagName;

	// id attribute
	if (obj.id) {
		string += ' id="' + obj.id + '"';
	}

	// class attributes
	if ( obj.classes.length ) {
		string += ' class="' + obj.classes.join(' ') + '"';
	}
}