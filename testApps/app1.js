var Component = require('../component.js');

var child1 = Component.extend({
	template: {
		'#someId': function() {
			if (!this.data) {
				return {
					div: 'wat!!!!'
				}
			} else {
				return {
					div: ''
				}
			}
		}
	}
});

var child2 = Component.extend({
	template: {
		'#someOtherId': 'foo'
	}
});

testComp = new Component({
	data: {
		foo: 'bar'
	},

	template: {
		div: function() {
			return {
				li: new child1({
					data: false
				})
			}
		}
	}
});

testComp2 = new Component({
	data: [
		'blah',
		'test',
		'wat'
	],

	template: {
		div: function() {
			var arr = [];
			
			for (var v = 0; this.data.length > v; v++) {
				arr.push( new child1({data:true}) );
			}

			return arr;
		}
	}
});