var _ = require('underscore');
var extend = require('./extend.js');
var nerve = require('./core.js');

Component = function(obj) {
	for (var prop in obj) {
		this[prop] = obj[prop];
	}

	if (!this['type']) {
		this.type = 'component'
	}

	if (!this['children']) {
		this.children = []
	}

	this.normalized = null;

	this.initialize.apply(this, arguments);
}

methods = {
	initialize: function() {
		this.normalized = this.normalize( this.template );
		this.stringified = this.stringify.normalized( this.normalized );
	}
}

// we need to use the nerve object like a mixin
// every component should have access to its library

for (var prop in nerve) {
	Component.prototype[prop] = nerve[prop];
}

_.extend(Component.prototype, methods);

Component.extend = extend;

module.exports = Component;