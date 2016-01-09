var testSelectors = [
	'div',
	'div.blah',
	'span#test',
	'blah',
	'asdf',
	'a[custom-val="blah"]',
	'a[data-val="blah"][data-val="blah"]'
];

var testSelector = function( selector ) {
	
	var nerve = new Nerve();

	var parsed = nerve.parse.css.selector( selector );

	describe('parsing "' + selector + '" ', function() {

		it('should return an object from a CSS selector string', function() {

			expect(nerve.toType(parsed)).toEqual('object');

		});

		it('should have keys of type, attrs, classes, id, and tagName', function() {
			var actualKeys = Object.keys(parsed).sort();

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
			it('should be "html"', function() {
				expect(parsed.type).toBe('html');
			})
		});

		describe('key of id', function() {
			it('should be string or null', function() {
				// testing with brute force
				// doing this until custom matchers work
				if ( nerve.toType(parsed.id) === 'string' ) {
					expect( true ).toBe( true );
				} else if ( nerve.toType(parsed.id) === 'null' ) {
					expect( true ).toBe( true );
				} else {
					// force a fail
					expect( true ).toBe( false );
				}
			});
		});

		describe('key of tagName ' + "'" + parsed.tagName + "'", function() {
			
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

			// sautomatically corrects non-DOM selectors as divs,
			// so this is pretty much guaranteed
			it('should be a valid DOM selector', function() {

				var needleExists = false;
				for (var d = 0; dom.length > d; d++) {
					if ( parsed.tagName === dom[d]) {
						needleExists = true;
					}
				}

				expect( needleExists ).toBe( true );
			});
			
		});

		describe('key of classes', function() {
			it('should be an array', function() {
				expect( nerve.toType( parsed.classes ) ).toBe('array');
			});

			if ( parsed.classes.length ) {
				it('should only contain strings', function() {

					var needle = true;
					for (var c = 0; parsed.classes.length > c; c++) {
						if ( nerve.toType( parsed.classes[c] ) !== 'string' ) {
							needle = false;
						}
					}
				
					expect( needle ).toBe(true);
				});
			}
		});

		describe('key of attrs', function() {
			it('should be an array', function() {
				expect( nerve.toType( parsed.attrs ) ).toBe('array');
			});

			if ( parsed.attrs.length ) {
				it('should only contain objects', function() {

					var needle = true;
					for (var c = 0; parsed.classes.length > c; c++) {
						if ( nerve.toType( parsed.classes[c] ) !== 'object' ) {
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
	console.log(testSelectors[v])
	testSelector( testSelectors[v] );
}

// to test just one
// testSelector(testSelectors[0]);
