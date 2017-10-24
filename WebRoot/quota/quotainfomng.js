var _isAjaxRequest = false;// 是否是远程请求
var SYS_REQUESTPAGEID = "PRJMNG_QUOTA_QUOTAINFOMNG";
var initData = null;//用于存储返回的数据
var data = null;
var quotaId = "001";
var flag = true;
windowHandler.onload = function() {
    //$.alerts.draggable = false;
    // 通过ajax或本地数据的方式获取数据，部署时将localStorage去除
	curNod = Request.getUrlParam("curNod");//获取当前节点
	isDefault = Request.getUrlParam("isDefault");
    handleInitData(data);
	JrzlTools.queryGrid(gridCfg, columnsCfg);
};
//初始化管理员面元素
function handleInitData(data) {
	var columnsCfg = null;
	//if (data != undefined && data != null && data.isBranch != undefined && data.isBranch != null) {
	if(true){
		// 流程节点初始化 待添加
	    //JrzlTools.loadSelectDomData(["WF_CUR_NOD_ID"], data.DDZL_NODE, true, null);
		 /*
	     * todo
	     */
	    // 日期控件
		JrzlTools.dateRange({
	        from : "VAL_DTE_STRT",
	        to : "VAL_DTE_END",
	        readOnly : true
	    });

	    JrzlTools.dateRange({
	        from : "DUE_DTE_STRT",
	        to : "DUE_DTE_END",
	        readOnly : true
	    });

	    //对应不同的流程节点显示不同的页面内容
	    /*
	     * todo
	     */


	    //查询 显示界面信息
	    /*
	     * todo
	     */


	} else {
		JrzlTools.alert("初始化额度管理页面失败，请联系管理员", "提示");
	}

    JrzlTools.distroyProgress(SYS_REQUESTPAGEID);
}


var columnsCfg = [ {
    property : "QUOTA_ID",
    title : "额度编号",
    width : "100px",
    renderer: "renderDtl",
    align : "center"
}, {
    property : "CLIENT_NAM",
    title : "客户名称",
    width : "100px",
    align : "center"
}, {
    property : "CORE_SYS_CLIENT_ID",
    title : "核心系统客户号",
    width : "100px",
    align : "center"
},{
    property : "TOT_QUO",
    title : "总额度",
    width : "100px",
    align : "center"
},{
    property : "REMAIN_QUO",
    title : "剩余可用额度",
    width : "100px",
    align : "center"
},{
    property : "QUO_DTE_STRT",
    title : "额度期限起(月)",
    width : "100px",
    align : "center"
}, {
    property : "QUO_DTE_STRT",
    title : "额度期限止(月)",
    width : "100px",
    align : "center"
}, {
    property : "QUO_TOP",
    title : "额度上限(元)",
    width : "100px",
    align : "center"
}, {
    property : "REMAIN_QUO_C",
    title : "剩余可用额度(元)",
    width : "100px",
    align : "center"
}, {
    property : "HIGH_QUO_LIMIT",
    title : "可占用高年限额度（元）",
    width : "100px",
    align : "center"
},{
    property : "IS_CREATE",
    title : "是否同业客户",
    width : "100px",
    align : "center"
}, {
    property : "PUB_QUO_TOP",
    title : "公募额度上限",
    width : "100px",
    align : "center",
}, {
    property : "RAMAIN_PUB_QUO",
    title : "预留公募额度",
    width : "100px",
    align : "center"
}, {
    property : "ACT_PUB_QUO",
    title : "实投公募额度",
    width : "100px",
    align : "center"
}, {
    property : "REMAIN_PUB_QUO",
    title : "剩余可用公募额度",
    width : "100px",
    align : "center"
}, {
    property : "PRI_QUO_TOP",
    title : "私募额度上限",
    width : "100px",
    align : "center"
}, {
    property : "REMAIN_PRI_QUO",
    title : "预留私募额度",
    width : "100px",
    align : "center"
},{
    property : "ACT_PRI_QUO",
    title : "实投私募额度",
    width : "100px",
    hidden : "true",
    align : "center"
}, {
    property : "REMAIN_PRI_QUO",
    title : "剩余可用私募额度",
    width : "100px",
    align : "center"
}, {
    property : "CURRENT_NOD",
    title : "当前节点",
    align : "center"
},, {
    property : "APP_STS",
    title : "审批状态",
    align : "center"
},{
    property : "MARK",
    title : "备注",
    hidden : "true",
    align : "center"
}];

var gridCfg = {
    id: "prvGrid",
    action: "",//分页查询
    localItems: "localItems",
    needOrderNum: true,
    needCheckBox :false,
    scrollX:true,
    initable: false,
    primaryKey:"QUOTA_ID",
    multiPageSelect:true
};

