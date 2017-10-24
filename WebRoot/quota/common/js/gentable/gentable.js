/**
 * 按照模板自动生成表格
 */
//生成表格计数
var loadNum=0;
//生成的table id（必填）
var tableid;
//数值格式化
var commafy;

//是否对空值校验
var isCheckNull;
/**
 * 生成的模板（必选）elmtype 类型；key：健值,value：名称，elmexp：浮动提示,nillable：是否必填，fldmap：下拉的内容
 * dcmdgt小数位数 maxval最大值  minval最小值  othchk正则表达式  chkexp正则表达式错误提示  maxlen最大长度  minlen最小长度
 */
var tabletableModelInfo;
//模板Map
var modelDataMap={};
//初始值
var tabletableInfoListMap;

var GenTable  = {
   genTable:function(gencfg){//生成表格
	   tableid=gencfg.tableid;
	   tableModelInfo=gencfg.tableModelInfo;
	   tableInfoListMap=gencfg.tableInfoListMap;
	   isCheckNull=gencfg.isCheckNull;//对空值根据配置进行校验
	   commafy = new Commafy();

	   if(isEmpty(tableid)){
		   JrzlTools.alert("tableid不能为空。", "提示");
		   return;
	   }

		if(isEmpty(tableModelInfo)){
			 JrzlTools.alert("没有需要加载的模板数据。", "提示");
			 return;
		}
		for (var i = 0; i < tableModelInfo.length; i++) {
			//设置模板map，方便调用
			modelDataMap[tableModelInfo[i].key]=tableModelInfo[i];
		}
		/**
		 * 画表格
		 */
		var trId_s;
		loadNum=0;
		for (var i = 0; i < tableModelInfo.length; i++) {
			if (loadNum % 2 == 0) {
				trId_s = tableid+'_tr_' + loadNum;
				$("#"+tableid).append("<tr id='" + trId_s + "' ></tr>");
				generateTable(trId_s,tableModelInfo[i]);

				if(i == tableModelInfo.length-1 && tableModelInfo[i].elmtype!='M'){//最后一个处于行首(不为多行文本)，补足空表格
					$("#" + trId_s).append('<td class="head"></td><td class="content"></td>');
				}
			}else{
				generateTable(trId_s,tableModelInfo[i]);
			}
		}
   },
   genViewTable:function(gencfg){//生成明细表格
	   tableid=gencfg.tableid;
	   tableModelInfo=gencfg.tableModelInfo;
	   tableInfoListMap=gencfg.tableInfoListMap;

	   if(isEmpty(tableid)){
		   JrzlTools.alert("tableid不能为空。", "提示");
		   return;
	   }

		if(isEmpty(tableModelInfo)){
			 JrzlTools.alert("没有需要加载的模板数据。", "提示");
			 return;
		}
		for (var i = 0; i < tableModelInfo.length; i++) {
			//设置模板map，方便调用
			modelDataMap[tableModelInfo[i].key]=tableModelInfo[i];
		}


		var trId_s;
		loadNum=0;
		for (var i = 0; i < tableModelInfo.length; i++) {
			if (loadNum % 2 == 0) {
				trId_s = tableid+'_tr_' + loadNum;
				$("#"+tableid).append("<tr id='" + trId_s + "' ></tr>");
				generateViewTable(trId_s,tableModelInfo[i]);

				if(i == tableModelInfo.length-1 && tableModelInfo[i].elmtype!='M'){//最后一个处于行首(不为多行文本)，补足空表格
					$("#" + trId_s).append('<td class="head"></td><td class="content"></td>');
				}
			}else{
				generateViewTable(trId_s,tableModelInfo[i]);
			}
		}
   },
   saveTable:function(gencfg){//保存数据拼接
	   tableModelInfo=gencfg.tableModelInfo;
	   tableInfoListMap=gencfg.tableInfoListMap;
	   isCheckNull=gencfg.isCheckNull;//Y：对空值根据配置进行校验；N：对空值跳过校验
	   if(isEmpty(isCheckNull)){
		   isCheckNull="Y";
	   }
	   if(null == tableInfoListMap){
		   tableInfoListMap={};
	   }
	   for (var i = 0; i < tableModelInfo.length; i++) {
			//设置模板map，方便调用
			modelDataMap[tableModelInfo[i].key]=tableModelInfo[i];
		}

	   for (var i = 0; i < tableModelInfo.length; i++) {
			var data=tableModelInfo[i];
			var num=$("#"+data.key).val()
			if(data.elmtype =='S'){//字符
				if(!textCheck(data.key)){
					return null;
				}
			}else if(data.elmtype =='P'){//百分比
				if(!numberCheck(data.key)){
					return null;
				}
			}else if(data.elmtype =='D'){//日期
				if(!dateCheck(data.key)){
					return null;
				}
			}else if(data.elmtype =='N'){//数值
				if(!numberCheck(data.key)){
					return null;
				}
			}else if(data.elmtype =='E'){//枚举
				if(!selectCheck(data.key)){
					return null;
				}else{
					num=data.fldmap[num];
				}
			}else if(data.elmtype =='M'){//多行文本
				if(!textCheck(data.key)){
					return null;
				}
			}

			tableInfoListMap[data.key]=num;
		}
		return tableInfoListMap;
   }
};


