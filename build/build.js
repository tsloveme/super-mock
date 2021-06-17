const path = require('path');
const args = process.argv.slice(2);
if (args && args.length) {
    global._ENV = args[0];
} else {
    global._ENV = 'prod';
}

const webpack = require('webpack');
const config = require('./webpack.config.prod');
process.title = `项目打包中: ${path.resolve(__dirname, '../').replace(/^(.{20}).{5,}(.{20})$/, "$1 ... $2")}`;

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