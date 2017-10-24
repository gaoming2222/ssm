var _isAjaxRequest = false;// 是否是远程请求
var SYS_REQUESTPAGEID = "PRJMNG_QUOTA_OCCUPINFO";

windowHandler.onload = function() {
	JrzlTools.queryGrid(gridCfg, columnsCfg);
	// 流程实例ID
	JrzlTools.distroyProgress(SYS_REQUESTPAGEID);
};
function view_onclick(ruleId) {
	var params = Request._assembleParameters({
		'RULE_ID' : ruleId
	});
	window.parent.addMainTab("PRJMNG_QUOTA_OCCUPINFODTL",
			"占用详情 ",
			"../../../jrzl/prjmng/quota/occupinfodtl.html?"
					+ params, null, SYS_REQUESTPAGEID);
}
function renderUrl(data, type, full, meta) {
	var ruleId = full.RULE_ID;
	return "<a onclick=view_onclick('" + ruleId + "')>" + data + "</a>";
}
var gridCfg = {
	id : "maingrid",
	needOrderNum : true,
	needCheckBox : false,
	localItems : "localItems",
	initable : false,
	pageSize : 5,
	height : 200,
	primaryKey : "BIZ_OP_UID",
	multiPageSelect : true
};

var columnsCfg = [ {
	property : "OCCUP_UID",
	title : "操作ID",
	hidden : true
}, {
	property : "QUOTA_ID",
	title : "额度编号",
}, {
	property : "CORE_USER_ID",
	title : "核心客户编号",
},{
	property : "RULE_ID",
	title : "规则编号",
	renderer: "renderUrl",
},{
	property : "DAT_STR",
	title : "额度期限起(月)",
}, {
	property : "DAT_END",
	title : "额度期限止",
	align : "center"
}, {
	property : "TOP_QUOTA",
	title : "额度上限"
}, {
	property : "REAMIN_QUOTA",
	title : "剩余可用额度"
}, {
	property : "OCCUPY_HIGN_LIMIT",
	title : "可占用高年度额度",

} ];
var localItems = null;
localItems = [ {
	"OCCUP_UID" : "0001",
	"QUOTA_ID" : "0001",
	"CORE_USER_ID" : "80234497",
	"RULE_ID" : "GZ001",
	"DAT_STR" : "2017-03",
	"DAT_END" : "2017-08",
	"TOP_QUOTA" : "1000000",
	"REAMIN_QUOTA" : "400000",
	"OCCUPY_HIGN_LIMIT" : "200000"
}, {
	"OCCUP_UID" : "0002",
	"QUOTA_ID" : "0001",
	"CORE_USER_ID" : "80234497",
	"RULE_ID" : "GZ002",
	"DAT_STR" : "2017-08",
	"DAT_END" : "2017-11",
	"TOP_QUOTA" : "1000000",
	"REAMIN_QUOTA" : "400000",
	"OCCUPY_HIGN_LIMIT" : "200000"
} , {
	"OCCUP_UID" : "0003",
	"QUOTA_ID" : "0001",
	"CORE_USER_ID" : "80234497",
	"RULE_ID" : "GZ003",
	"DAT_STR" : "2017-08",
	"DAT_END" : "2017-11",
	"TOP_QUOTA" : "1000000",
	"REAMIN_QUOTA" : "400000",
	"OCCUPY_HIGN_LIMIT" : "200000"
}, {
	"OCCUP_UID" : "0004",
	"QUOTA_ID" : "0001",
	"CORE_USER_ID" : "80234497",
	"RULE_ID" : "GZ004",
	"DAT_STR" : "2017-08",
	"DAT_END" : "2017-11",
	"TOP_QUOTA" : "1000000",
	"REAMIN_QUOTA" : "400000",
	"OCCUPY_HIGN_LIMIT" : "200000"
}  ];