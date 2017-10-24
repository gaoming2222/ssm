﻿//页面id
var SYS_REQUESTPAGEID = "PORTAL";

//定时激活cas的间隔时间
var CAS_LOGIN_TIME = 30*60*1000;
//需要实现windowHanler.onload来获取初始化数据
windowHandler.onload = function (){
	//初始化布局size
	initWindowSize();
	Request.processDataRequest({
		url:"/jrzl/pub/index/index.action",
		localStorage:localData,
		errorRedirect:true,
		callbackFunc:handleReturnData}
	);
	setTimeout(casLogin,CAS_LOGIN_TIME);
	initCasUrl();
	initTabbar();

	$("#DOWNLOADCHROME").css("display", "none");

//	if(!isIE8){
//		JrzlTools.confirm("建议使用chrome浏览器，是否下载chrome浏览器。","提示",function(val){
//			if(val){
//				Request.processDataRequest({
//					url:"/jrzl/pub/index/getChromeFileInfo.action",
//					localStorage:localData,
//					errorRedirect:false,
//					callbackFunc:function(data){
//						 Request.filedownload({url:"/jrzl/file/download.do",
//			                localStorage:null,
//			                errorRedirect:false,
//			                FILEID:data.FILEID
//			             });
//					}
//				});
//			}
//		});
//	}else{
//		$("#DOWNLOADCHROME").css("display", "none");
//	}
	//加入从数据库调取的时间
	getSysCurTime();
};
function downloadChrome(){
	JrzlTools.confirm("是否下载chrome浏览器。","提示",function(val){
		if(val){
			Request.processDataRequest({
				url:"/jrzl/pub/index/getChromeFileInfo.action",
				localStorage:localData,
				errorRedirect:false,
				callbackFunc:function(data){
					 Request.filedownload({url:"/jrzl/file/download.do",
		                localStorage:null,
		                errorRedirect:false,
		                FILEID:data.FILEID
		             });
				}
			});
		}
	});
}

function getSysCurTime(curSeconds){
	if( curSeconds == undefined || curSeconds == null || curSeconds*1 >= 59){
		//每分钟刷新一次
		Request.processDataRequest({
			url:"/jrzl/pub/index/time.action",
			localStorage:localData,
			errorRedirect:false,
			callbackFunc:function(data){
				// DATABASE_TIME:"2017-05-23 16:21:33"
				var newTime = data.DATABASE_TIME;
				var newSeconds = newTime.substring(newTime.lastIndexOf(":")+1);
				$("#sysTime").text("系统时间：" + data.DATABASE_TIME);
				setTimeout("getSysCurTime("+newSeconds+")", 999);
			}
		});
	}else{
		var newSeconds = curSeconds+1;
		var oldTime = $("#sysTime").text();
		var idx=oldTime.lastIndexOf(":");
		var oldSec = oldTime.substring(0, idx+1);
		if( newSeconds < 10 ){
			$("#sysTime").text(oldSec +"0"+ newSeconds);
		}else{
			$("#sysTime").text(oldSec+newSeconds);
		}
		setTimeout("getSysCurTime("+newSeconds+")", 999);
	}
}

//------首页布局 ---------------start
var isChrome = navigator.userAgent.indexOf("Chrome") != -1;
var isIE     = navigator.appName.indexOf("Microsoft")!= -1 ;
var isIE8    = isIE && (navigator.appVersion.indexOf("MSIE 8.0")!=-1);
var isIE7    = isIE && (navigator.appVersion.indexOf("MSIE 7.0")!=-1);
var isIE6    = isIE && (navigator.appVersion.indexOf("MSIE 6.0")!=-1);
var logoHeight = 50;
var exceptContainerHeight=86;
var sidebarWidth = 580;
var sidebarHideWidth = 0;
var casUrl = null;
//logo是否显示
var logoShow = true;
//菜单是否显示
var leftBarShow = true;

function initWindowSize(){
    $("html body").css("min-width", '1000px'); // 不能小于标题栏背景图宽度, 避免上下宽度不一致. 同时避免窗口过小引起各种子页面布局问题.
	//$("#content").css("min-width", document.body.clientWidth-sidebarWidth);
	$("#container").css("height",document.body.clientHeight-exceptContainerHeight);
	$("#content").css("width",document.body.clientWidth-sidebarWidth-1);
	$("#sys-menu").css("height",document.body.clientHeight-exceptContainerHeight-40);
}
window.onresize = windowResize;


//启动时就加载加载动画
function windowResize(){
	if(logoShow){
		$("#container").css("height",document.body.clientHeight-exceptContainerHeight);
		$("#sys-menu").css("height",document.body.clientHeight-exceptContainerHeight-40);

	}else{
		$("#container").css("height",document.body.clientHeight+logoHeight-exceptContainerHeight);
		$("#sys-menu").css("height",document.body.clientHeight+logoHeight-exceptContainerHeight-40);
	}

	if(leftBarShow){
		$("#content").css("width",$("#container").width()-sidebarWidth-1);
    }else{
		$("#content").css("width",$("#container").width()-sidebarHideWidth-1);
    }

};



