var parseFunctions = require('./modules/parseFunctions.js');
var parseCSSKey = require('./modules/parseCSSKey.js');
var normalize = require('./modules/normalize');
var stringify = require('./modules/stringify');
var toType = require('./modules/toType');

var Nerve = function( component ) {
	this.component = component;

	this.parse = {
		functions: parseFunctions( this ),
		css: parseCSSKey( this )
	}

	this.stringify = stringify( this );

	this.normalize = normalize( this );

	this.toType = toType;
}

if (typeof window !== "undefined") {
	window.Nerve = Nerve;
}

var Component = require('./component.js');

var testComponent = new Component({
	span: 'blah'
})

window.testTemp = {
	div: function() {
		return testComponent;
	}
}

exports.Nerve = Nerve;