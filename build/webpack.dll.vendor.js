const webpack = require('webpack')
const utils = require('./utils');

module.exports = {
  mode: 'development',
  entry: [
    'vue',
    'vuex',
    'vue-router',
    'axios',
    'element-plus',
    'moment',
    'lodash'
  ],
  output: {
    path: utils.resolvePath("build/cache/dll"),
    publicPath: './',
    filename: "vendors.js",
    library: "[name]_[hash]"
　},
  resolve: {
    extensions: ['.js', '.vue','.ts', '.json'],
    // alias: {
    //   'vue$':utils.resolvePath('src/libs/vue/index.js')
    // }
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   loader: 'babel-loader',
      //   include:[utils.resolvePath('src')],
      //   exclude:/node_modules/,
      //   options: {
      //     presets: [['@babel/preset-env']],
      //     cacheDirectory: utils.resolve('cache/dev')
      //   }
      // },
      // {
      //   test: /\.css$/,
      //   use: [
      //     'vue-style-loader',
      //     'css-loader'
      //   ]
      // }
    ]
  },

  plugins: [
    new webpack.DllPlugin({
      path: utils.resolve('cache/dll/manifest.json'),
      name: "[name]_[hash]",
      context: __dirname
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),
  ],
  devtool: "source-map"
};
