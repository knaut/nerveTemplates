var normalize = function( struct ) {
	// take a nerve template of static css selectors
	// and normalize it as a nested structure
	/*
	test structures:
	[{
		'div#blah': [
			{ 'span': '{{blah}}' },
			{ 'div': '{{blah}}' }
		]
	}]

	[{
		'div#blah': { 'span': '{{blah}}' }
	}]

	example:
	[	
		{
			type: 'html',
			attrs: [ { 
				attrKey: 'data-val'
				attrVal: 'value' } ],
			classes: [ 'className' ],
			id: 'string',
			tagName: 'string',
			inner: [
				{}
			]
		}
	]
	*/
	var normalized = [];

	switch( toType(struct) ) {
		case 'string':
			return struct;
		break;
		case 'array':
			for (var i = 0; struct.length > i; i++) {
				
				var obj = struct[i];

				for (var key in obj) {
					var parsed = parseCSSKey.parseSelector( key );
					parsed.inner = normalize( obj[key] );
				}

				normalized.push( parsed )
			}
		break;
		case 'object':

			var keys = Object.keys( struct );

			for (var k = 0; keys.length > k; k++) {
				var obj = {};
				var key = keys[k];
				var val = struct[key];

				obj[key] = val;

				for (var keyS in obj) {
					var parsed = parseCSSKey.parseSelector( keyS );
					parsed.inner = normalize( struct[keyS] );
				}

				normalized.push(parsed);
			}

		break;
	}

	return normalized;

}