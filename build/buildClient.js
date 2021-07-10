// 启动参数获取
let args = process.argv.slice(2);
console.log(args);
if (args[0] == 'development') {
  global._ENV = 'development';
}
console.log(process.argv.slice(2));
const webpack = require('webpack');
const config = require('./webpack.config.client');
console.log('start to pack...');
let start = new Date();
webpack(config, (err, stats)=>{
    //编译错误
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }

  const info = stats.toJson();
  if (stats.hasErrors()) {
      console.log('编译出错！');
      console.error(info.errors);
      process.exit(1);
  }
  //警告
  if (stats.hasWarnings()) {
      console.warn(info.warnings);
  }

  console.log(`it took ${new Date() - start} ms.`);
  console.log('packed success!');
})