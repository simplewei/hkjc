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
	'text!modules/tpl/recordDetail.html', 'text!modules/tpl/recordDetailLayer.html'],
	function($, _, iscroll, queryString, qrcode, html2canvas, wxLogin,
	tips, loading, rdTpl, rdlTpl) {

var demo = {"list_infos":[{"checkin_addr":"2","create_time":"2015-01-21 15:18:56","listid":"3000000003201501210000010132","modify_time":"2015-01-21 15:18:56","pay_time":"0000-00-00 00:00:00","race_addr":"1","race_day":"2015-02-01","race_type":"2","state":"1","ticket_count":"3","ticket_price":"100","total_money":"300","trade_state":"2","transid":"","uin":"ojmktt0eX6XixqHNl7wmSUvM_IQc"},{"checkin_addr":"1","create_time":"2015-01-21 14:41:00","listid":"3000000003201501210000010120","modify_time":"2015-01-21 14:41:00","pay_time":"0000-00-00 00:00:00","race_addr":"2","race_day":"2015-02-07","race_type":"2","state":"1","ticket_count":"2","ticket_price":"100","total_money":"200","trade_state":"2","transid":"","uin":"ojmktt0eX6XixqHNl7wmSUvM_IQc"},{"checkin_addr":"1","create_time":"2015-01-21 11:49:27","listid":"3000000003201501210000010100","modify_time":"2015-01-21 11:49:27","pay_time":"0000-00-00 00:00:00","race_addr":"2","race_day":"2015-02-07","race_type":"2","state":"1","ticket_count":"3","ticket_price":"100","total_money":"300","trade_state":"2","transid":"","uin":"ojmktt0eX6XixqHNl7wmSUvM_IQc"},{"checkin_addr":"2","create_time":"2015-01-21 11:44:55","listid":"3000000003201501210000010081","modify_time":"2015-01-21 11:44:55","pay_time":"0000-00-00 00:00:00","race_addr":"1","race_day":"2015-02-07","race_type":"2","state":"1","ticket_count":"5","ticket_price":"100","total_money":"500","trade_state":"2","transid":"","uin":"ojmktt0eX6XixqHNl7wmSUvM_IQc"},{"checkin_addr":"2","create_time":"2015-01-21 11:12:06","listid":"3000000003201501210000010090","modify_time":"2015-01-21 11:12:06","pay_time":"0000-00-00 00:00:00","race_addr":"2","race_day":"2015-02-01","race_type":"2","state":"1","ticket_count":"3","ticket_price":"100","total_money":"300","trade_state":"2","transid":"","uin":"ojmktt0eX6XixqHNl7wmSUvM_IQc"},{"checkin_addr":"1","create_time":"2015-01-21 11:12:04","listid":"3000000003201501210000010080","modify_time":"2015-01-21 11:12:04","pay_time":"0000-00-00 00:00:00","race_addr":"2","race_day":"2015-02-01","race_type":"2","state":"1","ticket_count":"3","ticket_price":"100","total_money":"300","trade_state":"2","transid":"","uin":"ojmktt0eX6XixqHNl7wmSUvM_IQc"},{"checkin_addr":"1","create_time":"2015-01-21 10:42:12","listid":"3000000003201501210000010073","modify_time":"2015-01-21 10:42:12","pay_time":"0000-00-00 00:00:00","race_addr":"1","race_day":"2015-02-01","race_type":"2","state":"1","ticket_count":"2","ticket_price":"100","total_money":"200","trade_state":"2","transid":"","uin":"ojmktt0eX6XixqHNl7wmSUvM_IQc"},{"checkin_addr":"1","create_time":"2015-01-21 10:36:39","listid":"3000000003201501210000010071","modify_time":"2015-01-21 10:36:39","pay_time":"0000-00-00 00:00:00","race_addr":"1","race_day":"2015-02-01","race_type":"2","state":"1","ticket_count":"3","ticket_price":"100","total_money":"300","trade_state":"2","transid":"","uin":"ojmktt0eX6XixqHNl7wmSUvM_IQc"}],"msg_id":"1f85810a142182923732180h","record_count":"8","retcode":"0","retmsg":"ok","tid":"hkjc_query_all_order","total_count":"9"}


		wxLogin.login().then(function() {
			/*
			 * 获取某一页的10条记录
			 */
			var getDetail = function(id){
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
				var qrcode = new QRCode($(".img-wrap", $layer)[0], {
					width: 238,
					height: 238,
					text: params.qrcode
				});
				$('.btn-line', $layer).tap(function(){
					$layer.find('.layer-main').addClass('fadeOut');
					setTimeout(function(){
						$layer.remove();
					}, 500);
				});
			};

			/*
			 * 页面初始化入口
			 */
			var init = function(){
				var parsed = queryString.parse(location.search);
				getDetail(parsed.listid).then(function(data){
					var _html = _.template(rdTpl)(data.list_info);
					$(_html).insertBefore('footer').on('tap', '.tickets>li', showQrcode);

				});
			};

			init();
		});
	});