function renderTimeStamp(data,type,full,meta) {
	if (!data) { // 不显示null
        return "";
    } else {
        try {
            var date = new Date();
            date.setTime(data);
            return JrzlTools.formatDate(date, "yyyy-MM-dd hh:mm:ss");
        } catch (e) {
            //console.log(e);
            return "";
        }
    }
}
// 查询----------start
function query_onclick() {
    var params = {

    };
    if (todoFlag) {
    	params.todoFlag = "Y";
    	params.isDefault = isDefault;
    };
    prvGrid.onquery(params);
}

function add_onclick() {
	var params = Request._assembleParameters({
		"processInstId"   : "0001",
		"MAIN_TAB_PAGEID" : SYS_REQUESTPAGEID,
    	"isNew" : "Y",
    	"curNod" : "FQ",
	});
	window.parent.addMainTab("PRJMNG_QUOTA_QUOTA",
			"额度信息",
			"../quota.html?"
					+ params, null, SYS_REQUESTPAGEID);
}
// 新增-------------end
// 查看-------------start
function check_onclick(){
	var mygridSelected=prvGrid.getSelection();
	if(null==mygridSelected)
	{
		JrzlTools.alert("请选择一行数据！",'提示',  null);
		return;
	}
	else{
		var params = Request._assembleParameters({
			"QUOTA_ID"   : mygridSelected.QUOTA_ID
		});
		window.parent.addMainTab("PRJMNG_QUOTA_INFOQUERY",
				"额度信息",
				"../../../jrzl/prjmng/quota/quotainfoquery.html?"
						+ params, null, SYS_REQUESTPAGEID);
	}
}
// 修改-------------start
function modify_onclick() {
	var mygridSelected=prvGrid.getSelection();
	if(null==mygridSelected)
	{
		JrzlTools.alert("请选择一行数据！",'提示',  null);
		return;
	}else{

		var params = Request._assembleParameters({
			'QUOTA_ID' : mygridSelected.QUOTA_ID
		});
		window.parent.addMainTab("PRJMNG_QUOTA_QUOTAINFOUPDATE",
				"额度信息更新",
				"../../../jrzl/prjmng/quota/quotainfoupdate.html?"
						+ params, null, SYS_REQUESTPAGEID);

	}


}

function handleModifyData(data) {

}

// 修改-------------end

//明细-------------start
//点击下划线跳转到新的界面
function view_onclick(WF_DEF_ID) {
	var params = Request._assembleParameters({
		'QUOTA_ID' : quotaId
	});
	if(flag){
	flag = false;
	window.parent.addMainTab("PRJMNG_QUOTA_OCCUPINFO",
			"占用信息 ",
			"../../../jrzl/prjmng/quota/occupinfo.html?"
					+ params, null, SYS_REQUESTPAGEID);

	}else{
		flag = true;
		window.parent.addMainTab("PRJMNG_QUOTA_OCCUPINFODTL",
				"占用信息 ",
				"../../../jrzl/prjmng/quota/occupinfodtl.html?"
						+ params, null, SYS_REQUESTPAGEID);
	}
}
function renderDtl(data, type, full, meta) {
	var quotaId = full.QUOTA_ID;
	return "<a onclick=view_onclick('" + quotaId + "')>" + data + "</a>";
}
//明细-------------end






//撤销-------------start
function cancel_onclick() {
}

// 删除-------------start
function delete_onclick() {
	var mygridSelected = prvGrid.getSelection();
	if (null == mygridSelected) {
		JrzlTools.alert("请选择一行数据！", '提示', null);
		return;
	} else {
		JrzlTools
				.confirm(
						"确认要删除数据吗？",
						"提示",
						function(btn) {
							JrzlTools.alert("暂时无法删除项目！", '提示', null);
						});
	}
}


//删除-------------end

// #localdata定义----------start
var localItems = null;
var localAddData = null;
var localInitData = null;
var localRespData = null;
// #localdata定义----------end

