//左边的收藏夹树
var leftTree;

// 右边的系统目录树
var rightTree;

// 新增文件夹窗口
var addFolderWin;

// 新增文件夹窗口
var reNameFolderWin;

// 收藏夹操作窗口
var jrzlFavoriteTreeWin;

//打开收藏夹管理操作界面
function openFavoriteWin(tree,id) {
	showJrzlFavoriteTreeWin();
	if(collectMenuDataFromIndex){
		initLeftTree(collectMenuDataFromIndex);
	}
	if(sysMenuJsonFromIndex){
		initRightTree(sysMenuJsonFromIndex);
	}
	if(tree == "left"){
		leftTree.search(id);
	}
	else if(tree == "right"){
		rightTree.search(id);
	}
}

// 显示收藏夹管理操作界面
function showJrzlFavoriteTreeWin() {
	if (jrzlFavoriteTreeWin) {
		jrzlFavoriteTreeWin.show();
	} else {
		jrzlFavoriteTreeWin = JrzlTools.openModalWindow({
			id : "jrzlFavoriteTree",
			title : "收藏夹管理",
			height : 'auto',
			width : 590,
			beforeClose : destroyTree
		});
	}
}
// 关闭
function closeFavWin(){
	JrzlTools.confirm("确认关闭收藏夹吗？","提示",function(confirm){
		if(confirm){
			jrzlFavoriteTreeWin.close();
		}
	});
}
// 保存
function savaFavWin(){
	JrzlTools.confirm("确认保存收藏夹吗？","提示",function(confirm){
		 if(confirm){
			var favMenuObj = leftTree.get_json(leftTree.get_node("root"));
			var favMenuValues = JSON.stringify(favMenuObj);

			if(canSave(favMenuObj)){
		    	Request.processDataRequest({url:"/jrzl/pub/index/addMyFavMenus.action",
    	    			    localStorage:localdata,
    	    			    errorRedirect:true,
    	    			    customParams:{'favMenuValues':favMenuValues},
    	    			    callbackFunc:callbackAddFav,
    	    			    progress:true,
    	    			    progressText:"保存中..."
    	    			    });
			}else {
				JrzlTools.alert('收藏夹中不能存在空的文件夹。','提示');
			}
		 }
	});
}
// 保存回调
function callbackAddFav(data){
	if(data != null && undefined != data && "0" == data.ErrorNo){
		var favMenuValues =leftTree.get_json(leftTree.get_node("root")).children;

		loadCollectMenu(favMenuValues);

		jrzlFavoriteTreeWin.close();
	}else{
		JrzlTools.alert('收藏夹保存出错，请重试或联系管理员。','提示');
	}
}

// 判断是否含有空文件夹
function canSave(obj){
	if((obj.type == "default") && obj.children.length == 0){
		return false;
	}
	if(obj.children.length != 0){
		for(var o in obj.children){
			if(!canSave(obj.children[o])){
				return false;
			}
		}
	}
	return true;
}

// 关闭窗口
function closeJrzlFavoriteTreeWin(){
	jrzlFavoriteTreeWin.close();
}
// 销毁树
function destroyTree(){
	leftTree.destroy();
	rightTree.destroy();
}


// 初始化左边的收藏夹树
function initLeftTree(data) {
	$('#leftTreeDiv').jstree({
		'core' : {
			'data' : [ {
				"text" 		: "收藏夹目录",
				"name" 		: "收藏夹目录",
				"id" 		: "root",
				"type" 		: "root",
				"state" 	: { "opened" : true },
				"children" 	: data
			} ],
			"check_callback" : true,
			"themes" : {
				dots:false
				/*
				 * variant:"small",
				 */
			},
			"multiple" : false,
			"animation" : 150
		},
		"types" : {
			"#" : {
				"max_children" : 1,
				"max_depth" : 4,
				"valid_children" : [ "root" ]
			},
			"root" : {
				"valid_children" : [ "default", "leaf" ]
			},
			"default" : {
				"valid_children" : [ "default", "leaf" ]
			},
			"leaf" : {
				"icon" : "jstree-file",
				"valid_children" : []
			}
		},
		"plugins" : [ "dnd", "contextmenu", "types", "search","unique" ],
        "search":{search_id:true},
		"contextmenu" : {
			items : function(o, cb) {
				var returnV = {};
				returnV.create = {
						"separator_before" : false,
						"separator_after" : false,
						"_disabled" : false,
						"label" : "新建文件夹",
						"action" : function(data) {
							var inst = $.jstree.reference(data.reference),
								obj = inst.get_node(data.reference);
							inst.create_node(obj, {menuId:JrzlTools.getUUID()}, "first",function(new_node) {
								setTimeout(function() {
									inst.edit(new_node);
								}, 0);
							});
						}
				};
				returnV.rename = {
						"separator_before" : false,
						"separator_after" : false,
						"_disabled" : false,
						"label" : "重命名",
						"action" : function(data) {
							var inst = $.jstree.reference(data.reference),
								obj = inst.get_node(data.reference);
							inst.edit(obj);
						}
				};
				returnV.remove = {
						"separator_before" : false,
						"icon" : false,
						"separator_after" : false,
						"_disabled" : false,
						"label" : "移除",
						"action" : function(data) {
							var inst = $.jstree.reference(data.reference),
								obj = inst.get_node(data.reference);
							if (obj.parent == "#"){
								return;
							}
							if (inst.is_selected(obj)) {
								inst.delete_node(inst.get_selected());
							} else {
								inst.delete_node(obj);
							}
						}
				};
				if (o.type == "root") {
					returnV.remove = null;
					returnV.rename = null;
				} else if (o.type == "leaf") {
					returnV.create = null;
				}
				return returnV;
			}
		}
	})
	.on("copy_node.jstree", function(e, data) {
		// 获取原始节点
		var	rightNode = rightTree.get_node(data.original.id);
		changeIdRecursion(data.node,rightNode);
	});

	leftTree = $.jstree.reference('leftTreeDiv');
}

