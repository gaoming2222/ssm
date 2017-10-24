function Treeitemsinglepick(options) {
    this.config = {
    	searchDataSource	: null,
    	url: null,
    	params:null,
        dataSource          : null,                          //数据源
        confirmCallBack     : null,                          //保存回调函数
        title               : "",
        loadAsyn  : false,                                   //分步加载
        clearCallBack 		: null,
        selectAll 			: false,
        search_leaves_only  : true,
 		enableSearch 		 :true,                          //显示搜索框
 		isNeedClear          :true                           //清空按钮是否显示
    };

    var uuid = JrzlTools.getUUID();

    this.config = $.extend(this.config, options || {});

    if(this.config.confirmCallBack==null){
    	JrzlTools.alert('请为Treeitemsinglepick添加确定回调函数。', "提示");
    	return;
    }

    this.config.dataSource = JrzlTools.cloneObject(this.config.dataSource);

    this.config.id = 'tree-items-pick-maindiv-'+uuid;
    this.config.searchId = 'tree-items-pick-searchdiv-'+uuid;
    this.config.searchBtnId =  'search-btn-id'+uuid;
    this.config.searchInputId = 'search-input-id'+uuid;
    this.config.treeId = 'tree-id'+uuid;

    this.config.clearBtnId = 'clear-btn-id-'+uuid;
    this.config.confirmBtnId = 'confirm-btn-id-'+uuid;
    this.config.closeBtnId = 'close-btn-id-'+uuid;

    this.config.uuid = uuid;
    this.config.win = null;
    this.config.tree = null;
    this.config.store = null;
    this.init();
 }

function _getTreeNodeMapping(node, treePrtMapping){
	var child = node.children;
	if( child != null && child.length > 0 ){
		var subChildren = [];
		for (var idx = 0; idx < child.length; idx++) {
			var nextNode = child[idx];
			_getTreeNodeMapping(nextNode, treePrtMapping);
			nextNode.children = [{text:" "}];
			subChildren.push(nextNode);
		}
		treePrtMapping[node.id] = subChildren;
	}
}

