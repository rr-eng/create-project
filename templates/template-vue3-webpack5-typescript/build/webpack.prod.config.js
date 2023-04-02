const baseWebpackConfig = require('./webpack.base.config');
const { merge } = require('webpack-merge');
module.exports = merge(baseWebpackConfig, {
  mode: 'production',
});
