var stringify = (function() {

	return {
		string: '',

		normalizedFunction: function( obj ) {

			var splitSrc = obj.src.split('%break%');

			for (var ss = 0; splitSrc.length > ss; ss++) {
				splitSrc[ss] = '<<' + splitSrc[ss] + '>>';
			}

			// stringify inner blocks first
			var innerString;
			var stringifiedInnerSrc;

			console.log(obj)
			for (var i = 0; splitSrc.length > i; i++) {
				console.log( splitSrc[i], i )
				console.log( obj.inner[i] );

				if (obj.inner[i] !== undefined) {
					console.log( this.normalizedHtml( obj.inner[i] ) );	
				}
				
			}
		},

		normalizedHtml: function( obj ) {
			var string = '';

			string += '<' + obj.tagName;

			// id
			if (obj.id) {
				string += ' id="' + obj.id + '"';
			}

			// classes
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

			// end the tag
			string += '>';
			console.log(string)
		}
	}

})();