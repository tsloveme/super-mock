const {merge} = require('webpack-merge')
const webpack = require('webpack')
const baseConfig = require('./webpack.config.base')
const MiniCssExtractPlugin  = require('mini-css-extract-plugin')
const utils = require('./utils');
// const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const webpackConfig = merge(baseConfig, {
  mode: 'production',
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name]-[contenthash].css'
    }),
    // 清空构建目录内容
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
      NODE_ENV: '"production"'
    })
  ],
  
  // 压缩、优化
  optimization: {
    minimizer: [
      // https://github.com/webpack-contrib/uglifyjs-webpack-plugin
      new UglifyJsPlugin({
        cache: true,
        parallel: true, // 多线程
        sourceMap: true
      }),
      // https://github.com/NMFR/optimize-css-assets-webpack-plugin
      // new OptimizeCSSAssetsPlugin({})
    ],
    runtimeChunk: {
      "name": "manifest"
    },
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  performance: {
    hints: false
  }
})
module.exports = webpackConfig;