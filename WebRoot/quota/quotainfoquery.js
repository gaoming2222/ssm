var SYS_REQUESTPAGEID = "PRJMNG_QUOTA_INFOQUERY";// 页面ID
var _isAjaxRequest = false;// 是否是远程请求

//页面加载时调用
windowHandler.onload = function() {

	JrzlTools.queryGrid(gridRuleInfoCfg, columnsInfoCfg); //初始化grid和columns 初始化为editGrid
	// 流程实例ID
	JrzlTools.distroyProgress(SYS_REQUESTPAGEID);
};

var gridRuleInfoCfg = {
	id : "gridRuleInfo",
	needOrderNum : true,
	needCheckBox : false,
	localItems : "localItems",
	initable : false,
	pageSize : 5,
	height : 200,
	primaryKey : "RULE",
	multiPageSelect : true
};
var columnsInfoCfg = [ {
	property : "RULE",
	title : "UID",
	hidden : true
},
{
	property : "QUO_ID",
	title : "额度编号",
	hidden : true

}, {
	property : "RULE_ID",
	title : "规则编号",

}, {
	property : "CONTROL_TYPE",
	title : "控制类型",
}, {
	property : "BOND_TYPE",
	title : "债券类型",
}, {
	property : "BOND_NAM",
	title : "债券全称",
}, {
	property : "DAT_STR",
	title : "额度期限起",

}, {
	property : "DAT_END",
	title : "额度期限止",
}, {
	property : "QUO_MUN",
	title : "额度金额",
} ];
var localItems = [ {
	"RULE" : "0001",
	"QUO_ID" : "0001",
	"RULE_ID" :"0001",
	"CONTROL_TYPE" : "期限",
	"BOND_TYPE" : "企业债",
	"BOND_NAM" : "ho11",
	"DAT_STR" : "1",
	"DAT_END" : "7",
	"QUO_MUN" : "100000"
}, {
	"RULE" : "0002",
	"QUO_ID" : "0002",
	"RULE_ID" :"0002",
	"CONTROL_TYPE" : "期限",
	"BOND_TYPE" : "企业债",
	"BOND_NAM" : "ho11",
	"DAT_STR" : "7",
	"DAT_END" : "30",
	"QUO_MUN" : "100000"

} ];
