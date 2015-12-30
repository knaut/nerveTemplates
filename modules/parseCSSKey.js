var parseCSSKey = (function() {

	return {
		selector: function(string) {
			// parse a CSS selector and normalize it as a a JS object
			/* 
			example:
				{
					type: 'dom',
					attrs: [ { 
						attrKey: 'data-val'
						attrVal: 'value' } ],
					classes: [ 'className' ],
					id: 'string',
					tagName: 'string'
				}
			*/

			var parsed = {
				type: 'html',
				tagName: 'div', // default element
				attrs: [],
				classes: [],
				id: ''
			};

			// check for attributes
			if (string.indexOf('[') > -1) {
				parsed.attrs = this.attrs(string);
			}

			// check for classes
			if (string.indexOf('.') > -1) {
				parsed.classes = this.classes(string);
			}

			// check for id
			if (string.indexOf('#') > -1) {
				parsed.id = this.id(string);
			}

			// check for tag name
			if (this.tagName(string)) {
				parsed.tagName = this.tagName(string);
			}

			return parsed;
		},

		tagName: function(string) {
			// parse a selector with an element name
			var reg = /^\w*/;

			var tag = string.match(reg)[0];

			if (!tag) {
				return false;
			} else {
				// list of supported dom tags
				var dom = [
					'div',
					'a',
					'p',
					'span',
					'ul',
					'li',
					'header',
					'article',
					'section',
					'nav',
					'footer',
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6',
					'pre',
					'em'
				];

				for (var d = 0; dom.length > d; d++) {
					if (dom[d] === tag) {
						return tag;
					}
				}
			}
		},

		id: function(string) {
			// parse a selector with an id
			// and extract the id
			var reg = /#[\w|-]*/;

			var id = string.match(reg)[0].substring(1);

			return id;
		},

		classes: function(string) {
			// parse a selector with at least one class
			var reg = /\.[\w|-]*/g;

			var classes = string.match(reg);

			var parsed = [];
			for (var c = 0; classes.length > c; c++) {
				// chop off the .
				var classString = classes[c].substring(1);
				parsed.push(classString)
			}

			return parsed;
		},

		attrs: function(string) {
			var reg = /\[.+\]/g;

			// we will only accept attributes grouped together in the selector
			var attrs = string.match(reg);

			// treat the attrs as an array, even if there's only one
			if (attrs[0].indexOf('][') > -1) {
				attrs = attrs[0].split('][');
			}

			// push the parsed pairs to an array for later
			var parsed = [];

			for (var i = 0; attrs.length > i; i++) {

				// clean up everything
				var attr = attrs[i].replace(/'|"|\[|\]/g, '');

				// only assume the attr has a key
				var pair = {};
				if (attr.indexOf('=') > -1) {
					var split = attr.split('=');
					pair = {
						attrKey: split[0],
						attrVal: split[1]
					};
					parsed.push(pair);
				} else {
					pair = {
						attrKey: attr,
						attrVal: null
					}
					parsed.push(pair);
				}
			}

			return parsed;
		}
	}
})();