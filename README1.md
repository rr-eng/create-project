## lint-staged
lint-staged: 是一个对git暂存区内容执行各种分析的工具。使用lint-staged之后，每次提交时会检测本次提交的文件。

安装：`npm add lint-staged -D`

```
scripts: {
  "precommit": "lint-staged",
}
"lint-staged": {
  "*.{js,ts,json}": [
    "prettier --write"
  ]
},
```
## husky
husky: 是一个git的hook工具。

安装：`npm add husky -D`

```
scripts: {
  "prepare": "husky install",
}
```
执行npm run prepare来启动husky。

添加pre-commit钩子： `npx husky add .husky/pre-commit "npm run precommit"`

## commitlint
commitlint: 用于统一规范提交信息。

添加commit-msg钩子：`npx husky add .husky/commit-msg "npx --no -- commitlint --edit $1"`
