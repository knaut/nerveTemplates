var stringify = (function() {

	return {
		normalized: function(normalized) {
			// let one do function do one thing:
			// take a normalized structure and recursively stringify it

			var string = '';
			for (var n = 0; normalized.length > n; n++) {
				var normalizedType = toType(normalized[n]);

				switch (normalizedType) {
					case 'object':
						string += stringify.object(normalized[n]);
						
					break;
					case 'string':
						console.log('let me know')
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
					string = stringify.html(obj);
				break;
				case 'function':
					string = stringify.func(obj);
				break;
			}
			return string;
		},

		func: function(obj) {
			// can be moved to a global config later
			var delimiters = {
				evaluate: ['<<', '>>'],
				interpolate: ['~~', '~~'],
				escape: ['--', '--'],
				srcBreak: '%break%'
			}

			var splitSrc = obj.src.split(delimiters.srcBreak);

			var string = '';

			// we loop based on the number of returned inner blocks
			for (var s = 0; obj.inner.length > s; s++) {
				// enclose the split src strings in evaluation brackets
				string += delimiters.evaluate[0] + splitSrc[s] + delimiters.evaluate[1];

				// we don't use stringify() here because that will cause unnecessary nested loops
				// we also know its type, so we can stringify it directly
				string += stringify.html(obj.inner[s]);
			}
			// we can assume there will be an ending bracket in most control structures
			string += delimiters.evaluate[0] + splitSrc[s] + delimiters.evaluate[1];

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

					for (var attrKey in attr) {
						string += ' '
					}
				}
			}

			// end the opening tag
			string += '>';

			if (obj.hasOwnProperty('inner') && obj.inner.length && toType(obj.inner) !== 'string') {
				string += stringify.normalized(obj.inner);
			} else if (toType(obj.inner) === 'string') {
				string += obj.inner;
			}

			string += '</' + obj.tagName + '>';

			return string;
		}
	}
})();