// #localdata赋值---------start
localItems = [ {
    "QUOTA_ID" : "ED80234497",
    "CLIENT_NAM" : "GAOMING",
    "CORE_SYS_CLIENT_ID" : "4497",
    "TOT_QUO" : "100000000.OO",
    "REMAIN_QUO" : "60000000.00",
    "QUO_DTE_STRT" : "2017-04",
    "QUO_DTE_STRT" : "2017-05",
    "QUO_TOP" : "100000000",
    "REMAIN_QUO_C" : "60000000.00",
    "HIGH_QUO_LIMIT" : "100000000",
    "IS_CREATE" : "是",
    "PUB_QUO_TOP" : "500000000.00",
    "RAMAIN_PUB_QUO" : "30000000.00",
    "ACT_PUB_QUO" : "50000000.00",
    "REMAIN_PUB_QUO" : "30000000.00",
    "PRI_QUO_TOP" : "20000000.00",
    "REMAIN_PRI_QUO": "10000000.00",
    "ACT_PRI_QUO" : "10000000.00",
    "REMAIN_PRI_QUO": "10000000.00",
    "MARK": "TWLY"
}, {
	"QUOTA_ID" : "ED80234497",
    "CLIENT_NAM" : "GAOMING",
    "CORE_SYS_CLIENT_ID" : "4497",
    "TOT_QUO" : "100000000.OO",
    "REMAIN_QUO" : "60000000.00",
    "QUO_DTE_STRT" : "2017-04",
    "QUO_DTE_STRT" : "2017-05",
    "QUO_TOP" : "100000000",
    "REMAIN_QUO_C" : "60000000.00",
    "HIGH_QUO_LIMIT" : "100000000",
    "IS_CREATE" : "是",
    "PUB_QUO_TOP" : "500000000.00",
    "RAMAIN_PUB_QUO" : "30000000.00",
    "ACT_PUB_QUO" : "50000000.00",
    "REMAIN_PUB_QUO" : "30000000.00",
    "PRI_QUO_TOP" : "20000000.00",
    "REMAIN_PRI_QUO": "10000000.00",
    "ACT_PRI_QUO" : "10000000.00",
    "REMAIN_PRI_QUO": "10000000.00",
    "MARK": "TWLY"
}, {
	"QUOTA_ID" : "ED80234497",
    "CLIENT_NAM" : "GAOMING",
    "CORE_SYS_CLIENT_ID" : "4497",
    "TOT_QUO" : "100000000.OO",
    "REMAIN_QUO" : "60000000.00",
    "QUO_DTE_STRT" : "2017-04",
    "QUO_DTE_STRT" : "2017-05",
    "QUO_TOP" : "100000000",
    "REMAIN_QUO_C" : "60000000.00",
    "HIGH_QUO_LIMIT" : "100000000",
    "IS_CREATE" : "否",
    "PUB_QUO_TOP" : "500000000.00",
    "RAMAIN_PUB_QUO" : "30000000.00",
    "ACT_PUB_QUO" : "50000000.00",
    "REMAIN_PUB_QUO" : "30000000.00",
    "PRI_QUO_TOP" : "20000000.00",
    "REMAIN_PRI_QUO": "10000000.00",
    "ACT_PRI_QUO" : "10000000.00",
    "REMAIN_PRI_QUO": "10000000.00",
    "MARK": "TWLY"
}, {
	"QUOTA_ID" : "ED80234497",
    "CLIENT_NAM" : "GAOMING",
    "CORE_SYS_CLIENT_ID" : "4497",
    "TOT_QUO" : "100000000.OO",
    "REMAIN_QUO" : "60000000.00",
    "QUO_DTE_STRT" : "2017-04",
    "QUO_DTE_STRT" : "2017-05",
    "QUO_TOP" : "100000000",
    "REMAIN_QUO_C" : "60000000.00",
    "HIGH_QUO_LIMIT" : "100000000",
    "IS_CREATE" : "是",
    "PUB_QUO_TOP" : "500000000.00",
    "RAMAIN_PUB_QUO" : "30000000.00",
    "ACT_PUB_QUO" : "50000000.00",
    "REMAIN_PUB_QUO" : "30000000.00",
    "PRI_QUO_TOP" : "20000000.00",
    "REMAIN_PRI_QUO": "10000000.00",
    "ACT_PRI_QUO" : "10000000.00",
    "REMAIN_PRI_QUO": "10000000.00",
    "MARK": "TWLY"
}, {
	"QUOTA_ID" : "ED80234497",
    "CLIENT_NAM" : "GAOMING",
    "CORE_SYS_CLIENT_ID" : "4497",
    "TOT_QUO" : "100000000.OO",
    "REMAIN_QUO" : "60000000.00",
    "QUO_DTE_STRT" : "2017-04",
    "QUO_DTE_STRT" : "2017-05",
    "QUO_TOP" : "100000000",
    "REMAIN_QUO_C" : "60000000.00",
    "HIGH_QUO_LIMIT" : "100000000",
    "IS_CREATE" : "否",
    "PUB_QUO_TOP" : "500000000.00",
    "RAMAIN_PUB_QUO" : "30000000.00",
    "ACT_PUB_QUO" : "50000000.00",
    "REMAIN_PUB_QUO" : "30000000.00",
    "PRI_QUO_TOP" : "20000000.00",
    "REMAIN_PRI_QUO": "10000000.00",
    "ACT_PRI_QUO" : "10000000.00",
    "REMAIN_PRI_QUO": "10000000.00",
    "MARK": "TWLY"
} ];

localInitData = {
	BIZ_STS : {

    },

};

localRespData = {
    "ErrorNo": "0"
};
// #localdata赋值---------end
