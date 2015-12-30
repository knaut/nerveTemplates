var nerve = (function() {

	var core = {
		parse: parse,
		stringify: stringify,
		normalize: normalize,
		render: function( template ) {		
			return this.stringify.normalized( this.normalize( template ) );
		}
	}

	return core;
	
})();