Treeitemsinglepick.prototype = {
    constructor: Treeitemsinglepick,
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

    	var searchButton = '';
    	var divheight = 392;
    	if( _config.enableSearch ){
    		searchButton = '<input type="text" id="'+ _config.searchInputId+'"  />'+
		 	'<input type="button" id="'+ _config.searchBtnId+'" value="搜索" />';
    		divheight = 415;
		}
    	var html = '<div id="'+ _config.id +'" class="singletree-items-pick">'+
    				 '<div id="'+ _config.searchId + '" class="singlepick-search-area">'+
    				 searchButton+
    				 '</div>'+
	 	              '<div class="tree-area">' +
	 	              	'<div id="'+ _config.treeId +'" ></div>'+
	 	              '</div>'+
	 	              '<div class="button-area">'+
		 	             '<input type="hidden" id="'+_config.select+ '"/>'+
	                     '<input type="button" id="'+_config.confirmBtnId+'" style="margin-right : 15px" class="tree-items-pick-btn"  value="确定" />';

         if(_config.isNeedClear){
        	 html+='<input type="button" id="'+_config.clearBtnId+'" style="margin-right : 15px" class="tree-items-pick-btn"  value="清空" />';
         }
         html+= '<input type="button" id="'+_config.closeBtnId+'"  class="tree-items-pick-btn"  value="取消" />'+
	 	              '</div>'+
                    '</div>';

    	var mainObj = $(html);
    	$(document.body).append(mainObj);

    	_config.win = JrzlTools.openModalWindow({
		    	id:_config.id,
		    	title:_config.title,
		    	height: divheight,
			    width: 500,
			    beforeClose:function(){
			    	self._distroyTree();
			    	$("#"+_config.id).remove();
			    }
		    });
    	//创建树
    	self._createTree();
    	if(_config.url == null){
	    	JrzlTools.autoCompleteSelect({
	    		id : _config.searchInputId,
	    		data :_config.searchDataSource
	    	});
    	}
    },

    _createTree:function(){
    	var self = this,
        _config = self.config;

    	var initData = _config.dataSource;
    	var treePrtMapping = {};
    	if( _config.loadAsyn ){
    		_getTreeNodeMapping(initData, treePrtMapping);
    		initData.children = [{text:" "}];
    	}

    	var jstypes = {
    			"root" : {
    				"valid_children" : ["default","leaf"]
    			},
    			"default" : {
    				"valid_children" : ["default","leaf","code","action"]
    			},
    			"leaf" : {
    				"icon" : "jstree-file",
    				"valid_children" : []
    			},
    			"code" : {
    				"icon" : "jstree-code",
    				"valid_children" : []
    			},
    			"action" : {
    				"icon" : "jstree-action",
    				"valid_children" : []
    			},
    			"disable" : {
    				"icon" : "jstree-file-disable",
    				"valid_children" : ["default","leaf","code","action"]
    			}
    		};
    	var jscore = {};
    	if(_config.url == null){
    		jscore = {
                'check_callback' : true,
    			'data' :   _config.dataSource,
    			"multiple" : false,
    			"animation" : 150,
    			"themes" : {
    				"name":"default",
    				dots:false
    			}
    		};
    	}else{
    		jscore = {
    			'check_callback' : true,
    			'data' :{
    				url: _config.url,  //异步加载jstree html格式的数据地址
    				success:function(data){
//    			    	JrzlTools.autoCompleteSelect({
//    			    		id : _config.searchInputId,
//    			    		data : data.deptList
//    			    	});
    				},
    	            data: _config.params,
    	            dataType:"json"
    			},
    			"multiple" : false,
    			"animation" : 150,
    			"themes" : {
    				"name":"default",
    				dots:false
    			}
    		};

    	}

    	_config.tree = $('#'+_config.treeId).jstree({
    		'core' : jscore,
    		"types" : jstypes,
    		"checkbox": {
    	    	"keep_selected_style": true
    	    },
    	    "plugins" : ["unique","types","dnd","state","search"],
    	    "search":{
				search_leaves_only:_config.search_leaves_only,
				search_null_tip:true/*,
				focusId:_config.searchInputId*/
			}
    	});

    	_config.tree.on("activate_node.jstree", function (e,data) {
			var node = data.node;
			if(node != null && node.type == "leaf"){
				$("#"+_config.select).val(node.original.text+"&"+node.original.bizId+"&"+node.original.type+"&"+node.original.id);
			}else if(node != null && node.type != 'leaf'){
				if(_config.selectAll) {
					$("#"+_config.select).val(node.original.text+"&"+node.original.bizId+"&"+node.original.type+"&"+node.original.id);
				} else {
					if(node.state != null && node.state.opened){
						data.instance.close_node(node);
					}
					else if(node.state != null && !node.state.opened){
						data.instance.open_node(node);
					}
				}
			}
		});
    	_config.tree.on("open_node.jstree", function (e, data) {
			var node = data.node;
    		if( node.children && node.children.length == 1 ){
    			//判断是否已经初始化过
    			var sonNodeID = data.instance.get_node(node.children[0]);
    			if( !(sonNodeID.original == ' ' || sonNodeID.original.text == ' ') ){
    				return ;
    			}
    			//删除空节点 delete_node get_node load_node
    			data.instance.delete_node(sonNodeID);
    			if(_config.loadAsyn){
    				//加载子节点x
    	        	var res = treePrtMapping[node.id];
    	        	if( res == null || res.length == 0 ){
    	        		return ;
    	        	}
        			for(var i =0; i< res.length; i++){
        				var curNodeType = res[i].type;
        				res[i].type="default";
            			data.instance.create_node(node.id, res[i], "last", function(new_node){});
            			if( curNodeType == "disable" ){
            				data.instance.set_icon(res[i].id, "jstree-file-disable");
            			}
        			}
    			}else{
        			//加载节点
        			_config.params["parentNodeId"] = node.original.bizId;
            		Request.processDataRequest( {
            			url : _config.url,
            			localStorage : null,
            			errorRedirect : true,
            			customParams : _config.params,
            	        callbackFunc : function(res){
            	        	var obj = data.instance.get_node(node.id);
            				if(_config.searchDataSource && _config.searchDataSource instanceof Array ){
            				}else{
            					_config.searchDataSource = [];
            				}
                			for(var i =0; i< res.length; i++){
        	        			data.instance.create_node(obj, res[i], "last", function(new_node){});
        	        			if( res[i].type == 'leaf' ){
        	        				_config.searchDataSource.push({label : res[i].text, value : res[i].id});
        	        			}
                			}
                			if( _config.searchDataSource.length > 0 ){
                				JrzlTools.autoCompleteSelect({
                					id : _config.searchInputId,
                					data : _config.searchDataSource
                				});
                			}
            	        }
            		});
    			}

    		}
		});
    	_config.tree.on("dblclick_node.jstree", function (e,data) {
			var node = data.node;
			if(node.type == "leaf"){
				$("#"+_config.select).val(node.original.text+"&"+node.original.bizId+"&"+node.original.type+"&"+node.original.id);
				$("#"+_config.confirmBtnId).click();
			} else {
				if(_config.selectAll) {
					$("#"+_config.select).val(node.original.text+"&"+node.original.bizId+"&"+node.original.type+"&"+node.original.id);
					$("#"+_config.confirmBtnId).click();
				}
			}
		});
    },

    _bindEnv:function(){
    	var self = this,
    	_config = self.config;

    	// 搜索
    	$("#"+ _config.searchBtnId).bind('click',function(){
    		var id = $('#'+_config.searchInputId).attr("code");
    		if(id == ""){
    			var search_text = $.trim($("#"+_config.searchInputId).val());
        		if(search_text == ""){
        			return;
        		}
        		$('#'+_config.treeId).jstree(true).search(search_text);
    			return;
    		}
    		var evObj = null;
    		var isIE     = JrzlTools.getBrowser().indexOf("MSIE")!= -1 ;
    		if(isIE){
    			evObj=document.createEventObject();
    		}else{
    			evObj = document.createEvent('MouseEvents');
    		}
        	var nodeobj = $.jstree.reference('#'+_config.treeId).get_node(id);
    		$.jstree.reference('#'+_config.treeId).close_all();
        	if(nodeobj == null || nodeobj == ""){
        		nodeobj = $.jstree.reference('#'+_config.treeId).get_node("USR_"+id);
        	}
        	if(nodeobj == null || nodeobj == ""){
        		$.jstree.reference('#'+_config.treeId).activate_node("root",evObj);
        	}else{
        		$.jstree.reference('#'+_config.treeId).open_node(nodeobj);
        		$.jstree.reference('#'+_config.treeId).activate_node(nodeobj,evObj);
        		$.jstree.reference('#'+_config.treeId).element.find('.jstree-clicked').addClass('jstree-search');
        	}
    	});

    	// 清空
    	$("#"+_config.clearBtnId).bind('click',function(){
    		//$.jstree.reference('#'+_config.treeId).close_all();
    		if(_config.clearCallBack != null){
    			_config.clearCallBack();
    		}
    		self._close();
    	}),

    	// 确定
    	$("#"+_config.confirmBtnId).bind('click',function(){
    		var returnItems={};
    		var item = $("#"+_config.select).val();

    		if(item == ""){
    			//获取选中的节点  by zql 80374725
        		var obj = $.jstree.reference('#'+_config.treeId).element.find('.jstree-clicked');
        		var node =null;
        		if(obj[0]){
        			node = $.jstree.reference('#'+_config.treeId).get_node(obj[0].parentNode.id);
            		//根据选中的节点获得选中的node, 然后拼接返回值 by zql 80374725
            		if(undefined == node || null == node){
                		JrzlTools.alert('请选择一条数据',"提示");
                		return;
            		}else{
            			item = node.original.text+"&"+node.original.bizId+"&"+node.original.type+"&"+node.original.id
                		$("#"+_config.select).val(item);
            		}
        		}else{
        			JrzlTools.alert('请选择一条数据', "提示");
        			return;
        		}
    		}

    		if(item.length >= 5){
    			returnItems.text=item.split("&")[0];
        		returnItems.id=item.split("&")[1];
        		returnItems.type=item.split("&")[2];
        		returnItems.uid=item.split("&")[3];
    		}
    		var temparr = $.jstree.reference('#'+_config.treeId).get_path(returnItems.uid);
    		if(temparr == false){
    			temparr = $.jstree.reference('#'+_config.treeId).get_path(returnItems.id);
    		}
    		if(temparr.length > 0){
	    		var restxt = temparr[1];
	    		for(var i = 2; i< temparr.length; i++){
	    			restxt += "/" + temparr[i];
	    		}
	    		returnItems.text = restxt;
	    	}

    		var flag = _config.confirmCallBack(returnItems);

    		if(!flag){
    			self._close();
    		}
    	});
    	// 取消
    	$("#"+_config.closeBtnId).bind('click',function(){
    		self._close();
    	});
    	// 绑定回车查询
    	$("#"+_config.id).bind("keyup",function(event){
    		if(event.keyCode == 13){
    			$("#"+ _config.searchBtnId).click();
            }
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
   	    _config.win.close();
    }
 };
