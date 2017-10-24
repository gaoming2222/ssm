var dataSource = "";
var selectData = [];

function UserItemsPicker(options) {
    this.config = {
        dataSource          : null,                          //数据源
        confirmCallBack     : null,                           //保存回调函数
        title               : "",
        head				: "",
        lastItems           : []
    };

    var uuid = JrzlTools.getUUID();

    this.config = $.extend(this.config,options || {});

    dataSource = this.config.dataSource;

    if(this.config.dataSource==null){
    	JrzlTools.alert('请为UserItemsPicker添加数据源。',"提示", null);
    	return;
    }
    if(this.config.confirmCallBack==null){
    	JrzlTools.alert('请为UserItemsPicker添加确定回调函数。','提示', null);
    	return;
    }

    this.config.dataSource = JrzlTools.cloneObject(this.config.dataSource);

    this.config.id = 'user-items-pick-maindiv-'+uuid;

    this.config.searchId 		= 'search-id-' + uuid;
    this.config.treeId 			= 'tree-id-' + uuid;
    this.config.queryId 		= 'query-id-' + uuid;
    this.config.searchBtnId     = 'search-btn-id' + uuid;
    this.config.searchTextId    = 'search-text-id' + uuid;
    this.config.resultId 		= 'result-id-' + uuid;
    this.config.operateId 		= 'operate-id-' + uuid;
    this.config.addAllBtnId 	= 'add-all-btn-id-' + uuid;
    this.config.removeAllBtnId 	= 'remove-all-btn-id-' + uuid;

    this.config.assignId 		= 'assign-id-' + uuid;
    this.config.choseId 		= 'chose-id-' + uuid;
    this.config.clearId 		= 'clear-id-' + uuid;

    this.config.buttonId 		= 'button-id-' + uuid;
    this.config.confirmBtnId 	= 'confirm-btn-id-' + uuid;
    this.config.closeBtnId 		= 'close-btn-id-' + uuid;

    this.config.uuid = uuid;
    this.config.win = null;
    this.config.tree = null;
    this.config.store = null;

    this.init();
 }

function getUserInBranch(branch, liDatas){
	for(var i = 0; i < branch.length; i++) {
    	if("leaf" == branch[i].type){
    		liDatas.push(branch[i]);
    	}else if( branch[i].children ){
    		getUserInBranch(branch[i].children, liDatas);
    	}
	}
}
function getUserTreeNodeById(branch, nodeId){
	if( branch ){
		for(var i = 0; i < branch.length; i++) {
        	if(nodeId == parseInt(branch[i].id, 10)) {
    			return branch[i];
    		}else if(branch[i].children){
    			var resultNod = getUserTreeNodeById(branch[i].children, parseInt(nodeId, 10));
    			if( resultNod ){
        			return resultNod;
    			}
    		}
		}
	}
}
function doUsrSearch(searchNode, searchResult, search_text, matcher){
	for(var i = 0; i < searchNode.length; i++) {
		if( "leaf" == searchNode[i].type ){
			if(searchNode[i].cmbId === search_text) {
				//cmbId查询是唯一性查询
				searchResult.push(searchNode[i]);
				return ;
			}else{
				flag = matcher.test(searchNode[i].text);
    			if(!flag) {
    				pinyinList = pinyinMakePy(searchNode[i].text);
    		        for(k = 0; k < pinyinList.length; k++) {
    		        	  flag = matcher.test(pinyinList[k]);
    		        	  if(flag) {
    		        		  break;
    		        	  }
    		        }
    			}
    			if(flag){
    				searchResult.push(searchNode[i]);
    			}
			}
		}else if(searchNode[i].children){
			doUsrSearch(searchNode[i].children, searchResult, search_text, matcher);
		}
	}
}

