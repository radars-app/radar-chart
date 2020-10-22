const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          compress: {
            warnings: false,
            drop_console: true,
            unsafe: true
          }
        }
      })
    ]
  }
});
