const express = require('express');
const app = express();

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
});

app.get('/', (req, res, next)=>{
  res.send(`
  <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Test</title>
      <style>html{font-size: 12px}</style>
    </head>
    <body>
      
      <script src="/devTools/static/js/vue.js"></script>
      <script src="/devTools/static/js/axios.js"></script>
      <script src="/devTools/static/js/sockjs.min.js"></script>
      <script src="/devTools/static/pages/toggle.js"></script>
    </body>
    </html>`);
})
require('./index.js')(app);
app.listen(3333, err=>{
  console.log('http://127.0.0.1:3333');
})


