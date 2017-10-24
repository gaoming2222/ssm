var _isAjaxRequest = false;// 是否是远程请求
//页面id
var SYS_REQUESTPAGEID = "PRJMNG_QUOTA_QUOTAINFO";
var MAIN_TAB_PAGEID = "";
var processInstId = ""; // 流程实例ID
var APPL_COD = "";
var curNod = "";
var isNew = "N";
var ynMap = null;
var oldPrdCod = null;
var genType = null;
var queryParams = {};
var recordMap = null;
var REV = null;
var curDte = null;
var oldPrdSerNum = null;
var FBM_APPR_COD = "";
var alertMsg = "";
var bizSts = "";
windowHandler.onload = function() {
	JrzlTools.editGrid(gridRuleInfoCfg, columnsInfoCfg);  //初始化grid和columns 初始化为editGrid
	JrzlTools.queryGrid(gridAtchCfg, columnsAtchCfg); //初始化grid和columns 初始化为queryGrid

	var map = {};
	map['1'] = "是";
	map['0'] = "否";
	JrzlTools.loadSelectDomData([ "CYCLE_USE" ], map, false, map['1']);
	JrzlTools.loadSelectDomData([ "CORR_CUSTOMER" ], map, false, map['0']);
	JrzlTools.loadSelectDomData([ "GRP_CUSTOMER" ], map, false, map['1']);

	var currMap = {};
	currMap['A'] = "CNY";
	currMap['B'] = "US";
	currMap['C'] = "UK";
	JrzlTools.loadSelectDomData([ "CURRENCY" ], currMap, false, map['A']);

	initDateText();

	JrzlTools.distroyProgress(SYS_REQUESTPAGEID);
};
function initDateText(){
	JrzlTools.dateRange({
        from : "VAL_DTE",
        to : "DUE_DTE",
        readOnly : true
    });
}

function handleInitData(data) {

}

function handleReturnData(data) {


}
//标红
var markRedCifGrid = {

};
function markRedFont(){

}
//=============保存业务信息 start==============
function save_onclick(isSubmit) {


}

//=============保存业务信息 end==============
//=============提交业务信息start==============
function submit_onclick() {

}
//=============提交业务信息end==============




//=============选择产品类型 start==============
function selectClient() {

}
//=============选择产品类型 end==============

//=============获取星期 start==============
function getWeekDay(dateId) {
	if (!checkCurDate(dateId)) {
		if (dateId == 'VAL_DTE') {
			JrzlTools.alert("“起息日”不能小于当天。", "提示");
		}
		if (dateId == 'DUE_DTE') {
			JrzlTools.alert("“到期日”不能为小于或等于当天。", "提示");
		}
		$("#LMT_DTE").val("");
		$("#LMT_DTE").afterTip('remove');
		return;
	}
	if (checkDate(dateId)) {
		var weekId = dateId + "_WEEKDAY";
		var weekDay = $dp.cal.getP('D');
		$("#" + weekId).html(weekDay);
		var result = JrzlTools.isGmsHoliday($("#" + dateId).val());
		if (result == true) {
			$("#" + dateId).afterTip('remove');
			$("#" + dateId).afterTip('init');
			$("#" + dateId).afterTip('warn');
			$("#LMT_DTE").val("");
			$("#LMT_DTE").afterTip('remove');
			JrzlTools.alert("所选日期为节假日，请重新选择！", "提示");
			return;
		}
		if ($("#VAL_DTE").val() != undefined && $("#VAL_DTE").val() != null && $("#VAL_DTE").val().length == 8
				&& $("#DUE_DTE").val() != undefined && $("#DUE_DTE").val() != null && $("#DUE_DTE").val().length == 8) {
			var dateInteval = JrzlTools.getDateInteval($("#VAL_DTE").val(), $("#DUE_DTE").val());
			if (dateInteval > 1024) {
				$("#" + dateId).afterTip('remove');
				$("#" + dateId).afterTip('init');
				$("#" + dateId).afterTip('warn');
				$("#LMT_DTE").val("");
				$("#LMT_DTE").afterTip('remove');
				JrzlTools.alert("起息日与到期日之间最大期限不能超过1024天，请重新选择！", "提示");
				return;
			} else {
				$("#LMT_DTE").val(dateInteval);
				checkLmtDate();
			}
		} else {
			$("#LMT_DTE").val("");
			$("#LMT_DTE").afterTip('remove');
		}
	} else {
		if (dateId == 'VAL_DTE') {
			JrzlTools.alert("“起息日”不能为空。", "提示");
		}
		if (dateId == 'DUE_DTE') {
			JrzlTools.alert("“到期日”不能为空。", "提示");
		}
	}
	return;
}