UserItemsPicker.prototype = {
    constructor: UserItemsPicker,
    init: function(options){
        var self = this,
            _config = self.config,
            _cache = self.cache;

            self._renderUI();
            // 绑定事件
            self._bindEnv();
    },
    _renderUI:function(){
    	var self = this,
        _config = self.config;

    	var html = '<div id="'+ _config.id +'" class="user-items-pick">'+
    					// 顶部选择区
    					'<div id="'+ _config.searchId +'" class="search-area">' +
    						'<div class="left-area">' +
		    					'<div class="tree-area">' +
									'<div id="'+ _config.treeId +'"></div>'+
		    					'</div>'+
		    					'<div id="'+ _config.queryId +'" class="query-area">' +
									'<input type="text" id="'+ _config.searchTextId +'">'+
									'<input type="button" id="'+ _config.searchBtnId +'" value="查询">'+
		    					'</div>'+
	    					'</div>'+
	    					'<div class="right-area">' +
		    					'<div id="'+ _config.resultId +'" class="result-area">' +

		    					'</div>'+
		    					'<div id="'+ _config.operateId +'" class="operate-area">' +
			    					'<input type="button" id="'+ _config.addAllBtnId +'" class="add-button" value="全部添加">'+
									'<input type="button" id="'+ _config.removeAllBtnId +'" class="cancel-button" value="取消添加">'+
		    					'</div>'+
	    					'</div>'+
    					'</div>'+
    					// 指派区域
    					'<div id="'+ _config.assignId +'" class="assign-area">'+
    						'<div class="head-area">'+
    							'<div calss="head-span">'+ _config.head  +'</div>'+
    						'</div>'+
    						'<div id="'+ _config.choseId +'" class="chose-area">'+

    						'</div>'+
    						'<div id="'+ _config.clearId +'" class="clear-area">'+
    						'</div>'+
    					'</div>'+
    					 // 底部按钮区
    					 '<div id="'+ _config.buttonId +'" class="bottom-button-area">' +
	    				 	'<input type="button" id="'+_config.confirmBtnId+'" value="确定" />'+
	                        '<input type="button" id="'+_config.closeBtnId+'" value="关闭" />'+
    					 '</div>'+
    				  '</div>';


    	var mainObj = $(html);

    	$(document.body).append(mainObj);
    	//创建树
  	    self._createTree();

  	    _config.win = JrzlTools.openModalWindow({
  	    	id:_config.id,
  	    	title:_config.title,
  	    	height: 'auto',						  //高度
		    width: 548,
		    beforeClose:function(){
		    	self._distroyTree();
		    	$("#"+_config.id).remove();
		    }
  	    });

  	    //记忆上次选择
  	    /*
		var lastNodes = [];
		for(var i = 0,len=_config.lastItems.length;i<len;i++){
			var node = {original:{}};
			node.id = _config.lastItems[i].sysId;
			node.original.bizId = _config.lastItems[i].id;
			node.original.text = _config.lastItems[i].text;
			lastNodes.push(node);
		}
		self._addToQueryResultPanel(lastNodes, _config.selectResultId);
  	    */
  	    selectData = [];
  	    if(_config.lastItems.length > 0) {
  	    	var len = _config.lastItems.length;

    		for ( var i = 0; i < len; i++) {
    			self._refreshAssignResult("add", _config.lastItems[i].itemId, _config.lastItems[i].text, _config.lastItems[i].cmbId, _config.lastItems[i].id);
    		}

  	    	self._addToAssignPanel();
  	    }


    },
    _removeLeaf:function(rmvChildren){
    	if( rmvChildren ) {
    		for(var i = 0; i < rmvChildren.length; i++){
    			if("leaf" == rmvChildren[i].type) {
					delete rmvChildren[i];
				} else if( rmvChildren[i].children ) {
					this._removeLeaf(rmvChildren[i].children);
				}
    		}
    	}
    },
    _createTree:function(){
    	var self = this,
        _config = self.config;

    	var tmpChildren = _config.dataSource.children;
    	self._removeLeaf(tmpChildren);


    	_config.tree = $('#'+_config.treeId).jstree({
    		'core' : {
    			'data' : _config.dataSource,
    			"multiple" : true,
    			"animation" : 150,
    			"themes" : {
    				"name":"default",
    				dots:false
    			}
    		},
    		"types" : {
    			"#" : {
    				"valid_children" : ["root"]
    			},
    			"root" : {
    				"valid_children" : ["default","leaf"]
    			},
    			"default" : {
    				"valid_children" : ["default","leaf"]
    			},
    			"leaf" : {
    				"icon" : "jstree-file",
    				"valid_children" : []
    			}
    		},
    			"plugins" : [ "types"]
    	});

    	//单击树型控件
    	_config.tree.on("activate_node.jstree", function (e,data) {
    		var leafItems = [];
    		var id = data.node.id;
    		var node = getUserTreeNodeById(dataSource.children, parseInt(id, 10));
    		$("#"+_config.resultId).empty();
    		if(node) {
    			leafItems = node.children;
    			self._addToQueryResultPanel(leafItems,_config.resultId);
    		}
		});

    },

    //将数据添加到右侧区域
    _addToQueryResultPanel:function(items,panel){
    	var li = "", i = 0, j = 0, self = this;
    	var liData = [];

    	var leafNodesTmp=[];
    	getUserInBranch(items, leafNodesTmp);
    	var leafNodes=[];
    	for(var i = 0; i < leafNodesTmp.length; i++) {
    		var existed = false;
        	for(var j = 0; j < leafNodes.length; j++) {
        		if( leafNodes[j].bizId == leafNodesTmp[i].bizId ){
        			existed = true;
        			break;
        		}
        	}
        	if( existed ){
        		continue;
        	}
    		//去除重复的用户
        	leafNodes.push(leafNodesTmp[i]);
    	}
    	for(var i = 0; i < leafNodes.length; i++) {
    		liData.push(leafNodes[i]);
    		li += "<div id='query_" + leafNodes[i].id + "' bizId='"+ leafNodes[i].bizId +"' itemText='"+ leafNodes[i].text +"' itemId='"+ leafNodes[i].id +"' cmbId='"+ leafNodes[i].cmbId +"' class='tree-items-pick-query-result-li'>"
			+"<span class='tree-items-pick-item-icon'></span>"
			+ leafNodes[i].text + "</div>";
		}

    	$("#"+panel).append(li);

//    	for(i = 0; i < items.length; i++) {
//    		for(j = 0; j < selectData.length; j++) {
//    			if(parseInt(items[i].id, 10) === parseInt(selectData[j][0], 10)) {
//    				$("#query_" + items[i].id).css("background-color","#DFFFDF");
//        			$("#query_" + items[i].id).attr("checked","checked");
//        			$("<span class='tree-items-pick-select-icon'></span>").appendTo($("#query_" + items[i].id));
//    			}
//    		}
//    	}

    	for(i = 0; i < liData.length; i++) {
    		for(j = 0; j < selectData.length; j++) {
				if( liData[i].bizId === selectData[j][3] ) {
					$("#query_" + liData[i].id).css("background-color","#DFFFDF");
	    			$("#query_" + liData[i].id).attr("checked","checked");
	    			$("<span class='tree-items-pick-select-icon'></span>").appendTo($("#query_" + liData[i].id));
				}
    		}
    	}

    	//点击需要提交的用户名
    	$(".result-area").find("div").click(function(){
			var liObj;
			if($(this).hasClass("tree-items-pick-query-result-li")){
				liObj = this;
			}else if($(this).hasClass("tree-items-pick-item-icon")){
				liObj = $(this).next("li");
			}

			if($(liObj).attr("checked")=="checked"){
    			$(liObj).css("background-color","");
    			$(liObj).removeAttr("checked");
    			$(liObj).children("span:eq(1)").remove();
    			self._refreshAssignResult("remove", $(liObj).attr("itemId"), $(liObj).attr("itemText"), $(liObj).attr("cmbId"), $(liObj).attr("bizId"));
    		}else{
    			$(liObj).css("background-color","#DFFFDF");
    			$(liObj).attr("checked","checked");
    			$("<span class='tree-items-pick-select-icon'></span>").appendTo($(liObj));
    			self._refreshAssignResult("add", $(liObj).attr("itemId"), $(liObj).attr("itemText"), $(liObj).attr("cmbId"), $(liObj).attr("bizId"));
    		}
			self._addToAssignPanel();
		});


    },
    //将需要提交的用户显示在提交框内
    _addToAssignPanel:function() {
    	var i = 0, assignStr = "", self = this;
    	$("#"+this.config.choseId).empty();
    	for(i = 0; i < selectData.length - 1; i++) {
    		assignStr += "<div class='tree-items-pick-div'>"+ selectData[i][1] +"<span id='assign_" + selectData[i][0] + "' itemText='"+ selectData[i][1] +"' itemId='"+ selectData[i][0] +"' cmbId='"+ selectData[i][2] +"' bizId='"+ selectData[i][3] +"' class='tree-items-pick-delete-icon'></span>";
    		assignStr += "；</div>";
		}

    	if(selectData.length > 0) {
    		assignStr += "<div class='tree-items-pick-div'>"+ selectData[selectData.length - 1][1] +"<span id='assign_" + selectData[selectData.length - 1][0] + "' itemText='"+ selectData[selectData.length - 1][1] +"' itemId='"+ selectData[selectData.length - 1][0] +"' cmbId='"+ selectData[selectData.length - 1][2] +"' bizId='"+ selectData[selectData.length - 1][3] +"' class='tree-items-pick-delete-icon'></span></div>";
    	}

    	$("#"+ this.config.choseId).append(assignStr);

    	//点击“X”删除提交用户
    	$(".tree-items-pick-delete-icon").click(function(){
    		var deleteObj;

    		deleteObj = this;

    		self._refreshAssignResult("remove", $(deleteObj).attr("itemId"), $(deleteObj).attr("itemText"), $(deleteObj).attr("cmbId"), $(deleteObj).attr("bizId"));

			self._addToAssignPanel();
			self._refreshQueryResultPanel($(deleteObj).attr("itemId"));
		});
    },

    //更新提交人列表
    _refreshAssignResult:function(type, itemId, text, cmbId, bizId) {
    	if("remove" === type) {
    		for(i = 0; i < selectData.length; i++) {
    			if( bizId === selectData[i][3] ) {
    				selectData.splice(i, 1);
    			}
    		}
    	} else {
    		selectData.push(new Array(itemId, text, cmbId, bizId));
    	}
    },

    //更新右侧列表选择情况
    _refreshQueryResultPanel:function(id) {

    	if($("#query_" + id)) {
    		$("#query_" + id).css("background-color","");
    		$("#query_" + id).removeAttr("checked");
    		$("#query_" + id).children("span:eq(1)").remove();
    	}
    },

    _bindEnv:function(){
    	var self = this,
    	_config = self.config;

    	//查询按钮
    	$("#"+_config.searchBtnId).bind('click',function(){
    		var search_text = $.trim($("#"+_config.searchTextId).val());

    		if(search_text == ""){
    			JrzlTools.alert("请先输入查询条件!", "提示");
    			return;
    		}
    		//$("#"+_config.resultId).empty();
    		self._search(search_text);
    	});
    	//回车查询
    	$("#"+_config.searchTextId).bind("keyup",function(event){
    		if(event.keyCode == 13){
    			$("#"+_config.searchBtnId).click();
            }
    	});

    	JrzlTools.popup({
			id			:	_config.searchTextId,
		    text		:	"支持一事通ID、姓名、拼音首字母查询",
		    showType	:   "focus",
		    align		:	"top left"
    	});

    	/*$("#"+_config.searchTextId).bind("focus",function(){
    		  if ($(this).hasClass("TextWater")) {
    		        $(this).removeClass("TextWater");
    		        $(this).val("");
    		    }
    	});
    	$("#"+_config.searchTextId).bind("blur",function(){
    		  if ($.trim($(this).val()) == "") {
    			  $(this).addClass("TextWater");
    			  $(this).val("一事通id/姓名/拼音");
    		    }
    	});*/

    	//全部添加
    	$("#"+_config.addAllBtnId).bind('click',function(){
    		var i = 0, length = 0, liObj;

    		length = $(".result-area").find(".tree-items-pick-query-result-li").length;

    		for(i = 0; i < length; i++) {
    			liObj = $(".result-area").find(".tree-items-pick-query-result-li").eq(i);

    			if($(liObj).attr("checked") === "checked") {
    				continue;
    			} else {
    				$(liObj).css("background-color","#DFFFDF");
        			$(liObj).attr("checked","checked");
        			$("<span class='tree-items-pick-select-icon'></span>").appendTo($(liObj));
        			self._refreshAssignResult("add", $(liObj).attr("itemId"), $(liObj).attr("itemText"), $(liObj).attr("cmbId"), $(liObj).attr("bizId"));
    			}
    		}

    		self._addToAssignPanel();
    	});
    	//取消添加
    	$("#"+_config.removeAllBtnId).bind('click',function(){
    		var i = 0, length = 0, liObj;

    		length = $(".result-area").find(".tree-items-pick-query-result-li").length;

    		for(i = 0; i < length; i++) {
    			liObj = $(".result-area").find(".tree-items-pick-query-result-li").eq(i);

    			if($(liObj).attr("checked") === "checked") {
    				$(liObj).css("background-color","");
        			$(liObj).removeAttr("checked");
        			$(liObj).children("span:eq(1)").remove();
        			self._refreshAssignResult("remove", $(liObj).attr("itemId"), $(liObj).attr("itemText"), $(liObj).attr("cmbId"), $(liObj).attr("bizId"));
    			}
    		}

    		self._addToAssignPanel();
    	});
    	//添加
    	$("#"+_config.addBtnId).bind('click',function(){
    		var lis = $("#"+_config.queryResultId+" li[checked='checked']");

    		for ( var i = 0; i < lis.length; i++) {
    			var li = $(lis[i]);
    			$(li).css("background-color","white");
    			$(li).removeAttr("checked");
    			$(li).next("span").remove();
    			var itemIcon = $(li).prev("span");
    			$("ul#"+_config.selectResultId).append(itemIcon).append(li);
    		}

    	});

    	//确定
    	$("#"+_config.confirmBtnId).bind('click',function(){
    		var returnItems=[], item;
    		var len = selectData.length;
    		for ( var i = 0; i < len; i++) {
    			item = {};
    			item.id = selectData[i][3];
    			item.text = selectData[i][1];
    			item.cmbId = selectData[i][2];
    			item.itemId = selectData[i][0];
    			returnItems.push(item);
    		}
    		_config.confirmCallBack(returnItems);
    		self._close();
    	});

    	//关闭
    	$("#"+_config.closeBtnId).bind('click',function(){
    		self._close();

//    		if(_config.lastItems.length > 0) {
//       	    	_config.lastItems = selectData;
//       	    } else {
//       	    	selectData = [];
//       	    	_config.lastItems = selectData;
//       	    }
    	});

    	//清空提交人
    	$("#" + _config.clearId).bind('click',function(){

    		if(selectData.length < 1) {
    			return;
    		}

    		JrzlTools.confirm("是否确定要清空?","提示",function(flag){
    			if(flag){
    				$("#"+_config.choseId).empty();
    	    		selectData = [];
    	    		$("#"+_config.removeAllBtnId).click();
    			}
    		});
    	});

    },
    //查询方法
    _search:function(search_text){
    	var self = this,
    	_config = self.config,
    	node, value, i = 0, j = 0, k = 0, num = 0, flag, pinyinList, li = "", matcher, id, existFlag, cmbId;

    	if(search_text.indexOf("*") != -1){
    		return;
    	}

    	matcher = new RegExp(search_text, "i" );

    	var searchResultOri = [];
    	doUsrSearch(dataSource.children, searchResultOri, search_text, matcher);
    	var searchResult = [];
    	for(var i = 0; i < searchResultOri.length; i++) {
    		var existed = false;
        	for(var j = 0; j < searchResult.length; j++) {
        		if( searchResult[j].bizId == searchResultOri[i].bizId ){
        			existed = true;
        			break;
        		}
        	}
        	if( existed ){
        		continue;
        	}
        	searchResult.push(searchResultOri[i]);
    	}


    	for(var i = 0; i < searchResult.length; i++) {
    		if( num >= 50 ){
				JrzlTools.alert("查询结果超出50条，请修改查询条件。","提示");
				return;
    		}
    		var node = searchResult[i];
    		if(node.cmbId === search_text) {
				li += "<div id='query_" + node.id + "' bizId='"+ node.bizId +"' itemText='"+ node.text +"' itemId='"+ node.id +"' cmbId='"+ node.cmbId +"' class='tree-items-pick-query-result-li'>"
					+"<span class='tree-items-pick-item-icon'></span>"
					+ node.text + "</div>";
				num = 1;
				break;
			}else{
				li += "<div id='query_" + node.id + "' bizId='"+ node.bizId +"' itemText='"+ node.text +"' itemId='"+ node.id +"' cmbId='"+ node.cmbId +"' class='tree-items-pick-query-result-li'>"
					+"<span class='tree-items-pick-item-icon'></span>"
					+ node.text + "</div>";
				num++;
			}
    	}


    	$("#" + _config.resultId).html(li);

    	liObj = $(".result-area").find(".tree-items-pick-query-result-li");

    	for(i = 0; i < liObj.length; i++) {
    		id = liObj.eq(i).attr("itemId");

    		for(j = 0; j < selectData.length; j++) {
    			if(parseInt(id, 10) === parseInt(selectData[j][0], 10)) {
    				$(liObj[i]).css("background-color","#DFFFDF");
    				$(liObj[i]).attr("checked","checked");
    				$("<span class='tree-items-pick-select-icon'></span>").appendTo($(liObj[i]));
    				break;
    			}
    		}
    	}

    	if(1 === num) {
    		liObj = $(".result-area").find(".tree-items-pick-query-result-li");
    		id = $(liObj).attr("itemId");

			for(i = 0; i < selectData.length; i++) {
    			if(parseInt(id, 10) === parseInt(selectData[i][0], 10)) {
    				existFlag = true;
    			}
    		}

			if(!existFlag) {
				$(liObj).css("background-color","#DFFFDF");
				$(liObj).attr("checked","checked");
				$("<span class='tree-items-pick-select-icon'></span>").appendTo($(liObj));
				self._refreshAssignResult("add", $(liObj).attr("itemId"), $(liObj).attr("itemText"), $(liObj).attr("cmbId"), $(liObj).attr("bizId"));
				self._addToAssignPanel();
			}
    	}

    	//点击需要提交的用户名
    	$(".result-area").find("div").click(function(){
			var liObj;
			if($(this).hasClass("tree-items-pick-query-result-li")){
				liObj = this;
			}else if($(this).hasClass("tree-items-pick-item-icon")){
				liObj = $(this).next("li");
			}

			if($(liObj).attr("checked")=="checked"){
    			$(liObj).css("background-color","");
    			$(liObj).removeAttr("checked");
    			$(liObj).children("span:eq(1)").remove();
    			self._refreshAssignResult("remove", $(liObj).attr("itemId"), $(liObj).attr("itemText"), $(liObj).attr("cmbId"), $(liObj).attr("bizId"));
    		}else{
    			$(liObj).css("background-color","#DFFFDF");
    			$(liObj).attr("checked","checked");
    			$("<span class='tree-items-pick-select-icon'></span>").appendTo($(liObj));
    			self._refreshAssignResult("add", $(liObj).attr("itemId"), $(liObj).attr("itemText"), $(liObj).attr("cmbId"), $(liObj).attr("bizId"));
    		}
			self._addToAssignPanel();
		});
    },
    _distroyTree:function(){
    	var self = this,
        _config = self.config;

    	$.jstree.reference('#'+_config.treeId).destroy();

    },

    _close:function(){
    	var self = this,
        _config = self.config;

    	self._distroyTree();
   	    $("#"+_config.id).remove();
//   	    if(_config.lastItems.length > 0) {
//   	    	_config.lastItems = selectData;
//   	    } else {
//   	    	selectData = [];
//   	    	_config.lastItems = selectData;
//   	    }
   	    _config.win.close();
    }
 };