// 递归调用 修改新节点的menuId
function changeIdRecursion(destNode,srcNode){
	destNode.original.menuId = srcNode.id;
	for(var i=0,len=srcNode.children.length;i<len;i++){
		changeIdRecursion(leftTree.get_node(destNode.children[i]),rightTree.get_node(srcNode.children[i]));
	}

}

// 初始化右边的系统目录树
function initRightTree(data) {
	$('#rightTreeDiv').jstree({
		'core' : {
			'data' : [ {
				"text" 		: "系统目录",
				"name" 		: "系统目录",
				"id"   		: "system",
				"type" 		: "root",
				"state"		: { "opened" : true },
				"children" 	: data
			} ],
			"themes" : {
				dots:false
			},
			"multiple" : false,
			"animation" : 150
		},
		"types" : {
			"#" : {
				"max_children" : 1,
				"max_depth" : 4,
				"valid_children" : [ "root" ]
			},
			"root" : {
				"valid_children" : [ "default", "leaf" ]
			},
			"default" : {
				"valid_children" : [ "default", "leaf" ]
			},
			"leaf" : {
				"icon" : "jstree-file",
				"valid_children" : []
			}
		},

		"plugins" : [ "dnd", , "types", "search" ],
		"dnd" : {
			'always_copy' : true
		},
		"search":{search_id:true}
	});
	rightTree = $.jstree.reference('rightTreeDiv');
}

// 左移
function moveLeft() {
	var leftNode = leftTree.get_selected(true);
	var rightNode = rightTree.get_selected(true);
	if(leftNode != null && leftNode.length >0 && rightNode != null && rightNode.length >0){
		leftTree.move_node(rightNode,leftNode[0].id);
	}

}

// 移除
function remove() {
	var node = leftTree.get_selected(true);

	if (node && node.length == 0) {
		JrzlTools.alert('请选择需要删除的目录。', '提示');
		return;
	}
	if (node && node[0].type == "root") {
		JrzlTools.alert('根目录不可删除。', '提示', null);
		return;
	}
	if (node && node[0].type != "root") {
		JrzlTools.confirm("确认移除吗？", "提示", function(confirm) {
			if (confirm) {
				leftTree.delete_node(node);
			}
		});
	}
}

//清空
function removeAll() {
	JrzlTools.confirm("确认清空吗？", "提示", function(confirm) {
		if (confirm) {
			leftTree.delete_node(leftTree.get_node("root").children);
		}
	});
}

// 置顶
function moveFirst(){
	var node = leftTree.get_selected(true);
	if(node != null && node.length > 0){
		leftTree.move_node(node,node[0].parent);
	}
}

// 上移
function moveUp() {
	var node = leftTree.get_selected(true);
	if(node == null || node.length == 0){
		return;
	}
	var siblings = leftTree.get_node(node[0].parent).children;
	Array.prototype.indexOf = function(val){
		for (var i = 0; i < this.length; i++) {
	        if (this[i] == val) return i;
	    }
	    return -1;
	};
	var index = siblings.indexOf(node[0].id);
	leftTree.move_node(node,node[0].parent,index-1 >= 0 ? index-1 : 0);
}

// 下移
function moveDown(){
	var node = leftTree.get_selected(true);
	if(node == null || node.length == 0){
		return;
	}
	var siblings = leftTree.get_node(node[0].parent).children;
	var len = siblings.length;
	Array.prototype.indexOf = function(val){
		for (var i = 0, len = this.length; i < len; i++) {
	        if (this[i] == val) return i;
	    }
	    return -1;
	};
	var index = siblings.indexOf(node[0].id);
	var x = index+2;
	leftTree.move_node(node,node[0].parent,x);
}
// 置底
function moveLast(){
	var node = leftTree.get_selected(true);
	if(node != null && node.length > 0){
		leftTree.move_node(node,node[0].parent,"last");
	}

}

//#localdata定义----------start
var localData = null;;
// #localdata定义----------end

//#localdata赋值---------end
localdata = {
	ErrorNo : 0
};
// #localdata赋值---------end
