/*
 * 马会门票购买逻辑
 *
 * /cgi-bin/v2.0/hkjc_query_race.cgi
 * param: req_type 请求类型 
 * 	1:查询当前可售比赛 2:查询某场比赛，用户当前可购买的最大票数
 * param: limit	最大记录数(可选)
 * param: race_id	比赛id
 *
 * /cgi-bin/v2.0/hkjc_order_n_prepay.cgi
 * param: race_id 比赛ID
 * param: ticket_count: 票数
 * 
 * author: simplewei
 * date: 2015-01-19
 */
require(['zepto', 'underscore', 'widgets/wxLogin', 'widgets/tips', 'text!modules/tpl/index.html'],
	function($, _, wxLogin, tips, tpl) {

	wxLogin.login().then(function() {

		/*
		 * 获取所有赛事
		 * 默认timeout
		 */
		var getAllRace = function(){
			return $.ajax({
				url: '/cgi-bin/v2.0/hkjc_query_race.cgi',
				data:{
					req_type: 1,
					limit: 0
				}
			});
		};

		/*
		 * 获取某一场赛事余票
		 * response: buy_limit: 可购买最大票数
		 * response: remain_count: 剩余票数
		 */
		var getRaceDetail = function(id){
			return $.ajax({
				url: '/cgi-bin/v2.0/hkjc_query_race.cgi',
				data:{
					req_type: 2,
					race_id: id
				}
			});
		};

		/*
		 * 下单&预支付
		 * response: 
		 */
		var pay = function(id, count){
			return $.ajax({
				url: '/cgi-bin/v2.0/hkjc_order_n_prepay.cgi',
				data:{
					race_id: id,
					ticket_count: count,
					from_url: 'ass0x'
				}
			});
		};

		/*
		 * 页面初始化主入口
		 * 
		 */
		var init = function(){

			// 获取所有赛事
			getAllRace().then(function(data){
				var temp = _.template(tpl);
				temp(data);
				debugger
				new tips({content: JSON.stringify(data)});

			});

			// 获取某一场赛事余票
			getRaceDetail(2).then(function(data){
				new tips({content: JSON.stringify(data)});
			});

			// 下单&预支付
			// pay(2, 1).then(function(data){
			// 	new tips({content: JSON.stringify(data)});
			// 	if(parseInt(data.retcode) ===0){
			// 		location.href = decodeURIComponent(data.pay_url);
			// 	};
			// });

			
		};

		init();
	});
});