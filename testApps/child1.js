var child1 = Component.extend({
	template: {
		'#someId': function() {
			if (this.data) {
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

module.exports = child1;