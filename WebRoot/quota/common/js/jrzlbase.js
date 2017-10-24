//判断是否已定义，若没有定义则新定义一个
if (typeof(_isAjaxRequest) == "undefined") {
	//是否是远程请求
	window.eval("var _isAjaxRequest = false;");
}

var SYS_PAGESIZE=50;
var SYS_TOKEN = null;//页面token
var ACCSEE_UUID = null;
//window.onload = onloadHandler;

var windowHandler = {
	onload : null /*方法是无参数的*/
};
/*
 * 窗口关闭前进行数据清空操作
 */
window.onunload = function(){
	JrzlTools.destroy();
	window.onunload = null;
};
/**
 * Tab页关闭前，向服务器发送正在使用中的信息
 */
function onTabRemove(){
	/*
	 * 需要做排他访问的页面每分钟向服务器发送正在使用中的信息
	 * 服务器一定时间没有收到信息会当做页面已关闭处理
	 */
	if(isExclPage()){
		Request.processDataRequest({url:"/pageLiving.do",async:false,localStorage:localPagelivingData,customParams:{__close_flag:true,__access_uuid:ACCSEE_UUID},progress:false,callbackFunc:function(data){}});
	}
}
/**
 * 如果希望在onload时进行处理，那么请定义windowHandler.onload方法.
 */
function onloadHandler(){
	sysPageInit();
	//检查是否有页面权限,如果有权限同时获取按钮权限
	var customParams={},
	url = window.location.href;
	customParams["SYS_REQUESTURL"] = url.substring(url.indexOf("/jrzl/"));
	var authUrl = "/pageAuthValidate.do";
	var casTicket = Request.getUrlParam("_ticket");
	if( casTicket != null ){
		authUrl = authUrl +"?_ticket="+casTicket;
	}
	/*
	 * 需要做排他访问的页面每分钟向服务器发送正在使用中的信息
	 * 服务器一定时间没有收到信息会当做页面已关闭处理
	 */
	if(isExclPage()){
		var requestParams = Request.getRequest();
		for(var paramName in requestParams){
			customParams[paramName]=requestParams[paramName];
		}
		customParams["__excelpage_callback"] = getCallBackValue();
	}

	Request.processDataRequest({url:authUrl, localStorage:localAuthData, customParams:customParams, errorRedirect:true,progress:false,callbackFunc:_handleCustomOnload});
}
/**
 * 一些公共的页面初始化
 * @return
 */
function sysPageInit(){
	$(".search-condition").children("table").find('tr').each(function(index,item){
		if(index>1){
		  $(this).toggle();
		}
	});
	// 增加对disabled的输入框背景特殊处理
	$("input[type='text']:disabled","select:disabled").css("background-color","#EEEEF3");
}
/**
 * 处理按钮权限,客户定义onload，可配置的浮动提示
 * @param data
 * @return
 */
function _handleCustomOnload(data){
	if(data!=null){
		//处理页面按钮的权限
		var oprAuths = data.OprAuth;
		if(oprAuths != null && oprAuths != undefined){
			$.each(oprAuths,function(i, id) {
				var $ele = $("#" + id);
				try {
					$ele.remove();
				} catch (e) {}
			});
		}

		$(".inner-button-area").each(function(i, e) {
			var buttonNumb = $(e).find("input[type=button]").length;
			if(buttonNumb == 0) {
				try {
					$(e).remove();
				} catch (e) {}
			}
		});

		if(data.SYS_PAGESIZE !=null && data.SYS_PAGESIZE != undefined){
			SYS_PAGESIZE = data.SYS_PAGESIZE;
		}
		if(data.SYS_TOKEN != null && data.SYS_TOKEN != undefined){
			SYS_TOKEN = data.SYS_TOKEN;
		}
	}
	//处理弹出配置
	_handlePopupConfig();

	/*
	 * 需要做排他访问的页面每分钟向服务器发送正在使用中的信息
	 * 服务器一定时间没有收到信息会当做页面已关闭处理
	 */
	if(isExclPage()){
		ACCSEE_UUID = data.__access_uuid;
		setTimeout("sendPageliving('"+ ACCSEE_UUID +"')", 60000);
	}

	//用户自定义的onload
	if ( windowHandler.onload ){
		windowHandler.onload();
		filterBackspace();
		hideMenuContext();
	}else{
		JrzlTools.distroyProgress(SYS_REQUESTPAGEID);
	}
}

