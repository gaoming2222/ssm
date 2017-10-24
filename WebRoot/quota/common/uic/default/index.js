﻿﻿﻿//页面id
var SYS_REQUESTPAGEID = "INDEX";

var sysid;
var sysMenuJsonFromIndex = [];
var collectMenuDataFromIndex = [];
var sysListIndex = [];
//需要实现windowHanler.onload来获取初始化数据
windowHandler.onload = function (){
	//初始化布局size
	initWindowSize();
	initTabbar();
	sysid = Request.getUrlParam('sysid');
	Request.processDataRequest({
		url:"/jrzl/pub/index/index.action",
		localStorage:localData,
		errorRedirect:true,
		callbackFunc:handleReturnData});
	//加入从数据库调取的时间
	getSysCurTime();
};

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

function handleReturnData(data){
	$("#USERWELCOME").text("当前用户：" + data.userName);
	//加载菜单
	loadMenu();
	bindEnterSearch();
	//newTodoTasks();//登录页面检查是否需要处理的任务
}

//load菜单
var sysMenu;
var searchMenu;
var collectMenu;

function loadCollectMenu(data){
	collectMenu =  JrzlTools.accordionMenu({id:'collect_menu',menuArrs:data,clickItemCallBack:itemclick,menuType:'3'});
	bindContextMenu();
	collectMenuDataFromIndex = data;
	//处理完初始化数据之后需要调用该方法去除页面加载进度条
	JrzlTools.distroyOnloadProgress();
}
// 菜单绑定回车查询
function bindEnterSearch(){
	$(".menu-search-box").bind("keyup",function(event){
		if(event.keyCode == 13){
			menu_search_onclick();
        }
	});
}

//根据菜单判断快捷按钮的权限并更新URL
var specialButtonInf = {"PUB_DOC_DOCMANAGE":""};
function loadMenu(){
	var specialPrvIds = "";
	if( specialButtonInf ){
		for( var prvId in specialButtonInf ){
			specialPrvIds = specialPrvIds +prvId+ ",";
		}
	}
	Request.processDataRequest({url:"/jrzl/pub/index/indexMenu.action",
		localStorage:menuData,
		customParams:{
	        "SYSID" : sysid,
	        "SPECIAL_MENU_ID" : specialPrvIds
		},
		errorRedirect:true,
		callbackFunc:handleReturnMenuData});
}

