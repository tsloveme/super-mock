const webpack = require('webpack');
const config = require('./webpack.config.prod');
console.log('start to pack...');
let start = new Date();
let complier = webpack(config, (err, stats)=>{
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