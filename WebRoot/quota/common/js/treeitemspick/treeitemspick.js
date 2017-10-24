
function TreeItemsPicker(options) {
    this.config = {
        dataSource          : null,                          //数据源
        confirmCallBack     : null,                           //保存回调函数
        title               : "",
        lastItems           : []
    };
    
    var uuid = JrzlTools.getUUID();
    
    this.config = $.extend(this.config,options || {});
    
    if(this.config.dataSource==null){
    	JrzlTools.alert('请为TreeItemPicker添加数据源。',"提示", null);
    	return;
    }
    if(this.config.confirmCallBack==null){
    	JrzlTools.alert('请为TreeItemPicker添加确定回调函数。','提示', null);
    	return;
    }
    
    this.config.dataSource = JrzlTools.cloneObject(this.config.dataSource);
    
    this.config.id = 'tree-items-pick-maindiv-'+uuid;
    this.config.treeId = 'tree-id'+uuid;
    this.config.queryResultId = 'query-result-id-'+uuid;
    this.config.selectResultId = 'select-result-id-'+uuid;
    
    this.config.queryTextId = 'query-text-id-'+uuid;
    this.config.queryBtnId = 'query-btn-id-'+uuid;
    
    this.config.addAllBtnId = 'add-all-btn-id-'+uuid;
    this.config.removeAllBtnId = 'remove-all-btn-id-'+uuid;
    this.config.addBtnId = 'add-btn-id-'+uuid;
    this.config.removeBtnId = 'remove-btn-id-'+uuid;
    this.config.moveUpBtnId = 'move-up-btn-id-'+uuid;
    this.config.moveDownBtnId = 'move-down-btn-id-'+uuid;
    
    this.config.confirmBtnId = 'confirm-btn-id-'+uuid;
    this.config.closeBtnId = 'close-btn-id-'+uuid;
    
    this.config.uuid = uuid;
    this.config.win = null;
    this.config.tree = null;
    this.config.store = null;
    
    this.init();
    
 }
 

