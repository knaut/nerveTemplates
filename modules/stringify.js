module.exports = {
	normalized: function(normalized) {
		// let one do function do one thing:
		// take a normalized structure and recursively stringify it

		var string = '';
		for (var n = 0; normalized.length > n; n++) {
			var normalizedType = nerve.toType(normalized[n]);

			switch (normalizedType) {
				case 'object':
					string += this.object(normalized[n]);
					break;
				case 'component':
					// seriously
					string += this.normalized( normalized[n].normalized );
					break;
			}
		}
		return string;
	},

	object: function(obj) {
		// helps split up the control logic
		// we can stringify based on the type of object we normalized
		// or easily add more type cases in the future
		var string = '';
		switch (obj.type) {
			case 'html':
				string = this.html(obj);
				break;
			case 'function':
				string = this.func(obj);
				break;
		}
		return string;
	},

	html: function(obj) {
		var string = '<' + obj.tagName;

		// id
		if (obj.id) {
			string += ' id="' + obj.id + '"';
		}

		// classes
		if (obj.hasOwnProperty('classes') && obj.classes.length) {
			string += ' class="' + obj.classes.join(' ') + '"';
		}

		// custom attrs
		if (obj.hasOwnProperty('attrs') && obj.attrs.length) {

			// loop through array of key/vals
			for (var a = 0; obj.attrs.length > a; a++) {
				var attr = obj.attrs[a];

				// for each pair, concatenate them as a single string
				var pair = []

				for (var key in attr) {
					pair.push(attr[key])
				}

				if (pair[1] === undefined) {
					
					string += ' ' + pair[0];

				} else {

					pair[1] = '"' + pair[1] + '"';
					pair = pair.join('=');

					// we add to the string each time in the loop, accounting for each attr in the array
					string += ' ' + pair;	

				}
				
			}
		}

		// end the opening tag
		string += '>';
		var innerType = nerve.toType(obj.inner);
		if (obj.hasOwnProperty('inner') && innerType === 'array' && innerType !== 'string') {
			string += this.normalized(obj.inner);
		} else if (innerType === 'string' || innerType === 'number') {
			string += obj.inner;
		}

		string += '</' + obj.tagName + '>';

		return string;
	}
}