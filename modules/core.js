var Nerve = function( component ) {
	this.component = component;

	this.parse = {
		functions: functionParser( this ),
		css: parseCSSKey( this )
	}

	this.stringify = stringify( this );

	this.normalize = normalize( this );

	this.toType = toType;
}