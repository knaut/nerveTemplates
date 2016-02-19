module.exports = {
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
		
		// regexes from CSSUtilities
		// http://onwebdev.blogspot.com/2011/09/javascript-parsing-css-selectors-with.html
		var rAttrs = /(\[\s*[_a-z0-9-:\.\|\\]+\s*(?:[~\|\*\^\$]?(=)\s*[\"\'][^\"\']*[\"\'])?\s*\])/gi;
		
		var attrs = string.match(rAttrs);

		if (attrs !== null && attrs.length !== 0) {

			// console.log(attrs)

			for (var a = 0; attrs.length > a; a++) {

				// parse a single attr string as provided by our loop, ex: [key="3"]
				var rKey = /\[(\s*[_a-z0-9-:\.\|\\]+\s*)/gi;
				var rVal = /(?:[~\|\*\^\$]?=\s*[\"\']([^\"\']*)[\"\'])?\s*\]/gi;

				var key = rKey.exec(attrs[a])[1];
				var val = rVal.exec(attrs[a])[1];

				var pair = {
					attrKey: key,
					attrVal: val
				};

				// assign class or id attributes to parsed object directly
				switch(pair.attrKey) {
					case 'id':
						parsed.id = pair.attrVal;
					break;
					case 'class':
						var classString = pair.attrVal;

						var classArr = classString.match(/[^\s]*/g);
						
						var cleanedArr = [];
						for (var i = 0; classArr.length > i; i++) {

							if (classArr[i].length) {
								cleanedArr.push(classArr[i]);
							}
						}
						parsed.classes = cleanedArr;

					break;
					default:
						// console.log(pair)
						parsed.attrs.push(pair);
					break;
				}
			}
		}

		// check for id in our selector, if we haven't already got one
		if (parsed.id === '') {
			var rId = /#([a-z]+[_a-z0-9-:\\]*)/ig;
			
			var id = rId.exec( string );
			
			if (id !== null) {
				parsed.id = id[1];
			}
		}

		// check for classes in our selector, if we haven't already got them
		if (parsed.classes.length === 0) {
			var rClasses = /(\.[_a-z]+[_a-z0-9-:\\]*)/ig;
			var classes = string.match(rClasses);

			if (classes !== null) {
				for (var c = 0; classes.length > c; c++) {
					classes[c] = classes[c].slice(1)
				}

				parsed.classes = classes;
			}

			
		}

		// get the tag name
		var rTagName = /(^\w*)/gi;
		var tagName = string.match(rTagName)[0];
		if (tagName.length) {
			parsed.tagName = tagName;
		}

		return parsed;
	}
};


