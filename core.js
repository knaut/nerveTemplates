nerve = {};

nerve.parse = {};
nerve.parse.css = require('./modules/parse/css.js');

nerve.toType = function(obj) {
	// better type checking
	// https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
	if (obj.hasOwnProperty('type') && obj.type === 'component') {
		return 'component';
	} else {
		return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
	}
}

nerve.normalize = function(struct) {
	var normalized = [];

	switch (this.toType(struct)) {
		case 'string':
			return struct;
			break;
		case 'array':
			for (var i = 0; struct.length > i; i++) {

				var obj = struct[i];

				for (var key in obj) {
					var parsed = nerve.parse.css.selector(key);
					parsed.inner = nerve.normalize(obj[key]);
				}

				normalized.push(parsed)
			}
			break;
		case 'object':
			var keys = Object.keys(struct);

			for (var k = 0; keys.length > k; k++) {
				var obj = {};
				var key = keys[k];
				var val = struct[key];

				obj[key] = val;

				for (var keyS in obj) {
					var parsed = nerve.parse.css.selector(keyS);
					parsed.inner = nerve.normalize(struct[keyS]);
				}

				normalized.push(parsed);
			}
			break;
		case 'function':
			// console.log('found a function', struct)
			// normalized.push(nerve.parse.functions.normalize(struct));
			break;
		case 'component':

			struct['parent'] = nerve.component;

			nerve.component.children.push(struct);
			break;
	}

	return normalized;
}