//生成明细表格
function generateViewTable(id,data){
	if(data.elmtype =='M'){//多行文本
		var id_new="";
		if (loadNum % 2 != 0) {//多行文本出现在一行的后面，先补足空格，另起一行
			$("#" + id).append('<td class="head"></td><td class="content"></td>');
			loadNum++;
			id_new=tableid+'_tr_' + loadNum;
			$("#"+tableid).append("<tr id='" + id_new + "' ></tr>");
		}else{
			id_new=id;
		}
		if(data.nillable=='Y'){
			$("#" + id_new).append('<td class="head"><font>*</font>' + data.value + '</td>');
		}else{
			$("#" + id_new).append('<td class="head">' + data.value + '</td>');
		}

		$("#" + id_new).append('<td class="textarea" colspan="3"'
				+'style="border-width: 1px;border-style: Solid;border-color: #c2c9cf;"><textarea id='
				+data.key+' rows="6" style="resize:none;overflow:auto;" readonly></textarea></td>');
		loadNum=loadNum+2;

		//赋值
		var val=tableInfoListMap[data.key];
		if(!isEmpty(val)){
			$("#" + data.key).val(val);
		}
	}else{
		if(data.nillable=='Y'){
			$("#" + id).append('<td class="head"><font>*</font>' + data.value + '</td>');
		}else{
			$("#" + id).append('<td class="head">' + data.value + '</td>');
		}
		$("#" + id).append('<td class="content" id="' + data.key + '"></td>');
		loadNum++;
		//赋值
		var val=tableInfoListMap[data.key];
		if(!isEmpty(val)){
			$("#" + data.key).html(val);
		}
	}

}

//生成表格
function generateTable(id,data){
	if(data.elmtype =='S'){//字符
		generateText(id, data);
	}else if(data.elmtype =='P'){//百分比
		generatePercent(id, data);
	}else if(data.elmtype =='D'){//日期
		generateDate(id, data);
	}else if(data.elmtype =='N'){//数值
		generateNumber(id, data);
	}else if(data.elmtype =='E'){//枚举
		generateSelect(id, data);
	}else if(data.elmtype =='M'){//多行文本
		var id_new="";
		if (loadNum % 2 != 0) {//多行文本出现在一行的后面，先补足空格，另起一行
			$("#" + id).append('<td class="head"></td><td class="content"></td>');
			loadNum++;
			id_new= tableid+"_tr_" +loadNum;
			$("#"+tableid).append("<tr id='" + id_new + "' ></tr>");
		}else{
			id_new=id;
		}
		generateTextArea(id_new, data);
	}

	//浮动提示
	JrzlTools.popup({
        id : data.key,
        text : data.elmexp,
        align : "top left",
        showType:"focus"
    });
	//校验初始化
	$("#" + data.key).afterTip("init");
}