function clearWeekDay(dateId) {
	checkDate(dateId);
	$("#LMT_DTE").val("");
	$("#LMT_DTE").afterTip('remove');
	if (dateId == 'VAL_DTE') {
		JrzlTools.alert("“起息日”不能为空。", "提示");
	}
	if (dateId == 'DUE_DTE') {
		JrzlTools.alert("“到期日”不能为空。", "提示");
	}
	return;
}

function checkDate(dateId){
	var weekId = dateId + "_WEEKDAY";
	if($("#" + dateId).val() === undefined || $("#" + dateId).val() === null
			|| $("#" + dateId).val() === "" || $("#" + dateId).val() === "null"){
		if (dateId == 'VAL_DTE') {
			$("#VAL_DTE").afterTip('remove');
			$("#VAL_DTE").afterTip('init');
			$("#VAL_DTE").afterTip('warn');
		}
		if (dateId == 'DUE_DTE') {
			$("#DUE_DTE").afterTip('remove');
			$("#DUE_DTE").afterTip('init');
			$("#DUE_DTE").afterTip('warn');
		}
		$("#" + dateId).val("");
		$("#" + weekId).html("");
		return false;
	} else {
		$("#" + dateId).afterTip('remove');
		$("#" + dateId).afterTip('init');
		$("#" + dateId).afterTip('ok');
		return true;
	}
}

function checkLmtDate(){
	if($("#LMT_DTE").val() === undefined || $("#LMT_DTE").val() === null
			|| $("#LMT_DTE").val() === "" || $("#LMT_DTE").val() === "null"){
		$("#LMT_DTE").afterTip('remove');
		$("#LMT_DTE").afterTip('init');
		$("#LMT_DTE").afterTip('warn');
		$("#LMT_DTE").val("");
		return false;
	} else {
		$("#LMT_DTE").afterTip('remove');
		$("#LMT_DTE").afterTip('init');
		$("#LMT_DTE").afterTip('ok');
		return true;
	}

}

function checkCurDate(dateId){
	if ($("#" + dateId).val() != undefined && $("#" + dateId).val() != null
			&& $("#" + dateId).val() != "" && $("#" + dateId).val() != "null") {
		if (dateId == 'VAL_DTE' && $("#VAL_DTE").val() < curDte) {
			$("#VAL_DTE").afterTip('remove');
			$("#VAL_DTE").afterTip('init');
			$("#VAL_DTE").afterTip('warn');
			return false;
		}
		if (dateId == 'DUE_DTE' && $("#DUE_DTE").val() <= curDte) {
			$("#DUE_DTE").afterTip('remove');
			$("#DUE_DTE").afterTip('init');
			$("#DUE_DTE").afterTip('warn');
			return false;
		}
	}
	return true;
}
//=============获取星期 end==============