function handleReturnData(data){
	if( data == null ){
		data=localData;
	}
	$("#USERWELCOME").text("当前用户：" + data.userName);
	//加载菜单
	loadMenu();
}

//初始化菜单---------------start
//load菜单
var specialButtonInf = {"PUB_DOC_DOCMANAGE":""};
function loadMenu(){
	var specialPrvIds = "";
	if( specialButtonInf ){
		for( var prvId in specialButtonInf ){
			specialPrvIds = specialPrvIds +prvId+ ",";
		}
	}

	Request.processDataRequest({
		url:"/jrzl/pub/index/homeMenu.action",
		localStorage:homeMenu,
		customParams:{
	        "SPECIAL_MENU_ID" : specialPrvIds
		},
		errorRedirect:true,
		callbackFunc:handleReturnMenuData});
}

var homeMenuList = [];
function handleReturnMenuData(data){
	var homeMenuHtml="";
	if(null == data || undefined == data || null==data.homeMenuList ){
		JrzlTools.alert("用户菜单权限未配置，请联系管理员。","错误 ");
	}else{
		homeMenuList=data.homeMenuList;
		var curDomain = window.location.href;
		var domainIdx = curDomain.indexOf("/", 8);//跨过 http://或者https://的距离
		if( domainIdx > 0 ){
			curDomain = curDomain.substring(curDomain.indexOf("://")+3, domainIdx).toUpperCase();
		}else{
			curDomain = curDomain.substring(curDomain.indexOf("://")+3).toUpperCase();
		}
		if(data.specialMenuButton){
			//顶上的快捷按钮显示
			for(var mnuId in data.specialMenuButton ){
				if( specialButtonInf[mnuId] != null && data.specialMenuButton[mnuId] != '' ){
					$("#"+mnuId).show();
					specialButtonInf[mnuId] = data.specialMenuButton[mnuId];
				}
			}
		}
		$.each(homeMenuList, function(index,obj){
			//对于外部系统增加CAS跳转
			var url= obj.url;
			if( url.indexOf('?') >= 0 ){
				url = url+"&sysid="+obj.id
			}else{
				url = url+"?sysid="+obj.id
			}
			var tmpStr = obj.url.toUpperCase();
			if( tmpStr.indexOf('HTTP://')==0 || tmpStr.indexOf('HTTPS://')==0 ){
				var newsysIdx = tmpStr.indexOf("/", 8);//跨过 http://或者https://的距离
				if( newsysIdx > 0 ){
					tmpStr = tmpStr.substring(tmpStr.indexOf("://")+3, newsysIdx).toUpperCase();
				}else{
					tmpStr = tmpStr.substring(tmpStr.indexOf("://")+3).toUpperCase();
				}
				if( curDomain != tmpStr ){
					//跳转其它系统
					url= casUrl+'?_service=' + encodeURIComponent(url);
				}
			}
			homeMenuHtml += "<div class='sysimgdiv'><img src='"+obj.imgMeu+"' title='"+obj.text+
			"'  onclick=window.open('"+url+"','"+obj.text+"')  onmouseout=showMenuImgChg(this,'"+obj.imgMeu+"') " +
			"id='"+obj.id+"' onmouseover=showMenuImgChg(this,'"+obj.imgOvr+"') />" +
			"<div class='sysimgfont'>"+obj.text+"</div></div>";
		});
	}
	$("#sys-menu").html(homeMenuHtml);
	specialButtonInf["PUB_DOC_DOCMANAGE"] = "../../../jrzl/pub/doc/docmanage.html";

	//处理完初始化数据之后需要调用该方法去除页面加载进度条
	JrzlTools.distroyOnloadProgress();
}

//变更图片
function showMenuImgChg(obj,src){
	$(obj).attr("src",src);
}

//初始化菜单---------------end
function loadCollectMenu(data){
	JrzlTools.accordionMenu({id:'collect_menu',menuArrs:data,clickItemCallBack:itemclick,menuType:'3'});
}

//cas -------------------------------start
/**
 * 初始化cas,获取cas地址
 * @returns
 */
function initCasUrl() {
	Request.processDataRequest({
		url:"/jrzl/pub/index/getCasUrl.action",
		localStorage:localCasData,
		errorRedirect:true,
		callbackFunc:function(data) {
			casUrl = data.casUrl;
	}});
}

/**
 *  定时登录CAS
 * @return
 */
function casLogin() {
	Request.processDataRequest({url:casUrl,localStorage:localCasData,isDirectUrl:true,ajaxDataType:'html',errorRedirect:false,callbackFunc:function(data){}});
	setTimeout(casLogin,CAS_LOGIN_TIME);
}

/**
 * 退出按钮
 *
 */
function logout_onclick() {
	JrzlTools.confirm("确定要退出本系统?","提示",function(flag){
		if(flag){
			var portalUrl = "/cas";
			if(JrzlTools.isPaas()) {
				portalUrl = "/common/uic/default/portal.html";
			}
			if(casUrl == null) {
				initCasUrl();
			}
			doLogout(casUrl,portalUrl);

		}
	});
}

/**
 * 单点退出
 */
