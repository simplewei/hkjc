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
	'text!modules/tpl/record.html', 'widgets/defaultWxShare'],
	function($, _, iscroll, wxLogin, tips, loading, recordTpl) {

	
		/*
		 * 渲染某一页的10条记录
		 * params: container 记录列表容器
		 */
		var recorder = function() {};

		recorder.prototype = {

			$container: $('.record-wrap'),

			$ul: $('.record-wrap .record'),

			totalCount: 0,

			currPage: -1,

			limit: 8,

			hasRecords: true,

			// 加载数据，并渲染DOM
			parseRecords: function(page) {
				$('.load-more').removeClass('hide');
				var that = this;
				return $.ajax({
					url: '/cgi-bin/v2.0/hkjc_query_all_order.cgi',
					data: {
						page_id: page,
						limit: this.limit
					}
				}).then(function(data) {
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
			loadFirstPage: function() {
				var $this = $(this);
				this.parseRecords(this.currPage + 1).then(function(data) {
					$this.trigger('firstLoad', data);
				});
			},

			// 默认第一页
			loadNextPage: function() {
				var $this = $(this);
				if ((this.limit * (this.currPage + 1)) < this.totalCount) {
					this.parseRecords(this.currPage + 1).then(function() {
						$this.trigger('load');
					});
				};
				if ((this.limit * (this.currPage + 1)) >= this.totalCount) {
					new tips({
						content: '全部加載完畢',
						stayTime: 500
					});
					this.hasRecords = false;
				};
			}
		};

		wxLogin.login().then(function() {

			/*
			 * 页面初始化入口
			 */
			var init = function(){
				var  total_count = 0;
				
				var Recorder = new recorder();

				Recorder.loadFirstPage();

				$(Recorder).on('firstLoad', function(e, data){
					$('.main').removeClass('')
					var className, retcode = parseInt(data.retcode);

					// retcode为0时表明cgi正常返回，否则异常
					if(!retcode && data.list_infos.length){
						className = 'show-record-wrap';
					}else if(!retcode){
						className = 'show-no-tips';
					}else{
						className = 'show-busy-tips';
					};
					$('.main').removeClass('show-loading-tips').addClass(className);
				
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

	            //  点击门票跳转到明细页
	            $('.record').on('tap', '.record-item', function(){
	            	var _href = $(this).attr('data-href');
	            	if(_href){
	            		location.href = _href;
	            	};
	            });
			};

			init();
		});
	});