TreeItemsPicker.prototype = {
    constructor: TreeItemsPicker,
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
    	
    	var html = '<div id="'+ _config.id +'" class="tree-items-pick">'+
	 	              '<div class="tree-area">'+
	 	              	'<div  id="'+ _config.treeId +'"></div>'+
	 	              '</div>'+		
                      '<table border="0" width="568px" style="margin-left:11px;">'+
	                      '<tr height="8px" >'+
		                     '<td cospan="3" width="550px" align="left">'+
			                    '<input id="'+ _config.queryTextId +'" class="tree-items-pick-input" />'+ 
			                    '<input type="button" id="'+ _config.queryBtnId +'"  class="tree-items-pick-query-btn" value="查询"/>'+	
		                     '</td>'+
	                      '</tr>'+
	                      '<tr height="210px">'+
		                     '<td  width="236px" >'+
			                    '<div style="display:block;background-color: white; width:236px; height:220px; border:1px solid gray;overflow-y: scroll;overflow-x:hidden;">'+
				                  '<ul style="list-style-type:none; padding:6px; width:220px;" id="'+ _config.queryResultId +'" ></ul>'+
			                    '</div>'+
		                     '</td>'+
		                     '<td align="center" width="80px" valign="middle">'+
			                    '<div style="display:block;" >'+
				                    '<input type="button" id="'+ _config.addBtnId +'"      value="添加" class="tree-items-pick-btn" style="margin-bottom: 10px"/>'+
				                    '<input type="button" id="'+ _config.removeBtnId +'"   value="移除"  class="tree-items-pick-btn" style="margin-bottom: 10px"/>'+
				                    '<input type="button" id="'+ _config.moveUpBtnId +'"   value="上移"  class="tree-items-pick-btn" style="margin-bottom: 10px"/>'+
				                    '<input type="button" id="'+ _config.moveDownBtnId +'" value="下移" class="tree-items-pick-btn" style="margin-bottom: 10px"/>'+		
				                    '<input type="button" id="'+ _config.addAllBtnId +'"      value="全部添加" class="tree-items-pick-btn" style="margin-bottom: 10px"/>'+
			                        '<input type="button" id="'+ _config.removeAllBtnId +'"   value="全部移除"  class="tree-items-pick-btn" style="margin-bottom: 10px"/>'+
			                    '</div>'+
		                     '</td>'+
		                     '<td width="235px">'+
			                    '<div  style="display:block;background-color: white; width:236px; height:220px; border:1px solid gray; overflow-y: scroll;overflow-x:hidden;">'+
				                   '<ul style="list-style-type:none; padding:6px; width:220px;" id="'+ _config.selectResultId +'" ></ul>'+
			                    '</div>'+
		                     '</td>'+
	                       '</tr>'+
	                      
                        '</table>'+
                        '<div class="bottom-button-area">'+
	                        '<input type="button" id="'+_config.confirmBtnId+'" style="margin-right : 15px" class="tree-items-pick-btn"  value="确定" />'+
	                        '<input type="button" id="'+_config.closeBtnId+'" class="tree-items-pick-btn"  value="关闭" />'+
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
		    width: 600,		
		    beforeClose:function(){
		    	self._distroyTree();
		    	$("#"+_config.id).remove();
		    }
  	    });
  	  
  	    //记忆上次选择
		var lastNodes = [];
		for(var i = 0,len=_config.lastItems.length;i<len;i++){
			var node = {original:{}};
			node.id = _config.lastItems[i].sysId;
			node.original.bizId = _config.lastItems[i].id;
			node.original.text = _config.lastItems[i].text;
			lastNodes.push(node);
		}
		self._addToQueryResultPanel(lastNodes, _config.selectResultId);	
  	    
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
    			"plugins" : [ "types","search"],
    			"search":{
    				search_leaves_only	:	true,
    				search_callback	:	function(search_text, node){self._search(search_text, node);}
    			}		
    	});
    	_config.tree.on("activate_node.jstree", function (e,data) {
    		var leafItems = [];
			var node = data.node;
			var instance = data.instance;
			if(node.type == "leaf"){
				leafItems.push(node);
			}
			else{
				var collectLeafItems = function(node){
					if(node.type == "leaf"){
    					leafItems.push(node);
    				}else{
    					var children = node.children;
    					for(var i=0,len=children.length;i<len;i++){
    						collectLeafItems(instance.get_node(node.children[i]));
    					}
    				}    				
    			};
    			collectLeafItems(node);
    			$("ul#"+_config.queryResultId).empty();
			}
			self._addToQueryResultPanel(leafItems,_config.queryResultId);
		});
    	_config.tree.on("dblclick_node.jstree", function (e,data) {
    		   		
		});
    },
    
    _addToQueryResultPanel:function(items,panel){  
    	
    	for(var i = 0,len = items.length;  i < len; i++){ 
			var node = items[i];	
			var tmpItem = $("li#query_" + node.id);
			if(tmpItem.length == 0){
				var li = $("<li id='query_" + node.id + "' bizId='"+ node.original.bizId +"'  class='tree-items-pick-query-result-li'>" 
							+ node.original.text + "<span class='tree-items-pick-item-icon'></span>"
							+"</li>");
				$("#"+panel).append(li);
				
				$(li).click(function(){	
					var liObj;
					if($(this).hasClass("tree-items-pick-query-result-li")){
						liObj = this;
					}else if($(this).hasClass("tree-items-pick-item-icon")){
						liObj = $(this).next("li");
					}					
					if($(liObj).attr("checked")=="checked"){
		    			$(liObj).css("background-color","");
		    			$(liObj).removeAttr("checked");
		    			$(liObj).next("span").remove();
		    		}
		    		else{
		    			$(liObj).css("background-color","#F0F0B4");
		    			$(liObj).attr("checked","checked");
		    			$("<span class='tree-items-pick-select-icon'></span>").insertAfter($(liObj));
		    		}
				});
				
			}	
		}		
    	
    },
 
    _bindEnv:function(){
    	var self = this,
    	_config = self.config;
    	//查询按钮
    	$("#"+_config.queryBtnId).bind('click',function(){
    		var search_text = $.trim($("#"+_config.queryTextId).val());
    		if(search_text == ""){
    			return;
    		}
    		$("#" + _config.queryResultId).empty();
    		$('#' + _config.treeId).jstree(true).search(search_text);
    	});
    	//回车查询
    	$("#"+_config.queryTextId).bind("keyup",function(event){
    		if(event.keyCode == 13){
    			$("#"+_config.queryBtnId).click();		
            }  
    	});
    
    	//全部添加
    	$("#"+_config.addAllBtnId).bind('click',function(){
    		var lis = $("#"+_config.queryResultId+" li");	

    		for ( var i = 0; i < lis.length; i++) {	
    			var li = $(lis[i]);
    			$(li).css("background-color","white");
    			if($(li).attr("checked")=="checked"){
    				$(li).removeAttr("checked");
        			$(li).next("span").remove();
    			}
    			var itemIcon = $(li).prev("span");	
    			$("ul#"+_config.selectResultId).append(itemIcon).append(li);		
    		}
    	
    	});
    	//全部移除
    	$("#"+_config.removeAllBtnId).bind('click',function(){
    		var lis = $("#"+_config.selectResultId+" li");	

    		for ( var i = 0; i < lis.length; i++) {	
    			var li = $(lis[i]);
    			$(li).css("background-color","white");
    			if($(li).attr("checked")=="checked"){
    				$(li).removeAttr("checked");
        			$(li).next("span").remove();
    			}
    			var itemIcon = $(li).prev("span");	
    			$("ul#"+_config.queryResultId).append(itemIcon).append(li);		
    		}
    	
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
    	//移除
    	$("#"+_config.removeBtnId).bind('click',function(){
    		var lis = $("#"+_config.selectResultId+" li[checked='checked']");	

    		for ( var i = 0; i < lis.length; i++) {	
    			var li = $(lis[i]);
    			$(li).css("background-color","white");
    			$(li).removeAttr("checked");
    			$(li).next("span").remove();
    			var itemIcon = $(li).prev("span");	
    			$("ul#"+_config.queryResultId).append(itemIcon).append(li);		
    		}
    	
    	});
    	//上移
    	$("#"+_config.moveUpBtnId).bind('click',function(){
    		var li = $("#"+_config.selectResultId+" li[checked='checked']");
    		if(li.length>1){
    			JrzlTools.alert('不能同时移动两个。','警告' , null);
    			return;
    		}
    		var i = $(li).index("#"+_config.selectResultId+" li");
    		if(i > 0){
	    		$(li).animate({},'slow',function(){	
	    			var frontSpan = $("#"+_config.selectResultId+" li:eq("+(i - 1)+")");
	    			var span1 = $(li).next("span");
	    			var span2 = $(li).prev("span");
	    			
	    			$(frontSpan).before(span2);
	    			$(frontSpan).before(li);
	    			$(frontSpan).before(span1);
	    		});
    		}
    	 });
    	//下移事件
    	$("#"+_config.moveDownBtnId).bind('click',function(){
    		var li = $("#"+_config.selectResultId+" li[checked='checked']");
    		if(li.length>1){
    			JrzlTools.alert( '不能同时移动两个。','警告', null);
    			return;
    		}
    		var maxIndex = $("#"+_config.selectResultId+" li").length - 1;
    		
    		var i = $(li).index("#"+_config.selectResultId+" li");
    		if(i < maxIndex) {
    			$(li).animate({},'slow',function(){	
    				var behindLi = $("#"+_config.selectResultId+" li:eq("+(i + 1)+")");
    				var span1 = $(li).prev("span");
    				var span2 = $(li).next("span");
    				$(behindLi).after(span2);
    				$(behindLi).after(li);
    				$(behindLi).after(span1);
    			});
    		}
    	});
    	//确定
    	$("#"+_config.confirmBtnId).bind('click',function(){
    		var returnItems=[];
    		var len = $("#"+_config.selectResultId+" li").length;
    		for ( var i = 0; i < len; i++) {
    			var item = {};
    			var  $li = $("#"+_config.selectResultId+" li:eq(" + i + ")");
    			if($li.attr("id").split("query_").length == 2){
    				item.sysId = $li.attr("id").split("query_")[1];
    			}
    			else{
    				item.sysId = $li.attr("id");
    			}
    			item.id = $li.attr("bizId");
    			item.text = $li.text();
    			returnItems.push(item);
    		}
    		var flag = _config.confirmCallBack(returnItems);
    		if(!flag){
    			self._close();
    		}   		
    	});
    	//关闭
    	$("#"+_config.closeBtnId).bind('click',function(){
    		self._close();
    	});
    	
    },
    //查询方法
    _search:function(search_text, node){
    	var self = this,
    	_config = self.config;
    	
    	if(node != null && node.type != "leaf"){
    		return;
    	}

    	var matcher = new RegExp( search_text, "i" );
    	var value = node.original.text;
    	var flag = matcher.test( value );
    	if(!flag){
        	var pinyinList = pinyinMakePy(value);
	        for(var k=0,len=pinyinList.length;k<len;k++){
	        	  flag = matcher.test( pinyinList[k] );
	        	  if(flag){
	        		  break;
	        	  }
	        }
        }
    	if(flag){
    		var tmpItem = $("li#query_" + node.id);
    		
    		if (tmpItem.length == 0) {
					var li = $("<li id='query_" + node.id + "' bizId='"+ node.original.bizId +"'   class='tree-items-pick-query-result-li'>" 
						+"<span class='tree-items-pick-item-icon' ></span>"
						+ node.original.text + "</li>");
					$("#"+_config.queryResultId).append(li);
					
					$(li).click(function(){	
						var liObj;
						if($(this).hasClass("tree-items-pick-query-result-li")){
							liObj = this;
						}else if($(this).hasClass("tree-items-pick-item-icon")){
							liObj = $(this).next("li");
						}					
						if($(liObj).attr("checked")=="checked"){
			    			$(liObj).css("background-color","");
			    			$(liObj).removeAttr("checked");
			    			$(liObj).next("span").remove();
			    		}
			    		else{
			    			$(liObj).css("background-color","#F0F0B4");
			    			$(liObj).attr("checked","checked");
			    			$("<span class='tree-items-pick-select-icon'></span>").insertAfter($(liObj));
			    		}
					});
				}
        }    	
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