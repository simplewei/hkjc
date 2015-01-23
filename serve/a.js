
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
var path = require('path');
var express = require('express');
var uExtract = require('url-extract')();

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
app.use('/node/ticket/',  function(req, res) {

	uExtract.snapshot('http://127.0.0.1:8000/node/tpl/ticket.html?qr=123456', {
		// zoomFactor: 2,
		viewportSize: { width: 300, height: 400 },
		image: 'snapshot/tickets/watermask.png',
		javascriptEnabled: true,
		callback: function(job) {

			console.log(job.image)
			var _path = path.join('/node', job.image);
			console.log(_path)
			res.writeHead(302, {
				'Location': _path
			});
			res.end();
		}
	});
});

//静态文件目录 - 获取图片
app.use('/node/snapshot', express.static(__dirname + '/snapshot/'));
app.use('/node/tpl', express.static(__dirname + '/tpl/'));

if (!module.parent) {
  app.listen(8000);
  console.log('Express started on port 8000');
};

