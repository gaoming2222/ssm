function Organtreepick(options) {
    this.config = {
        dataSource          : null,                          //数据源
        clickEvent          : null,                         //点击事件
        selectAll : false,
        loadAsyn  : false,
        treeDiv   : null,
        frameId   : null,
        ready     : null
    };

    var uuid = JrzlTools.getUUID();

    this.config = $.extend(this.config,options || {});

    if(this.config.dataSource==null){
    	JrzlTools.alert('请为Organtreepick添加数据源。','提示');
    	return;
    }

    this.config.dataSource = JrzlTools.cloneObject(this.config.dataSource);

    this.config.id = 'tree-items-pick-maindiv-'+uuid;
    this.config.searchId = 'tree-items-pick-searchdiv-'+uuid;
    this.config. searchBtnId =  'search-btn-id'+uuid;
    this.config. searchInputId = 'search-input-id'+uuid;
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

Organtreepick.prototype = {
    constructor: Organtreepick,
    init: function(options){
        var self = this,
            _config = self.config,
            _cache = self.cache;

            self._renderUI();
            // 绑定事件
            self._bindEnv();

    },    //激活某个节点
    activate_node:function(id){
		var evObj = null;
		var isIE     = JrzlTools.getBrowser().indexOf("MSIE")!= -1 ;
		if(isIE){
			evObj=document.createEventObject();
		}else{
			evObj = document.createEvent('MouseEvents');
		}
    	var nodeobj = $.jstree.reference('#'+this.config.treeId).get_node(id);
    	if(nodeobj == null || nodeobj == ""){
    		$.jstree.reference('#'+this.config.treeId).activate_node("root",evObj);
    	}else{
    		$.jstree.reference('#'+this.config.treeId).open_node(nodeobj);
    		$.jstree.reference('#'+this.config.treeId).activate_node(nodeobj,evObj);
    	}
    },
    //得到父个节点
    get_parent_node:function(node){
    	var nodeobj = $.jstree.reference('#'+this.config.treeId).get_node(node);
    	return $.jstree.reference('#'+this.config.treeId).get_node(nodeobj.parent);
    },
    _renderUI:function(){
    	var self = this,
        _config = self.config;

    	var html = '<div id="'+ _config.id +'" class="singletree-items-pick">'+
	 	              '<div class="tree-area">' +
	 	              	'<div id="'+ _config.treeId +'" ></div>'+
	 	              '</div>'+
                    '</div>';

    	var mainObj = $(html);
    	$("#" + _config.treeDiv).append(mainObj);

    	//创建树
    	self._createTree();
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
    	_config.tree = $('#'+_config.treeId).jstree({
            'core' : {
                'check_callback' : true,
                'data' :   _config.dataSource,
                "multiple" : false,
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
    		},
	    	"checkbox": {
	    	"keep_selected_style": true
	    	},
	    	"plugins" : ["unique","types","dnd","state" ]
    	    });

    	_config.tree.on("activate_node.jstree", function (e,data) {
			var node = data.node;
			if( node == null ){
				return ;
			}else if( node.type == "leaf"){
				$("#"+_config.select).val(node.original.text+"&"+node.original.bizId+"&"+node.original.type);
			}else if( node.type != 'leaf'){
				if(_config.selectAll) {
					$("#"+_config.select).val(node.original.text+"&"+node.original.bizId+"&"+node.original.type);
				} else {
					if(node.state != null && node.state.opened){
						data.instance.close_node(node);
					}
					else if(node.state != null && !node.state.opened){
						data.instance.open_node(node);
					}
				}
			}
			_config.clickEvent(node);

			$("#" + _config.frameId).attr("src", node.original.url);
			$("#" + _config.frameId).show();
		});
    	_config.tree.on("dblclick_node.jstree", function (e,data) {
    		var node = data.node;
			if(node.type == "leaf"){
				$("#"+_config.select).val(node.original.text+"&"+node.original.bizId+"&"+node.original.type);
				$("#"+_config.confirmBtnId).click();
			} else {
				if(_config.selectAll) {
					$("#"+_config.select).val(node.original.text+"&"+node.original.bizId+"&"+node.original.type);
					$("#"+_config.confirmBtnId).click();
				}
			}
		});
    	_config.tree.on("open_node.jstree", function (e,data) {
			var node = data.node;
    		if( node.children && node.children.length == 1 ){
    			//判断是否已经初始化过
    			var sonNodeID = data.instance.get_node(node.children[0]);
    			if( sonNodeID.original.text != ' ' ){
    				return ;
    			}
    			//删除空节点 delete_node get_node load_node
    			data.instance.delete_node(sonNodeID);
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
    		}
		});
		if(_config.ready != null){
		   	_config.tree.on("ready.jstree", _config.ready);
		}
    },

    _bindEnv:function(){
    	var self = this,
    	_config = self.config;

    	/*
    	// 搜索
    	$("#"+ _config.searchBtnId).bind('click',function(){
    		var search_text = $.trim($("#"+_config.searchInputId).val());
    		if(search_text == ""){
    			return;
    		}
    		$('#'+_config.treeId).jstree(true).search(search_text);
    	});

    	// 清空
    	$("#"+_config.clearBtnId).bind('click',function(){
    		if(_config.clearCallBack != null){
    			_config.clearCallBack();
    		}
    		self._close();
    	}),

    	// 确定
    	$("#"+_config.confirmBtnId).bind('click',function(){
    		var returnItems={};
    		var item = $("#"+_config.select).val();

    		if(item.length >= 5){
    			returnItems.text=item.split("&")[0];
        		returnItems.id=item.split("&")[1];
        		returnItems.type=item.split("&")[2];
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
    	*/
    }
    /*

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
    }*/
 };
