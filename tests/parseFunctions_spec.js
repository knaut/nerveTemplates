// these funcs aren't run, just parsed
var testFuncs = [
	function() {
		return {
			'div': 'foo'
		}	
	},
	function() {
		for (var n = 0; props.length > n; n++) {
			return {
				'div': '~~props[n]~~'
			}
		}
	}
]

var nerve = new Nerve();

var testFunc = function( test ) {
	console.log(test);

	var parsed = nerve.parse.functions.normalize( test );
	console.log(parsed)

		// it('should return an object with keys inner, src, type', function() {
		// 	console.log(parsed)

		// 	expect( nerve.toType( parsed ) ).toEqual('object')
		// 	expect( nerve.toType( parsed.inner ) ).toEqual('array');
		// 	expect( nerve.toType( parsed.src ) ).toEqual('string');
		// 	expect( parsed.type ).toEqual('function');

		// });

		

}

for (var f = 0; testFuncs.length > f; f++) {
	testFunc( testFuncs[f] );
}