const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');
const {resolvePath} = require('./utils');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
let isDev = global._ENV = 'development';
module.exports = {
  entry: {
    main: [ resolvePath('src/main.ts')]
  } ,
  output: {
    // 打包后的文件存放的路径
    path:  resolvePath('dist'),
    publicPath: './',
    // 打包后输出文件的文件名
    filename:isDev ? 'js/bundle.js' :'js/[name].[contenthash].js',
    chunkFilename: isDev ? 'js/[name].[hash].js' :'js/[name].[contenthash].js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.d.ts', '.json'],
    alias: {
      '@': resolvePath('src'),
      '@store$':resolvePath('src/store/index.js'),
      '@components':resolvePath('src/components'),
      '@pages':resolvePath('src/pages'),
      '@assets':resolvePath('src/assets')
    }
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include:[resolvePath('src')],
        exclude:/node_modules/,
        options: {
          presets: [['@babel/preset-env']], // https://www.babeljs.cn/docs/plugins/preset-env
          plugins: ['@babel/plugin-syntax-dynamic-import'],
          cacheDirectory: isDev ? resolvePath('cache/dev') : false
        }
      }, 
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include:[
          resolvePath('src'),
          resolvePath('node_modules/element-plus')
        ],
        exclude:/node_modules\/(?!element\-plus)/,
        options: {
          cacheDirectory:  isDev ? resolvePath('cache/dev') : false
        }
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        include:[
          resolvePath('src'),
          resolvePath('node_modules/element-plus')
        ],
        exclude:/node_modules\/(?!element\-plus)/,
      },
      {
        test: /\.(png|jpe?g|gif|svg|pdf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 2000,
            name: 'img/[name].[hash:7].[ext]'
          }
        }
      }, {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'media/[name].[hash:7].[ext]'
          }
        }
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'fonts/[name].[hash:7].[ext]'
          }
        }
      },
      {
        test: /\.css$/,
        use: (function(){
          let loaders = ['css-loader'];
          if (!isDev) {
            loaders.unshift(MiniCssExtractPlugin.loader)
          } else {
            loaders.unshift('style-loader')
          }
          return loaders;
        })()
      },
       {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolvePath('src/index.html'),
      inject: true,
      title: 'super-mock',
      favicon: false
    }),
    new VueLoaderPlugin(),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {from: resolvePath('static'), to: 'dist/static'}
    //   ]
    // })
  ]
}
