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

{
	type: 'component',
	name: 'MyComponent'
}

// basic dom tag
{
	type: 'dom',
	tagName: 'div',
	id: null,
	attrs: [ { 'data-val': null } ],
	classes: [ 'boo', 'hah' ],
	inner: [],
}

// function with return blocks, normalized doms
{
	type: 'function',
	src: 'if(message){%break%}else{%break%}',
	blocks: [{
		type: 'dom',
		tagName: 'div',
		id: null,
		attrs: [ { 'data-val': null } ],
		classes: [ 'boo', 'hah' ],
		inner: 'foo'
	}, {
		type: 'dom',
		tagName: 'span',
		id: null,
		attrs: [ { 'data-val': null } ],
		classes: [ 'boo', 'hah' ],
		inner: 'bar'
	}]
}



// normalizeDom
// 	parseSelector
// 	normalize
	
// normalizeFunction
// 	sliceReturnBlock
// 	parseReturnBlock

// normalizeComponent

// stringifyDom
// stringifyFunction