//生成下拉
function generateSelect(id, data) {
	if(data.nillable=='Y'){
		$("#" + id).append('<td class="head"><font>*</font>' + data.value + '</td>');
	}else{
		$("#" + id).append('<td class="head">' + data.value + '</td>');
	}

	$("#" + id).append('<td class="content"><select class="select" id="' + data.key + '"></select></td>');
	var idArr = [];
	idArr.push(data.key);
	JrzlTools.loadSelectDomData(idArr,data.fldmap,true,null);
	onSelectChange(data.key);
	loadNum++;

	//赋值
	if(!isEmpty(tableInfoListMap)){
		var val=tableInfoListMap[data.key];
		if(!isEmpty(val)){
			for (var key in data.fldmap) {
	            if(data.fldmap[key]==val){
	            	$("#" + data.key).val(key);
	            }
	        }

		}
	}


}
//生成日期
function generateDate(id, data) {
	if(data.nillable=='Y'){
		$("#" + id).append('<td class="head"><font>*</font>' + data.value + '</td>');
	}else{
		$("#" + id).append('<td class="head">' + data.value + '</td>');
	}

	$("#" + id).append('<td class="content"><input type="text" id="' + data.key + '" class="date" onchange="dateCheck(this);"/></td>');
	JrzlTools.date({id:data.key,format:'yyyyMMdd',readOnly:true});
	onDateChange(data.key);
	loadNum++;

	//赋值
	if(!isEmpty(tableInfoListMap)){
		var val=tableInfoListMap[data.key];
		if(!isEmpty(val)){
			$("#" + data.key).val(val);
		}
	}

}
//生成文本
function generateText(id, data) {
	if(data.nillable=='Y'){
		$("#" + id).append('<td class="head"><font>*</font>' + data.value + '</td>');
	}else{
		$("#" + id).append('<td class="head">' + data.value + '</td>');
	}

	$("#" + id).append('<td class="content"><input type="text" id="' + data.key + '" /></td>');
	onTextChange(data.key);
	 loadNum++;

	//赋值
	 if(!isEmpty(tableInfoListMap)){
		 var val=tableInfoListMap[data.key];
			if(!isEmpty(val)){
				$("#" + data.key).val(val);
			}
	 }

}

//生成数值

function generateNumber(id, data) {

	if(data.nillable=='Y'){
		$("#" + id).append('<td class="head"><font>*</font>' + data.value + '</td>');
	}else{
		$("#" + id).append('<td class="head">' + data.value + '</td>');
	}

	$("#" + id).append('<td class="content"><input type="text"  id="'
			+ data.key + '" style="text-align:right"/></td>');
	onNumberChange(data.key);
	loadNum++;

	//赋值
	if(!isEmpty(tableInfoListMap)){
		var val=tableInfoListMap[data.key];
		if(!isEmpty(val)){
			$("#" + data.key).val(val);
		}
	}

}
//生成百分比
function generatePercent(id, data) {
	var value=data.value;
	if(data.value.indexOf("%")<=0 ){
		value+="（%）";
	}
	if(data.nillable=='Y'){
		$("#" + id).append('<td class="head"><font>*</font>' + value + '</td>');
	}else{
		$("#" + id).append('<td class="head">' + value + '</td>');
	}

	$("#" + id).append('<td class="content"><input type="text" id="' + data.key + '" style="text-align:right"/></td>');
	onNumberChange(data.key);
	loadNum++;

	//赋值
	if(!isEmpty(tableInfoListMap)){
		var val=tableInfoListMap[data.key];
		if(!isEmpty(val)){
			$("#" + data.key).val(val);
		}
	}

}
//生成文本域
function generateTextArea(id, data) {
	if(data.nillable=='Y'){
		$("#" + id).append('<td class="head"><font>*</font>' + data.value + '</td>');
	}else{
		$("#" + id).append('<td class="head">' + data.value + '</td>');
	}

	$("#" + id).append('<td class="textarea" colspan="3"'
			+'style="border-width: 1px;border-style: Solid;border-color: #c2c9cf;"><textarea id='
			+data.key+' rows="6" style="resize:none;overflow:auto;"></textarea></td>');
	onTextChange(data.key);
	loadNum=loadNum+2;

	//赋值
	if(!isEmpty(tableInfoListMap)){
		var val=tableInfoListMap[data.key];
		if(!isEmpty(val)){
			$("#" + data.key).val(val);
		}
	}

}

