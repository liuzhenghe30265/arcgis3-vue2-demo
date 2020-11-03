[![AppVeyor](https://img.shields.io/appveyor/build/gruntjs/grunt)](https://github.com/liuzhenghe30265/arcgis3-vue2-demo)
[![npm](https://img.shields.io/badge/npm-6.4.1-brightgreen.svg)](https://www.npmjs.com/)
[![webpack](https://img.shields.io/badge/webpack-^3.6.0-brightgreen.svg)](https://github.com/webpack/webpack)
[![vue](https://img.shields.io/badge/vue-^2.6.11-brightgreen.svg)](https://github.com/vuejs/)
[![vue-router](https://img.shields.io/badge/vue--router-^3.2.0-brightgreen.svg)](https://github.com/vuejs/vue-router)
[![axios](https://img.shields.io/badge/axios-^0.20.0-brightgreen.svg)](https://github.com/axios/axios)
[![esri-loader](https://img.shields.io/badge/esri--loader-^2.15.0-brightgreen.svg)](https://github.com/Esri/esri-loader/)
[![element-ui](https://img.shields.io/badge/element--ui-2.13.2-brightgreen.svg)](https://github.com/ElemeFE/element/)
[![ArcGIS](https://img.shields.io/badge/ArcGIS-3.25-brightgreen.svg)](https://developers.arcgis.com/javascript/3/)

## Introduction

[![](https://tva1.sinaimg.cn/large/007S8ZIlly1gjsa9nmlhej31bi0u01kx.jpg)](https://liuzhenghe30265.github.io/arcgis3-vue2-demo)

## Preparation

You need to install [node](https://nodejs.org/) and [git](https://git-scm.com/) locally. The project is based on [ES2015+](https://es6.ruanyifeng.com/), [vue](https://cn.vuejs.org/index.html), [vuex](https://vuex.vuejs.org/zh-cn/), [vue-router](https://router.vuejs.org/zh-cn/), [vue-cli](https://github.com/vuejs/vue-cli) , [axios](https://github.com/axios/axios) and [element-ui](https://github.com/ElemeFE/element)。

## Features

```
│  .browserslistrc
│  .eslintrc.js
│  .gitignore
│  babel.config.js
│  package.json
│  README.md
│  vue.config.js
│  yarn.lock
│
├─public
│      favicon.ico
│      index.html
│
└─src
    │  App.vue
    │  main.js
    │
    ├─assets
    │
    ├─components
    │  │  InitMap.vue
    │  │
    │  └─modules
    │          CustomSymbols.vue
    │          DrawingGraphics.js
    │          DrawingGraphics.vue
    │          GeoServer.vue
    │          HeatMap.vue
    │          MapServer.vue
    │          PathLineLayer.js
    │          TrackPlayback.vue
    │
    ├─router
    │      index.js
    │
    ├─store
    │      index.js
    │
    └─views
            About.vue
            Home.vue

```

## Project setup

```bash
# clone the project
git clone https://github.com/liuzhenghe30265/arcgis3-vue2-demo.git

# enter the project directory
cd arcgis3-vue2-demo

# install dependency
yarn install

# Compiles and hot-reloads for development
yarn serve

# Compiles and minifies for production
yarn build
```

## Browsers support

Modern browsers and Internet Explorer 10+.

| IE / Edge        | Firefox         | Chrome          | Safari          |
| ---------------- | --------------- | --------------- | --------------- |
| IE10, IE11, Edge | last 2 versions | last 2 versions | last 2 versions |

## License

[MIT](https://github.com/liuzhenghe30265/arcgis3-vue2-demo/blob/master/LICENSE)
