describe( 'parseCSSKey', function() {

	it( 'should return an object from a CSS selector string', function() {

		expect( toType( parseCSSKey('div') ) ).toEqual( 'object' );

	});

	it( 'should have keys of type, attrs, classes, id, and tagName', function() {
		var actualKeys = Object.keys( parseCSSKey('div') ).sort();

		var expectedKeys = [
			'type',
			'attrs',
			'classes',
			'id',
			'inner',	// can remove inner later, not used in this function
			'tagName'
		].sort();

		expect( actualKeys ).toEqual( expectedKeys );

	});
});