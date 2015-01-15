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

app.use(express.static(__dirname + '/resource/tickets/')); //静态文件目录
//保存base64图片POST方法
app.post('/node/ticket', function(req, res){
    //接收前台POST过来的base64
    
    var imgData = req.body.imgData;
    //过滤data:URL
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    var filename = req.body.name+".png";
    fs.writeFile('resource/tickets/'+filename, dataBuffer, function(err) {
        if(err){
          res.send(err);
        }else{
          res.send({url:'/node/ticket/'+filename});
        };
    });
});

app.use('/node/ticket', express.static(__dirname + '/resource/tickets/'));


if (!module.parent) {
  app.listen(8000);
  console.log('Express started on port 8000');
}