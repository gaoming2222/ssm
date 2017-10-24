var _isAjaxRequest = false;// 是否是远程请求
var SYS_REQUESTPAGEID = "PRJMNG_QUOTA_QUOTA";
var processInstId = ""; // 流程实例ID
var curNod = "";
var outTabId = null; // 外层tab选中标志id
var tab, tab1, tab2;
var MAIN_TAB_PAGEID = "";
var initData = null;
var isNew = "N";
windowHandler.onload = function() {
	// 流程实例ID
	processInstId = Request.getUrlParam("processInstId");
	MAIN_TAB_PAGEID = Request.getUrlParam("MAIN_TAB_PAGEID");
	curNod = Request.getUrlParam("curNod");
	if (Request.getUrlParam("isNew") != undefined
			&& Request.getUrlParam("isNew") != null
			&& Request.getUrlParam("isNew") != "") {
		isNew = Request.getUrlParam("isNew");
	}
	handleInitData();
	JrzlTools.distroyProgress(SYS_REQUESTPAGEID);
};

function handleInitData() {
	initData = {
		"MAIN_TAB_PAGEID" : SYS_REQUESTPAGEID,
		"isNew" : isNew,
		"processInstId" : processInstId,
		"curNod" : curNod
	}
	tab = JrzlTools.orcTab("tab", false);
	tab2 = JrzlTools.orcTab("tabs2", false);
	// 打开第一个Tab页
	$.when(openOuterTabAsync(tab, "#tab-1")).always(function() {
		openingTab = false;
	});
}

//调用iframe函数
function excuteIframeFunc(argsStr) {
	var a = (new Function("", "return " + argsStr))();
	var id = a.id;
	var func = a.func;
	var args = a.args;
	var ifms = $("iframe[id=" + id + "]");
	for (var i = 0, len = ifms.length; i < len; i++) {
		var v_Obj = ifms[i].contentWindow;
		try {
			v_Obj["eval"].call(v_Obj, func + '("' + args + '")');
		} catch (e) {
		}
	}
}

//main tab 关闭事件
var closeOperator = null;
function onTabClose() {
	JrzlTools.activeMainTab(SYS_REQUESTPAGEID);
	JrzlTools.confirm("是否确认关闭？", "提示", function(btn) {
		if (btn) {
			JrzlTools.executeMainTabFunc(MAIN_TAB_PAGEID, "query_onclick");
			JrzlTools.closeMainTab(SYS_REQUESTPAGEID);
		}
	});
}

function onSubTabClose() {
	JrzlTools.activeMainTab(SYS_REQUESTPAGEID);
	JrzlTools.executeMainTabFunc(MAIN_TAB_PAGEID, "query_onclick");
	JrzlTools.closeMainTab(SYS_REQUESTPAGEID);
}

/* 页面元素响应 */
//单击外层tab
$("#tab").children("ul").find("li").each(function(index, item) {
	$(item).bind('click', function() {
		if (openingTab) {
			return;
		}
		$.when(openOuterTabAsync(tab, $(this).attr('href'))).always(function() {
			openingTab = false;
		});
	});
});

//单击内层tab2
$("#tabs2").children("ul").find("li").each(
		function(index, item) {
			$(item).bind(
					'click',
					function() {
						if (openingTab) {
							return;
						}
						$.when(openInnerTabAsync(tab2, $(this).attr('href')))
								.always(function() {
									openingTab = false;
								});
					});
		});

// openOuterTab -> openInnerTab -> leaveFrame -> openTaskIframe -> tabObj.openTab -> enterFrame
/**
 * 打开外层tab页.
 * @tabObj tab对象
 * @selector 将打开的tab对应的jQuery选择器
 * @return promise
 */
function openOuterTabAsync(tabObj, selector) {
	openingTab = true;
	var dtd = $.Deferred();
	openTaskIframe(selector);
	tabObj.openTab(selector);
	outTabId = selector;
	dtd.resolve();
	if (tabObj && selector != outTabId) {
		dtd.reject();
	} else {
		dtd.resolve();
	}
	return dtd.promise();
};

// 载入Tab下的Iframe
function openTaskIframe(tabSelector) {
	switch (tabSelector) {
	case "#tab-1":
		opentaskIframe1();
		break;
	case "#tab-2":
		opentaskIframe2();
		break;
	case "#tab-3":
		//opentaskIframe3();
		break;
	default:
		break;
	}
}

function assembleParams() {
	return Request._assembleParameters(initData);
}

// 记录子页面加载完成状态, key: tabSelector, value: true
// 加载完成则不再设置src.
var iframeLoaded = {};
function doOpenTaskIframe(tabSelector, pageUrl, pageId) {
	if (!iframeLoaded[tabSelector]) {
		var iframe = $(tabSelector + " iframe");
		iframe.load(function() {
			iframeLoaded[tabSelector] = true;
			//console.log("iframe loaded."+tabSelector);
		});
		iframe.attr("id", pageId);
		iframe.attr("src", pageUrl + "?" + assembleParams());
	}
}

// 产品基本信息
function opentaskIframe1() {
	var src = "../../prjmng/quota/quotainfo.html";
	var pageid = "PRJMNG_QUOTA_QUOTAINFO";
	doOpenTaskIframe("#tab-1", src, pageid);
}
// 审批历史
function opentaskIframe2() {
	var src = "../../prjmng/quota/operatelog.html";
	var pageid = "PRJMNG_QUOTA_OPERATELOG";
	doOpenTaskIframe("#tab-2", src, pageid);
}
//流程图
function opentaskIframe3() {
	var src = "../../prjmng/todo/taskgraph.html";
	var pageid = "PRJMNG_TODO_TASKGRAPH";
	doOpenTaskIframe("#tab-3", src, pageid);
}

//../../../../../prjmng/todo/taskgraph.html";
//var pageid = "PRJMNG_TODO_TASKGRAPH";



function getPrjNam() {

}

function getOpenTabAfterIC() {
	return "#li-tab-1"; // 审批页面
}

// #localdata定义----------start
var localInitData = null;
var localData = null;
var localRespData = null;
// #localdata定义----------end

// #localdata赋值---------start

localRespData = {
	"ErrorNo" : "0"
};
//#localdata赋值---------end