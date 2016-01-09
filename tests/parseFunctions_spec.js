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

	var parsed = nerve.parse.functions.normalize( test );

}

for (var f = 0; testFuncs.length > f; f++) {
	testFunc( testFuncs[f] );
}