function selectCifUserInfo() {
	JrzlTools.addMainTab("PRJMNG_ININVEST_LOANAUDIT_COMMON_CIFCLIENTMNG",
          "选择客户信息",
          "../../../jrzl/prjmng/ininvest/loanaudit/common/cifclientmng.html?"
          + Request._assembleParameters({
  			oriPageId : SYS_REQUESTPAGEID,
  			motherTabTypeFlag:"EDT",
  			ciftyp : "1",
  			buttonid : "CIF_NAM"
  		}), null, MAIN_TAB_PAGEID);
}
//=============设置CIF信息 start==============
function setCIFInfo(buttonid,data){
	if (data.CLTNBR == undefined || data.CLTNBR == null || data.CLTNBR === "null") {
		data.CLTNBR = "";
	}
	if (data.CLTNAM == undefined || data.CLTNAM == null || data.CLTNAM === "null") {
		data.CLTNAM = "";
	}
	if (data.FNLCOD == undefined || data.FNLCOD == null || data.FNLCOD === "null") {
		data.FNLCOD = "";
	}
	if (data.FNLSUB == undefined || data.FNLSUB == null || data.FNLSUB === "null") {
		data.FNLSUB = "";
	}
	if (buttonid == "CIF_NAM") {
		$("#" + buttonid).val(data.CLTNAM);
		$("#" + buttonid + "_ID").val(data.CLTNBR);
		$("#FNL_COD").val(data.FNLCOD);
		$("#FNL_SUB").val(data.FNLSUB);
	}
	if (buttonid == "BTM_INVST_NAM") {
		$("#" + buttonid).val(data.CLTNAM);
		$("#" + buttonid + "_ID").val(data.CLTNBR);
		$("#BTM_INVST_FNL_COD").val(data.FNLCOD);
		$("#BTM_INVST_FNL_SUB").val(data.FNLSUB);
	}
	checkCifValue(buttonid);
}

function checkCifValue(buttonid){
	if (buttonid === "CIF_NAM"){
		$("#CIF_NAM").afterTip('remove');
		$("#CIF_NAM").afterTip('init');
		if($("#CIF_NAM_ID").val() === undefined || $("#CIF_NAM_ID").val() === null
				|| $("#CIF_NAM_ID").val() === "" || $("#CIF_NAM_ID").val() === "null"){
			$("#CIF_NAM").afterTip('warn');
			JrzlTools.alert("所选客户客户号为空，请重新选择", "提示");
			return false;
		}
		if($("#CIF_NAM").val() === undefined || $("#CIF_NAM").val() === null
				|| $("#CIF_NAM").val() === "" || $("#CIF_NAM").val() === "null"){
			$("#CIF_NAM").afterTip('warn');
			JrzlTools.alert("所选客户名称为空，请重新选择", "提示");
			return false;
		}
		$("#CIF_NAM").afterTip('ok');
		return true;

	}
	if (buttonid === "BTM_INVST_NAM") {
		$("#BTM_INVST_NAM_ID").afterTip('remove');
		$("#BTM_INVST_NAM_ID").afterTip('init');
		if($("#BTM_INVST_NAM_ID").val() === undefined || $("#BTM_INVST_NAM_ID").val() === null
				|| $("#BTM_INVST_NAM_ID").val() === "" || $("#BTM_INVST_NAM_ID").val() === "null"){
			$("#BTM_INVST_NAM_ID").afterTip('warn');
			JrzlTools.alert("所选底层出资方客户号为空，请重新选择", "提示");
			return false;
		}
		$("#BTM_INVST_NAM_ID").afterTip('ok');
		$("#BTM_INVST_NAM").afterTip('remove');
		$("#BTM_INVST_NAM").afterTip('init');
		if($("#BTM_INVST_NAM").val() === undefined || $("#BTM_INVST_NAM").val() === null
				|| $("#BTM_INVST_NAM").val() === "" || $("#BTM_INVST_NAM").val() === "null"){
			$("#BTM_INVST_NAM").afterTip('warn');
			JrzlTools.alert("所选底层出资方名称为空，请重新选择", "提示");
			return false;
		}
		$("#BTM_INVST_NAM").afterTip('ok');
		return true;
	}
}
//=============设置CIF信息end==============
function selectCurrency() {

}
function selectCycleUse() {

}
function selectCorrCustomer() {

}
function selectGroupCustomer() {

}

function selectCifInfo() {

}


//=============选择规则信息end==============

