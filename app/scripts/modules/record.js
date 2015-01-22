/*
 * 马会门票订单记录页
 *
 * /cgi-bin/v2.0/hkjc_query_all_order.cgi
 * param: page_id	页数,从0开始
 * param: limit		每页记录数，需大于0
 * response: total_count	总条目数，可用于分页
 * response: list_infos		本页记录明细
 *
 * author: simplewei
 * date: 2015-01-21
 */

require(['zepto', 'underscore', 'iscroll', 'widgets/wxLogin', 'widgets/tips', 'widgets/loading',
	'text!modules/tpl/record.html'],
	function($, _, iscroll, wxLogin, tips, loading, recordTpl) {
var demo = {"list_infos":[{"checkin_addr":"2","create_time":"2015-01-21 15:18:56","listid":"3000000003201501210000010132","modify_time":"2015-01-21 15:18:56","pay_time":"0000-00-00 00:00:00","race_addr":"1","race_day":"2015-02-01","race_type":"2","state":"1","ticket_count":"3","ticket_price":"100","total_money":"300","trade_state":"2","transid":"","uin":"ojmktt0eX6XixqHNl7wmSUvM_IQc"},{"checkin_addr":"1","create_time":"2015-01-21 14:41:00","listid":"3000000003201501210000010120","modify_time":"2015-01-21 14:41:00","pay_time":"0000-00-00 00:00:00","race_addr":"2","race_day":"2015-02-07","race_type":"2","state":"1","ticket_count":"2","ticket_price":"100","total_money":"200","trade_state":"2","transid":"","uin":"ojmktt0eX6XixqHNl7wmSUvM_IQc"},{"checkin_addr":"1","create_time":"2015-01-21 11:49:27","listid":"3000000003201501210000010100","modify_time":"2015-01-21 11:49:27","pay_time":"0000-00-00 00:00:00","race_addr":"2","race_day":"2015-02-07","race_type":"2","state":"1","ticket_count":"3","ticket_price":"100","total_money":"300","trade_state":"2","transid":"","uin":"ojmktt0eX6XixqHNl7wmSUvM_IQc"},{"checkin_addr":"2","create_time":"2015-01-21 11:44:55","listid":"3000000003201501210000010081","modify_time":"2015-01-21 11:44:55","pay_time":"0000-00-00 00:00:00","race_addr":"1","race_day":"2015-02-07","race_type":"2","state":"1","ticket_count":"5","ticket_price":"100","total_money":"500","trade_state":"2","transid":"","uin":"ojmktt0eX6XixqHNl7wmSUvM_IQc"},{"checkin_addr":"2","create_time":"2015-01-21 11:12:06","listid":"3000000003201501210000010090","modify_time":"2015-01-21 11:12:06","pay_time":"0000-00-00 00:00:00","race_addr":"2","race_day":"2015-02-01","race_type":"2","state":"1","ticket_count":"3","ticket_price":"100","total_money":"300","trade_state":"2","transid":"","uin":"ojmktt0eX6XixqHNl7wmSUvM_IQc"},{"checkin_addr":"1","create_time":"2015-01-21 11:12:04","listid":"3000000003201501210000010080","modify_time":"2015-01-21 11:12:04","pay_time":"0000-00-00 00:00:00","race_addr":"2","race_day":"2015-02-01","race_type":"2","state":"1","ticket_count":"3","ticket_price":"100","total_money":"300","trade_state":"2","transid":"","uin":"ojmktt0eX6XixqHNl7wmSUvM_IQc"},{"checkin_addr":"1","create_time":"2015-01-21 10:42:12","listid":"3000000003201501210000010073","modify_time":"2015-01-21 10:42:12","pay_time":"0000-00-00 00:00:00","race_addr":"1","race_day":"2015-02-01","race_type":"2","state":"1","ticket_count":"2","ticket_price":"100","total_money":"200","trade_state":"2","transid":"","uin":"ojmktt0eX6XixqHNl7wmSUvM_IQc"},{"checkin_addr":"1","create_time":"2015-01-21 10:36:39","listid":"3000000003201501210000010071","modify_time":"2015-01-21 10:36:39","pay_time":"0000-00-00 00:00:00","race_addr":"1","race_day":"2015-02-01","race_type":"2","state":"1","ticket_count":"3","ticket_price":"100","total_money":"300","trade_state":"2","transid":"","uin":"ojmktt0eX6XixqHNl7wmSUvM_IQc"}],"msg_id":"1f85810a142182923732180h","record_count":"8","retcode":"0","retmsg":"ok","tid":"hkjc_query_all_order","total_count":"9"}


		wxLogin.login().then(function() {

			
			/*
			 * 渲染某一页的10条记录
			 * params: container 记录列表容器
			 */
			var recorder = function(){};

			recorder.prototype = {

				$container: $('.record-wrap'),

				$ul: $('.record-wrap .record'),

				totalCount: 0,

				currPage: -1,

				limit: 8,

				hasRecords: true,

				// 加载数据，并渲染DOM
				parseRecords: function(page){
					$('.load-more').removeClass('hide');
					var that = this;
					return $.ajax({
						url: '/cgi-bin/v2.0/hkjc_query_all_order.cgi',
						data:{
							page_id: page,
							limit: this.limit
						}
					}).then(function(data){
						var _temp = _.template(recordTpl);
						var _html = _temp(data);
						that.$ul.append(_html);
						that.totalCount = data.total_count;
						++that.currPage;
						$('.load-more').addClass('hide');
						return data;
					});
				},

				// 加载第一页
				loadFirstPage: function(){
					var $this = $(this);
					this.parseRecords(this.currPage+1).then(function(){
						$this.trigger('firstLoad');
					});
				},

				// 默认第一页
				loadNextPage: function(){
					var $this = $(this);
					if((this.limit* (this.currPage+1))<this.totalCount){
						this.parseRecords(this.currPage+1).then(function(){
							$this.trigger('load');
						});
					};
					if((this.limit* (this.currPage+1))>=this.totalCount){
						new tips({
							content: '全部加载完毕',
							stayTime: 500
						});
						this.hasRecords = false;
					};					
				}
			};


			/*
			 * 页面初始化入口
			 */
			var init = function(){
				var  total_count = 0;
				
				var Recorder = new recorder();
				Recorder.loadFirstPage();
				$(Recorder).on('firstLoad', function(){
					$('.main').removeClass('show-loading-tips').addClass('show-record-wrap');
					myScroll.refresh();
				});
				$(Recorder).on('load', function(){
					myScroll.refresh();
				});
						
				var myScroll = new iscroll('#wrapper',{
					scrollbars: true
				});
	            myScroll.on('scrollEnd', function () {
	                if(Recorder.hasRecords){
	                	Recorder.loadNextPage();
	                }
	            });
			};

			init();
		});
	});