function handleReturnMenuData(data){
	if(null == data || undefined == data){
		JrzlTools.alert("菜单初始化出错。","错误 ");
		return;
	}
	if(null != data.sysname && undefined != data.sysname){
		document.title=data.sysname;
		$("#headtitle").text("资产管理"+data.sysname);
	}else{
		document.title="资产管理系统";
		$("#headtitle").text(data.sysname);
	}
	if(null != data.sysMenuData && undefined != data.sysMenuData){
		sysMenuJsonFromIndex = data.sysMenuData;
	}
	if(null != data.collectMenuData && undefined != data.collectMenuData){
		collectMenuDataFromIndex = data.collectMenuData;
	}
	if(null != data.sysList && undefined != data.sysList){
		sysListIndex = data.sysList;
		initsysList(sysListIndex);
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

	sysMenu = JrzlTools.accordionMenu({id:'sys_menu',menuArrs:data.sysMenuData,clickItemCallBack:itemclick,menuType:'1'});
	searchMenu =  JrzlTools.accordionMenu({id:'search_menu',menuArrs:data.seachMenuData,clickItemCallBack:itemclick,menuType:'2'});
	collectMenu =  JrzlTools.accordionMenu({id:'collect_menu',menuArrs:data.collectMenuData,clickItemCallBack:itemclick,menuType:'3'});

	$.getScript("../../plugins/jsTree-3.0.8/jstree.js",function(){
    	$.getScript("jrzlfavoritetree.js",null);
    });

	bindContextMenu();
	//处理完初始化数据之后需要调用该方法去除页面加载进度条
	JrzlTools.distroyOnloadProgress();
}

//初始化系统切换菜单
function initsysList(data){
	var homeMenuHtml="";
	$.each(data,function(index,obj){
		var url=obj.url+"?sysid="+obj.id;
		homeMenuHtml += "<div class='syschglist' onclick=window.open('"+url+"','"+obj.text+"') >" +
		"<img class='syslistimg' src='"+obj.imgMeu+"' />" +
				"<span class='syschg-text syschg-border-bottom'>"+obj.text+"</span></div>";

	});
	$("#showMenu").html(homeMenuHtml);
}


function adjustOuterSize(){
	tabbar.adjustOuterSize();
}

//------首页布局 ---------------start
var isChrome = navigator.userAgent.indexOf("Chrome") != -1;
var isIE     = navigator.appName.indexOf("Microsoft")!= -1 ;
var isIE7    = isIE && (navigator.appVersion.indexOf("MSIE 7.0")!=-1);
var isIE6    = isIE && (navigator.appVersion.indexOf("MSIE 6.0")!=-1);
var logoHeight = 50;
var exceptContainerHeight=86;
var sidebarWidth = 220;
var sidebarHideWidth = 0;

function initWindowSize(){
    $("html body").css("min-width", '1000px'); // 不能小于标题栏背景图宽度, 避免上下宽度不一致. 同时避免窗口过小引起各种子页面布局问题.
	//$("#content").css("min-width", document.body.clientWidth-sidebarWidth);
	$("#container").css("height",document.body.clientHeight-exceptContainerHeight);
	$("#content").css("width",document.body.clientWidth-sidebarWidth-1);
	$("div.wrap-menu").css("height",document.body.clientHeight-exceptContainerHeight-40);
	$("#sys_menu").css("height",document.body.clientHeight-exceptContainerHeight-40);
	$("#search_menu").css("height",document.body.clientHeight-exceptContainerHeight-40);
	$("#collect_menu").css("height",document.body.clientHeight-exceptContainerHeight-40);
}
window.onresize = windowResize;


//启动时就加载加载动画
function windowResize(){
	if(logoShow){
		$("#container").css("height",document.body.clientHeight-exceptContainerHeight);
		$("div.wrap-menu").css("height",document.body.clientHeight-exceptContainerHeight-40);
		$("#sys_menu").css("height",document.body.clientHeight-exceptContainerHeight-40);
		$("#search_menu").css("height",document.body.clientHeight-exceptContainerHeight-40-60);
		$("#collect_menu").css("height",document.body.clientHeight-exceptContainerHeight-40-60);
	}else{
		$("#container").css("height",document.body.clientHeight+logoHeight-exceptContainerHeight);
		$("div.wrap-menu").css("height",document.body.clientHeight+logoHeight-exceptContainerHeight-40);
		$("#sys_menu").css("height",document.body.clientHeight+logoHeight-exceptContainerHeight-40);
		$("#search_menu").css("height",document.body.clientHeight+logoHeight-exceptContainerHeight-40);
		$("#collect_menu").css("height",document.body.clientHeight+logoHeight-exceptContainerHeight-40);
	}

	if(leftBarShow){
		$("#content").css("width",document.body.clientWidth-sidebarWidth-1);
    }else{
		$("#content").css("width",document.body.clientWidth-sidebarHideWidth-1);
    }

};

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

//-------------首页布局---------------end


//-------------工具按钮操作区------start


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

/**
 * 具体退出功能
 * @param type
 * @returns
 */
function logout(type) {
	JrzlTools.confirm("确定要退出本系统?","提示",function(flag){
		if(flag){
			window.close();
		}
	});
}

//-------------工具按钮操作区------end

//-------------sidebar 工具按钮操作区------start

function menu_search_btn_onclick(){
	$("#sysmenu").hide();
	$("#collectmenu").hide();
	$("#searchmenu").show();
}

function menu_collect_btn_onclick(){
	$("#sysmenu").hide();
	$("#searchmenu").hide();
	$("#collectmenu").show();
}

function return_sys_onclick(){
	$("#searchmenu").hide();
	$("#collectmenu").hide();
	$("#sysmenu").show();
}

function menu_search_onclick(){
	var seachText = $("#menu_search_text").val();
	searchMenu.searchMenu(seachText);
}

/**
 * 系统切换
 */
function syschg_onclick(){
	var st;
	$("#showDiv").slideDown(500);

	var hideDiv = function(){
		$("#showDiv").slideUp(500);
	};
	var offtop = $("#syschg").offset().top * 1;
	var heightStr = $("#syschg").css("height");
	var pattern = /(\d+)(px)/;
	var height = heightStr.replace(pattern, '$1') * 1;
	offtop += height;
	$("#showDiv").css("top", offtop);
	$("#showMenu").hover(
		function() {
			clearTimeout(st);
		},
		function() {
			st = setTimeout(hideDiv, 500);
		}
	);
	$(".syschg-img").hover(
			function() {
				clearTimeout(st);
			},
			function() {
				st = setTimeout(hideDiv, 500);
			}
		);
}
//-------------sidebar 工具按钮按钮区----------end


//初始化布局及左边bar动画 ---------------end

//tabbar -------------------------------start
var tabbar;
function initTabbar(){
	tabbar = JrzlTools.dhtmlxTabbar();
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
//tabbar -------------------------------end

//treeMenu------------------------------start

function itemclick(node){
	if(node.disable == true || node.access == false){
		return;
	}
	var urlPath =  "";
    if((node.url!=null)&&(node.url!='')&&(node.url!='undefined')){
          urlPath=node.url;
          var otherSystem = false;
          if(urlPath.indexOf("/jrzl/") == -1){
        	  otherSystem = true;
          }
	      if(node.leaf){
	    	    var id = node.id;
	    	    if(node.menuId!=null&&node.menuId.length>0){
	    	        id = node.menuId;
	    	    }

	    	    // 可以重复打开页面 生成新的ID
	    		if(multi_page_id[id] != null){
	    			id = id + "_" + JrzlTools.getUUID();
	    		}
	            var tmptab = tabbar.getIndex(id);

			    if(tmptab!=-1) {
			    	 tabbar.setTabActive(id);
			     } else {
			    	 tabbar.addTab({id:id,text:node.name,closable:true,icon:"mail",otherSystem:otherSystem});
					 tabbar.setContentHref(id, urlPath);
					 tabbar.setTabActive(id);
	             }
	       }
   }
}

//treeMenu------------------------------end

/*
 *   index 新任务提醒div  ----------  start
 */
function newTodoTasks(){
	 Request.processDataRequest({
		 url:"/jrzl/pub/index/getNewTodoTasks.action",
		 localStorage:todoTaskJson,
		 errorRedirect:false,
		 callbackFunc:handleReturnData1
	 });
}

function handleReturnData1(data){
   var tasks=data.Tasks;
   var allNum=data.allNum;
   var tradeTasksHtml=null;
	if(tasks.TCS>0||tasks.TDB>0){
		tipHtml = "您有新到 "+ allNum +" 项任务";
		$("#winpop .tip").html(tipHtml);
		$("#winpop .todo-num").text(tasks.TDB);
		$("#winpop .cc-num").text(tasks.TCS);
		// 显示弹出窗
		enetgetMsg();
		// 标签闪动
		flashTitle(allNum);
	}
	else{
		setTimeout("newTodoTasks()",60000); //没有新的任务，60秒重新请求任务数据
    }
}

function enetgetMsg(){
   $("#winpop").slideToggle(2000); //以2000s的速度滑出弹出消息窗
   setTimeout("enetcloseDiv()",30000); //30s后关闭弹出窗
}

/*
 * 关闭div 任务提示窗口
 */
function enetcloseDiv(){
	$("#winpop").slideToggle(2000); //以2000s速度隐藏弹出窗
	//setTimeout("newTodoTasks()",60000);//隐藏后，60秒重新请求任务数据
}

//[{TOC=1084, TOO=0}]
//抄送连接页面
function  newTodoTasksTcs(){
	 window.parent.addMainTab("PUB_INDEX_TODONOTICE_TODONOTICE","抄送任务","../../../jrzl/pub/index/todonotice/todonotice.html");
}
//代办连接页面
function  newTodoTasksTdb(){
//	window.parent.addMainTab("PRJMNG_TODO_TODOTASK","待办任务","../../../jrzl/prjmng/todo/todotask.html");
}

var hasflashtitle = false;
function flashTitle(count, times) {
    if (hasflashtitle) return;
    hasflashtitle = true;
    var oldtitle = document.title;
    var i = 0, times = times || 48;
    var tip = "您有新到" + count + "项任务";
    var tc = function() {
        try {
            i++;
            var c = i % 2;
            if (c == 0) {
                document.title = "★★" + tip + "★★";
            }
            else {
                document.title = "☆☆" + tip + "☆☆";
            }
            if (i < times * 2) {
                setTimeout(tc, 200);
            }
            else {
                document.title = oldtitle;
                hasflashtitle = false;
            }
        }
        catch (e) {
            document.title = oldtitle;
            hasflashtitle = false;
        }
    };
    setTimeout(tc, 200);
}


//-------------添加及移除收藏夹菜单----------start
function bindContextMenu(){
	$("li[sys_menu='true']").contextMenu('sysContextMenu', {
        bindings: {
        	'addToCollectMenu': function(menu) {
        		openFavoriteWin('right',menu.id);
        		bindContextMenu();
        	}
        }
	});

	$("li[search_menu='true']").contextMenu('sysContextMenu', {
        bindings: {
          'addToCollectMenu': function(menu) {
        	  openFavoriteWin('right',menu.id);
        	  bindContextMenu();
          }
        }
	});

	$("li[collect_menu='true']").contextMenu('collectContextMenu', {
        bindings: {
          'removeFromCollectMenu': function(node) {
        	  openFavoriteWin('left',node.id);
          }
        }
     });
}
//-------------添加及移除收藏夹菜单----------end



//本地数据对象，不需要走后台
//#localdata定义----------start
var localData = {};
var menuData = null;
if (typeof(sysMenuJson) == "undefined") {
	window.eval("var sysMenuJson = [];");//global.js若未配置，则申明主页菜单配置变量，防止报错
}
//#localdata定义----------end

//#localdata赋值---------start


var searchMenuJson=[
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
                         	       url:"../../../jrzl/pub/doc/docmanage.html"
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

              var myMenuJson =[ {
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

              var sysList=[
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


localData = {userName:"管理员"};
menuData = {sysMenuData:sysMenuJson,seachMenuData:searchMenuJson, collectMenuData:myMenuJson,sysList:sysList,sysname:"项目管理系统"};
//#localdata赋值---------start

//#localdata----------end


//localData1  is new Task --------------start

var todoTaskJson=null;


todoTaskJson={"Tasks":{"TCS":0,"TDB":12},"allNum":12};

//localData1  --------------end


