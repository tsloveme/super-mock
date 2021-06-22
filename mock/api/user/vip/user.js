// this is a module to respone the request
module.exports = function(req, res, next){
  let userId = req.query.userId || req.body.userId;
  let userList = [
    {userId:123, name: 'chentangson-vip', company: 'pingan'},
    {userId:456, name: 'robot-vip', company: 'microsoft'}
  ];
  let user = userList.find(u=>u.userId == userId);
  if (!user) user = userList[0];
  res.send({
    data: user,
    success: true,
    code: "0000"
  });
}