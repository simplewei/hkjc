/*
 * 这是一个生成和获取图片的应用
 *
 * POST /node/ticket
 *   接收imgData和name
 *   imgData 图片的base64编码
 *   name 图片的名字
 *
 * GET /node/ticket
 *   在 ./resource/tickets/下取静态文件（这里是取图片）
 *
 * date:    2015-01-16
 * author:  simplewei
 */

var fs = require("fs");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer'); 

app.use(bodyParser.json()); 
// for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
 // for parsing application/x-www-form-urlencoded
app.use(multer()); 
// for parsing multipart/form-data

module.exports = app
//配置

//保存base64图片POST方法
app.post('/node/ticket', function(req, res){
    //接收前台POST过来的base64
    
    var imgData = req.body.imgData;
    //过滤data:URL
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    var filename = req.body.name+".png";

    var _path = __dirname + '/resource/tickets/';
    fs.writeFile(_path+filename, dataBuffer, function(err) {
        if(err){
          res.status(500).send(err);
        }else{
          res.send({url:'/node/ticket/'+filename});
          // 出于安全考虑，10分钟后销毁图片
          setTimeout(function(){
            fs.unlink(_path+filename);
          },600000);
        };
    });
});

//静态文件目录 - 获取图片
app.use('/node/ticket', express.static(__dirname + '/resource/tickets/'));


if (!module.parent) {
  app.listen(8000);
  console.log('Express started on port 8000');
};