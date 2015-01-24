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

require(['zepto', 'underscore', 'iscroll', 'queryString', 'qrcode', 
	'html2canvas', 'widgets/wxLogin', 'widgets/tips', 'widgets/loading',
	'text!modules/tpl/recordDetail.html', 'text!modules/tpl/recordDetailLayer.html', 'widgets/defaultWxShare'],
	function($, _, iscroll, queryString, qrcode, html2canvas, wxLogin,
	tips, loading, rdTpl, rdlTpl) {

// var demo = {"list_info":{"checkin_addr":"1","create_time":"2015-01-23 17:24:10","from_url":"wechat","listid":"3000000003201501230000010560","modify_time":"2015-01-23 17:25:14","pay_time":"2015-01-23 17:25:16","race_addr":"1","race_day":"2015-01-28","race_id":"1","race_type":"2","send_msg":"0","spid":"3000000003","state":"1","ticket_count":"1","ticket_price":"10","total_money":"10","trade_state":"4","transid":"1010013000000003201501230000473267","uin":"ojmkttwv_4zEk3uec5d8jxZx6jEc"},"listid":"3000000003201501230000010560","msg_id":"1f85810a142200553902907h","retcode":"0","retmsg":"ok","ticket_info":[{"qrcode":"S002114-9000001108-01006","state":"1"}],"tid":"hkjc_query_order"}

		wxLogin.login().then(function() {

			/*
			 * 获取订单明细
			 */
			var getListInfo = function(id){
				return $.ajax({
					url: '/cgi-bin/v2.0/hkjc_query_order.cgi',
					data:{
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

				$('.btn-line', $layer).tap(function(){
					$layer.remove();
				});
				
				

				// 生成门票图片 html2canvas
				// $.ajax({
				// 	url: '/node/ticket',
				// 	data: {
				// 		code: params.qrcode,
				// 		checkin_addr: params.checkin_addr,
				// 		race_day: params.race_day,
				// 		race_type: params.race_type
				// 	},
				// 	timeout: 3000
				// }).then(function(data){
				// 	$('.img-wrap').append('<img class="qrcode-download" src="'+
				// 		data.url+'" width="238" height="238"/>')
				// });


			};

			/*
			 * 页面初始化入口
			 * 数据加载完毕后将节点插入到footer节点前
			 * 然后去除loading效果
			 */
			var init = function(){
				var parsed = queryString.parse(location.search);
				getListInfo(parsed.listid).then(function(data){
					var _html = _.template(rdTpl)(data);
					$(_html).insertBefore('footer')
					.on('tap', '.tickets>li', showQrcode);
					$('.container').removeClass('show-loading-tips');
					
				});
			};

			init();
		});

		
	});