//====================列表配置start====================
//规则信息------------------------------start
var columnsInfoCfg = [{
		property : "RULE",
		title : "UID",
		hidden : true
	},{
		property : "QUO_ID",
		title : "额度编号",
		hidden : true

	},{
		property : "RULE_ID",
		title : "规则编号",
	},{
		property : "CONTROL_TYPE",
		title : "控制类型",
		render:renderCon

	}, {
		property : "BOND_TYPE",
		title : "债券类型",
		//render: renderRuleBond
	}, {
		property : "BOND_NAM",
		title : "债券全称"
	},{
		property : "DAT_STR",
		title : "额度期限起",
		render: renderDat

	},{
		property : "DAT_END",
		title : "额度期限止",

    },{
    	property : "QUO_MUN",
    	title : "额度金额",

}];
var gridRuleInfoCfg = {
	id: "gridRuleInfo",
	search : false,
	height : 200,
	needOrderNum : true
};
function renderCon(data, type, full, meta) {
	if (data == "A") {
		return "期限";
	} else {
		return "券种";
	}
}

function renderRuleBond(data, type, full, meta) {
	if (data == "A") {
		return "公司债";
	}
	if (data == "B") {
		return "企业债";
	}
	if (data == "C") {
		return "非公司企业债";
	}
}
function renderDat(data,type,full,meta){
	if (data == "A") {
		return "1个月";
	}
	else if (data == "B") {
		return "2个月";
	}
	else if (data == "C") {
		return "3个月";
	}else{
		return "6个月"
	}
}
//规则信息------------------------------end
function editRuleInfo_onclick() {

}

function deleteRuleInfo_onclick() {

}


//规则配置界面start
var rulewin;
function addRuleInfo_onclick() {
	rulewin = JrzlTools.openModalWindow({
		id : "addRuleInfo",
		title : "规则信息新增",
		height : 'auto',
		width : 590
	});

	var mapControl = {};
	mapControl['期限'] = "期限";
	mapControl['券种'] = "券种";
	JrzlTools.loadSelectDomData([ "CONTROL_TYPE" ], mapControl, true, null);

	var mapBond = {};
	mapBond['企业债'] = "企业债";
	mapBond['公司债'] = "公司债";
	mapBond['非金融企业债'] = "非金融企业债";
	JrzlTools.loadSelectDomData([ "BOND_TYPE" ], mapBond, true,null);

	var mapQuoDat = {};
	mapQuoDat['A'] = "1天";
	mapQuoDat['B'] = "7天";
	mapQuoDat['C'] = "14天";
	mapQuoDat['D'] = "1个月";
	mapQuoDat['E'] = "2个月";
	mapQuoDat['F'] = "3个月";
	mapQuoDat['G'] = "4个月";
	mapQuoDat['H'] = "5个月";
	mapQuoDat['I'] = "6个月";
	mapQuoDat['J'] = "7个月";
	mapQuoDat['K'] = "8个月";
	mapQuoDat['L'] = "9个月";
	mapQuoDat['M'] = "10个月";
	mapQuoDat['N'] = "11个月";
	mapQuoDat['O'] = "12个月";
	mapQuoDat['P'] = "24个月";
	mapQuoDat['Q'] = "36个月";
	mapQuoDat['R'] = "48个月";
	mapQuoDat['S'] = "60个月";
	mapQuoDat['T'] = "72个月";
	mapQuoDat['U'] = "84个月";
	mapQuoDat['V'] = "96个月";
	mapQuoDat['W'] = "108个月";
	mapQuoDat['X'] = "120个月";
	JrzlTools.loadSelectDomData([ "QUO_DAT_STR" ], mapQuoDat, true, null);
	JrzlTools.loadSelectDomData([ "QUO_DAT_END" ], mapQuoDat, true, null);

	isPostTableEdit = false;
}
//规则配置界面end