function doLogout(casUrl,portalUrl) {
	// 退出公共cas(如果存在)
	//logoutCas();
	// 退出系统cas
	logoutJrzlCas(casUrl,portalUrl);
}

/**
 * 退出公共cas(如果存在)
 * @returns
 */
function logoutCas() {
	var casUrl="/cas/logout";
	Request.processDataRequest({
		url:casUrl,
		localStorage:localCasData,
		ajaxType:'get',
		isDirectUrl:true,
		ajaxDataType:'html',
		errorRedirect:false,
		callbackFunc:null
	});
}
/**
 * 退出系统cas
 * @param casUrl
 * @returns
 */
function logoutJrzlCas(casUrl, portalUrl) {
	var casLogOutUrl = casUrl + 'logout';
	$.ajax({
        url: casLogOutUrl,
    	dataType:"jsonp",
        jsonp:"jsonpcallback"
    });
	logoutJcglWeb(portalUrl);
}
/**
 * 退出web session
 * @param portalUrl
 * @returns
 */
function logoutJcglWeb(portalUrl) {
	Request.processDataRequest({
		url:"/jrzl/pub/index/logout.action",
		localStorage:localCasData,
		errorRedirect:true,
		callbackFunc:function(data) {
			// 关闭窗口情况
			if(portalUrl == null){
				window.opener=null;
				window.open('','_self');
				window.close();
			}
			// 重定向
			else{
				window.location.href = portalUrl;
			}
		}
	});
}

/**
 * 特殊权限的快捷按钮图标
 */
function specialAccessButtonClick(obj){
	var eleId = obj.id;
	var tabName = obj.title;
	if( eleId && specialButtonInf[eleId] ){
		addMainTab(eleId, tabName, specialButtonInf[eleId], true);
	}
}

//cas -------------------------------end

//tabbar -------------------------------start
var tabbar;
function initTabbar(){
	tabbar = JrzlTools.dhtmlxTabbar();
	tabbar.addTab({id:"PUB_PORTAL_TODOTASK_MYTODOTASK",text:"默认处理任务",closable:false,refresh:true, size:130});
	tabbar.addTab({id:"PUB_PORTAL_TODOTASK_TODOTASK",text:"待领用任务",closable:false,refresh:true, size:130});
	tabbar.addTab({id:"PUB_PORTAL_TODOTASK_TOREADTASK",text:"待阅任务",closable:false,refresh:true});
	tabbar.addTab({id:"PUB_PORTAL_TODONOTICE_TODONOTICE",text:"通知",closable:false,refresh:true});
	tabbar.setContentHref("PUB_PORTAL_TODOTASK_MYTODOTASK", "../../../jrzl/pub/portal/todotask/mytodotask.html");
	tabbar.setContentHref("PUB_PORTAL_TODONOTICE_TODONOTICE", "../../../jrzl/pub/portal/todonotice/todonotice.html");
	tabbar.setContentHref("PUB_PORTAL_TODOTASK_TOREADTASK", "../../../jrzl/pub/portal/todotask/toreadtask.html");
	tabbar.setContentHref("PUB_PORTAL_TODOTASK_TODOTASK", "../../../jrzl/pub/portal/todotask/todotask.html");
	tabbar.setTabActive("PUB_PORTAL_TODOTASK_MYTODOTASK");
}



/**
 * 增加tab页
 * @param id 待打开Tab的pageId
 * @param text 标题
 * @param url 路径
 * @param otherSystem 是否为其他系统
 * @param curId 当前Tab页pageId
 * @return
 */
function addMainTab(id,text,url,otherSystem,curId,bizUid){
	id = $.trim(id);
	otherSystem = otherSystem = null ? false:otherSystem;
	var index =  tabbar.getIndex(curId); //当前Tab页的序号，从0开始

	// 可以重复打开页面 生成新的ID
	if(multi_page_id[id] != null){
		if(bizUid != null && bizUid != "") {
			id = id + "_" + bizUid;
		} else {
			id = id + "_" + JrzlTools.getUUID();
		}
	}
	// 获取待打开页序号
	var tmptab = tabbar.getIndex(id);
	// 等于-1，打开新Tab页
	if(tmptab == -1){
   	 	if(curId == null || index == -1){				//如果没有传入当前Tab页的pageId，表示使用默认方式打开
   	 		tabbar.addTab({id:id,text:text,closable:true,otherSystem:otherSystem});
   	 	}
   	 	else {            //传入pageId情况下，且不是待办和抄送两个页面，在当前Tab页的后面打开
   	 		tabbar.addTab({id:id,text:text,closable:true,otherSystem:otherSystem,position:(index+1),oriID:curId});
   	 	}
   	 	tabbar.setContentHref(id, url);
   	 	tabbar.setTabActive(id);
	}
	else{
		tabbar.setContentHref(id, url);
    	tabbar.setTabActive(id,true,text);
	}
}
/**
 * 关闭某个tab页
 * @param id
 * @return
 */
function closeMainTab(id){
	tabbar.removeTab(id,true);
}
/**
 * 激活tab页
 * @param id
 * @return
 */
