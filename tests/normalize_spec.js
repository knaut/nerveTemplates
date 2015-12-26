var testStructures = [
	template
];

// we can test normalized template structures by comparing them with their
// associated template objects.
// if the nested structure matches, we can be sure we're not missing
// any elements.

testStructure = function( struct ) {
	console.log(struct, normalize( struct ));

	describe('template type', function() {
		it('should be an object', function() {
			expect(toType(struct)).toEqual('object');
		});
	});

	var normalized = normalize(struct);
	
	describe('normalized structure', function() {
		it('should be an array', function() {
			expect(toType(normalized)).toEqual('array');
		});
	});

	// traverse our normalized structure with our original template structure,
	// ensuring that we've achieved fidelity from template to normalized
	describe('for every key in the template structure', function() {
		for (var key in struct) {
			it('the value should be an object, array, or string', function() {
				var isValid = false;
				var keyType = toType(struct[key]);
				
				if (keyType === 'object' || keyType === 'array' || keyType === 'string') {
					isValid = true;
				}

				expect(isValid).toEqual(true);
			});
		}
	});
	



	// get the number of keys
	var normalizedKeysLength = Object.keys(normalized).length;

	// describe('testing normalized structure', function() {
		
	// 	var testStructKeysLength = Object.keys(struct).length;
		
	// 	it('should have the same number of keys (' + normalizedKeysLength + ') as its template (' + testStructKeysLength + ') at the root level', function() {
	// 		expect( normalizedKeysLength ).toEqual( testStructKeysLength );
	// 		// console.log(normalized.inner)
	// 		if (normalized[0].hasOwnProperty('inner')) {
	// 			testInner
	// 		}
	// 	});
	// })
}

var testInner = function( struct ) {

}

for (var v = 0; testStructures.length > v; v++) {
	testStructure( testStructures[v] );
}

// to test just one
// testSelector(testSelectors[0]);