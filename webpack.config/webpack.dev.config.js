const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');
const { plugins } = require('./webpack.server.config');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;

module.exports = merge(baseWebpackConfig, {
	mode: 'development',
	devtool: 'source-map',
	plugins: [
		new CleanWebpackPlugin()
	]
});
