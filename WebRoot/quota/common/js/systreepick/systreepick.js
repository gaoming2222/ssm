function Systreepick(options) {
    this.config = {
        dataSource          : null,                          //数据源
        selectAll : false,
        treeDiv : null,
        ready   : null
    };
    
    var uuid = JrzlTools.getUUID();
    
    this.config = $.extend(this.config,options || {});
    
    if(this.config.dataSource==null){
    	JrzlTools.alert('请为Systreepick添加数据源。','提示');
    	return;
    }
    
    this.config.dataSource = JrzlTools.cloneObject(this.config.dataSource);
    
    this.config.id = 'tree-items-pick-maindiv-'+uuid;
    this.config.treeId = 'tree-id'+uuid;
       
    this.config.uuid = uuid;
    this.config.win = null;
    this.config.tree = null;
    this.config.store = null;
    this.init();
 }
 

Systreepick.prototype = {
    constructor: Systreepick,
    init: function(options){
        var self = this,
            _config = self.config,
            _cache = self.cache;

            self._renderUI();
            
    },
    //激活某个节点
    activate_node:function(node){
    	var self = this,
    		_config = self.config,
    		treeObj = $.jstree.reference('#'+ _config.treeId),
    		nodeobj = treeObj.get_node(node);
    	if(nodeobj == null || nodeobj == ""){
    		treeObj.trigger('activate_node', {'node' : treeObj.get_node("root")});
    	}else{
    		var nodeIds = JrzlTools.cloneObject(nodeobj.parents);
    		nodeIds.push(node.id);
    		treeObj.trigger('activate_node', { 'node' : nodeobj });
    		treeObj.open_node(nodeIds,null,false);
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
    	
    	_config.tree = $('#'+_config.treeId).jstree({
    		'core' : {
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
    				"icon" : "jstree-folder",
    				"valid_children" : ["system"]
    			},
    			"system" : {
    				"icon" : "jstree-folder",
    				"valid_children" : ["subsys"]
    			},
    			"subsys" : {
    				"icon" : "jstree-folder",
    				"valid_children" : ["mod"]
    			},
    			"mod" : {
    				"icon" : "jstree-file",
    				"valid_children" : []
    			}
    		}
    	});
    	_config.tree.on("activate_node.jstree", function (e,data) {
			var node = data.node;
			if(node != null){
				$("#"+_config.select).val(node.original.text+"&"+node.original.bizId+"&"+node.original.type);
			}else{
				return;
			}
			
			if("root" == node.original.type) {
				addSystem();
			} else if("system" == node.original.type) {
				showSystem(node);
			} else if("subsys" == node.original.type) {
				showSubSys(node);
			} else if("mod" == node.original.type) {
				showMod(node);
			}
		});
		if(_config.ready != null){
		   	_config.tree.on("ready.jstree", _config.ready);
		}
    }
 };
