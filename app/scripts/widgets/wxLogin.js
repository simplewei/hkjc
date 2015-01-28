/*
 * 微信登录
 * 由于微信的登录状依赖于微信通过url返回的code值，所以，微信登录无法实现无刷新登录
 * cmdno=1表示请求登录，此时需要传递code参数, 由cgi写入air_uin cookie
 * cmdno=2表示判断登录态，此时不需要传递code参数
 * author simplewei
 * date 2014-08-30
 */

define(['zepto', 'queryString', '/scripts/config/sys.config.js'],
    function($, queryString, config) {

    var exports = {},
        login_cgi = '/cgi-bin/v2.0/hkjc_login.cgi',
        appid = 'wx1cf17f8626cfbaf6';

    /*
     * 登陆态校验
     */
    exports.check = function() {

        return $.ajax({
            url: login_cgi,
            data: {
                cmdno: 2
            },
            cache: false
        });
    };


    /*
     * 微信OAuth鉴权入口，将直接跳转到微信健全页，后回调，并带回code。
     */
    exports.OAuthLogin = function() {

        var deferred = $.Deferred();
        var urlHash = queryString.parse(location.search.substr(1));
        if (urlHash.code) {
            return $.ajax({
                url: login_cgi,
                data: {
                    cmdno: 1,
                    code: urlHash.code
                },
                cache: false
            });
        } else {
            top.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' +
                encodeURIComponent(location.href)+ '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
        }
        return deferred;
    }


    /*
     * 登陆入口
     */
    exports.login = function() {

        var deferred = $.Deferred();

        if(navigator.userAgent.indexOf('MicroMessenger') >= 0){
            // 微信登陆            
            exports.check().then(function(data) {
                data.retcode = parseInt(data.retcode);
                if (data.retcode === 0) {
                    deferred.resolve();
                } else if (data.retcode == '2000002') {
                    exports.OAuthLogin().then(deferred.resolve);
                };
            });
        }else{
            // QQ登陆 -- 方便测试
            $.get('/cgi-bin/v2.0/hkjc_query_race.cgi?req_type=1&limit=0').then(function(data) {
                data.retcode = parseInt(data.retcode);
                if (data.retcode === 0) {
                    deferred.resolve();
                } else if (data.retcode == '2000002') {
                    location.href = 'http://ui.ptlogin2.qq.com/cgi-bin/login?appid=1000101&s_url=' +
                    encodeURIComponent(location.href) + '&style=9';
                };
            });
        };        

        return deferred;
    };

    return exports;

});