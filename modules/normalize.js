module.exports = function(struct) {
	var normalized = [];

	switch (this.toType(struct)) {
		case 'string':
			return struct;
			break;
		case 'number':
			return struct;
			break;
		case 'array':

			// for component based library (Ulna), check if we're mixed into the component
			// prototype, and assume on its api
			if (this.type === 'component') {
				// this is uninintuitive but works because of recursion
				// when we loop, we push to the normalized struct (component's) children
				for (var x = 0; struct.length > x; x++) {
					normalized.push = this.normalize(struct[x]);
				}

				// we're still in this seperate function process
				// by setting normalized to the struct, we return the array for normalized templates
				normalized = struct;

			} else {
				
				// code where we assume every array holds another nerve template object
				for (var i = 0; struct.length > i; i++) {

					var obj = struct[i];

					for (var key in obj) {

						// check for interpolated keys
						key = this.interpolate( key );

						var parsed = this.parse.css.selector(key);
						parsed.inner = this.normalize(obj[key]);
					}

					normalized.push(parsed)
				}
			}

			break;
		case 'object':
			var keys = Object.keys(struct);

			for (var k = 0; keys.length > k; k++) {
				var obj = {};
				var key = keys[k];
				var val = struct[key];

				obj[key] = val;

				for (var keyS in obj) {

					// check for interpolatable keys
					if (key.indexOf('<<') > -1 && key.indexOf('>>') > -1) {

						var interpolatedKey = this.interpolate( keyS );
						struct[interpolatedKey] = struct[keyS];
						
						delete struct[keyS];

						var parsed = this.parse.css.selector(interpolatedKey);
						parsed.inner = this.normalize(struct[interpolatedKey]);
					} else {
						var parsed = this.parse.css.selector(keyS);
						parsed.inner = this.normalize(struct[keyS]);
					}
				}

				normalized.push(parsed);
			}
			break;
		case 'function':
			// console.log('found a function', struct);

			// here we set the returned object as the result of whatever the function ran,
			// resulting in a structure that should also be normalized

			// we call this as the current context, assuming that this is a component
			normalized = this.normalize(struct.call(this));

			break;
		case 'component':
			// console.log('found a component');

			// for components we push a parent reference
			struct['parent'] = this;

			// assuming refactored Ulna api
			// we push to a children array for convenient references
			this.children.push(struct);

			// we push to the normalized template
			// or, we could just set the normalized array as the next component structure
			// depends if we want the component's api in normalized object
			normalized = struct.normalized;
			// normalized.push( struct );

			break;
	}

	return normalized;
}