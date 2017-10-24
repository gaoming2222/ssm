var _isAjaxRequest = false;// 是否是远程请求
var SYS_REQUESTPAGEID = "PRJMNG_QUOTA_OPERATELOG";

windowHandler.onload = function() {
	JrzlTools.queryGrid(gridCfg, columnsCfg);
	// 流程实例ID
	JrzlTools.distroyProgress(SYS_REQUESTPAGEID);
};
var gridCfg = {
		  id:"maingrid",
	      needOrderNum: true,
	      needCheckBox :false,
	      localItems: "localItems",
	      initable: false,
	      pageSize: 5,
	      height :200,
	      primaryKey:"BIZ_OP_UID",
	      multiPageSelect:true
	};

var columnsCfg = [{
	property : "BIZ_OP_UID",
	title : "操作ID",
	hidden : true
},{
	property : "BIZ_OP_NOD",
	title : "操作阶段",
	width : "10%",
	align : "center"
},
{
	property : "BIZ_COD",
	title : "业务编号",
	width : "10%",
	align : "center"
},
{
	property : "BIZ_OP_USR",
	title : "操作人",
	width : "10%"
},{
	property : "BIZ_OP_DPT",
	title : "所属机构",
	width : "10%"
},{
	property : "BIZ_OP_TYP",
	title : "操作类型",
	width : "8%",
	align : "center"
},{
	property : "BIZ_OP_MSG",
	title : "操作记录",
	width : "30%",
	align : "left"
},{
	property : "BIZ_OP_DTL_UID",
	title : "记录详情",
	width : "5%"
},{
	property : "BIZ_OP_DTE",
	title : "操作日期",
	width : "10%"
}];

var localItems = null;
localItems = [
              {
            	  "BIZ_OP_UID" : "0001",
            	  "BIZ_OP_NOD" : "发起",
            	  "BIZ_COD"    : "0001",
            	  "BIZ_OP_USR" : "gm",
            	  "BIZ_OP_DPT" : "分行",
            	  "BIZ_OP_TYP" : "A",
            	  "BIZ_OP_MSG" : "ffff",
            	  "BIZ_OP_DTL_UID" : "fff",
            	  "BIZ_OP_DTE"    : "2017-08-22"
              },
              {
            	  "BIZ_OP_UID" : "0002",
            	  "BIZ_OP_NOD" : "审批",
            	  "BIZ_COD"    : "0002",
            	  "BIZ_OP_USR" : "gmf",
            	  "BIZ_OP_DPT" : "分行",
            	  "BIZ_OP_TYP" : "A",
            	  "BIZ_OP_MSG" : "ffff",
            	  "BIZ_OP_DTL_UID" : "fff",
            	  "BIZ_OP_DTE"    : "2017-08-22"
              }
    ];