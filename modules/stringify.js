var stringify = (function() {

	return {
		normalizedFunction: function( obj ) {

			var splitSrc = obj.src.split('%break%');

			for (var ss = 0; splitSrc.length > ss; ss++) {
				splitSrc[ss] = '<<' + splitSrc[ss] + '>>';
			}

			// stringify inner blocks first
			var innerString;
			var stringifiedInnerSrc;

			for (var i = 0; splitSrc.length > i; i++) {
				console.log( splitSrc[i] )
			}
		}
	}

})();