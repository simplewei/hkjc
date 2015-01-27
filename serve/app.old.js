

/*
 * 这是一个生成和获取图片的应用
 *
 * POST /node/ticket
 *   接收code
 *   通过node-qrcode生产二维码图片后直接返回图片文件流
 *
 * date:    2015-01-16
 * author:  simplewei
 */

var fs = require("fs");
var path = require('path');
var express = require('express');
var qr = require('qr-image');

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


// 静态文件目录 - 获取图片
app.use('/node/ticket',  function(req, res) {

	var code = req.query.code;
	var checkin_addr = req.query.checkin_addr;
	var race_day = req.query.race_day;
	var race_type = req.query.race_type;

	var img = qr.image(code);
	res.writeHead(200, {'Content-Type': 'image/png'});
	img.pipe(res);
});

if (!module.parent) {
  app.listen(8000);
  console.log('Express started on port 8000');
};