//数值change绑定
function onNumberChange(key){
	var data=modelDataMap[key];
	var scale=data.dcmdgt;//小数位数
	if(isEmpty(scale)){
		scale=null;
	}else{
		scale=parseInt(scale+"");
	}
	//金额格式化
	$("#" + key).on({
		"focus":function(){
			var self = this, num = $(self).val();
			$(self).val(commafy.delCommafy(num));
			JrzlTools._moveCursorToEnd(self);
		},
		"blur":function(){
			var self = this, num = $(self).val();
			if(!numberCheck(key)){
				return;
			}
			if(null !=scale){
				num=new BigDecimal(num+"").setScale(scale, MathContext.ROUND_HALF_UP);
			}
			num = commafy.addCommafy(num);
			$(self).val(num);
		}
	});
}
//数值验证
function numberCheck(key){


	var data=modelDataMap[key];

	var tipsName=data.value;
	if(data.elmtype =='P'){
		if(tipsName.indexOf("%")<=0 ){
			tipsName+="（%）";
		}
	}
	var maxval=data.maxval;//最大值
	var minval=data.minval;//最小值

	var num = $("#"+key).val();
	num=commafy.delCommafy(num);

	if(isEmpty(maxval)){
		maxval="1000000000000000";
	}else{
		maxval=new BigDecimal(maxval+"");
	}
	if(isEmpty(minval)){
		minval="-1000000000000000";
	}else{
		minval=new BigDecimal(minval+"");
	}

	$("#"+key).afterTip("clear");
	//空值不校验
	if(isCheckNull == 'N' && num.length==0){
	    return true;
	}

	//可以为空:空值直接返回，不用继续校验
	if(data.nillable == 'N' && num.length==0){
		$("#"+key).afterTip("ok");
	    return true;
	}

	var flag = commafy.isRightNum(num, maxval, minval, tipsName);
	if(flag == 1){
		if(data.nillable == 'Y'){
			JrzlTools.alert( "“"+tipsName+"”不能为空。", "警告");
		    $("#"+key).afterTip("warn");
		    return false;
	    }else{
	    	$("#"+key).afterTip("ok");
	    }

	}else if(flag == 0){
		$("#"+key).afterTip("ok");
	}else{
		JrzlTools.alert(flag, "警告");
		$("#"+key).afterTip("warn");
		return false;
	}
	var reg=data.othchk;
	if(!isEmpty(reg)){
		var pattern=new RegExp(reg);
		if(!pattern.test(num)){
			JrzlTools.alert("“"+tipsName+"”校验出错："+data.chkexp, "警告");
			$("#"+key).afterTip("warn");
			return false;
		}else{
			$("#"+key).afterTip("ok");
		}
	}
	return true;
}
//文本绑定
function onTextChange(key){
	$("#" + key).on({
		"change":function(){
			textCheck(key);
		}
	});
}
//文本校验
function textCheck(key){
	var data=modelDataMap[key];
	var maxlen=data.maxlen;//最大长度
	var minlen=data.minlen;//最小长度

	var num = $("#"+key).val();

	if(isEmpty(maxlen)){
		maxlen=null;
	}else{
		maxlen=parseInt(maxlen+"");
	}
	if(isEmpty(minlen)){
		minlen=null;
	}else{
		minlen=parseInt(minlen+"");
	}

	$("#"+key).afterTip("clear");
	//空值不校验
	if(isCheckNull == 'N' && num.length==0){
	    return true;
	}

	//可以为空:空值直接返回，不用继续校验
	if(data.nillable == 'N' && num.length==0){
		$("#"+key).afterTip("ok");
	    return true;
	}

	if(maxlen !=null && num.length>maxlen){
		JrzlTools.alert( "“"+data.value+"”超过最大长度["+maxlen+"]。", "警告");
	    $("#"+key).afterTip("warn");
	    return false;
	}else if(minlen !=null && num.length<minlen){
		JrzlTools.alert( "“"+data.value+"”小于最小长度["+minlen+"]。", "警告");
	    $("#"+key).afterTip("warn");
	    return false;
	}else if(data.nillable == 'Y' && num.length==0){
		JrzlTools.alert( "“"+data.value+"”不能为空。", "警告");
	    $("#"+key).afterTip("warn");
	    return false;
	}else{
		$("#"+key).afterTip("ok");
	}
	var reg=data.othchk;
	if(!isEmpty(reg)){
		var pattern=new RegExp(reg);
		if(!pattern.test(num)){
			JrzlTools.alert("“"+data.value+"”校验出错："+data.chkexp, "警告");
			$("#"+key).afterTip("warn");
			return false;
		}else{
			$("#"+key).afterTip("ok");
		}
	}
	 return true;
}

