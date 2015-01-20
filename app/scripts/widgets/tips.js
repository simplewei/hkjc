/*
 * 提示条
 * Author: simplewei
 * Date: 2015-01-19
 */
;define(['zepto'], function($) {

	// 默认模板
	var _tipsTpl = '<div class="fadeIn ui-poptips-<%=type%>">' +
		'<div class="ui-poptips-cnt">' +
		'<i></i><%=content%>' +
		'</div>' +
		'</div>';

	// 默认参数
	var defaults = {
		content: '',
		stayTime: 1000,
		type: 'info',
		callback: function() {}
	};
	// 构造函数
	var Tips = function(option) {
		var self = this;
		this.element = $(_tipsTpl).appendTo(document.body);
		this.elementHeight = this.element.height();

		this.option = $.extend(defaults, option);

		var that = this
		setTimeout(function() {
			self.show();
		}, 20);

	};

	Tips.prototype = {
		show: function() {
			var self = this;
			self.element.trigger($.Event("tips:show"));
			if (self.option.stayTime > 0) {
				setTimeout(function() {
					self.hide();
				}, self.option.stayTime)
			}
		},
		hide: function() {
			var self = this;
			self.element.trigger($.Event("tips:hide"));
			this.element.addClass('fadeOut')
			setTimeout(function() {
				self.element.remove();
			}, 500);

		}
	};



	return Tips;
});