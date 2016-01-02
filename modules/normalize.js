var normalize = function( nerve ) {
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

	return function( struct ) {

		var normalized = [];

		switch( toType(struct) ) {
			case 'string':
				return struct;
			break;
			case 'array':
				for (var i = 0; struct.length > i; i++) {
					
					var obj = struct[i];

					for (var key in obj) {
						var parsed = nerve.parse.css.selector( key );
						parsed.inner = nerve.normalize( obj[key] );
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
						var parsed = nerve.parse.css.selector( keyS );
						parsed.inner = nerve.normalize( struct[keyS] );
					}

					normalized.push(parsed);
				}
			break;
			case 'function':
				normalized.push( nerve.parse.functions.normalize( struct ) );
			break;
			case 'component':
				console.log('found component!', struct);

				struct['parent'] = nerve.component;

				nerve.component.children.push( struct );

				// if (children !== undefined) {
				// 	children.push( struct );	
				// }
				
				// this would dump the rendered template of the nested component into the next one
				// normalized = normalize( struct.template );
				// var normalStruct = normalize( struct.template );

				// console.log(this)

				

			break;
		}

		return normalized;

	}
}