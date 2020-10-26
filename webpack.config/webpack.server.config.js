const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.config');

module.exports = merge(baseWebpackConfig, {
	mode: 'development',
	output: {
		path: path.join(__dirname, '../devServer'),
	},
	devServer: {
		port: 8080,
		contentBase: baseWebpackConfig.externals.paths.dist,
		watchContentBase: true,
		overlay: {
			warnings: true,
			errors: true
		},
		inline: true,
		hot: true
	},
	plugins: [
		new HtmlWebpackPlugin({
      inject: true,
      filename: 'index.html',
      template: path.join(__dirname, '../src/index.html')
    }),
	],
	devtool: 'eval-cheap-source-map'
});
