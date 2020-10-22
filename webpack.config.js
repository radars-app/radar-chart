const environment = require('./environment');

if(process.env.NODE_ENV === environment.PROD) {
	module.exports = require('./webpack.config/webpack.prod.config');
} else if(process.env.NODE_ENV === environment.DEV) {
  module.exports = require('./webpack.config/webpack.dev.config');
}

