/*
 * 提示条
 * Author: simplewei
 * Date: 2015-01-19
 */
;define(['zepto'], function($) {

	// 默认模板
	var tipsTpl =
		'<div class="pop-warn">' +
			'<div class="pop-warn-cnt">' +
				'<p><%-content%></p>' +
			'</div>' +
		'</div>';
	// 默认参数
	var defaults = {
		content: '',
		stayTime: 1000
	};
	// 构造函数
	var Tips = function(options) {
		var self = this;
		$.extend(this, defaults, options)
		var _tipsTpl = tipsTpl.replace('<%-content%>', this.content);
		this.element = $(_tipsTpl).appendTo(document.body);
		var that = this
		this.show();
	};

	Tips.prototype = {
		show: function() {
			var self = this;
			setTimeout(function() {
				self.hide();
			}, this.stayTime);
		},
		hide: function() {
			var self = this;
			this.element.addClass('fadeOut');
			setTimeout(function() {
				self.element.remove();
			}, 500);
		}
	};

	return Tips;
});