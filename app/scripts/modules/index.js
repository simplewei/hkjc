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

require(['zepto', 'queryString', 'underscore', 'widgets/wxLogin', 'widgets/tips', 'widgets/loading',
	'text!modules/tpl/index.html', 'widgets/defaultWxShare'],
	function($, queryString, _, wxLogin, tips, loading, tpl) {

	loading.show();

	wxLogin.login().then(function() {

		/*
		 * 获取所有赛事
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
		 * 根据后台规则的映射表
		 * '1'表示 跑馬地
		 * '2'表示 沙田
		 */
		var addrMap = {
			'1': '跑馬地',
			'2': '沙田'
		};

		/*
		 * 获取某一场赛事余票
		 * response: buy_limit: 可购买最大票数
		 * response: remain_count: 剩余票数
		 */
		var getRaceDetail = function(id){
			loading.show();
			return $.ajax({
				url: '/cgi-bin/v2.0/hkjc_query_race.cgi',
				data:{
					req_type: 2,
					race_id: id
				}
			}).then(function(data){
				loading.hide();
				return data;
			});
		};

		/*
		 * 下单&预支付
		 */
		var pay = function(id, count){
			loading.show();
			return $.ajax({
				url: '/cgi-bin/v2.0/hkjc_order_n_prepay.cgi',
				data:{
					race_id: id,
					ticket_count: count,
					from_url: 'wechat'
				}
			}).then(function(data){
				loading.hide();
				if(data.retcode == '0'){
					location.href = decodeURIComponent(data.pay_url);
				}else{
					new tips({content: JSON.stringify(data)});
				};
			})
		};


		/*
		 * 根据用户选择联动赛事地点(input)、入场地(select)
		 * 赛事地点每时段只有一个
		 */
		var parseRaceAddr = function(){
			var addrs = JSON.parse(this.value);
			addr = addrs[0];
			if(!addr)
				return;

			$('#race-addr').val(addrMap[addr.race_addr]);

			var _html= '';
			_.each(addr.checkin_info, function(obj){
				var selected = obj.checkin_addr == addr.race_addr? 'selected="selected"': '';
				_html+= '<option '+selected +' value=\''+ JSON.stringify(obj) +'\'>'+
					addrMap[obj.checkin_addr] +'</option>'
			});
			$('#race-chkin').html(_html).change();
		};

		/*
		 * 根据用户选择联动余票信息
		 * Math.min自动将字符转为整型
		 * 输入框若超出 0~limit限额，都将被强制改回限额
		 */
		var parseTicketInfo = function(addrs){
			var raceInfo = JSON.parse(this.value);
			getRaceDetail(raceInfo.race_id).then(function(data){
				var limit = Math.min(data.buy_limit, data.remain_count);
				var $input = $('.count-select').attr('data-limit', limit).find('input');
				if($input.val() > limit){
					$input.val(limit);					
				};
				if($input.val() < 1){
					$input.val(1);					
				};
				if(limit == 0){
					$('form.on-sale').addClass('had-sold');
				}else{
					$('form.on-sale').removeClass('had-sold');				
				};
				changeCountState();
			});
		};


		/*
		 * 根据数字输入框内容改变左右按钮状态
		 */
		var changeCountState = function() {
			$('.count-select .add,.count-select .del').removeClass('on');
			var currentVal = $('.count-select input').val();
			var limit = $('.count-select').attr('data-limit');
			if (parseInt(currentVal) <= 1) {
				$('.count-select .del').addClass('on');
			};
			if (parseInt(currentVal) >= parseInt(limit)) {
				$('.count-select .add').addClass('on');
			};
			cclatePrice();
		};

		/*
		 * 初始化门票输入框
		 */
		var initCountSelector = function(){

			$('.count-select').on('tap', '.add, .del', function(){
				if($(this).hasClass('add') && $(this).hasClass('on')){
					new tips({content: '超出購買限額'});
					return;
				};
				var $input = $(this).parent().find('input');
				var currentVal = parseInt($input.val());
				var limit = $(this).parent().attr('data-limit');
				if($(this).hasClass('add') && currentVal < limit){
					currentVal += 1;
					$input.val(currentVal);
				}else if($(this).hasClass('del')&& currentVal > 1){
					currentVal -= 1;
					$input.val(currentVal);
				};
				changeCountState();
			});
		};


		/*
		 * 实时计算价格
		 * 
		 */
		var cclatePrice = function(){
			var raceInfo = JSON.parse($('#race-chkin').val());
			var ticket_price = raceInfo.ticket_price;
			var full_price = raceInfo.full_price;
			var numb = $('.count-select input').val();
			// debugger
			$('.pay-price .old em').html((numb*full_price/100).toFixed(2));
			$('.pay-price .now em').html((numb*ticket_price/100).toFixed(2));
		};

		/*
		 * 立即预定
		 * 
		 */
		var payOrder = function(){
			if($('form.on-sale').hasClass('had-sold')){
				return false;
			};
			var raceInfo = JSON.parse($('#race-chkin').val());
			var race_id = raceInfo.race_id;
			var count = $('.count-select input').val();
			if(pay <1){
				new tips({content: '至少購買一張票！'});
				return;
			};
			pay(race_id, count);
		};


		/*
		 * 根据race_id自动联想赛事选项
		 * 
		 */
		 var autoComplete = function(data){
		 	var parsed = queryString.parse(location.search);
		 	if(parsed.race_id){		 		
		 		$.each(data.race_info,function(i,m){// debugger
		 			$.each(this.race,function(i,n){
			 				$.each(this.checkin_info,function(){
				 			if(this.race_id == parsed.race_id){
				 				$('#race-date').val(JSON.stringify(m.race));
				 			};
				 		});
			 		});
		 		});
		 	};
		 	// debugger
		 };

		/*
		 * 页面初始化入口
		 */
		var init = function(){
			// 获取所有赛事
			getAllRace().then(function(data){
				loading.hide();
				var temp = _.template(tpl);
				var _html = temp(data);
				$('#race-date').html(_html).change();
				autoComplete(data);
			});

			// 根据用户选择联动赛事地点
			$('#race-date').on('change', parseRaceAddr);
			// 根据用户选择联动入场地
			// $('#race-addr').on('change', parseChkinAddr);
			// 根据用户选择联动余票信息
			$('#race-chkin').on('change', parseTicketInfo);

			initCountSelector();

			//  立即预定
			$('.btn-book').on('tap', payOrder);

		};

		init();
	});
});