/*
 * 判断当前页面是否为排他访问页面
 */
function isExclPage(){
	if(typeof(gExcl_pages)  != "undefined"){
		//遍历页面组
		for(var groupid in gExcl_pages){
			var pages = gExcl_pages[groupid];
			//遍历页面组中页面
			for(var p in pages){
				if(SYS_REQUESTPAGEID == pages[p].pageid){
					return true;
				}
			}
		}
	}
	return false;
}
/*
 * 判断当前页面是否为排他访问页面
 * 判断是否使用callback方法获取键值
 * 如果是则执行callback方法返回获取到的值
 * callback方法需要在页面对应的js中有业务开发者自定义实现，返回值为字符串、无输入参数
 */
function getCallBackValue(){
	if(typeof(gExcl_pages)  != "undefined"){
		//遍历页面组
		for(var groupid in gExcl_pages){
			var pages = gExcl_pages[groupid];
			//遍历页面组中页面
			for(var p in pages){
				if(SYS_REQUESTPAGEID == pages[p].pageid
						&& pages[p].callback ){
					return window.eval(pages[p].callback+"()");
				}
			}
		}
	}
	return "";
}
/*
 * 需要做排他访问的页面定时向服务器发送正在使用中的信息
 * 服务器一定时间没有收到信息会当做页面已关闭处理
 */
function sendPageliving(access_uuid){
	Request.processDataRequest({url:"/pageLiving.do",localStorage:localPagelivingData,customParams:{"__access_uuid":access_uuid},progress:false,errorRedirect:true,callbackFunc:_handlePageliving});
}
/**
 * @param data
 * @return
 */
function _handlePageliving(){
	setTimeout("sendPageliving('"+ ACCSEE_UUID +"')", 60000);
}

/**
 * 过滤系统Backspace键
 */
function filterBackspace(){
	$(document).keydown(function(event){
	      var code = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;

	      var activeType = document.activeElement.type;
	      if(activeType == "text" || activeType == "textarea"){
	    	  if(document.activeElement.readOnly){
	    		  return false;
	    	  }
	      } else if(8 == code && activeType != "text"  && activeType != "textarea" && activeType != "password"){
	    	  return false;
	       }
	});
}
/**
 * 绑定关闭右键menucontext事件
 */
function hideMenuContext(){
	 $(document).bind('click', function(){
		 window.top.$('div#jqContextMenu').hide();
		 window.top.$('div#jqContextMenu').next("div").hide();
	});
}
/**
 * 处理弹出配置
 * @return
 */
function _handlePopupConfig(){
	//传入pageId
	var sys_RequestPageId = "";
	if (typeof(SYS_REQUESTPAGEID)== "undefined") {
		 sys_RequestPageId = "pass";
	}else{
		 sys_RequestPageId = SYS_REQUESTPAGEID;
	}
	if(!_isAjaxRequest){//不是远程ajax请求
		 if(localPopupData!=null && localPopupData!=undefined){
			 var popupText = {};
	         var popupType = {};
			 for(var i=0,len=localPopupData.length;i<len;i++){
				 popupText[localPopupData[i]["KEY"]] = localPopupData[i]["DESC"];
				 popupType[localPopupData[i]["KEY"]] = localPopupData[i]["SHOWTYPE"];
			 }
		     for(var key in popupText){
		    	 JrzlTools.popup({id:key,text:popupText[key],showType:popupType[key],align:"top left"});
	        }

	     }
		return;
	}
	//页面弹出框数据获取
	var popupUrl = Request.getDeployName()+"/jrzl/pub/index/popupConfig.action";
	$.ajax({
        type: "post",
        url: popupUrl,
        data: {SYS_REQUESTPAGEID:sys_RequestPageId},
        dataType: "json",
        timeout: 10*60*1000,
        success: function(data){
		        if(data.popupData!=null && data.popupData!=undefined){
		        	var popupText = {};
		        	var popupType = {};
		        	for(var i=0,len=data.popupData.length;i<len;i++){
		        		popupText[data.popupData[i]["KEY"]] = data.popupData[i]["DESC"];
		        		popupType[data.popupData[i]["KEY"]] = data.popupData[i]["SHOWTYPE"];
		        	}
		        	for(var key in popupText){
		        		JrzlTools.popup({id:key,text:popupText[key],showType:popupType[key],align:"top left"});
		        	}
		        }
        }

	});
}


