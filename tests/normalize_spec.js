var nerve = new Nerve();

describe('normalized', function() {
	it('should be an array', function() {
		expect( nerve.toType( normalized ) ).toEqual('array');
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
			console.log( nerve.toType(normalized[n].inner))
			if ( nerve.toType( normalized[n].inner ) === 'string' || nerve.toType( normalized[n].inner ) === 'array' ) {
				
				isStringOrArray = true;
				console.log(isStringOrArray)
			}	
		}
		expect( isStringOrArray ).toEqual(true);
	});
})