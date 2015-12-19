normalize = function( struct ) {
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
			for (var key in struct) {
				var parsed = parseCSSKey.parseSelector( key );
				parsed.inner = normalize( struct[key] );
			}

			normalized.push( parsed );
		break;
	}

	return normalized;

}