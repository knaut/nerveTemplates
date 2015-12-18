stringify = function(normalized) {

	var string = '';
	var innerChildren = [];

	// iterate through the parsed object and
	// modify the string
	console.log(typeof normalized, normalized)
	if (typeof normalized === 'string') return;

	for (var n = 0; normalized.length > n; n++) {

		var obj = normalized[n];

		if (obj.tagName === 'function') {
			console.log('stringify function', obj);
			var splitSrc = obj.src.split('%break%');

			for (var ss = 0; splitSrc.length > ss; ss++) {
				splitSrc[ss] = '<<' + splitSrc[ss] + '>>';

				if (obj[ss] !== undefined) {
					var stringifiedBlock = stringify(obj.inner[ss]);
					string = splitSrc[ss] + stringifiedBlock;
				}

			}

			console.log(splitSrc)

			// stringify any inners first, and then insert them into the split src
			if (obj.hasOwnProperty('inner') && obj.inner.length && typeof obj.inner !== 'string') {
				console.log(obj)
				

				// cycle through the inners and stringify them, one by one, 
				// attaching them in order with our split src
				var innerString;
				var stringifiedInnerSrc;
				for (var i = 0; splitSrc.length > i; i++) {
					console.log(splitSrc[i] )
					innerString = stringify( [ obj.inner[i] ] );

					stringifiedInnerSrc = splitSrc[i] + innerString;
				}

				var stringifiedInner = stringifiedInnerSrc;

				console.log(stringifiedInner)

				string += stringifiedInner;

				// return stringifiedInner
				
			} else if (typeof obj.inner === 'string') {
				
				string += obj.inner;
				var stringifiedInner = obj.inner;
			}

			console.log('inner' , stringifiedInner)



			// string = splitSrc.join('%break%');
			console.log(string, splitSrc);

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
			string += stringify(obj.inner);
		} else if (typeof obj.inner === 'string') {
			string += obj.inner;
		}


		if (obj.tagName !== 'function') {
			string += '</' + obj.tagName + '>';
		}


		console.log(string)
	}

	return string;

}