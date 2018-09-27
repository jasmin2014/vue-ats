# DTS 资产交易中心

## 项目开发

### 依赖

本项目依赖于 Vue-cli 进行构建，但是运行和编译不需要 vue-cli 环境，只需要安装有 node，然后在项目根目录通过以下命令安装依赖：

Tip：因为使用了 SCSS 进行预编译，所以项目会依赖 node-sass 模块，在 windows 下可能会出现模块安装问题，建议使用 cnpm 进行安装。

``` bash
$ npm install
```

### 开发

安装好依赖后可以通过以下命令运行项目，然后进行开发：

```bash
$ npm start
```

### 打包

参见前端构建[http://wiki.trc.com/pages/viewpage.action?pageId=7545510](http://wiki.trc.com/pages/viewpage.action?pageId=7545510)

## 项目目录结构

```text
.
├── build           // 项目构建(webpack)相关代码
├── config          // 项目开发环境配置
├── dist            // 编译输出
├── src             // 源码目录
│   └── main.js     // 程序入口文件，加载各种公共组件
│   └── App.vue     // 页面入口文件
│   └── style.scss  // 全局样式
│   └── api         // API 配置文件
│   └── assets      // 第三方静态文件
│   └── components  // vue公共组件
│   └── pages       // 业务组件
│   └── router      // 路由配置
│   └── utils       // 工具库
│   └── vuex        // vuex的状态管理
├── static          // 静态文件，比如一些图片，json数据等
├── test            // 测试
├── .babelrc        // ES6语法编译配置
├── .editorconfig   // 定义代码格式
├── .eslintrc.json  // 代码风格检查
├── .gitignore      // git上传需要忽略的文件格式
├── index.html      // 入口页面
├── README.md       // 项目说明
├── proxy.js        // 代理转发
├── package.json    // 项目基本信息
├── 开放平台_白皮书   // 项目概况与中英文对照
```

## 分支管理策略

项目采用类似 git flow 管理策略，规范化工作流程，让大家更有效的合作。

### 1. 主分支 master

主分支只提供可以正式发布使用的版本，任何情况下都不能直接在 master 分支上修改代码。

### 2. 开发分支 develop

主分支只用来发布版本，日常开发则在 develop 分支上进行。

### 3. 生产环境分支 publish
推送后自动同步到生成环境（!!慎用）

``` bash
# 创建一个功能分支：
$ git checkout -b publish develop
# 开发完成后，将功能分支合并到develop分支：
$ git checkout develop
$ git merge --no-ff publish
# 删除publish分支：
$ git branch -d publish
# 删除远程分支
$ git push origin :publish
# 将修改推送到远程仓库
$ git push origin develop
```

Tip：默认情况下，Git 执行“快进式合并”（fast-farward merge），会直接将 master 分支指向 develop 分支，使用 `–no–ff` 参数后，会执行正常合并，在 master 分支上生成一个新节点。

### 4. 测试分支 test
推送后自动同步到测试环境

当需求开发完成后需要进行测试，这时要从 develop 分支上创建 test 分支。测试通过以后要将 test 分支合并进 develop 和 master 分支。可以直接在 test 分支上修改 bug 和 修改版本号。

``` bash
# 创建一个测试分支：
$ git checkout -b test develop
# 确认没问题后，合并commit
$ git rebase -i develop
# 合并到master分支：
$ git checkout master
$ git merge --no-ff test
# 对合并生成的新节点，做一个标签
$ git tag -a 1.2
#再合并到develop分支：
$ git checkout develop
$ git merge --no-ff test
# 最后，删除预发布分支：
$ git branch -d test
```

## Commit Message

`git commit` 的 message 应该清晰明了，说明本次提交的目的，以提供更多的历史信息，方便快速浏览查找信息。

每次提交，Commit message 都包括三个部分：`Header` 和 `Body`。其中，Header 是必需的，Body 可以省略。不管是哪一个部分，任何一行都不得超过72个字符（或100个字符）。这是为了避免自动换行影响美观。

具体来说，Commit message 应以 `feat/fix/docs/style/refactor/pref/test/chore` 开头，用括号说明修改的作用域(可省略)，后面跟一个英文冒号和空格，然后再描述一下所做的修改:

```bash
> feat(hooks/commit-msg): Commit Message Check
```

### Header

Header 部分只有一行，包括三个字段：type（必需）、scope（可选）和subject（必需）。

1. type：type用于说明 commit 的类别，只允许使用下面7个标识。

    ```text
    feat：新功能（feature）
    fix：修补 bug
    docs：文档（documentation）
    style： 格式（不影响代码运行的变动）
    refactor：重构（即不是新增功能，也不是修改 bug 的代码变动）
    pref：代码优化
    test：增加测试
    chore：构建过程或辅助工具的变动
    ```

2. scope

    scope 用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同。

3. subject

    subject是 commit 目的的简短描述，不超过50个字符。

### Body

Body 部分是对本次 commit 的详细描述，可以分成多行。应该说明代码变动的动机，以及与以前行为的对比

#### Revert

有一种特殊情况，如果当前 commit 用于撤销以前的 commit，则必须以revert:开头，后面跟着被撤销 Commit 的 Header。
