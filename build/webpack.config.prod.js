const merge = require('webpack-merge')
const webpack = require('webpack')
const baseConfig = require('./webpack.config.base')
const gConfig = require('../config');
const MiniCssExtractPlugin  = require('mini-css-extract-plugin')
const utils = require('./utils');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const webpackConfig = merge(baseConfig, {
  mode: 'production',
  module: {
    rules: [
      // {
      //   test: /\.css?$/,
      //   use: [
      //     MiniCssExtractPlugin.loader, 
      //     'css-loader'
      //   ]
      // }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/main-[contentHash].css')
    }),
    // 清空构建目录内容
    new (require('clean-webpack-plugin'))(['dist'], {root:utils.resolve('./')}),
    
    new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"', NODE_ENV: '"production"'})
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
      new OptimizeCSSAssetsPlugin({})
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

// 打包 Ueditor
if(gConfig.enableEditor) {
  webpackConfig.plugins.push(new CopyWebpackPlugin([
    { from: './src/components/neditor/', to: 'neditor/', force:true},
  ]))
}
// 代码调试
if(gConfig.devtool) {
  webpackConfig.devtool = gConfig.devtool;
}
module.exports = webpackConfig;