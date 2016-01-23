nerve = {};
nerve.parse = {};

nerve.parse.css = require('./modules/parse/css.js');
nerve.toType = require('./modules/toType.js')
nerve.normalize = require('./modules/normalize.js');

module.exports = nerve;