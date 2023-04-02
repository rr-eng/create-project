const glob = require('glob');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(
    path.resolve(__dirname, '../packages/*/main.{js,ts}'),
  );
  entryFiles.forEach(file => {
    const match = file.match(/packages\/(.*)\/main.(js|ts)/);
    const pageName = match && match[1];
    entry[pageName] = file;
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.resolve(
          __dirname,
          `../packages/${pageName}/template.html`,
        ),
        filename: `${pageName}.html`,
        chunks: [pageName],
        inject: true, // 是否将打包出来的js/css文件插入到html中，默认为true
        minify: true, // 生产环境默认为true
      }),
    );
  });
  return {
    entry,
    htmlWebpackPlugins,
  };
};
const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
  entry: entry,
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].[chunkhash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: '> 1%, not ie <= 8',
                modules: false, // 设置为false，不会对es6模块化语法进行更改，依然使用import引入模块，webpack在打包时，可以进行静态分析，方便tree shaking优化
                useBuiltIns: 'usage', // 对api的转换采用按需加载，即用到了哪个方法就引入对应的转换代码，不全量引入polyfill
                corejs: 3,
              },
            ],
            [
              '@babel/preset-typescript',
              {
                allExtensions: true, // 支持所有文件扩展名，否则在vue文件中使用ts会报错
              },
            ],
          ],
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash:8][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'font/[name].[hash:8][ext]',
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
    }),
  ].concat(htmlWebpackPlugins),
  resolve: {
    extensions: ['.ts', '.js', '.json', '.vue'],
  },
};