//规则信息确定按钮start
function saveRuleInfo_onclick() {
	var data = {
	    "RULE" : "",
	    "QUO_ID" : "",
	    "RULE_ID" : "00000001",//自动生成
	    "CONTROL_TYPE" : $("#CONTROL_TYPE").val(),
	    "BOND_TYPE" : $("#BOND_TYPE").val(),
	    "BOND_NAM" : $("#BOND_NAM").val(),
	    "DAT_STR" : $("#QUO_DAT_STR").val(),
	    "DAT_END" : $("#QUO_DAT_END").val(),
	    "QUO_MUN" : $("#QUO_MUN").val()
    };
	if (isPostTableEdit == true) {

	} else {
		var ruleInfoGridData = gridRuleInfo.getData();
		var flag = false;
		$.each(ruleInfoGridData, function(m, o) {
			if (data.QUO_ID == o.QUO_ID) {
				flag = true;
				return false;
			}
		});
		if (flag) {


			JrzlTools.alert("所选客户已存在，请重新选择", "提示");
			return;
		}
		ruleInfoGridData.push(data);
		gridRuleInfo.loadData(ruleInfoGridData);

	}
	rulewin.close();
}

function closeRuleInfo_onclick() {
	JrzlTools.confirm("确认关闭吗？", "提示", function(confirm) {
	    if (confirm) {
	    	rulewin.close();
	    }
	});
}
//规则信息确定按钮end

//表格函数响应satrt
function onChangeControlType() {
	var controlType = document.getElementById("CONTROL_TYPE").value;
	if (controlType == "券种") {
		document.getElementById("QUO_DAT_STR").disabled = true;
		document.getElementById("QUO_DAT_END").disabled = true;
	}
	if (controlType == "期限") {
		document.getElementById("BOND_TYPE").disabled = true;
		document.getElementById("BOND_NAM").disabled = true;
	}
}

function onChangeBondType() {

}

function onChangeDateStart() {

}

function onChangeDateEnd() {

}
//表格函数响应end

//================选择经办人 end===============
//规则配置界面end

//附件信息------------------------------start
var columnsAtchCfg=[{
		property:"ATCH_UID",
		title:"附件UID",
		hidden:true
	},{
		property:"NAME",
		title:"附件名称",
		renderer : "renderer_downloadAtch",
		sortable:false
	},{
		property:"CRT_USR_NAM",
		title:"上传人",
		sortable:false
	},{
		property:"SAV_ORG_NAM",
		title:"所属机构",
		sortable:false
	},{
		property:"CRT_TIM",
		title:"上传日期",
		renderer: "renderTimeStamp",
		sortable:true
	}
];
var gridAtchCfg = {
	  id:"atchGrid",
      needOrderNum: true,
      needCheckBox :false,
      localItems: "localArchItems",
      initable: false,
      pageSize: 5,
      height :200,
      primaryKey:"ATCH_UID",
      multiPageSelect:true
};
//附件信息------------------------------end

//上传窗口 --------start  html界面已经注释掉
var win;

function uploadAtch_onclick() {
	// 附件上传
	JrzlTools.fileUpload({
		id : "uploader_ATCH",
		max_file_size : 50
	});
	$("#showUploadAtch .plupload_filelist_content").css({
		height : "245px",
		overflow : "auto",
		background : "url(../../../common/uic/default/images/Cloud.png) no-repeat",
		width: "530px"});

	win = JrzlTools.openModalWindow({
		id : "showUploadAtch",
		title : "附件上传",
		height :'auto',
		width : 550,
	    beforeClose:closewindews
	});

}

/*
* 提交上传文件
*/
function uploadAtch(){
	var uploaderids= $("#uploader_ATCH").attr("file");//
	if(uploaderids!= null && uploaderids != "" ) {
		JrzlTools.confirm("确认上传？","提示",function(btn) {
			if(btn){
				  Request.processDataRequest({
					  url:"/jrzl/prjmng/product/sglcust/ddzl/ddzlinfo/modifyDdzlAtch.action",
					  errorRedirect:false,
					  customParams:{
						  "APPL_COD": APPL_COD,
						  "FILEIDS":uploaderids,
						  "EDIT_TYPE" : "E",
						  "REV" : REV
					  },
					  progressText:"正在处理，请稍候...",
					  progress : true,
					  callbackFunc:handleFileData
				  });
			}
		});
	} else {
		JrzlTools.alert("没有上传文件或文件没有上传成功。","提示");
	}
}
/*
*提交上传文件 回调信息
*/
function handleFileData(data){
	closeAtch_onclick();
	if(data && data.ErrorNo == "0"){
		if (data.REV) {
			REV = data.REV;
		}
		JrzlTools.alert("上传成功", "提示", function(btn) {
			if (btn) {
				atchGrid.onquery(queryParams);
			}
		});
  }
  else if(data && data.ErrorNo != "0" && data.ErrorMsg != null) {
      JrzlTools.alert(data.ErrorMsg, "提示");
  }
  else{
      JrzlTools.alert("上传失败，请联系管理员", "提示");
  }
}

