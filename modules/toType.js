module.exports = function(obj) {
	// better type checking
	// https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
	
	// not sure why toType gets called again, happens accessing data sub-keys in components
	if (obj === undefined) return;


	if (obj.hasOwnProperty('type') && obj.type === 'component') {
		return 'component';
	} else {
		return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
	}
}