//数据后台请求
var Request =
{
	//ajax 请求
	processDataRequest:function(options){
	     var self = this;
		 var config = {
		    	url               :  null,                     // 请求url
		    	localStorage      :  null,                     //本地获取数据，当localStorage为空时通过ajax请求后台数据
		        form              :  null,                     // 请求表单
		        formFilters       :  [],                        // 请求表单项过滤
		        customParams      :  {},                        // 自定义参数
		        errorRedirect     :  false,                    // 出错是否跳转到出错页
		        callbackFunc      :  null,                     //请求成功回调函数
		        progress          :  false,                    //是否需要提交进度条
		        progressText      :  "正在提交，请稍候...",      //进度条提示
		        validated         :  false,                    //是否需要校验表单
		        submitConfirm     :  false,                    //提交确认弹出框
		        confirmText       :  "确定提交？",				//确认提交弹出提示内容
		        pageSnapshot      :  false,                    //是否需要网页快照
		        isDirectUrl       :  false,                    //是否是直接请求，即是否需要自动添加部署名
		        ajaxType          :  "post",                    //ajax数据传送类型post ,get
		        ajaxDataType      :  "json",                    //ajax数据返回类型json,xml,html
		        _isOrigRequest    :  true,                     //是否是原始请求，此不需要用户配置
		        getRequestBaseUrl :  self._getRequestBaseUrl,   //此不需要用户配置
		        assembleParameters:  self._assembleParameters,  //此不需要用户配置
		        processDataRequest:  self.processDataRequest,   //此不需要用户配置
		        getDeployName     :  self.getDeployName,        //此不需要用户配置
		        async			  :  "true"					//是否为异步请求，默认为true
		    };
		 config = $.extend(config,options || {});//config和options合并覆盖

		 if(config._isOrigRequest){
			 if(config.url==null&&config.form!=null){
				 config.url=config.form.action;
			 }
			 if(config.url==null||config.url.length==0||config.url==undefined){
				 JrzlTools.alert("没有配置请求url。","提示");
				 return;
			 }
			 if((config.validated)){ //需要校验，执行字段校验
				 if(typeof $.doValidate!=="function"){
					 JrzlTools.alert("没有引进校验所需的js。","提示");
				     return;
				 }else if(!($.doValidate(config.url))){
					return;//校验不通过，返回
				 }
				 //校验附件上传相关

			 }

			 if(!config.isDirectUrl){//url加上部署名
				 config.url = config.getDeployName()+config.url;
			 }
			 //过滤及拼接参数
			 if(config.form!=null){
					var elements = config.form.elements;
					for(var i=0,len=elements.length;i<len;i++){
						if(elements[i].id!=null&&elements[i].id!=undefined&&elements[i].id.length!=0){
							if(self._containtElement(config.formFilters,elements[i].id)){
								continue;
							}else{
								config.customParams[elements[i].id]=elements[i].value;
							}
						}
					}
			 }
			 //去掉参数左右的空格
			 for(var key in config.customParams){
				 config.customParams[key] = $.trim(config.customParams[key]);
			 }
			 //传入pageId
			 var sys_RequestPageId = "";
			 if (typeof(SYS_REQUESTPAGEID)== "undefined") {
				 sys_RequestPageId = "pass";
			 }else{
				 sys_RequestPageId = SYS_REQUESTPAGEID;
			 }
			 config.customParams["SYS_REQUESTPAGEID"] = sys_RequestPageId;

			 //网页快照
			 if(config.pageSnapshot){
				 config.customParams["PAGE_SNAPSHOT"] = $(body).html();
			 }

			 //token
			 if(SYS_TOKEN!=null){
				 config.customParams["SYS_TOKEN"] = SYS_TOKEN;
			 }
			 //如果不是ajax请求，用本地数据
			 if(!_isAjaxRequest){
				 config.callbackFunc(config.localStorage);
				 return;
			 }

			//提交确认弹出框
			 if(config.submitConfirm){
				 JrzlTools.confirm(config.confirmText,"提示",function(confirm){
					 if(confirm){
						 $.ajax(initSystemAjaxRequestParams(config));
					 }

				 });

			 }else{
				 $.ajax(initSystemAjaxRequestParams(config));
			 }
		 }else{
			 $.ajax(initSystemAjaxRequestParams(config));
		 }

	},

	//ajax 文件下载
	filedownload:function(options){
	     var self = this;
		 var config = {
		    	url               :  null,                     // 请求url
		    	localStorage      :  null,                     //本地获取数据，当localStorage为空时通过ajax请求后台数据
		        form              :  null,                     // 请求表单
		        customParams      :  {},                        // 自定义参数
		        errorRedirect     :  false,                    // 出错是否跳转到出错页
		        callbackFunc      :  null,                     //请求成功回调函数
		        progress          :  true,                     //是否需要提交进度条
		        validated         :  false,                    //是否需要校验表单
		        submitConfirm     :  false,                    //提交确认弹出框
		        _isOrigRequest    :  true,                     //是否是原始请求，此不需要用户配置
		        getRequestBaseUrl :  self._getRequestBaseUrl,   //此不需要用户配置
		        assembleParameters:  self._assembleParameters,  //此不需要用户配置
		        processDataRequest:  self.processDataRequest,   //此不需要用户配置
		        getDeployName     :  self.getDeployName         //此不需要用户配置

		    };
		 config = $.extend(config,options || {});
		 config.customParams.FILEID=config.FILEID;
		 config.customParams._EXTREQUEST_FROMAJAX = "true";
		 config.data = config.customParams;

		 $.fileDownload(config.getDeployName()+config.url, config)
		    .fail(function (data){
		    	handleSysErrResponse(data, config);});
	},

	//跳转url函数
	htmlUrlRedirect:function(options){
		var self = this;
		var config = {
		    	url                 :  null,                     // 跳转url
		        form                :  null,                     // 跳转表单
		        formFilters         :  [],                       // 跳转表单项过滤
		        customParams        :  {}                        // 自定义参数
		    };
		config = $.extend(config,options || {});

		if(config.url==null&&config.form!=null){
			config.url=config.form.action;
		}
		if(config.url==null||config.url.length==0||config.url==undefined){
			 JrzlTools.alert("没有配置跳转url。","提示");
			return;
		}
		if(config.form!=null){
			var elements = config.form.elements;
			for(var i=0,len=elements.length;i<len;i++){
				if(elements[i].id!=null&&elements[i].id!=undefined&&elements[i].id.length!=0){
					if(self._containtElement(config.formFilters,elements[i].id)){
						continue;
					}else{
						config.customParams[elements[i].id]=elements[i].value;
					}
				}
			}
		}
		config.url = config.url+"?" + self._assembleParameters(config.customParams);
		window.location.href = config.url;

	},
	//获得当前url中的参数
	getUrlParam : function(val){
		var uri = decodeURIComponent(location.href);
		var re = new RegExp("(&|[\?])" +val+ "=([^&?]*)", "g");
		return ((uri.match(re))?(uri.match(re)[0].substr(val.length+2)):null);
	},
	//获取当强url中的所有参数
	getRequest :function(){
	    var url = decodeURIComponent(location.href); //获取url中"?"符后的字串
		var theRequest = new Object();
		var pos = url.indexOf("?");
		if ( pos != -1) {
		     var str = url.substr(pos + 1);
		     strs = str.split("&");
		     for(var i = 0; i < strs.length; i ++) {
		        theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
		     }
		}
		return theRequest;
	},
	//获取当强url中的所有参数
	//获取部署名
	getDeployName: function(){
		if(JrzlTools.isPaas()) {
			return '';
		}
		var localUrl = window.location.href;

		var index = localUrl.indexOf("/jrzl/");
		if(index==-1){
			index = localUrl.indexOf("/common/uic/");
		}
		var baseUrl = localUrl.substr(0,index);
		var lastIndex = baseUrl.lastIndexOf("/");
		var deployName = '';
		if(_isAjaxRequest == true) {
			deployName = baseUrl.substr(lastIndex,index);
		} else {
			deployName = baseUrl.substr(0,index);
		}
		return deployName;
	},
	//获取相对路径层级
	getPathLevel:function(){
		var localUrl = window.location.href;
		var index = localUrl.indexOf("/jrzl/");
		if(index==-1){
			index = localUrl.indexOf("/common/uic/");
		}
		var pathUrl = localUrl.substr(index);
		var lvls = pathUrl.split('/');
        var len = lvls.length;
        if(len>2){
        	len=len-2;
        }else{
            len=0;
        }
        var str = "";
		for(var i=0;i<len;i++ ){
			str = str+"../";
		}
		return str;
	},
	//关闭当前窗口
	closeWindow:function(){
		var isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
		if(isChrome){
			window.opener=null;
			window.open('','_self');
		}
		window.close();
	},
	//内部方法，检查数组中是否包含id
	_containtElement: function(arr,id){
		for(var i=0,len=arr.length;i<len;i++){
			if(arr[i]==id){
				return true;
			}
		}
		return false;
	},
	//获取基础的url
	_getRequestBaseUrl: function(){
		var localUrl = window.location.href;
		var index = localUrl.indexOf("/jrzl/");
		if(index==-1){
			index = localUrl.indexOf("/common/uic/");
		}
		var baseUrl = localUrl.substr(0,index+1);
		return baseUrl;
	},
    //为url组装参数
	_assembleParameters: function(params){
		var tempParams = "";
		for(var key in params){
			tempParams = tempParams + key + "=" + params[key]+"&";
		}
		if(tempParams.length>0){
			tempParams = tempParams.substr(0,tempParams.length-1);
		}
		return encodeURIComponent(tempParams);
	}

};