function deleteAtch_onclick(){
	var atchIdArray=[];
	var multiSelected =  atchGrid.getMultiPageSelectKey();
	if (multiSelected.length>0) {
		for(var i=0;i<multiSelected.length;i++){
			atchIdArray.push(multiSelected[i]);
		}
		if(atchIdArray.length>0){
			JrzlTools.confirm("是否确认删除？","提示",function(btn){
				if(btn){
					Request.processDataRequest({
						url:"/jrzl/prjmng/product/sglcust/ddzl/ddzlinfo/deleteDdzlAtch.action",
						errorRedirect:false,
						customParams:{
							"APPL_COD":APPL_COD,
							"OLD_FILEIDS":JSON.stringify(atchIdArray),
							"EDIT_TYPE" : "E",
							"REV" : REV
						},
						progressText:"正在处理，请稍候...",
						progress : true,
						callbackFunc:handleDeleteFileData
					});
				}
			});
		}
	} else{
		JrzlTools.alert("请至少选择一条需要删除记录","提示");
	}
}

function  handleDeleteFileData(data){
	if(data && data.ErrorNo == "0"){
		if (data.REV) {
			REV = data.REV;
		}
		JrzlTools.alert("删除成功", "提示", function(btn) {
			if (btn) {
				atchGrid.onquery(queryParams);
			}
		});
  }
  else if(data && data.ErrorNo != "0" && data.ErrorMsg != null) {
      JrzlTools.alert(data.ErrorMsg, "提示");
  }
  else{
      JrzlTools.alert("删除失败，请联系管理员", "提示");
  }
}

//点名称下载 --------start
function renderer_downloadAtch(data, type, full, meta) {
	var id = full.ID;
	return "<a onclick='downloadAtch(\"" + id + "\")'>" + data
			+ "</a>";
}

function downloadAtch(value) {
	if (value != null) {
		JrzlTools.confirm("是否确认下载？", "提示", function(btn) {
			if (btn) {
				Request.filedownload({
					url : "/jrzl/file/download.do",
					errorRedirect : false,
					FILEID : value
				});
			}
		});

	} else {
		JrzlTools.alert("请选择一条记录", "提示");
	}
}
//点名称下载 --------end

//下载 -------start
//全部下载
function downloadAllAtch_onclick() {
	var mygridAll =  atchGrid.getAllData();
	if (mygridAll.length < 0) {
		JrzlTools.alert("没有可以下载的附件", "提示");
		return;
	}

	Request.processDataRequest({
		url:"/jrzl/prjmng/product/sglcust/acthmng/getSglcustListAtchAction.action",
		errorRedirect:false,
		customParams:{
			"APPL_COD":APPL_COD,
		},
		progress : true,
		progressText:"正在处理，请稍候...",
		callbackFunc:handleDownAllData
	});
}

function handleDownAllData(data) {
	var mygridAll = data.ATTCH_INFO;
	if (mygridAll.length > 0) {
		var flieList = [];
		for (var i = 0; i < mygridAll.length; i++) {
			flieList.push(mygridAll[i].ATCH_UID);
		}
		JrzlTools.confirm("是否确认全部下载？", "提示", function(btn) {
			if (btn) {
				downloadFileds(flieList);
			}
		});
	}else{
		JrzlTools.alert("没有数据需要下载", "提示");
	}
}

