const path = require('path');
const baseWebpackConfig = require('./webpack.base.config');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].[chunkhash:8].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserWebpackPlugin({
        terserOptions: {
          format: {
            comments: false, // 构建时删除注释
          },
        },
        extractComments: false,
      }),
    ],
    splitChunks: {
      minSize: 0,
      minChunks: 2,
      chunks: 'async',
      cacheGroups: {
        vuemain: {
          test: /[\\/]node_modules[\\/]vue[\\/]/,
          name: 'vue',
          chunks: 'all',
          priority: -10,
        },
      },
    },
  },
});
