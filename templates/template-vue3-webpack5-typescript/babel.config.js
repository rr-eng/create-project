module.exports = {
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
      { onlyRemoveTypeImports: true, allExtensions: true },
    ], // onlyRemoveTypeImports，typescript>=3.8时，设置为true，转换时删除type-only imports
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
  ],
};
