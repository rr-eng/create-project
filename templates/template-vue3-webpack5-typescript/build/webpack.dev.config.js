const path = require('path');
const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.base.config');
const { merge } = require('webpack-merge');

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devServer: {
    static: {
      directory: path.resolve(__dirname, '../dist'),
    },
    hot: true,
    open: false,
    port: 3000,
    compress: true,
    proxy: {},
  },
  devtool: 'cheap-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
});
