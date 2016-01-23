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

	if (!this['data']) {
		this.data = {}
	}

	this.normalized = null;

	this.initialize();
}

Component.prototype = {
	initialize: function() {
		this.normalized = this.normalize( this.template );
	}
}

// we need to use the nerve object like a mixin
// every component should have access to its library

for (var prop in nerve) {
	Component.prototype[prop] = nerve[prop];
}

module.exports = Component;