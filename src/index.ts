#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const enquirer = require('enquirer');
const minimist = require('minimist');
const chalk = require('chalk');

const argv = minimist(process.argv.slice(2));
const cwd = process.cwd();

const TEMPLATES = [
  {
    name: 'vue3-webpack5-typescript',
    message: 'vue3 + webpack5 + typescript 实现的多页面项目',
    value: 'vue3 + webpack5 + typescript 实现的多页面项目',
  },
  {
    name: 'project-two',
    message: '基于xxx第二个项目模板啦啦啦',
    value: '项目二模板',
  },
  {
    name: 'project-three',
    message: '基于xxx第三个项目模板哈哈哈',
    value: '项目三模板',
  },
];

const init = async () => {
  let targetDir = argv._[0];
  if (!targetDir) {
    const { projectName } = await enquirer.prompt({
      type: 'input',
      name: 'projectName',
      message: 'Please input projectName:',
    });
    targetDir = projectName;
  }

  const packageName = await getValidPackageName(targetDir);
  console.log(chalk.green('packageName:', packageName));

  // 确定项目创建路径
  const rootPath = path.join(cwd, packageName);
  console.log(chalk.green('\nProject path is: ' + chalk.green.bold(rootPath)));

  // 生成项目文件夹
  if (!fs.existsSync(rootPath)) {
    fs.mkdirSync(rootPath);
  } else {
    const existFiles = fs.readdirSync(rootPath);
    if (existFiles.length) {
      const { yes } = await enquirer.prompt({
        type: 'confirm',
        name: 'yes',
        initial: 'y',
        message: `${chalk.blue(
          `The target directory ${packageName} is not empty.\n Remove existing files and continue?`,
        )}`,
      });
      if (yes) {
        removeDir(rootPath);
      } else {
        return;
      }
    }
  }

  // 选择项目模板
  let template = argv.t || argv.template;
  if (!template) {
    const { templaetName } = await enquirer.prompt({
      type: 'select',
      name: 'templaetName',
      message: '请选择模板',
      choices: TEMPLATES,
    });
    template = templaetName;
    console.log(chalk.green('您选择的模板为：', template));
  }

  const templateDir = path.join(
    __dirname,
    '..',
    'templates',
    `template-${template}`,
  );

  // 写入文件，将templates下的模板代码写入新建的项目中
  const write = (file: string, content?: string) => {
    const targetPath = path.join(rootPath, file.replace(/^_/, '.'));
    if (content) {
      fs.writeFileSync(targetPath, content);
    } else {
      copy(path.join(templateDir, file), targetPath);
    }
  };

  const files = fs.readdirSync(templateDir);
  for (const file of files.filter((f: any) => f !== 'package.json')) {
    write(file);
  }

  const pkg = require(path.join(templateDir, 'package.json'));
  pkg.name = packageName;

  write('package.json', JSON.stringify(pkg, null, 2));
};

// 检验输入项目名称是否符合规范，不规范要求重新输入
const getValidPackageName = async (projectName: string) => {
  const packageNameRegExp = /^[a-z]+(-[a-z]+)*$/;
  if (packageNameRegExp.test(projectName)) {
    return projectName;
  } else {
    const { inputProjectName } = await enquirer.prompt({
      type: 'input',
      name: 'inputProjectName',
      message: 'Please input projectName again:',
      validate(value: string) {
        return packageNameRegExp.test(value) ? true : 'projectName is unvalid';
      },
    });
    return inputProjectName;
  }
};

// 删除文件夹
const removeDir = (rootPath: string) => {
  if (!fs.existsSync(rootPath)) {
    return;
  }
  const existFiles = fs.readdirSync(rootPath);
  for (const file of existFiles) {
    const abs = path.resolve(rootPath, file);
    if (fs.lstatSync(abs).isDirectory()) {
      removeDir(abs);
      fs.rmdirSync(abs);
    } else {
      fs.unlinkSync(abs);
    }
  }
};

// 复制文件及文件夹
const copy = (source: string, target: string) => {
  const stat = fs.statSync(source);
  if (stat.isDirectory()) {
    copyDir(source, target);
  } else {
    fs.copyFileSync(source, target);
  }
};
const copyDir = (sourceDir: string, targetDir: string) => {
  fs.mkdirSync(targetDir, { recursive: true });
  for (const file of fs.readdirSync(sourceDir)) {
    const sourceFile = path.join(sourceDir, file);
    const targetFile = path.join(targetDir, file);
    copy(sourceFile, targetFile);
  }
};

init().catch(e => {
  console.log(e);
});