function initSystemAjaxRequestParams(config){
	var ajaxParams={
		async: config.async,
        type: config.ajaxType,
        url: config.url,
        data: config.customParams,
        dataType: config.ajaxDataType,
        xhrFields: config.xhrFields,
        crossDomain: config.crossDomain,
        timeout: 10*60*1000,
        success: function(data){
		             if(data!=null){
						 if(data.SYS_TOKEN!=null && data.SYS_TOKEN!=undefined){
							SYS_TOKEN = data.SYS_TOKEN;
						 };
		             }
		             if(config.callbackFunc!=null){
		            	 config.callbackFunc(data);
		             }
                 },
        error: function(XMLHttpRequest, textStatus, errorThrown){
               	  JrzlTools.distroyProgress(SYS_REQUESTPAGEID);
               	  var errorMsg = "";
                     if(XMLHttpRequest.status=='404'){
                   	  errorMsg="网页未找到！";
                     }else if(XMLHttpRequest.status=='500'){
                		handleSysErrResponse(XMLHttpRequest.responseText, config);
                    	return ;
                     }else if(XMLHttpRequest.status=='200' && textStatus=='parsererror'){
                   	  errorMsg="返回数据类型错误！";
                     }else if(XMLHttpRequest.status=='0'&& textStatus=='timeout'){
                   	  errorMsg="请求超时！";
                     }else if(XMLHttpRequest.status=='0'&& textStatus=='error'){
                   	  	errorMsg=config.url+"配置错误！";
                     }else if( XMLHttpRequest.status=='431' ){
                   		handleSysErrResponse(XMLHttpRequest.responseText, config);
	                    	return ;
                     }else{
                   	  errorMsg = XMLHttpRequest.responseText;
                     }
                     if(config.errorRedirect==true){
                   	  location.href = config.getRequestBaseUrl()+'common/uic/default/error.html?'+config.assembleParameters({'errorMsg':errorMsg});
                     }

                  },
       beforeSend:function(data){
               	   if(config.progress){
               		   JrzlTools.loading(config.progressText);
               	   }
                  },
       complete: function(data){
               	   if(config.progress){
               		   JrzlTools.unloading();
               	   }
                }
     };
	return ajaxParams;

}


