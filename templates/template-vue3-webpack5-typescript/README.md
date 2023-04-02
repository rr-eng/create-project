## npm + vue3 + webpack5 + typescript 实现的多页面项目模板，不使用vue-cli

### 包管理工具：npm

npm init 生成 package.json 文件。

npm install 安装依赖

### typescript

`npm install typescript -D`

`npm tsc --init` 生成 tsconfig.json 配置文件

### eslint、prettier 配置

`npm install eslint @rr1/eslint-config-vue -D` 安装 eslint、@rr1/eslint-config-vue(自己 github 上的 eslint 插件)

新建.eslintrc.js:

```
module.exports = {
  extend: ['@rr1/eslint-config-vue/typescript']
};
```

新建.prettierrc.js

```
module.exports = require('@rr1/eslint-config-vue/prettier');
```

### babel 配置

babel 是一个 javascript 编译器，主要将 es6+语法转换为向后兼容的 js 语法，使代码能够在当前或旧的浏览器中运行。babel 在转译过程中，将源代码分为语法(syntax)和方法特性(api)来处理。语法借助 webpack5 使用 babel-loader 来处理，api 的处理需要 polyfill。

安装 `npm install @babel/cli @babel/core @babel/preset-env -D`

如果项目使用 ts 编写，`npm install @babel/preset-typescript -D`

安装插件 `npm install @babel/runtime @babel/plugin-transform-runtime -D`

1、对方法进行转化后，可能会有赋值函数，该插件可以自动移除转换后的辅助函数。

2、自动引入@babel/runtime-corejs3/core-js-stable/。

3、自动引入@babel/runtime/regenerator，

https://zhuanlan.zhihu.com/p/394783727

新建 babel.config.js 文件：

```
module.exports = {
  presets: [
    [
      ''@babel/preset-env',
      {
        targets: '> 1%, not ie <= 8',
        modules: false,
        useBuiltIns: 'usage',
        corejs: 3
      }'
    ],
    ['@babel/preset-typescript', { onlyRemoveTypeImports: true, allExtensions: true }]
  ],
  plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-runtime']
}
```

### 添加.gitignore、README.md 等文件

以上就是项目的基本结构配置。

我们新增的业务组件均位于 packages 文件夹下，在 packages 下新建 index 文件夹为例：

-packages

- index
  - src
    - components
      - index.vue
    - main.js
  - package.json
  - template.html
  - tsconfig.json

### webpack 解析 vue 组件

`npm install vue-loader -D` webpack 中配置 vue-loader 和 VueLoaderPlugin

### 使用 less 编写 vue 组件 webpack 解析 less

`npm install less less-loader css-loader style-loader -D`

### webpack 编译 ts

两种方式 ts-loader 和 babel-loader + @babel/preset-typescript

```
{
  test: /\.tsx?$/,
  loader: 'ts-loader',
  exclude: /(node_modules)/,
  options: {
    appendTsSuffixTo: [/\.vue$/], // 给对应文件添加.ts或.tsx后缀
    transpileOnly: true // ts-loader会对ts文件做类型检查并抛出检查错误，可设置为true进行检查关闭，只进行转译
  }
}

{
  test: /\.tsx?$/,
  loader: 'babel-loader',
  exclude: /(node_modules)/,
  options: {
    presets: [
      '@babel/preset-env',
      [
        '@babel/preset-typescript',
        {
          allExtensions: true // 支持所有文件扩展名，否则在vue文件中使用ts会报错
        }
      ]
    ]
  }
}
```

比较：
ts-loader 是全量引入的，并且会对 ts 文件做类型检查，可设置 transpileOnly 为 true 来关闭检查。

babel-loader 通过 preset 预设的方式引入@babel/preset-typescript 来编译 ts，并且是按需引入 polyyfill，但是 babel-loader 不能对 ts 文件进行类型检查，所以打包速度会比 ts-loader 更快。

### webpack 解析图片文字

`npm install file-loader url-loader -D` 注意 file-loader 和 url-loader 在 webpack4 和 webpack5 中的使用区别

### webpack 为css添加前缀

`npm install postcss postcss-loader autoprefixer -D` 需要在less，css解析时postcss-loader，创建postcss.config.js引入autoprefixer插件，并配置overrideBrowserslist属性（测试时发现如果不配置overrideBrowserslist，添加前缀不会生效）

也可以不安装autoprefixer，只安装postcss-preset-env（整合了很多常用的插件，包括autoprefixer）

### px2rem
`npm install postcss-pxtorem -D`

### webpack配置文件解析
webpack.base.config.js：

多页面打包

资源解析：vue解析、less解析、ts解析、图片字体解析

样式增强：css前缀补齐  px2rem

目录清理

提取css为单独的文件

生成html文件

resolve解析

webpack.dev.config.js：

热更新

source-map

webpack.prod.config.js：




