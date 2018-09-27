var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({sourceMap: config.dev.cssSourceMap})
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin(merge({
      '__DEV__': false
    }, config.dev.env)),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'assets.html',
      template: './src/pages/assets.html',
      favicon: './src/pages/favicon.ico',
      hash: true,
      inject: true,
      chunks: ['manifest', 'vendor', 'assets']
    }),
    new HtmlWebpackPlugin({
      filename: 'funds.html',
      template: './src/pages/funds.html',
      favicon: './src/pages/favicon.ico',
      hash: true,
      inject: true,
      chunks: ['manifest', 'vendor', 'funds']
    }),
    new HtmlWebpackPlugin({
      filename: 'center.html',
      template: './src/pages/center.html',
      favicon: './src/pages/favicon.ico',
      hash: true,
      inject: true,
      chunks: ['manifest', 'vendor', 'center']
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/pages/index.html',
      favicon: './src/pages/favicon.ico',
      hash: true,
      inject: true,
      chunks: ['manifest', 'vendor', 'account']
    }),
    new HtmlWebpackPlugin({
      filename: 'chain-assets.html',
      template: './src/pages/chain-assets.html',
      favicon: './src/pages/favicon.ico',
      hash: true,
      inject: true,
      chunks: ['manifest', 'vendor', 'chain_assets']
    }),
    new HtmlWebpackPlugin({
      filename: 'chain-funds.html',
      template: './src/pages/chain-funds.html',
      favicon: './src/pages/favicon.ico',
      hash: true,
      inject: true,
      chunks: ['manifest', 'vendor', 'chain_funds']
    }),
    new FriendlyErrorsPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
  ]
})