//统一处理系统错误返回ErrorNo与ErrorNo
function handleSysErrResponse(dataStr, config){
	var data;
	if( dataStr != undefined && typeof dataStr == 'string' ){
		dataStr = dataStr.replace(/&quot;/g, "\"");
		try {
			data = window.eval('(' + dataStr + ')');
		} catch (e) {
			data = {};
		}
	}
	if(data.ErrorNo== null || data.ErrorNo==undefined || data.ErrorNo.length==0){
		data.ErrorNo = "5";
	}
	if(data.SYS_TOKEN != undefined && data.SYS_TOKEN != ""){
		SYS_TOKEN = data.SYS_TOKEN;
	}
	var errorMsg = data.ErrorMsg;
	//没有返回错误信息，使用默认
	if( data.ErrorMsg==null || data.ErrorMsg.length==0 ||
     			 data.ErrorMsg==undefined ){
		if(data.ErrorNo=="1"){
	     			 errorMsg = "未找到对应的交易，请联系管理员！";
		}else if(data.ErrorNo=="2"){
	             	 errorMsg = "您没有访问权限，请联系系统管理员！";
		}else if(data.ErrorNo=="3"){
	             	 errorMsg = "访问错误，请联系系统管理员！";
		}else if(data.ErrorNo=="4"){
	             	 errorMsg = "系统处理异常，请联系系统管理员！";
		}else if(data.ErrorNo=="5"){
	             	 errorMsg = "出现未知错误，请联系系统管理员！";
		}else if(data.ErrorNo=="9"){
	             	 errorMsg = "不允许重复提交！";
		}
	}
	//后台校验没通过
	if(data.ErrorNo=="6"){
    	 errorMsg = "";
    	 var failDetail = data.VALIDATE_FAIL_DETAIL;
       	 if(failDetail!=null && failDetail!=undefined){
       		 for(var key in failDetail){
       			$.showWarnTip(key);
       			errorMsg=errorMsg+failDetail[key]+'\n';
       		 }
       	 }else{
       		errorMsg="后台校验没有通过。";
       	 }
	}
	//cas登录失效
	if(data.ErrorNo=="7"){
     	 config.url=data.CasValidateUrl;
     	 config._isOrigRequest=false;
     	 config.processDataRequest(config);
     	 return;
	}else if(data.ErrorNo=="8"){
		if(data.CasValidateUrl != null
				&& data.CasValidateUrl != "null"
				&& data.CasValidateUrl != ""){
//			openBlank(data.CasValidateUrl);
//			window.parent.location.href=data.CasValidateUrl;
			window.location.href=data.CasValidateUrl;
		}
     	return;
 	}

	//异常返回处理
    if(config.errorRedirect==true||data.ErrorNo=="2"){
    	 var sys_RequestPageId = "";
		 if (typeof(SYS_REQUESTPAGEID)== "undefined") {
			 sys_RequestPageId = "pass";
		 }else{
			 sys_RequestPageId = SYS_REQUESTPAGEID;
		 }
    	 location.href = config.getRequestBaseUrl()+'common/uic/default/error.html?'+config.assembleParameters({'errorMsg':errorMsg,"SYS_REQUESTPAGEID":sys_RequestPageId});
    }else{
       	 JrzlTools.alert(errorMsg,"错误");
    }
}



//#系统需要的local定义----------start
var localAuthData = null;
var localPopupData = null;
var localPagelivingData = null;
//#系统需要的local定义----------end

//#localdata赋值---------start
localAuthData = {"__access_uuid":"0577d441-8837-482c-a535-856e472c1ab4","OprAuth":[],"SYS_TOKEN":"4345fcba-6a84-4664-999b-106aabf90213","ErrorMsg":"","SYS_PAGESIZE":50,"ErrorNo":"0"};
//#localdata赋值---------end