function activeMainTab(id){
	var tmptab = tabbar.getIndex(id);
    if(tmptab!=-1) {
    	 tabbar.setTabActive(id);
     }
}
/**
 * 刷新tab页
 * @param id
 * @return
 */
function refreshMainTab(id){
	var tmptab = tabbar.getIndex(id);
    if(tmptab!=-1) {
    	 tabbar.setTabActive(id);
    	 tabbar.forceLoad(id);
     }
}

function executeMainTabFunc(id,func){
	var tabs = $("iframe[id^="+id+"_]");

	for(var i = 0,len = tabs.length; i < len; i++){
		var v_Obj = tabs[i].contentWindow;
		try{
			v_Obj["eval"].call(v_Obj, func+'("'+arguments[2]+'")');
		}
		catch(e){}
	}
}

function distroyTabProgress(id){
	tabbar.distroyProgressBar(id);
};

function adjustOuterSize(){
	tabbar.adjustOuterSize();
}
//tabbar -------------------------------end

/**
 * logo收起及显示
 */
var logoShow = true;
function logoToggle(obj){
	if(logoShow){
		$("#header").hide();
		$("#header").stop(true).animate({
			height:0
		},10);
		$("#container").stop(true).animate({
			height:document.body.clientHeight+logoHeight-exceptContainerHeight
		},10,adjustOuterSize);
		$(obj).removeClass("logo-up");
		$(obj).addClass("logo-down");
		logoShow = false;
	}else{

		$("#header").stop(true).animate({
			height:logoHeight
		},10,headShow);
		$("#container").stop(true).animate({
			height:document.body.clientHeight-exceptContainerHeight
		},10,adjustOuterSize);

		$(obj).removeClass("logo-down");
		$(obj).addClass("logo-up");
		logoShow = true;
	}

	if(isIE7 || isIE6 ){
		//do nothing
	}else{
		windowResize();
	}
}

function headShow(){
	$("#header").show();
}

/**
 * 菜单栏的收起及显示
 */
var leftBarShow = true;
function leftBarToggle(obj){
	if(leftBarShow){
		$("#sidecontrol").hide();
		$("#sidebar").stop(true).animate({
			opacity:'0.6',
			width:sidebarHideWidth
		},200);
		$("#content").stop(true).animate({
			opacity:'1',
			width:document.body.clientWidth-sidebarHideWidth-1
		},200,adjustOuterSize);
		$(obj).removeClass("left-bar-hide");
		$(obj).addClass("left-bar-show");
		leftBarShow = false;
	}else{
		$("#sidebar").stop(true).animate({
			opacity:'1',
			width:sidebarWidth
		},200,showSideBar);
		$("#content").stop(true).animate({
			opacity:'1',
			width:document.body.clientWidth-sidebarWidth-1
		},200,adjustOuterSize);
		$(obj).removeClass("left-bar-show");
		$(obj).addClass("left-bar-hide");
		leftBarShow = true;
	}
}

function showSideBar(){
	$("#sidecontrol").show();
}

/**
 * 首页
 */
function home_onclick(){
	var id = "PUB_PORTAL_TODOTASK_TODOTASK";
	 var tmptab = tabbar.getIndex(id);
     if(tmptab!=-1) {
    	 tabbar.setTabActive(id);
     } else {
    	 tabbar.addTab({id:id,text:"待办任务",closable:false,refresh:true});
    	 tabbar.setContentHref(id, "../../../jrzl/pub/portal/todotask/todotask.html");
		 tabbar.setTabActive(id);
     }
}


//通知页面
function  newTodoTasksTcs(){
	 window.parent.addMainTab("PUB_PORTAL_TODONOTICE_TODONOTICE","通知","../../../jrzl/pub/index/todonotice/todonotice.html");
}
//代办连接页面
function  newTodoTasksTdb(){
	window.parent.addMainTab("PUB_PORTAL_TODOTASK_TODOTASK","待办任务","../../../jrzl/pub/index/todotask/todotask.html");
}

var sysMenuJsonFromIndex = [];
var collectMenuDataFromIndex = [];

//本地数据对象，不需要走后台
//#localdata定义----------start
var localData = {};
var localCasData = {};
var menuData = null;
var searchMenuJson = null;
var homeMenu = null;
var myMenuJson = null;
var todoTaskJson=null;
if (typeof(sysMenuJson) == "undefined") {
	//global.js若未配置，则申明主页菜单配置变量，防止报错
	window.eval("var sysMenuJson = [];");
}
//#localdata定义----------end

//#localdata赋值---------start


