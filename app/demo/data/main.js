// 分别为 hkjc_query_all_order.cgi hkjc_query_order.cgi
// 制造假数据，方便在PC上测试

var express = require('express');
var app = express();
app.get('/cgi-bin/v2.0/hkjc_query_all_order.cgi', function(req, res) {
	res.send({
		"list_infos": [{
			"checkin_addr": "2",
			"pay_time": "2015-02-02 16:10:53",
			"listid": "3000000003201502020000010790",
			"modify_time": "2015-02-02 16:11:04",
			"pay_time": "2015-02-02 16:11:07",
			"race_addr": "2",
			"race_day": "2015-02-21",
			"race_type": "1",
			"state": "1",
			"ticket_count": "5",
			"ticket_price": "10",
			"total_money": "10",
			"trade_state": "4",
			"transid": "1010013000000003201502020000474118",
			"uin": "ojmkttwv_4zEk3uec5d8jxZx6jEc"
		},{
			"checkin_addr": "2",
			"pay_time": "2015-02-02 16:11:53",
			"listid": "3000000003201502020000010791",
			"modify_time": "2015-02-02 16:11:04",
			"pay_time": "2015-02-02 16:11:07",
			"race_addr": "2",
			"race_day": "2015-02-22",
			"race_type": "1",
			"state": "1",
			"ticket_count": "5",
			"ticket_price": "10",
			"total_money": "10",
			"trade_state": "4",
			"transid": "1010013000000003201502020000474119",
			"uin": "ojmkttwv_4zEk3uec5d8jxZx6jEc"
		}],
		"msg_id": "1f85810a142348031309499h",
		"record_count": "1",
		"retcode": "0",
		"retmsg": "ok",
		"tid": "hkjc_query_all_order",
		"total_count": "1"
	});
});

app.get('/cgi-bin/v2.0/hkjc_query_order.cgi', function(req, res) {
	res.send({
		"list_info": {
			"checkin_addr": "2",
			"pay_time": "2015-02-02 16:10:53",
			"from_url": "wechat",
			"listid": "3000000003201502020000010790",
			"modify_time": "2015-02-02 16:11:04",
			"pay_time": "2015-02-02 16:11:07",
			"race_addr": "2",
			"race_day": "2015-02-21",
			"race_id": "29",
			"race_type": "1",
			"send_msg": "0",
			"spid": "3000000003",
			"state": "1",
			"ticket_count": "1",
			"ticket_price": "10",
			"total_money": "10",
			"trade_state": "4",
			"transid": "1010013000000003201502020000474118",
			"uin": "ojmkttwv_4zEk3uec5d8jxZx6jEc"
		},
		"listid": "3000000003201502020000010790",
		"msg_id": "1f85810a142348080913859h",
		"retcode": "0",
		"retmsg": "ok",
		"ticket_info": [{
			"qrcode": "S002114-9000001108-12000",
			"state": "1"
		},{
			"qrcode": "S002114-9000001108-12001",
			"state": "1"
		},{
			"qrcode": "S002114-9000001108-12002",
			"state": "1"
		},{
			"qrcode": "S002114-9000001108-12003",
			"state": "1"
		},{
			"qrcode": "S002114-9000001108-12004",
			"state": "1"
		}],
		"tid": "hkjc_query_order"
	});
});


module.exports = app;