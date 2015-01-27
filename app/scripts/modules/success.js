/*
 * 马会门票购买成功页
 *
 * /cgi-bin/v2.0/hkjc_query_all_order.cgi
 * param: page_id	页数,从0开始
 * param: limit		每页记录数，需大于0
 * response: total_count	总条目数，可用于分页
 * response: list_info		本页记录明细
 *
 * author: simplewei
 * date: 2015-01-21
 */

require(['zepto', 'queryString', 'widgets/wxLogin', 'widgets/loading', 'widgets/weixinApi'],
	function($, queryString, wxLogin, loading, weixin) {

		loading.show();

		wxLogin.login().then(function() {


			/*
			 * 获取订单明细
			 */
			var getListInfo = function(id){

				return $.ajax({
					url: '/cgi-bin/v2.0/hkjc_query_order.cgi',
					data: {
						listid: id
					}
				});
			};


			/*
			 * 页面初始化入口
			 * 支付中心会将订单号作为 out_trade_no 字段带回
			 */
			
			var parsed = queryString.parse(location.search);
			getListInfo(parsed.out_trade_no).then(function(data){
// var data={"list_info":{"checkin_addr":"1","create_time":"2015-01-24 17:10:33","from_url":"wechat","listid":"3000000003201501240000010645","modify_time":"2015-01-24 17:11:11","pay_time":"2015-01-24 17:11:14","race_addr":"1","race_day":"2015-02-15","race_id":"11","race_type":"1","send_msg":"0","spid":"3000000003","state":"1","ticket_count":"1","ticket_price":"10","total_money":"10","trade_state":"4","transid":"1010013000000003201501240000473388","uin":"ojmkttwv_4zEk3uec5d8jxZx6jEc"},"listid":"3000000003201501240000010645","msg_id":"1f85810a142209067420386h","retcode":"0","retmsg":"ok","ticket_info":[{"qrcode":"S002114-9000001108-11001","state":"1"}],"tid":"hkjc_query_order"}

				loading.hide();

				//  计算出比赛日期、入场场地、 支付金额，并展示
				var addrMap = {
					'1': '跑馬地',
					'2': '沙田'
				};
				var time = new Date(data.list_info.race_day);
				var month = time.getMonth() + 1;
				var date = time.getDate();
				var day = ['日', '一', '二', '三', '四', '五', '六'][time.getDay()];
				var type = {'1': '日','2': '夜'}[data.list_info.race_type];
				var _date = '' + month + '月' + date + '日 星期' + day + ' ' + type + '馬';
				
				$('#count').html(data.list_info.ticket_count);
				$("#date").html(_date);
				$("#addr").html(addrMap[data.list_info.checkin_addr]);
				$("#price").html('HK$'+ (data.list_info.total_money/100).toFixed(2));
			
				share(data.list_info);
			});

			//  绑定 与好友分享 按钮
			$('.btn-select').on('tap', function(){
				$('.layer-share').removeClass('hide');
			});
			//  绑定 分享弹层 点击，去除该弹层
			$('.layer-share').on('tap', function(){
				$('.layer-share').addClass('hide');
			});
			
		});


		//微信分享
		function share(data, callbacks) {

			weixin.ready(function(Api) {
				// 微信分享的数据
				var addrMap = {
					'1': '跑馬地',
					'2': '沙田'
				};
				var _time = new Date(data.race_day);
				var _desc = '我用WeChat以優惠價HK$'+ (data.ticket_price/100) +'買了'+
					(_time.getMonth()+1)+ '月'+ _time.getDate() +'日'+ 
					addrMap[data.checkin_addr] + '的香港賽馬會公眾席門票，你也快來買一張吧！'
				var wxData = {
					"appId": "wx1cf17f8626cfbaf6", // 服务号可以填写appId
					// imgUrl需用ip，否则微信在ios中会把域名解析成ip来做请求
					"imgUrl": 'http://hkjc.qq.com/styles/img/share_logo.gif',
					"link": 'http://hkjc.qq.com?race_id='+ data.race_id,
					"desc": _desc,
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
						$('.layer-share').addClass('hide');
					},
					// 整个分享过程结束
					all: function(resp) {
						// 如果你做的是一个鼓励用户进行分享的产品，在这里是不是可以给用户一些反馈了？
						//alert("分享结束");
					}
				};
				$.extend(wxData, data);
				$.extend(wxCallbacks, callbacks);

				// 用户点开右上角popup菜单后，点击分享给好友，会执行下面这个代码
				Api.shareToFriend(wxData, wxCallbacks);

				// 点击分享到朋友圈，会执行下面这个代码
				Api.shareToTimeline(wxData, wxCallbacks);


			});
		};

	});