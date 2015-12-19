var testSelectors = [
	'div',
	'div.blah',
	'span#test',
	'blah',
	'asdf',
	'a[custom-val="blah"]',
	'a[data-val="blah"][data-val="blah"]'
];

var testSelector = function(selector) {
	var parsedKey = parseCSSKey(selector);

	describe('parseCSSKey: ' + "'" + selector + "'", function() {

		it('should return an object from a CSS selector string', function() {

			expect(toType(parsedKey)).toEqual('object');

		});

		it('should have keys of type, attrs, classes, id, and tagName', function() {
			var actualKeys = Object.keys(parsedKey).sort();

			var expectedKeys = [
				'type',
				'attrs',
				'classes',
				'id',
				'tagName'
			].sort();

			expect(actualKeys).toEqual(expectedKeys);

		});

		describe('key of type', function() {
			it('should be "dom"', function() {
				expect(parsedKey.type).toBe('dom');
			})
		});

		describe('key of id', function() {
			it('should be string or null', function() {
				// testing with brute force
				// doing this until custom matchers work
				if ( toType(parsedKey.id) === 'string' ) {
					expect( true ).toBe( true );
				} else if ( toType(parsedKey.id) === 'null' ) {
					expect( true ).toBe( true );
				} else {
					// force a fail
					expect( true ).toBe( false );
				}
			});
		});

		describe('key of tagName ' + "'" + parsedKey.tagName + "'", function() {
			
			// list of all possible dom tags
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

			// parseCSSKey automatically corrects non-DOM selectors as divs,
			// so this is pretty much guaranteed
			it('should be a valid DOM selector', function() {

				var needleExists = false;
				for (var d = 0; dom.length > d; d++) {
					if ( parsedKey.tagName === dom[d]) {
						needleExists = true;
					}
				}

				expect( needleExists ).toBe( true );
			});
			
		});

		describe('key of classes', function() {
			it('should be an array', function() {
				expect( toType( parsedKey.classes ) ).toBe('array');
			});

			if ( parsedKey.classes.length ) {
				it('should only contain strings', function() {

					var needle = true;
					for (var c = 0; parsedKey.classes.length > c; c++) {
						if ( toType( parsedKey.classes[c] ) !== 'string' ) {
							needle = false;
						}
					}
				
					expect( needle ).toBe(true);
				});
			}
		});

		describe('key of attrs', function() {
			it('should be an array', function() {
				expect( toType( parsedKey.attrs ) ).toBe('array');
			});

			if ( parsedKey.attrs.length ) {
				it('should only contain objects', function() {

					var needle = true;
					for (var c = 0; parsedKey.classes.length > c; c++) {
						if ( toType( parsedKey.classes[c] ) !== 'object' ) {
							needle = false;
						}
					}
				
					expect( needle ).toBe(true);
				});
			}
		});

	});
}

// to test all example selectors
for (var v = 0; testSelectors.length > v; v++) {
	testSelector( testSelectors[v] );
}

// to test just the simplest
// testSelector(testSelectors[1]);