//日期绑定
function onDateChange(key){
	$("#" + key).on({
		"change":function(){
			dateCheck(key);
		}
	});
}
//日期校验
function dateCheck(key){
	var data=modelDataMap[key];

	var num = $("#"+key).val();
	$("#"+key).afterTip("clear");
	//空值不校验
	if(isCheckNull == 'N' && num.length==0){
	    return true;
	}
	//可以为空:空值直接返回，不用继续校验
	if(data.nillable == 'N' && num.length==0){
		$("#"+key).afterTip("ok");
	    return true;
	}

	if(data.nillable == 'Y' && num.length==0){
		JrzlTools.alert( "“"+data.value+"”不能为空。", "警告");
	    $("#"+key).afterTip("warn");
	    return false;
	}else if(num.length>0&&num.length !=8){
		JrzlTools.alert( "“"+data.value+"”格式不对。", "警告");
	    $("#"+key).afterTip("warn");
	    return false;
	}else{
		$("#"+key).afterTip("ok");
	}

	var reg=data.othchk;
	if(!isEmpty(reg)){
		var pattern=new RegExp(reg);
		if(!pattern.test(num)){
			JrzlTools.alert("“"+data.value+"”校验出错："+data.chkexp, "警告");
			$("#"+key).afterTip("warn");
			return false;
		}else{
			$("#"+key).afterTip("ok");
		}
	}
	return true;
}

//下拉绑定
function onSelectChange(key){
	$("#" + key).on({
		"change":function(){
			selectCheck(key);
		}
	});
}
//下拉校验
function selectCheck(key){
	var data=modelDataMap[key];
	var num = $("#"+key).val();
	//空值不校验
	if(isCheckNull == 'N' && num.length==0){
	    return true;
	}
	//可以为空:空值直接返回，不用继续校验
	if(data.nillable == 'N' && num.length==0){
		$("#"+key).afterTip("ok");
	    return true;
	}

	$("#"+key).afterTip("clear");
	if(data.nillable == 'Y' && num.length==0){
		JrzlTools.alert( "“"+data.value+"”不能为空。", "警告");
	    $("#"+key).afterTip("warn");
	    return false;
	}else{
		$("#"+key).afterTip("ok");
	}

	var reg=data.othchk;
	if(!isEmpty(reg)){
		var pattern=new RegExp(reg);
		if(!pattern.test(num)){
			JrzlTools.alert("“"+data.value+"”校验出错："+data.chkexp, "警告");
			$("#"+key).afterTip("warn");
			return false;
		}else{
			$("#"+key).afterTip("ok");
		}
	}
	return true;
}

//为空判断
function isEmpty(value) {
    if ((undefined == value)||(null == value) || ("" == value) ) {
        return true;
    } else {
        return false;
    }
}
