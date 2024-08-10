const CracoAntDesignPlugin = require('craco-antd')
const { CracoAliasPlugin, configPaths } = require('react-app-rewire-alias')
const appPackageJson = require('./package.json')
const appName = appPackageJson.name
const path = require('path')
const staticPath = 'static'

module.exports = {
  // https://github.com/DocSpring/craco-antd#readme
  plugins: [
    {
      // https://stackoverflow.com/questions/66200826/craco-with-ant-design-and-css-modules
      plugin: CracoAntDesignPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
            sourceMap: false
          }
        },
        modifyLessRule: function (lessRule) {
          return {
            ...lessRule,
            // craco-less中，配置为 /\.module\.(less)$/，导致.module.less文件无法编译，此处覆盖相关配置
            exclude: /\.nothing\.(less)$/
          }
        },
        cssLoaderOptions: {
          modules: {
            localIdentName: '[local]__[hash:base64:5]',
            // 回调必须返回 `local`，`global`  默认global
            mode: (resourcePath) => {
              if (/(module|modules|local)\.(less|css)$/i.test(resourcePath)) {
                return 'local'
              }

              return 'global'
            }
          }
        },
        babelPluginImportOptions: {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: true
        }
      }
    },
    {
      plugin: CracoAliasPlugin,
      options: { alias: configPaths('./tsconfig.paths.json') }
    }
  ],
  // https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#configuration-overview
  webpack: {
    configure: (webpackConfig, { paths }) => {
      paths.appBuild = path.resolve(__dirname, 'dist')
      if (process.env.BUILD_ENV) {
        webpackConfig.devtool = false
      }
      webpackConfig.output.path = path.resolve(__dirname, 'dist')
      webpackConfig.output.library = `${appName}-[name]`
      webpackConfig.output.libraryTarget = 'umd'
      webpackConfig.output.chunkFilename = `${staticPath}/js/[name].[contenthash:8].chunk.js`
      webpackConfig.output.filename = `${staticPath}/js/[name].[fullhash:8].bundle.js`
      webpackConfig.output.chunkLoadingGlobal = `webpackJsonp_${appName}`
      webpackConfig.output.globalObject = 'window'
      return webpackConfig
    }
  },
  devServer: (devServerConfig) => {
    const config = devServerConfig

    config.headers = {
      'Access-Control-Allow-Origin': '*'
    }
    config.historyApiFallback = true
    config.hot = false
    config.liveReload = false
    config.proxy = {
      '/admin': {
        target: 'http://127.0.0.1:3000/',
        changeOrigin: true
      }
    }
    return config
  }
}