searchMenuJson=[
              	  {
                   	 name: "客户管理系统",
                   	 id:'client-manage-system',
                   	 leaf:false,
                   	 children: [
                   	      {
                                     name:"客户查询",
                                     id:"PUB_CLTMANAGE_CLTQUERY_CLTQUERYTEST3",
                                     leaf:true,
                                     url:"../../../jrzl/pub/cltmanage/cltquery/cltqueryTest3.html"
                              },
                              {

                           	   name:"客户新增",
                                  id:"cltadd",
                                  url:"",
                                  leaf:false,
                                  children:[

   											{
   											    name:"客户新增带折叠",
   											    id:"cltaddwithaccordion",
   											    leaf:true,
   											    access:false,
   											    url:"../../../jrzl/pub/cltmanage/cltadd/cltadd带折叠.html"

   											},
   											{
   											    name:"客户新增普通",
   											    id:"cltaddnormal",
   											    leaf:true,
   											    url:"../../../jrzl/pub/cltmanage/cltadd/cltadd.html"

   											}

                                            ]

                              }
                              ,
                              {
                           	      name:"客户明细查看",
                           	      id:"cltdetailview",
                           	      leaf:true,
                           	      url:"../../../jrzl/pub/cltmanage/cltview/cltinfo.html"

                              },
                              {
                           	   name:"帮助文档管理",
                         	       id:"docmanage",
                         	       leaf:true,
                         	       url:"../quotainfomng.html"
                              }

                   	 ]

                   },
                   {
                   	"name": "立项申请系统",
                       "id" :"project-create-system",
                        leaf:false,
                        disable:true,
                        "children": [
                                     {
                                         "name": "立项申请",
                                         "id":"creat-prj",
                                         leaf:true,
                                         disable:true
                                     }
                                     ]
                   },
                   {
                      "name": "项目管理系统",
                      "id" :"project-manage-system",
                       leaf:false,
                       disable:true,
                      "children": [
                          {
                              "name": "项目管理",
                              "id":"prjmanage",
                              leaf:true,
                              disable:true
                          }
                      ]
                   },

                   {
                      "name": "执行管理系统",
                      "id" :"execute-manage-system",
                      leaf:false,
                      "children": [

                          {
                              "name": "待办管理",
                              "url": "page/taskManage/TaskManage.html",
                              "id":"taskmanage1",
                              leaf:false,
                              "children": [
              			               {
              			                "name": "待办xxxx执行",
              			                "url": "page/taskManage/TaskManage.html",
              			                leaf:true,
              			                "id":"taskmanage"
              			                }
              			           ]
                          },
                          {
                              "name": "待办管理2",
                              "url": "page/taskManage/TaskManage.html",
                              leaf:true,
                              "id":"taskmanage2"
                          },
                          {
                              "name": "待办管理3",
                              "url": "page/taskManage/TaskManage.html",
                              leaf:true,
                              "id":"taskmanage3"
                          }

                      ]
                   },

                   {
                      "name": "租后管理系统",
                      "id" :"rental-manage-system",
                      leaf:false,
                      "children": [

                          {
                              "name": "租后管理",
                              "url": "page/taskManage/TaskManage.html",
                              "id":"rentmange",
                              leaf:false,
                              "children": [
              			               {
              			                "name": "租后查看",
              			                "url": "page/taskManage/TaskManage.html",
              			                leaf:true,
              			                "id":"rentview"
              			                }
              			           ]
                          }
                      ]
                   },{
                  	 "name": "资产分类系统",
                    "id" :"fund-classify-system",
                    leaf:false,
                    disable:true,
                    "children": [
                                 {
                                     "name": "资产分类",
                                     "id":"fund-classify",
                                     leaf:true,
                                     disable:true
                                 }
                              ]
                },
                   {
                       "name": "风险预警系统",
                       "id" :"risk-warn-system",
                       leaf:false,
                       "children": [

                           {

               			                "name": "风险预警管理",
               			                "url": "page/taskManage/TaskManage.html",
               			                 leaf:true,
               			                "id":"riskwarnmanage"

                           }
                       ]
                    },
                    {
                   	 "name": "流程管理系统",
                        "id" :"workflow-manage-system",
                        leaf:false,
                        "children": [
                                    {
                                   	 "name": "流程管理",
            			                "url": "../../../jrzl/pub/workflow/processmanage/processquery.html",
            			                leaf:true,
            			                "id":"PUB_WORKFLOW_PROCESSMANAGE_PROCESSQUERY"
                                    },{
                                   	 "name": "流程明细",
            			                "url": "../../../jrzl/pub/workflow/processdetail/detail.html",
            			                leaf:true,
            			                "id":"PUB_WORKFLOW_PROCESSDETAIL_DETAIL"
                                    },{
                                   	 "name":"审批历史",
                                   	 "url":"../../../jrzl/pub/workflow/taskbaseinfo/taskapprovedetail.html",
                                   	 leaf:true,
                                   	 "id":"PUB_WORKFLOW_TASKBASEINFO_TASKAPPROVEDETAIL"
                                    },{
                                   	 "name":"审批历史图形化显示",
                                   	 "url":"../../../jrzl/pub/workflow/taskbaseinfo/taskstatusgraph.html",
                                   	 leaf:true,
                                   	 "id":"PUB_WORKFLOW_TASKBASEINFO_TASKSTATUSGRAPH"
                                    },
                                    {
                                   	 "name":"任务查询管理",
                                   	 "url":"../../../jrzl/pub/workflow/taskbaseinfo/taskquery.html",
                                   	 leaf:true,
                                   	 "id":"PUB_WORKFLOW_TASKBASEINFO_TASKQUERY"
                                    },
                                    {
                                   	 "name":"审批信息",
                                   	 "url":"../../../jrzl/pub/workflow/taskbaseinfo/taskmemosubmit.html",
                                   	 leaf:true,
                                   	 "id":"PUB_WORKFLOW_TASKBASEINFO_TASKMEMOSUBMIT"
                                    },
                                    {
                                   	 "name":"授权管理",
                                   	 "url":"../../../jrzl/pub/workflow/proxymanage/proxyquery.html",
                                   	 leaf:true,
                                   	 "id":"PUB_WORKFLOW_PROXYMANAGE_PROXYQUERY"
                                    }
                    ]
                    },{
                   	 "name": "基础管理",
                        "id" :"base-manage-system",
                        leaf:false,
                        disable:true,
                        "children": [
                                     {
                                         "name": "组件管理",
                                         "id":"cptmanage",
                                         leaf:true,
                                         disable:true
                                     }
                                  ]
                    },
                   {
                       "name": "系统管理",
                       "id" :"system-manage-system",
                       leaf:false,
                       "children": [
                           {
                               "name": "组件管理",
                               "id":"cptmanage",
                               leaf:false,
                               "children": [
               			            {
               			                "name": "组件管理",
               			                "url": "../../../jrzl/pub/sysmanage/cptmanage/cptquery/cptquery.html",
               			                leaf:true,
               			                "id":"PUB_JRZLCC_CPTMANAGE_CPTQUERY_CPTQUERY"
               			            }
                           		]
                           },
                           {
                               "name": "数据权限管理",
                               "id":"dataprvmanage",
                               "children": [
               			            {
               			                "name": "数据权限管理",
               			                "url": "../../../jrzl/pub/dataprv/dataprvquery.html",
               			                leaf:true,
               			                "id":"PUB_DATAPRV_DATAPRVQUERY"
               			            }
                           		]
                           },
                            {
                               "name": "页面配置管理",
                               "url": "../../../jrzl/pub/sysmanage/pagemanage/pagequery/pagequery.html",
                               leaf:true,
                               "id":"pagemanage"
                           },
                           {
                               "name": "模板参数管理",
                               "url": "../../../jrzl/pub/sysmanage/notice/tplparams/query/tplparamsqry.html",
                               leaf:true,
                               "id":"PUB_NOTICE_TPLPARAMS_QUERY_TPLPARAMSQRY"
                           } ,
                           {
                               "name": "通知账号管理",
                               "url": "../../../jrzl/pub/sysmanage/notice/accounts/query/noticeaccqry.html",
                               leaf:true,
                               "id":"PUB_NOTICE_ACCOUNTS_QUERY_NOTICEACCQRY"
                           },{
                               "name": "资源管理",
                               "url": "../../../jrzl/pub/sysmanage/resmanage/resquery/query.html",
                               leaf:true,
                               "id":"PUB_SYSMANAGE_RESMANAGE_RESQUERY_QUERY"
                           },
                           {
                                       "name": "通知模板管理",
                                       "id":"noticeinfo",
                                       leaf:false,
                                       "children": [
                       			            {
                       			                "name": "通知模板管理",
                       			                "url": "../../../jrzl/pub/sysmanage/notice/register/query/noticeregqry.html",
                       			                 leaf:true,
                       			                "id":"PUB_NOTICE_REGISTER_QUERY_NOTICEREGQRY"
                       			            },{
                                              	 "name": "到期提醒管理",
                                                   "url": "../../../jrzl/pub/sysmanage/notice/expireremind/query/expireremindqry.html",
                                                   leaf:true,
                                                   "id":"PUB_NOTICE_EXPIREREMIND_QUERY_EXPIREREMINDQRY"
                                               },{
                                              	 "name": "通知发送查询",
                                                   "url": "../../../jrzl/pub/sysmanage/notice/sendquery/query/noticesendqry.html",
                                                   leaf:true,
                                                   "id":"PUB_NOTICE_SENDQUERY_QUERY_NOTICESENDQRY"
                                               },{
                                              	 "name": "通知回复查询",
                                                   "url": "../../../jrzl/pub/sysmanage/notice/responsequery/query/noticerespqry.html",
                                                   leaf:true,
                                                   "id":"PUB_NOTICE_RESPONSEQUERY_QUERY_NOTICERESPQRY"
                                               },{
                                              	 "name": "通知查询",
                                                   "url": "../../../jrzl/pub/sysmanage/notice/sendquery/bizqry/noticebizqry.html",
                                                   leaf:true,
                                                   "id":"PUB_NOTICE_SENDQUERY_BIZQRY_NOTICEBIZQRY"
                                               }
                                   		]
                            }
                       ]
                    },
                    {
                   	 "name": "旧租赁系统",
                        "id" :"old-leasing-business-system",
                        leaf:false,
                        old:true,
                        "children": [
                                    {
                                   	 "name": "旧系统入口",
            			                "url": "../../../jrzl/pub/workflow/processquery/query.html",
            			                leaf:true,
            			                "id":"old-system-enter"
                                    }
                    ]
                    }

               ];

              myMenuJson = [ {
            		"children" : [ {


            						"name" : "通知模板管理",
            						"url" : "/jrzl2web/jrzl/pub/sysmanage/notice/register/noticeregqry.html",
            						"id" : "bcdfc2fe-c5f0-4d97-b2cd-aff5bf0ec4b4",
            						"menuId" : "PUB_SYSMANAGE_NOTICE_REGISTER_NOTICEREGQRY",
            						"leaf" : true,
            						"type":"leaf",
            						"text":"通知模板管理",
            						"disable" : false,
            						"old" : false
            					},
            					{
            						"name" : "模板参数管理",
            						"url" : "/jrzl2web/jrzl/pub/sysmanage/notice/tplparams/tplparamsqry.html",
            						"id" : "8850490a-773c-4b4a-96bf-bec9f2e4a65c",
            						"menuId" : "PUB_SYSMANAGE_NOTICE_TPLPARAMS_TPLPARAMSQRY",
            						"leaf" : true,
            						"type":"leaf",
            						"text":"模板参数管理",
            						"disable" : false,
            						"old" : false
            					},
            					{
            						"name" : "通知账号管理",
            						"url" : "/jrzl2web/jrzl/pub/sysmanage/notice/accounts/noticeaccqry.html",
            						"id" : "5f055ae2-824c-4a84-8df8-dfeb101fe1d4",
            						"menuId" : "PUB_SYSMANAGE_NOTICE_ACCOUNTS_NOTICEACCQRY",
            						"leaf" : true,
            						"type":"leaf",
            						"text":"通知账号管理",
            						"disable" : false,
            						"old" : false
            					},
            					{
            						"name" : "数据权限管理",
            						"url" : "/jrzl2web/jrzl/pub/dataprv/dataprvquery.html",
            						"id" : "a2f8b1d0-3cc9-4ac4-9358-5fb72038332c",
            						"menuId" : "PUB_DATAPRV_DATAPRVQUERY",
            						"leaf" : true,
            						"type":"leaf",
            						"text":"数据权限管理",
            						"disable" : false,
            						"old" : false
            					},
            					{
            						"name" : "资源管理",
            						"url" : "/jrzl2web/jrzl/pub/sysmanage/resmanage/resmanage.html",
            						"id" : "7816aba8-ebdb-4f52-8a95-ad49131764cd",
            						"menuId" : "PUB_SYSMANAGE_RESMANAGE_RESMANAGE",
            						"leaf" : true,
            						"type":"leaf",
            						"text":"资源管理",
            						"disable" : false,
            						"old" : false
            					},
            					{
            						"name" : "页面配置管理",
            						"url" : "/jrzl2web/jrzl/pub/sysmanage/pagemanage/pagequery.html",
            						"id" : "7adeabc1-84d6-4499-acd6-f8938c627b4f",
            						"menuId" : "PUB_SYSMANAGE_PAGEMANAGE_PAGEQUERY",
            						"leaf" : true,
            						"type":"leaf",
            						"text":"页面配置管理",
            						"disable" : false,
            						"old" : false
            					},
            					{
            						"name" : "到期提醒管理",
            						"url" : "/jrzl2web/jrzl/pub/sysmanage/notice/expireremind/expireremindqry.html",
            						"id" : "6ab3c57f-91ff-4894-aa5b-fe4ba65811dc",
            						"menuId" : "PUB_SYSMANAGE_NOTICE_EXPIREREMIND_EXPIREREMINDQRY",
            						"leaf" : true,
            						"type":"leaf",
            						"text":"到期提醒管理",
            						"disable" : false,
            						"old" : false
            					},
            					{
            						"name" : "通知发送查询",
            						"url" : "/jrzl2web/jrzl/pub/sysmanage/notice/sendquery/noticesendqry.html",
            						"id" : "570d6c8c-25f8-4e21-8039-89291ec43595",
            						"menuId" : "PUB_SYSMANAGE_NOTICE_SENDQUERY_NOTICESENDQRY",
            						"leaf" : true,
            						"type":"leaf",
            						"text":"通知发送查询",
            						"disable" : false,
            						"old" : false
            					},
            					{
            						"name" : "通知回复查询",
            						"url" : "/jrzl2web/jrzl/pub/sysmanage/notice/responsequery/noticerespqry.html",
            						"id" : "b4d84549-9eee-4d19-bcda-a3d7761cb08d",
            						"menuId" : "PUB_SYSMANAGE_NOTICE_RESPONSEQUERY_NOTICERESPQRY",
            						"leaf" : true,
            						"type":"leaf",
            						"text":"通知回复查询",
            						"disable" : false,
            						"old" : false
            					},
            					{
            						"name" : "组件管理",
            						"url" : "/jrzl2web/jrzl/pub/sysmanage/cptmanage/cptquery.html",
            						"id" : "70393790-b820-46f3-87cf-ae5aeeec9ed3",
            						"menuId" : "PUB_JRZLCC_CPTMANAGE_CPTQUERY",
            						"leaf" : true,
            						"type":"leaf",
            						"text":"组件管理",
            						"disable" : false,
            						"old" : false
            					},
            					{
            						"name" : "用户管理",
            						"url" : "/owk/owk/authority/userAction.do?_actionType=listUsers&_com_rb_owkStyle=S008&_com_rb_owkMenuSysID=jrzl",
            						"id" : "ac48044f-e878-4e2e-ba9c-1e2a39892c81",
            						"menuId" : "USER_MANAGER",
            						"leaf" : true,
            						"type":"leaf",
            						"text":"用户管理",
            						"disable" : false,
            						"old" : false
            					},
            					{
            						"name" : "角色管理",
            						"url" : "/owk/owk/authority/roleAction.do?_actionType=listRoles&_com_rb_owkMenuSysID=jrzl&_com_rb_owkStyle=Sjrzl",
            						"id" : "57929420-88bd-41bb-8ce2-94b692873392",
            						"menuId" : "ROLE_MNGER",
            						"leaf" : true,
            						"type":"leaf",
            						"text":"角色管理",
            						"disable" : false,
            						"old" : false
            					},
            					{
            						"name" : "定时任务",
            						"url" : "/owk/owk/authority/job/jobAction.do?_actionType=listJobs&_com_rb_owkMenuSysID=jrzl&_com_rb_owkStyle=Sjrzl",
            						"id" : "16a0d85d-08c4-4bd9-82d0-3a6afead6099",
            						"menuId" : "JOB",
            						"leaf" : true,
            						"type":"leaf",
            						"text":"定时任务",
            						"disable" : false,
            						"old" : false
            					},
            					{
            						"name" : "机构管理",
            						"url" : "/owk/owk/authority/orgAction.do?_actionType=showOrgFrame&_com_rb_owkMenuSysID=jrzl&_com_rb_owkStyle=Sjrzl",
            						"id" : "963eef19-9d81-4342-bd95-027d1ee46787",
            						"menuId" : "ORG_MNG",
            						"leaf" : true,
            						"type":"leaf",
            						"text":"机构管理",
            						"disable" : false,
            						"old" : false
            					},
            					{
            						"name" : "条目管理",
            						"url" : "/owk/owk/authority/dictEntryAction.do?_actionType=listDictEntrys&_com_rb_owkStyle=S008&_com_rb_owkMenuSysID=jrzl",
            						"id" : "c2a8d951-d832-4cac-a1bf-dc18832c0bb3",
            						"menuId" : "DICT_ITEM",
            						"leaf" : true,
            						"type":"leaf",
            						"text":"条目管理",
            						"disable" : false,
            						"old" : false
            					} ],
            			"name" : "系统管理",
            			"url" : "",
            			"id" : "07df5122-bc15-44c5-b425-eff1215dffb7",
            			"menuId" : "sysMng",
            			"leaf" : false,
            			"type":"default",
						"text":"系统管理",
            			"disable" : false,
            			"old" : false
            	} ];

              homeMenu=[
                            {
                          	  id:"gms",
                          	text:"GMS系统",
                          	  imgMeu:"images/gms-.png",
                          	  imgOvr:"images/gms.png",
                          	  url:"../../../common/uic/default/index.html"
                             },
                             {
                           	  id:"xmgl",
                           	text:"项目管理系统",
                           	  imgMeu:"images/xmgl-.png",
                           	  imgOvr:"images/xmgl.png",
                           	  url:"../../../common/uic/default/index.html"
                              },
                              {
                            	  id:"xyfx",
                            	  text:"信用风险管理系统",
                            	  imgMeu:"images/xyfx-.png",
                            	  imgOvr:"images/xyfx.png",
                            	  url:"../../../common/uic/default/index.html"
                               },
                               {
                             	  id:"gggl",
                             	 text:"公共管理系统",
                             	  imgMeu:"images/gggl-.png",
                             	  imgOvr:"images/gggl.png",
                             	  url:"../../../common/uic/default/index.html"
                                },
                                {
                              	  id:"scfx",
                              	text:"市场风险管理系统",
                              	  imgMeu:"images/scfx-.png",
                              	  imgOvr:"images/scfx.png",
                              	  url:"../../../common/uic/default/index.html"
                                 },
                                 {
                               	  id:"hggl",
                               	text:"合规管理系统",
                               	  imgMeu:"images/hggl-.png",
                               	  imgOvr:"images/hggl.png",
                               	  url:"../../../common/uic/default/index.html"
                                  },
                                  {
                                	  id:"czfx",
                                	  text:"操作风险管理系统",
                                	  imgMeu:"images/czfx-.png",
                                	  imgOvr:"images/czfx.png",
                                	  url:"../../../common/uic/default/index.html"
                                   },
                                   {
                                 	  id:"gzl",
                                 	 text:"工作流系统",
                                 	  imgMeu:"images/gzl-.png",
                                 	  imgOvr:"images/gzl.png",
                                 	  url:"../../../common/uic/default/index.html"
                                    },

                            ];

localData = {userName:"管理员",DATABASE_TIME:"2017-05-23 16:21:33"};
menuData = {sysMenuData:sysMenuJson,seachMenuData:searchMenuJson, collectMenuData:myMenuJson,homeMenu:homeMenu};
localCasData = {"casUrl":"http://127.0.0.1:8080/jrzl2cas/"};
todoTaskJson={"Tasks":{"TCS":9,"TDB":0},"allNum":9};

//#localdata赋值---------end