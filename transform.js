toType: function(obj) {
	// better type checking
	// https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
	var type = ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();		
	// for components, we assume they will be capitalized or pascal cased
	// if (type === 'string') {
	// 	if (obj.toLowerCase() !== obj) {
	// 		type = 'component'
	// 	}
	// }
	return type;
}	

transform = function( struct ) {
	// the main function, entry point for any template literal

	// recursively take a nested object where the keys are selectors
		// and the vals are objects, arrays, or text nodes (strings)
		// and normalize it into a consistently nested pattern of
		// arrayed objects that map easily to DOM nodes

		/* 
		normalized DOM:
			{
				type: 'dom',
				attrs: [ { data-val: 'value' } ],
				classes: [ 'className' ],
				id: 'string',
				inner: [],
				tagName: 'string'
			}

			normalized function:
			{
				type: 'function',
				inner: [ //more normalized objects ],
				src: 'functionSrc'
			}
		*/

		console.log(struct);

		var type = toType( struct );
		var normalized = [];

		if (type === 'object') {
			var keys = Object.keys( struct );

			for (var k = 0; keys.length > k; k++) {
				var obj = {};
				var key = keys[k];
				var val = struct[key];

				obj[key] = val;

				normalized.push(obj);
			}
		} else if (type !== 'array') {
			console.log('Warning: asked to transform neither object nor array', struct);
		}

		console.log(type, normalized)

		for (var i = 0; normalized.length > i; i++) {

			var obj = normalized[i];

			for ( var key in obj ) {

				var parsed = this.parseCSSKey( key );

				console.log(parsed)
			}

		}

}