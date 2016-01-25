nerve = {};
nerve.type = 'nerve';

nerve.parse = {};
nerve.parse.css = require('./modules/parse/css.js');

nerve.toType = require('./modules/toType.js')
nerve.normalize = require('./modules/normalize.js');
nerve.stringify = require('./modules/stringify.js');

module.exports = nerve;