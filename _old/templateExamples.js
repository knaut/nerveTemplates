var testTemplates = (function() {

	
	// rootTempl1 = {
	// 	h2: 'Click Me',
	// 	div: function() {
	// 		if (number) {
	// 			return {
	// 				'#amazing': {
	// 					'#blah': example
	// 				}
	// 			}	
	// 		} else {
	// 			return {
	// 				'span': 'counter is at zero'
	// 			}
	// 		}			
	// 	}		
	// }


	// rootTempl2 = {
	// 	h2: 'Click Me',
	// 	'#child-1': example
	// }


	testFunc2 = {
		h2: 'Click Me',
		div: function() {
			if (number) {
				return {
					'#amazing[data-val="test"]': 'example'
				}	
			} else {
				return {
					'span': 'counter is at zero'
				}
			}
		}
	}

	testFunc1 = {
		h2: 'Click Me',
		div: function() {
			if (number) {
				return {
					'#amazing': 'example'
				}	
			} else {
				return {
					'span': 'counter is at zero'
				}
			}
		}
	}

	testFunc3 = {
		h2: 'Click Me',
		div: function() {
			if (number) {
				return {
					'#amazing': {
						'#example': 'just an example'
					}
				}	
			} else {
				return {
					'span': 'counter is at zero'
				}
			}
		}
	}

	// normalize an object into an array
	template = {
		'#root': {
			'div': 'blah',
			'header': {
				'div#test': 'test',
				'div#blah': {
					'span#meh': 'blah blah'
				}
			},
			'span': 'this is just a test template',
			'div#amazing.my-other-class': 'a series of nested elements…',
			'nav': {
				'span': 'this is a nested child'
			},
			'footer#test': {
				'ul': {
					'li#test': 'span'
				}
			}
		}
	}

	// javascript doesn't do object literals with the same key name
	// this might be rare in the day-to-day, but still a downer
	// a workaround could be to wrap the container el that has multiple els of the same selector in an array, and turn the enclosing key/vals into objects
	template2 = {
		'#root': [{
				'div': 'blah'
			}, {
				'div': 'blah'
			}, {
				'div': 'blah'
			}, {
				'span': 'this is just a test template'
			}, {
				'div#amazing.my-other-class': 'a series of nested elements…'
			}, {
				'nav': {
					'span': 'this is a nested child'
				}
			}, {
				'div': 'blah'
			},
			// nested arrays in arrays like this cause issues
			{
				'header': {
					'div#test': 'test',
					'div#blah': {
						'span#meh': 'blah blah'
					}
				}
			}, {
				'footer#test': {
					'ul': {
						'li#test': 'span'
					}
				}
			}
		]
	};


	testArr1 = {
		'#a.foo[data-val="1"][data-val="a"]': [{
			'div': 'test text'
		}, {
			'div': 'other text'
		}],
		'#b.bar[data-val=2]': [{
			'div': 'test text'
		}, {
			'div': 'other text'
		}],
		'#c.baz.banksy[data-val=3]': [{
			'div': 'test text'
		}, {
			'div': 'other text'
		}]
	}


	testArr2 = {
		'#a.foo[data-val=1][data-val="a"]': {
			'div#first': 'test text',
			'div#second': 'other text'
		},
		'#b.bar[data-val=2]': {
			'div#first': 'test text',
			'div#second': 'other text'
		},
		'#c.baz.banksy[data-val=3]': {
			'div#first': 'test text',
			'div#second': 'other text'
		}
	}

	// placing literal strings in arrays, delimited by :
	testArr3 = {
		'#a.foo[data-val=1][data-val="a"]': [
			'div:test text',
			'div:other text'
		],
		'#b.bar[data-val=2]': [
			'div:test text',
			'div:other text'
		],
		'#c.baz.banksy[data-val=3]': [
			'div:test text',
			'div:other text'
		]
	}

	// nest objects in arrays
	testArr4 = [{
		'#a.foo[data-val=1][data-val="a"]': [
			'div:test text',
			'div:other text'
		]
	}, {
		'#b.bar[data-val=2]': [
			'div:test text',
			'div:other text'
		]
	}, {
		'#c.baz.banksy[data-val=3]': [
			'div:test text',
			'div:other text'
		]
	}]

	// testArr5 = [
	// 	'a#a.foo[data-val=1][data-val="a"]:test text'
	// ]

	// not supported
	// testArr6 = 'span#a.foo[data-val=1][data-val="a"]:blah blah'

	// not supported
	// testArr7 = 'div'

	testArr8 = [{
		'div': 'test'
	}, {
		'div': 'test'
	}]

	testArr9 = {
		'#a.foo[data-val=1][data-val="a"]': {
			'#b.bar[data-val=2]': {
				'#c.baz.banksy[data-val=3]': 'hello World!'
			}
		}
	}

	testArr10 = {
		'#a.foo[data-val=1][data-val="a"]': {
			'#b.bar[data-val=2]': {
				'#c.baz.banksy[data-val=3]': 'hello World!'
			},

			'#d.bar[data-val=4]': {
				'#e.baz.banksy[data-val=5]': 'hello Waldo!'
			}
		}
	}

	testArr11 = {
		'#a.foo[data-val=1][data-val="a"]': {
			'#b.bar[data-val=2]': {
				'#c.baz.banksy[data-val=3]': 'hello World!'
			},

			'#d.bar[data-val=4]': {
				'#e.baz.banksy[data-val=5]': [{
						'div': 'blah'
					}, {
						'div': 'blah'
					}, {
						'div': 'blah'
					}, {
						'span': 'this is just a test template'
					}, {
						'div#amazing.my-other-class': 'a series of nested elements…'
					}, {
						'nav': {
							'span': 'this is a nested child'
						}
					}, {
						'div': 'blah'
					}
				]
			}
		}
	}

	// testing function templates

	// you could re-render the function
	// testReturn = '<div>{{ (function( data ) { return \'<span>:{{data}}:</span>\'})( data ) }}</div>'

	// but thats a stretch from this
	// testReturn2 = '<div><< if (message) { >><span></span><< } else { >>bob<< } >></div>'

	// working based on test return 2
	// a = template(testReturn2)({message: 'test'})
	// yields "<div><< if (message) { >><span></span><< } else { >>bob<< } >></div>"

	// need a better syntax than tildes
	// annoying, but we split strings based on familiar tokens, which often happen to be ones we use later
	// would be nice to configure template (and thus parsing) settings based on a single config -- problem for later
	tr2 = {
		'div.blah': function() {
			if (message) {
				return {
					span: '~~message~~'
				}
			} else {
				return {
					span: 'bob'
				}
			}
		}
	}

})();

// simple template
// template = {
// 	'div.container': {
// 		'span.message': '{{message}}'
// 	}
// }