module.exports = {
  plugins: [
    [
      'postcss-preset-env',
      {
        browsers: ['> 1%', 'last 2 versions'],
      },
    ],
    [
      'postcss-pxtorem',
      {
        rootValue: 100,
      },
    ],
  ],
};
