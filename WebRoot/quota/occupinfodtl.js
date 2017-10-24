var _isAjaxRequest = false;// 是否是远程请求
var SYS_REQUESTPAGEID = "PRJMNG_QUOTA_OCCUPINFODTL";

windowHandler.onload = function() {
	JrzlTools.queryGrid(gridCfg, columnsCfg);
	// 流程实例ID
	JrzlTools.distroyProgress(SYS_REQUESTPAGEID);
};
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
	property : "OCCUPDTL_UID",
	title : "占用详情ID",
	hidden : true
},{
	property : "RULE_ID", // 如若没有则以-表示
	title : "规则编号",
	hidden : true
}, {
	property : "BOND_ID",
	title : "债券编号",
},{
	property : "BOND_NAME",
	title : "债券全称",
},{
	property : "BOND_LIST_DAT",
	title : "债券上市日",
},{
	property : "BOND_MAT_DAT",
	title : "债券到期日",
} ,{
	property : "OCCUP_NUM",
	title : "占用金额",
},{
	property : "OCCUP_FUT_NUM",
	title : "占用高年限金额"
}];
var localItems = null;
localItems = [ {
	"OCCUPDTL_UID" : "0001",
	"RULE_ID" : "GZ001",
	"BOND_ID" : "BOND0001",
	"BOND_NAME" : "潍坊债券",
	"BOND_LIST_DAT" : "2017-08-01",
	"BOND_MAT_DAT" : "2017-09-01",
	"OCCUP_NUM" : "200000",
	"OCCUP_FUT_NUM" :"0"
}, {
	"OCCUPDTL_UID" : "0002",
	"RULE_ID" : "GZ001",
	"BOND_ID" : "BOND0002",
	"BOND_NAME" : "潍坊债券",
	"BOND_LIST_DAT" : "2017-08-01",
	"BOND_MAT_DAT" : "2017-09-01",
	"OCCUP_NUM" : "0",
	"OCCUP_FUT_NUM" :"8000"
}  ];