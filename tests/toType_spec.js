describe( 'toType', function() {

	var nerve = new Nerve();

	it( 'should return a string of the object\'s type', function() {

		// array
		expect( nerve.toType( [] ) ).toEqual('array');

		// object
		expect( nerve.toType( {} ) ).toEqual('object');

		// function
		expect( nerve.toType( function(){} ) ).toEqual('function');

		// number
		expect( nerve.toType( 0 ) ).toEqual('number');

		// string
		expect( nerve.toType( 'test' ) ).toEqual('string');
	});

});