//批量下载
function downloadAtch_onclick() {
	var multiSelected =  atchGrid.getMultiPageSelectKey();
	if (multiSelected.length > 0) {
		var flieList = [];
		for (var i = 0; i < multiSelected.length; i++) {
			flieList.push(multiSelected[i]);
		}
		JrzlTools.confirm("是否确认全部下载？", "提示", function(btn) {
			if (btn) {
				downloadFileds(flieList);
			}
		});
	}else{
		JrzlTools.alert("请勾选至少一条需要下载的附件", "提示");
	}
}

function downloadFileds(fileList){
	var fileDupName="";
	var fileDownloadName="";

	if(fileList.length>1){
		fileDupName = "_上传于";
		fileDownloadName = "单一定制_附件管理_";
	}

	var fileids = fileList.toString().replace(/\s/g, '');
	Request.filedownload({
		url : "/jrzl/file/download.do",
		errorRedirect : true,
		customParams : {
			FILE_DOWNLOAD_NAME : fileDownloadName,
			FILE_DUPLICATE_NAME : fileDupName
		},
		FILEID : fileids
	});
}


function closeAtch_onclick() {
	win.hide();
}
function closewindews() {
	uploader_ATCH.distroy();
}
//上传窗口 --------end

//产品说明书信息------------------------------start
var columnsSpecCfg=[
];
var gridSpecCfg = {
		id:"specGrid",
      height :50,
      search :false
};

function renderCrtUsr(data,type,full,meta){
	if (full["CRT_USR_NM"]){
		return full["CRT_USR_NM"];
	}
}
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
function renderGenType(data,type,full,meta){
	if (data && genType[data]){
		return genType[data];
	} else {
		return "";
	}
}
//产品说明书信息------------------------------end

//上传窗口 --------start
var win;

function uploadAtch_onclick() {
	// 附件上传
	JrzlTools.fileUpload({
		id : "uploader_ATCH",
		max_file_size : 50
	});
	$("#showUploadAtch .plupload_filelist_content").css({
		height : "245px",
		overflow : "auto",
		background : "url(../../../common/uic/default/images/Cloud.png) no-repeat",
		width: "530px"});

	win = JrzlTools.openModalWindow({
		id : "showUploadAtch",
		title : "附件上传",
		height :'auto',
		width : 550,
	    beforeClose:closewindews
	});

}

/*
 * 提交上传文件
 */
function uploadAtch(){
	var uploaderids= $("#uploader_ATCH").attr("file");//
	if(uploaderids!= null && uploaderids != "" ) {
		JrzlTools.confirm("确认上传？","提示",function(btn) {

		});
	} else {
		JrzlTools.alert("没有上传文件或文件没有上传成功。","提示");
	}
}
/*
 *提交上传文件 回调信息
 */
function handleFileData(data){
	closeAtch_onclick();
	if(data && data.ErrorNo == "0"){
		if (data.REV) {
			REV = data.REV;
		}
		JrzlTools.alert("上传成功", "提示", function(btn) {
			if (btn) {
				atchGrid.onquery(queryParams);
			}
		});
    }
    else if(data && data.ErrorNo != "0" && data.ErrorMsg != null) {
        JrzlTools.alert(data.ErrorMsg, "提示");
    }
    else{
        JrzlTools.alert("上传失败，请联系管理员", "提示");
    }
}

function deleteAtch_onclick(){
	var atchIdArray=[];
	var multiSelected =  atchGrid.getMultiPageSelectKey();
	if (multiSelected.length>0) {
		for(var i=0;i<multiSelected.length;i++){
			atchIdArray.push(multiSelected[i]);
		}
		if(atchIdArray.length>0){
			JrzlTools.confirm("是否确认删除？","提示",function(btn){

			});
		}
	} else{
		JrzlTools.alert("请至少选择一条需要删除记录","提示");
	}
}

function  handleDeleteFileData(data){
	if(data && data.ErrorNo == "0"){
		if (data.REV) {
			REV = data.REV;
		}
		JrzlTools.alert("删除成功", "提示", function(btn) {
			if (btn) {
				atchGrid.onquery(queryParams);
			}
		});
    }
    else if(data && data.ErrorNo != "0" && data.ErrorMsg != null) {
        JrzlTools.alert(data.ErrorMsg, "提示");
    }
    else{
        JrzlTools.alert("删除失败，请联系管理员", "提示");
    }
}

