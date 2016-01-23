nerve = {};
nerve.parse = {};

nerve.parse.css = require('./modules/parse/css.js');
nerve.toType = require('./modules/toType.js')
nerve.normalize = require('./modules/normalize.js');

var Component = require('./component.js');

var child1 = new Component({
	template: {
		'#someId': 'blah'
	}
});

var child2 = new Component({
	template: {
		'#someOtherId': 'foo'
	}
});

testComp = new Component({
	data: true,

	template: {
		div: function() {
			if (this.data) {
				return child1
			} else {
				return child2
			}
		}
	}
});






