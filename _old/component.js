var nerve = require('./core.js');

var Component = function( template ) {
	this.type = 'component';
	this.template = template;

	this.nerve = new Nerve();
}

module.exports = Component;