//点名称下载 --------start
function renderer_downloadAtch(data, type, full, meta) {
	var id = full.ID;
	return "<a onclick='downloadAtch(\"" + id + "\")'>" + data
			+ "</a>";
}

function downloadAtch(value) {
	if (value != null) {
		JrzlTools.confirm("是否确认下载？", "提示", function(btn) {
			if (btn) {
				Request.filedownload({
					url : "/jrzl/file/download.do",
					errorRedirect : false,
					FILEID : value
				});
			}
		});

	} else {
		JrzlTools.alert("请选择一条记录", "提示");
	}
}
// 点名称下载 --------end

// 下载 -------start
// 全部下载
function downloadAllAtch_onclick() {
	var mygridAll =  atchGrid.getAllData();
	if (mygridAll.length < 0) {
		JrzlTools.alert("没有可以下载的附件", "提示");
		return;
	}

	Request.processDataRequest({
		url:"/jrzl/prjmng/product/sglcust/acthmng/getSglcustListAtchAction.action",
		errorRedirect:false,
		customParams:{
			"APPL_COD":APPL_COD,
		},
		progress : true,
		progressText:"正在处理，请稍候...",
		callbackFunc:handleDownAllData
	});
}

function handleDownAllData(data) {
	var mygridAll = data.ATTCH_INFO;
	if (mygridAll.length > 0) {
		var flieList = [];
		for (var i = 0; i < mygridAll.length; i++) {
			flieList.push(mygridAll[i].ATCH_UID);
		}
		JrzlTools.confirm("是否确认全部下载？", "提示", function(btn) {
			if (btn) {
				downloadFileds(flieList);
			}
		});
	}else{
		JrzlTools.alert("没有数据需要下载", "提示");
	}
}

// 批量下载
function downloadAtch_onclick() {
	var multiSelected =  atchGrid.getMultiPageSelectKey();
	if (multiSelected.length > 0) {
		var flieList = [];
		for (var i = 0; i < multiSelected.length; i++) {
			flieList.push(multiSelected[i]);
		}
		JrzlTools.confirm("是否确认全部下载？", "提示", function(btn) {
			if (btn) {
				downloadFileds(flieList);
			}
		});
	}else{
		JrzlTools.alert("请勾选至少一条需要下载的附件", "提示");
	}
}

function downloadFileds(fileList){
	var fileDupName="";
	var fileDownloadName="";

	if(fileList.length>1){
		fileDupName = "_上传于";
		fileDownloadName = "单一定制_附件管理_";
	}

	var fileids = fileList.toString().replace(/\s/g, '');
	Request.filedownload({
		url : "/jrzl/file/download.do",
		errorRedirect : true,
		customParams : {
			FILE_DOWNLOAD_NAME : fileDownloadName,
			FILE_DUPLICATE_NAME : fileDupName
		},
		FILEID : fileids
	});
}


function closeAtch_onclick() {
	win.hide();
}
function closewindews() {
	addRuleInfo.distroy();
}
//上传窗口 --------end

//====================列表配置end====================

//选择产品信息------------------------------start
function selectPrdInfo() {

}

function setPrdInfo(oldApplCod) {

}

function handleOldReturnData(data) {



}

function calTotCst(id) {

}

//#localdata定义----------start
var localItems = null;
localArchItems  = null;
var localData = null;
var localInitData = null;
var SubmitReturn=null;
//#localdata定义----------end

//#localdata赋值---------start

var localInitData = {

};

localItems = [{
	            "UID" : "gm001",
	            "QUO_ID" : "00000001",
	            "CONTROL_TYPE" : "A",
	            "BOND_TYPE" :"A",
	            "BOND_NAM"  :"dfdfdf",
	            "DAT_STR"  : "A",
	            "DAT_END"  : "C",
	            "QUO_MUN" : "98989988"
	          }
              ]
submitReturn = {"ErrorMsg":"","ErrorNo":"0"};

//#localdata赋值---------end