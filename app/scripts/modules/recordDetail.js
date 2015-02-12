/*
 * 马会门票订单详情页
 *
 * 单个订单查询接口
 * /cgi-bin/v2.0/hkjc_query_order.cgi
 * param: listid	订单id
 * response: list_info	订单信息
 *
 * author: simplewei
 * date: 2015-01-21
 */

require(['zepto', 'underscore', 'iscroll', 'queryString', 'qrcode', 'widgets/weixinApi',
		'html2canvas', 'widgets/wxLogin', 'widgets/tips', 'widgets/loading',
		'text!modules/tpl/recordDetail.html', 'text!modules/tpl/recordDetailLayer.html'
	],
	function($, _, iscroll, queryString, qrcode, weixin, html2canvas, wxLogin,
		tips, loading, rdTpl, rdlTpl) {

		// var demo = {"list_info":{"checkin_addr":"1","create_time":"2015-01-23 17:24:10","from_url":"wechat","listid":"3000000003201501230000010560","modify_time":"2015-01-23 17:25:14","pay_time":"2015-01-23 17:25:16","race_addr":"1","race_day":"2015-01-28","race_id":"1","race_type":"2","send_msg":"0","spid":"3000000003","state":"1","ticket_count":"1","ticket_price":"10","total_money":"10","trade_state":"4","transid":"1010013000000003201501230000473267","uin":"ojmkttwv_4zEk3uec5d8jxZx6jEc"},"listid":"3000000003201501230000010560","msg_id":"1f85810a142200553902907h","retcode":"0","retmsg":"ok","ticket_info":[{"qrcode":"S002114-9000001108-01006","state":"1"}],"tid":"hkjc_query_order"}

		wxLogin.login().then(function() {

			/*
			 * 获取订单明细
			 */
			var getListInfo = function(id) {
				return $.ajax({
					url: '/cgi-bin/v2.0/hkjc_query_order.cgi',
					data: {
						listid: id
					}
				});
			};


			/*
			 * 显示门票明细-qrcode
			 * 传入this —— 当前li节点
			 */
			showQrcode = function() {
				params = JSON.parse($(this).attr('data-params'));
				var _html = _.template(rdlTpl)(params);
				var $layer = $(_html).appendTo(document.body);

				// 阅读qrcodejs源码发现其逻辑为：
				// 先生成canvas，再生成带默认base64 src的img
				// 待img onload事件异步触发后在生产真正的二维码
				var qrcode = new QRCode($(".img-wrap", $layer)[0], {
					width: 238,
					height: 238,
					text: params.qrcode
				});

				$layer.removeClass('hide');

				$('.btn-line', $layer).click(function() {
					$layer.remove();
				});



				html2canvas($('.piccut-area')[0], {
					letterRendering: true,
					background: '#fff',
					onrendered: function(canvas) {
						$.ajax({
							url: '/node/ticket',
							type: 'post',
							data:{
								imgData: canvas.toDataURL(),
								name: params.qrcode
							}
						}).then(function(data){
							var _h = '<img class="qrcode-download" src="'+
								data.url+ '" width="238" height="238"/>';
							$('.img-wrap').append(_h);
							$('.tips-1').css({
								visibility: 'visible'
							});
						});
					}
				});
		



			};

			/*
			 * 页面初始化入口
			 * 数据加载完毕后将节点插入到footer节点前
			 * 然后去除loading效果
			 */
			var init = function() {
				var parsed = queryString.parse(location.search);
				getListInfo(parsed.listid).then(function(data) {
					// var data ={"list_info":{"checkin_addr":"1","create_time":"2015-01-24 17:09:37","from_url":"wechat","listid":"3000000003201501240000010644","modify_time":"2015-01-24 17:10:11","pay_time":"2015-01-24 17:10:14","race_addr":"1","race_day":"2015-02-15","race_id":"11","race_type":"1","send_msg":"0","spid":"3000000003","state":"1","ticket_count":"1","ticket_price":"10","total_money":"10","trade_state":"4","transid":"1010013000000003201501240000473386","uin":"ojmkttwv_4zEk3uec5d8jxZx6jEc"},"listid":"3000000003201501240000010644","msg_id":"1f85810a142210880404115h","retcode":"0","retmsg":"ok","ticket_info":[{"qrcode":"S002114-9000001108-11000","state":"1"}],"tid":"hkjc_query_order"}
					var _html = _.template(rdTpl)(data);
					$(_html).insertBefore('footer')
						.on('click', '.tickets>li', showQrcode);
					$('.container').removeClass('show-loading-tips');
					share(data.list_info);
				});
			};

			init();
		});

		//微信分享
		var share = function(data, callbacks){
		
		
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


				// 用户点开右上角popup菜单后，点击分享给好友，会执行下面这个代码
				Api.shareToFriend(wxData, wxCallbacks);

				// 点击分享到朋友圈，会执行下面这个代码
				Api.shareToTimeline(wxData, wxCallbacks);
			

			});
		};
		
	});