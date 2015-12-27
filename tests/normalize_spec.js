var normalized = normalize(template)

describe('normalized', function() {
	it('should be an array', function() {
		expect( toType( normalized ) ).toEqual('array');
	});

	// only single root supported atm
	// it('should have a single root', function() {
	// 	expect( normalized.length ).toEqual(1);
	// });

	// check for inner
	it('should have a property "inner" that is a string or array', function() {
		expect( normalized.hasOwnProperty('inner') ).toEqual(true);
		console.log( normalized)
		var isStringOrArray = false;
		for (var n = 0; normalized.length > n; n++) {
			console.log( toType(normalized[n].inner))
			if ( toType( normalized[n].inner ) === 'string' || toType( normalized[n].inner ) === 'array' ) {
				
				isStringOrArray = true;
				console.log(isStringOrArray)
			}	
		}
		expect( isStringOrArray ).toEqual(true);
	});
})