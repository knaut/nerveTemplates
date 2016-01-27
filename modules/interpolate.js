module.exports = function(key) {
	// extract stringified refs based on a custom syntax
	var reg = /\<\<([a-zA-Z|\.]*)\>\>/g;
	var arr = key.match(reg);

	// loop through the references
	for (var a = 0; arr.length > a; a++) {

		// better regexing, or passing a handler to replace, might save us this cleanup dance
		var ref = arr[a].replace(/[\<*|\>*]/g, '');

		// we could eval here
		// instead we'll construct a custom function that only returns based on type (for security concerns)
		// then we'll call that in the context of the current object we're mixed into
		var interpolatedRef = (new Function(
			// only strings and numbers should be acceptable as references
			'if (typeof ' + ref + ' === \'string\' || typeof ' + ref + ' === \'number\') { ' +
				'return ' + ref +
			'} else {' +
				'throw new Error("Bad reference encountered while interpolating template:", ' + ref + ');' +
			'}')).call(this);

		// replace each found reference in our array with its interpolated equivalent
		key = key.replace(arr[a], interpolatedRef)
	}

	return key;
}