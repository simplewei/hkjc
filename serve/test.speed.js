
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



var code,url,checkin_addr = 1,race_type=2,race_day='2015-02-12';
console.log(1234)
var time1= new Date().getTime();

var test = function(){
	var code = new Date().getTime()
	for(i=0; i<20; i++){
		// console.log(i);
		code += i;
		url = 'http://127.0.0.1:8000/node/tpl/ticket.html?code='+code+
				'&checkin_addr='+ checkin_addr + '&race_day='+ race_day + '&race_type='+ race_type;
		
		
		uExtract.snapshot(url, {
			viewportSize: { width: 300, height: 400 },
			image: 'snapshot/tickets/'+code+'.png',
			javascriptEnabled: true,
			callback: function(job) {
				console.log(job.image + ': '+ (new Date().getTime() - time1));
				
				// 出于安全考虑，1分钟后销毁图片
				// setTimeout(function() {
				// 	fs.unlink(path.join(__dirname, job.image));
				// }, 60000);

			}
		});
	};
};

test();
setTimeout(function(){
	test();
	setTimeout(function(){
		test();
		setTimeout(function(){
			test();
		}, 1000);
	}, 1000);
}, 1000);