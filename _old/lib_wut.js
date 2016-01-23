var component = function( obj ) {
	this.type = 'component';
	
	for (var prop in obj) {
		this[prop] = obj[prop];
	}
}

component.prototype = {};

var el = function( obj ) {
	this.type = 'tag';

	for (var prop in obj) {
		this[prop] = obj[prop];
	}
}

el.prototype = {};

var func = function( obj ) {
	this.type = 'function';

	for (var prop in obj) {
		this[prop] = obj[prop];
	}
};

