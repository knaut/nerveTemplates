


// simple template
template = {
	'div.container': {
		'span.message': '{{message}}'
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
tf1 = {
	'div#tf1': {
		'span': function() {
			if (data.message) {
				return {
					div: '{{message}}'
				}
			} else {
				return {
					span: 'im not sure what im doing'
				}
			}
		}
	}
}

tf1 = {
	'div#tf1': {
		'span': function() {
			if (data.message) {
				{{message}}
			} else {
				'im not sure what im doing'
			}
		}
	}
}

tf2 = {
	'div#tf2': function() {
		return {
			span: 'test text'
		}
	}
}

tf3 = {
	'div#tf3': function( data ) {
		if (data) { 
			return {
				span: 'this is {{data}}'
			}
		} else {
			return {
				span: 'not sure'
			}
		}
	}
}

// in context, function args wouldn't mean much here, because their bodies
// would be used by underscore during template rendering. these functions never get called,
// they are just inlaid into the template
tf4 = {
	'div#tf3': function() {
		if (message) { 
			return {
				span: 'this is {{message}}'
			}
		} else {
			return {
				span: 'not sure'
			}
		}
	}
}

// you could re-render the function
testReturn = '<div>{{ (function( data ) { return \'<span>:{{data}}:</span>\'})( data ) }}</div>'

// but thats a stretch from this
testReturn2 = '<div><< if (message) { >><span></span><< } else { >>bob<< } >></div>'

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

// playing with custom syntaxes
// these are the most visually boring, but also the simplest and easiest to write
c1 = {
	'#tf3': {
		'if message': {
			span: 'this is {{message}}'
		},
		'else': {
			'#bob': 'bob'
		}
	}
}

c2 = {
	'#tf3': {
		'for item in myArray': {
			span: 'this is {{message}}'
		}
	}
}

c3 = {
	'#c3': {
		'for item in myArray': {
			'if item !== undefined': {
				span: 'this is my {{item}}'
			}
		}
	}
}

// () keep it simple *?

// d1 = {
// 	'#d1': {
// 		'for': function(item in array) {
// 			'if (item !== undefined)': {
// 				span: 'this is my {{item}}'
// 			}
// 		}
// 	}
// }

// just straight inline javascript
d2 = {
	'#d2': {
		'for (var item in array)': {
			'if (item !== undefined)': {
				span: 'this is my {{item}}'
			}
		}
	}
}
// or really use them like helpers/functions
d3 = {
	'#d3': {
		forEach: function(index, array) {
			if (index !== undefined) {
				return {
					span: 'this is some {{item}}'
				}
			}
		},
		ifElse: function() {}
	}
}

d4 = {
	'#d4': {
		forEach: function(index, array) {
			if (index !== undefined) {
				return {
					span: 'this is some {{item}}'
				}
			}
		},
		ifElse: function( someItem ) {
			if (someItem !== undefined) {
				return {
					span: 'what is this {{someItem}}'
				}
			}
		}
	}
}

// or try to hack the system with the usually suspected strings
// d5 = {
// 	'#d5': {
// 		'<< for (var prop in item) { >>': {
// 			span: '{{item}}'
// 		}
// 	}
// }



