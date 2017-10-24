var SYS_REQUESTPAGEID = "PRJMNG_QUOTA_QUOTARULE";// 页面ID
var _isAjaxRequest = false;// 是否是远程请求

//页面加载时调用
windowHandler.onload = function() {
	//查询显示列表
	JrzlTools.queryGrid(gridCfg, columnsCfg);
	var map = {};
	map['A'] = "期限";
	map['B'] = "券种";
	JrzlTools.loadSelectDomData([ "CONTROL_TYPE" ], map, false, map['A']);

	var map1 = {};
	map1['A'] = "GSM";
	map1['B'] = "GSM";
	JrzlTools.loadSelectDomData([ "BOND_TYPE" ], map1, false, map['A']);

	var mapQuoDat = {};
	mapQuoDat['A'] = "公募";
	mapQuoDat['B'] = "私募";
	JrzlTools.loadSelectDomData([ "COLLECTION_TYPE" ], mapQuoDat, true, null);
	//显示页面
	JrzlTools.distroyProgress(SYS_REQUESTPAGEID);
}
// 数据请求回调函数

// datagrid 的列配置
var columnsCfg = [  {
	property : "CONTROL_ID",
	title : "监控管理ID",
	width : "100px",
	hidden : "true",
    align : "center"
}, {
	property : "TRADE_DAT",
	title : "日期",
	width : "100px",
	align : "center"
}, {
	property : "QUOTA_ID",
	title : "额度编号",
	width : "100px",
	align : "center"
}, {
	property : "USER_ID",
	title : "核心客户编号",
	width : "100px",
	align : "center"

},{
	property : "RULE_ID",
	title : "规则编号",
	width : "100px",
	align : "center"

}, {
	property : "LEAD_NUM",
	title : "领用编号",
	width : "100px",
	align : "center"

},{
	property : "ISS_SCALE",
	title : "发行规模",
	width : "100px",
	align : "center"
},{
	property : "BOND_ID",
	title : "债券代码",
	width : "100px",
	align : "center"

}, {
	property : "BOND_TYPE",
	title : "债券类型",
	width : "100px",
	align : "center"
},{
	property : "BOND_LIST_DAT",
	title : "债券上市日",
	width : "100px",
	align : "center"
}, {
	property : "BOND_MAT_DAT",
	title : "债券到期日",
	width : "100px",
	align : "center"
},{
	property : "CAMP_ON",   //增加为+，减少为-
	title : "预占",
	width : "100px",
	align : "center"
},{
	property : "REAL_ON",  //增加为+，减少为-
	title : "实占",
	width : "100px",
	align : "center"
},{
	property : "REMIAN_NUM",
	title : "剩余可用金额",
	width : "100px",
	align : "center"
}];
// render 转换函数
function renderCon(data, type, full, meta) {
	if (data == "A") {
		return "期限";
	} else {
		return "券种";
	}
}
function renderBond(data, type, full, meta) {
	if (data == "A") {
		return "GSM";
	} else {
		return "GSM";
	}
}
// datagrid配置
var gridCfg = {
	id : "mygrid",
	action : "",
	localItems : "localItems",
	scrollX : false, // 横向滚动条
	needOrderNum : true,
	initable : true,
	validated : true,
	afterLoaded : 'distroyProgress'
};

function distroyProgress() {
	JrzlTools.distroyProgress(SYS_REQUESTPAGEID);
}

// 查询
function query_onclick() {
	var params = null;
	params = {

	};// 列表查询参数

	mygrid.onquery(params); // 列表查询

}


// 本地数据对象，不需要走后台
var localData = null;
var localItems = null;
// #localdata定义----------end

// #localdata赋值---------start

localItems = [ {
	"CONTROL_ID" : "JKGL0001",
	"TRADE_DAT" : "2017-08-22",
	"QUOTA_ID" : "EDGL0001",
	"USER_ID" : "80234497",
	"RULE_ID" : "0001",
	"BOND_ID" : "0001",
	"LEAD_NUM" : "00001",
	"ISS_SCALE" : "6000000",
	"BOND_TYPE" : "企业债",
	"BOND_LIST_DAT" :"2017-08-22",
	"BOND_MAT_DAT" :"2017-12-22",
	"CAMP_ON" : "1000000",
	"REAL_ON" : "800000",
	"REMIAN_NUM" : "5000000"
},{
	"CONTROL_ID" : "JKGL0001",
	"TRADE_DAT" : "2017-08-22",
	"QUOTA_ID" : "EDGL0001",
	"USER_ID" : "80234497",
	"RULE_ID" : "0001",
	"BOND_ID" : "0002",
	"LEAD_NUM" : "00001",
	"ISS_SCALE" : "6000000",
	"BOND_TYPE" : "企业债",
	"BOND_LIST_DAT" :"2017-06-22",
	"BOND_MAT_DAT" :"2017-08-22",
	"CAMP_ON" : "1000000",
	"REAL_ON" : "800000",
	"REMIAN_NUM" : "5000000"
},{
	"CONTROL_ID" : "JKGL0001",
	"TRADE_DAT" : "2017-08-22",
	"QUOTA_ID" : "EDGL0001",
	"USER_ID" : "80234497",
	"RULE_ID" : "0002",
	"BOND_ID" : "0003",
	"LEAD_NUM" : "00001",
	"ISS_SCALE" : "6000000",
	"BOND_TYPE" : "企业债",
	"BOND_LIST_DAT" :"2017-03-22",
	"BOND_MAT_DAT" :"2017-05-22",
	"CAMP_ON" : "1000000",
	"REAL_ON" : "800000",
	"REMIAN_NUM" : "5000000"
},{
	"CONTROL_ID" : "JKGL0001",
	"TRADE_DAT" : "2017-08-22",
	"QUOTA_ID" : "EDGL0002",
	"USER_ID" : "80234488",
	"RULE_ID" : "0003",
	"BOND_ID" : "0004",
	"LEAD_NUM" : "00001",
	"ISS_SCALE" : "6000000",
	"BOND_TYPE" : "企业债",
	"BOND_LIST_DAT" :"2017-09-22",
	"BOND_MAT_DAT" :"2017-11-22",
	"CAMP_ON" : "1000000",
	"REAL_ON" : "800000",
	"REMIAN_NUM" : "5000000"
} ]

// #localAuthData赋值---------start
localAuthData = {

};
// #localAuthData赋值---------end
// #localPopupData赋值---------start
localPopupData = [

];
// #localPopupData赋值---------end

