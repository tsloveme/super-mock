const webpack = require('webpack')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const utils = require('./utils');
const fs = require('fs');
// 引入磁盘已经生成的 vendor.js 文件，提升工程冷启动速度
function handleDLL(options) {
  this.options = options || {};
}
handleDLL.prototype.apply = (compiler) => {
  console.log('compiler====')
  // console.log(compiler)
  compiler.hooks.thisCompilation.tap('handleDLL', (compilation, callback) => {
    const stats = compilation.getStats().toJson();
    let libsPath = 'js/vendors.js';
    var content = fs.readFileSync(utils.resolve('cache/dll/vendors.js'), {encoding: 'utf-8'});
    compilation.assets[libsPath] = {
        source: () => content,
        name: libsPath,
        size: () => content.length,
    };
    const htmlFile = stats.assets.find(file=>/\index\.html$/.test(file.name));
    if (htmlFile) {
      let name = htmlFile.name;
      let source = compilation.assets[name];
      let content = source.source();
      content = content.replace('<!--dll-->',`<script src="${libsPath}"></script>`);
      delete compilation.assets[name];
      compilation.assets[name] = {
          source: () => content,
          name,
          size: () => content.length,
      };
    }
    // stats.assets.forEach((item,index) => {
    //   let name = item.name;
    //   if(name.indexOf('.html')>-1){
    //     let source = compilation.assets[name];
    //     let content = source.source();
    //     content = content.replace('<!--dll-->',`<script src="${libsPath}"></script>`);
    //     delete compilation.assets[name];
    //     compilation.assets[name] = {
    //         source: () => content,
    //         name,
    //         size: () => content.length,
    //     };
    //   }
    // });
    callback();
  });
};

module.exports = merge(baseConfig, {
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
      // 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    // new handleDLL()
    // new BasicPlugin()
  ],
  devtool: "eval-source-map"
})
