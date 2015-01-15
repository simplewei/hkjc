/*
 * qrcode html2canvas 例子
 * author simplewei
 * 2015-01-14
 */

require(['zepto', 'qrcode', 'html2canvas'],
 function($, qrcode, html2canvas){
 	// 点击按钮生成 二维码
 	var qrObj = new qrcode('qrcode');
 	$('#qrbtn').tap(function(){
 		qrObj.makeCode($('#qrInput').val())
 	});

 	// 点击生成节点截图
 	$('#canvasbtn').tap(function(){
 		var temp = $('#qrcode');
 		html2canvas(temp[0],{
 			onrendered: function(canvas){

 				$(document.body).append('<h1>以下是canvas动态生成</h1><img src="'+canvas.toDataURL()+'" />');
 				$.ajax({
					url: '/node/ticket', 
					type: 'POST',
					data:{
	 					imgData: canvas.toDataURL(),
	 					name: $('#qrInput').val()
	 				},
	 				enctype: 'multipart/form-data',
	 				success: function(data,b){
	 					$(document.body).append('<h1>以下是后台返回</h1><img src="'+data.url+'" />');
					}
	 			});

	 			// /node/ticket/weixinboo.png
 			}
 		});
 	});
});