const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');
const { plugins } = require('./webpack.server.config');

module.exports = merge(baseWebpackConfig, {
	mode: 'development',
	devtool: 'source-map',
	plugins: [
		new CleanWebpackPlugin()
	]
});
