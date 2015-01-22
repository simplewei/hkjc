define(function(){
	
	var exports = {};

	var template = 
	'<div class="pop-loading pop-loading-wx js-cls-loading-transmask show-pop-layer">'+
	    '<div class="pop-loading-cnt">'+
	        '<span class="pop-ico-loading"></span>'+
	        '<div class="pop-loading-txt js-cls-loading-text">载入中...</div>'+
	    '</div>'+
	'</div>';

	exports.show = function(){
		if($('.pop-loading').length)
			$('.pop-loading').show();
		else
			$(document.body).append(template);
	};

	exports.hide = function(){
		$('.pop-loading').hide();
	};

	return exports;
})