// this is a module to respone the request
module.exports = function(req, res, next){
  let data = {
    success: true,
    code: "0000",
    data: [
      {name: 'chentangson-vip', company: 'pingan'},
      {name: 'robot-vip', company: 'micro soft'}
    ]
  }
  res.send(data);
}