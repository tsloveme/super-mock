const path = require('path');
const {resolvePath} = require('./utils');
const webpack = require('webpack');
let isDev = global._ENV == 'development';
console.log('isDev')
console.log(isDev)
module.exports = {
  mode: isDev ? 'development' : 'production',
  // watch: isDev ? true : false,
  watch: true,
  entry: {
    client: [resolvePath('client/index.js')]
  } ,
  output: {
    path: resolvePath('./'),
    publicPath: './',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.d.ts', '.json'],
    alias: {
      crypto: false
    },
  },
  module: {
    rules: [ 
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include:[
          resolvePath('client')
        ]
      },
      // {
      //   test: /\.ts$/,
      //   loader: 'ts-loader',
      //   include:[
      //     resolvePath('client')
      //   ]
      // },
      {
        test: /\.(png|jpe?g|gif|svg|pdf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 2000,
            name: 'img/[name].[hash:7].[ext]'
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      }
    ]
  }
}
