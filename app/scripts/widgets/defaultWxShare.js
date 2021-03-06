/*
 * 默认微信分享模块
 * 引入该模块则自动提供默认的微信分享
 *
 * Author: simplewei
 * Date: 2015-01-24
 */

define(['widgets/weixinApi'], function(weixin){
	
	weixin.ready(function(Api) {


		// 微信分享的数据

		var wxData = {
			"appId": "wx1cf17f8626cfbaf6", // 服务号可以填写appId
			// imgUrl需用ip，否则微信在ios中会把域名解析成ip来做请求
			"imgUrl": 'http://hkjc.qq.com/styles/img/share_logo.gif',
			"link": 'http://hkjc.qq.com',
			"desc": 'WeChat賽馬獨享HK$1優惠價購買香港賽馬會公眾席門票，快來買一張吧！',
			"title": "WeChat 賽馬"
		};


		// 分享的回调
		var wxCallbacks = {

			// 分享操作开始之前
			ready: function() {
				// 你可以在这里对分享的数据进行重组
				//alert("准备分享");
			},
			// 分享被用户自动取消
			cancel: function(resp) {
				// 你可以在你的页面上给用户一个小Tip，为什么要取消呢？
				//alert("分享被取消");
			},
			// 分享失败了
			fail: function(resp) {
				// 分享失败了，是不是可以告诉用户：不要紧，可能是网络问题，一会儿再试试？
				//alert("分享失败");
			},
			// 分享成功
			confirm: function(resp) {
				// 分享成功了，我们是不是可以做一些分享统计呢？
				//window.location.href='http://192.168.1.128:8080/wwyj/test.html';
				//alert("分享成功");
			},
			// 整个分享过程结束
			all: function(resp) {
				// 如果你做的是一个鼓励用户进行分享的产品，在这里是不是可以给用户一些反馈了？
				//alert("分享结束");
			}
		};

		// 用户点开右上角popup菜单后，点击分享给好友，会执行下面这个代码
		Api.shareToFriend(wxData, wxCallbacks);

		// 点击分享到朋友圈，会执行下面这个代码
		Api.shareToTimeline(wxData, wxCallbacks);

		// 点击分享到腾讯微博，会执行下面这个代码
		Api.shareToWeibo(wxData, wxCallbacks);

	});
});