

function ItemSinglePicker(options) {
	  this.config = {
			    localData		: 		[], //本地数据
		    	url				:		"",  //查询列表对应的url
		    	urlParams		:		{},  //查询列表传入的固定参数
		    	QryDataListNam	:		"",  //查询列表在返回数据中对应的key值
		    	title       	:		null, //modal的title
		    	beforeClose 	:		null, //关闭回调函数
		    	clearCallBack	:		function(){ //清楚回调函数
		    		return;
		    	},
		    	iDisplayLength	:		50,  // 列表的长度
		    	height 			:		"auto", //modal的高度
                width 			:		0, //modal的宽度
                tableWidth 		: 		0,	//table的宽度
                /*[{
	            	id:"DPT_UID", 	//input框的id
	            	label:"部门",	//input框的label
	            	selectData:"", 	//下拉框数据
	            	DefaultVal:"111376",
	            	onchangeFn	: null,
	            	selectUrl : "/jrzl/pub/dptmanage/getDptManageList.action",
	            	selectParams : {},
	            	ListNam		 : "deptList"
	             }]
                 */
                inputSearch		: 		[], //搜索配置
                tableCfg 		: 		[], //表格列配置
            	querybutton		: 		true,
            	clearbutton		: 		true,
            	confirmbutton	: 		true,
            	Required 		: 		[],
            	UsrNamSelectCfg:{},  //默认用户名选择窗口
				UsrIDSelectCfg:{},  //默认用户ID选择窗口
				DptSelectCfg:{}  //默认用户选择窗口 部门选择参数
            	
		    };
	  
	  this.config = $.extend(this.config, options || {});
	  var uuid = JrzlTools.getUUID();
	  //设置配置信息
	  this.config["UUID"] = uuid;
	  this.config["selectDivID"] = "ItemSinglePickerDivID"+ uuid;
	  
	  this.config["itemQueryID"] = "itemQueryID"+ uuid;
	  this.config["ClearID"] = "ClearID"+ uuid;
	  this.config["ConfirmID"] = "ConfirmID"+ uuid;
	  this.config["SelectTableID"] = "SelectTableID"+ uuid;
	  this.init();
 }

ItemSinglePicker.prototype = {
    constructor: ItemSinglePicker,
    init: function(options){
        var self = this;
        _config = self.config;
        self._renderUI();
        // 绑定事件
        self._bindEnv();
		//初始化
		//document.getElementById(_config.itemQueryID).click();
    },
    _renderUI:function(){
    	var self = this,
        _config = self.config;
    	 //头部
    	 var htmlHeader = '<div id="'+ _config.selectDivID + '" style="display:none;">'
		 					+'<div class="top-button-area">';
    	 //搜索部分
         var htmlSerarch ='<table border="0" width="100%" >';
         for(var i = 0; i<  _config.inputSearch.length; i += 2){
             var inputItem = "";
             if(i+2 <=  _config.inputSearch.length){
                 var inputid = _config.inputSearch[i].id + _config.UUID;
                 var inputlabel = _config.inputSearch[i].label;
                 var onchangeFn = _config.inputSearch[i].onchangeFn;
                 var inputid1 = _config.inputSearch[i+1].id + _config.UUID;
                 var inputlabel1 = _config.inputSearch[i+1].label;
                 var Required1 = "";
                 var Required2 = "";
                 
                 if (JrzlTools.containtElement(_config.Required, _config.inputSearch[i].id))
                 	Required1 = "<font style='color:red;'>*</font>";
                 if (JrzlTools.containtElement(_config.Required, _config.inputSearch[i+1].id))
                 	Required2 = "<font style='color:red;'>*</font>";
                 
                 
                 inputItem  = '<tr height="35px">'
                 +'	<td class="required">&nbsp;</td>'
                 +'	<td class="head">'+ Required1 + inputlabel+'：</td>'
                 +'	<td class="content">'
                 +'		<input type="text" id="'+ inputid + '" style="width: 80%;"/></td>'
                 +'	<td class="required">&nbsp;</td>'
                 +'	<td class="head">'+ Required2 + inputlabel1+'：</td>'
                 +'	<td class="content">'
                 +'		<input type="text" id="'+ inputid1 + '" style="width: 80%;" /></td>'
                 +'</tr>';
             }else{
                 var inputid = _config.inputSearch[i].id + _config.UUID;
                 var inputlabel = _config.inputSearch[i].label;
                 var Required1 = "";
                 if (JrzlTools.containtElement(_config.Required, _config.inputSearch[i].id))
                 	Required1 = "<font style='color:red;'>*</font>";
                 
                 inputItem  = '<tr height="35px">'
                 +'	<td class="required">&nbsp;</td>'
                 +'	<td class="head">'+Required1+inputlabel+ '：</td>'
                 +'	<td class="content">'
                 +'		<input type="text" id="'+  inputid + '" style="width: 80%;"/></td>'
                 +'		<td align="center" colspan="6">'
      			 +'			<input type="button" class="common-button" id="'+ _config.itemQueryID + '" value="查询" />'
      			 +'			<input type="button" class="common-button" id="'+ _config.ClearID + '" value="清空" />'
      			 +'			<input type="button" class="common-button" id="'+ _config.ConfirmID + '" value="确定" />'
      			 +'		</td>'
                 +'</tr>';
             }
             htmlSerarch += inputItem;
         }
         if(i <  _config.inputSearch.length+1){
             htmlSerarch += '<tr height="35px">'
                 +'		<td align="center" colspan="6">'
      			 +'			<input type="button" class="common-button" id="'+ _config.itemQueryID + '" value="查询" />'
      			 +'			<input type="button" class="common-button" id="'+ _config.ClearID + '" value="清空" />'
      			 +'			<input type="button" class="common-button" id="'+ _config.ConfirmID + '" value="确定" />'
      			 +'		</td>'
                 +'</tr>';
         }
         htmlSerarch += 	'</table>'
        	 			+ '</div>';
         
         var htmltable = '<table border="0"  height="250px" >'
        	 		 +'		<tr height="250px">'
        	 		 +'		<td width="100%">'
        	 		 +'			<div class="inner-list-area" >'
					 +'				<table id="'+ _config.SelectTableID + '"></table>'
					 +'			</div>'
					 +'		</td>'
					 +'		</tr>'
					 +'</table>';
         		
         var htmltail ='</div>';

         var html = htmlHeader + htmlSerarch + htmltable + htmltail;

		//挂载到body
    	var mainObj = $(html);
    	$(document.body).append(mainObj);
    	
    	//创建窗口
    	_config.win = JrzlTools.openModalWindow({
	    	id:_config.selectDivID,
	    	title:_config.title,
	    	height: _config.height,
		    width: _config.width,
		    beforeClose:function(){
		    	if(_config.beforeClose){
		    		_config.beforeClose(_config.UUID);
		    	}
		    }
	    });
    	//根据配置显示按钮
    	if(false == _config.querybutton){
    		$("#"+ _config.itemQueryID).css("display", "none");
    	}
    	if(false == _config.clearbutton){
    		$("#"+ _config.ClearID).css("display", "none");
    	}
    	if(false == _config.confirmbutton){
    		$("#"+ _config.ConfirmID).css("display", "none");
    	}
    	//初始化搜索框的  下拉列表
    	for(var i = 0; i<  _config.inputSearch.length; i += 1){
            var inputid = _config.inputSearch[i].id + _config.UUID;
            var datalist = _config.inputSearch[i].selectData;
            var selectUrl = _config.inputSearch[i].selectUrl;
            var ListNam = _config.inputSearch[i].ListNam;
            //先查看是否有本地数据
            if(null !== datalist &&   undefined !== datalist  && "" !== datalist){
                JrzlTools.autoCompleteSelect({//使用本地datalist
                    id : inputid,
                    data : datalist
                });
            }else if( undefined !== selectUrl && "" !== selectUrl){
            	Request.processDataRequest( {
        			url : selectUrl,
        			localStorage : null,
        			errorRedirect : true,
        			customParams : _config.inputSearch[i].selectParams,
        	        callbackFunc : function(data){
        	        	if(data[ListNam]){ //key可以设置
        	        		JrzlTools.autoCompleteSelect({
            	        		id : inputid,
            	        		data : data[ListNam]
            	        	});
        	        	}else{//key默认值：ITEMPICKSEARCHLIST
        	        		JrzlTools.autoCompleteSelect({
            	        		id : inputid,
            	        		data : data.ITEMPICKSEARCHLIST
            	        	});
        	        	}
        	        }
        		});
            } 
        }
    	//表格的列配置
    	window["rowdbclick"+ _config.UUID]= function(item){
    		if(null == _config.confirmCallBack){
    			JrzlTools.alert("未配置保存回调函数。","提示")
    			return;
    		}
    		var flag = _config.confirmCallBack(item, _config.UUID);
    		if(!flag){
    			self.hide();
    		}
        };
    	var itemQryListCfg = _config.tableCfg;
		var itemQryGridCfg = {
				id : _config.SelectTableID,
		        search : false,
		        height : 190,
		        rowdbclick:"rowdbclick"+ _config.UUID,
		        width  : _config.tableWidth,
		        needOrderNum : true};
		//使用editgrid的原因是有一些数据从redis中获取，并不支持分页
		JrzlTools.editGrid(itemQryGridCfg, itemQryListCfg);
		//初始化列表
		var table = window[_config.SelectTableID];
		table.loadData([]);		
    },
    _bindEnv:function(){
    	var self = this,
    	_config = self.config;
    	//绑定onchange事件
    	var changeFns= {};
        for(var i = 0; i< _config.inputSearch.length; i ++){
        	var inputid = _config.inputSearch[i].id + _config.UUID;
        	if(_config.inputSearch[i].onchangeFn){
        		changeFns[inputid] = _config.inputSearch[i].onchangeFn;
        		$("#"+ inputid).bind('blur', function() {
        			if (changeFns[this.id]) {
        				changeFns[this.id](this, _config.UUID);
        			}
        		});
        	}
        }
    	
    	//查询
    	$("#"+ _config.itemQueryID).bind('click',function(){
    		//优先使用本地查询数据
    		if(0 !== _config.localData.length){
    			var table = window[_config.SelectTableID];
    			table.loadData(_config.localData);
    			return;
    		}
    		
    		//向后台请求查询数据
    		var params = {
                    iDisplayLength : _config.iDisplayLength
            };
            if(null !== _config.urlParams){
                $.each(_config.urlParams, function(key, val){
                    params[key] = val;
                });
            }
            //根据搜索框拼接参数
            for(var i = 0; i<  _config.inputSearch.length; i ++){
                var inputid = _config.inputSearch[i].id ;
                var datalist = _config.inputSearch[i].selectData;
                //下拉框
                if($("#"+ inputid + _config.UUID).attr("code")){
                    params[inputid] =  $.trim($("#"+ inputid + _config.UUID).attr("code"));
                }else{
                    params[inputid] =  $.trim($("#"+ inputid + _config.UUID).val());
                }
                //使用默认值
                if(undefined != _config.inputSearch[i].DefaultVal && "" == params[inputid]){
                	params[inputid] =  _config.inputSearch[i].DefaultVal; 
        		}
                if (JrzlTools.containtElement(_config.Required, inputid ) && params[inputid] == ""){
                	JrzlTools.alert("请输入"+_config.inputSearch[i].label,"提示")
         			return;
                 }
            };
            //向后台查询
    		Request.processDataRequest({
    			url:_config	.url,
    			localStorage	:null,
    			progress		: true,
    			progressText      :  "正在查询，请稍候...",      //进度条提示
    			errorRedirect:true,
    			customParams:params,
    			callbackFunc:function(data){
    				var table = window[_config.SelectTableID];
    				if(data.ITEMSINGLEPICKLIST){//不是分页查询的，ITEMSINGLEPICKLIST是对应的key
    					table.loadData(data.ITEMSINGLEPICKLIST);
    				}else if(_config.QryDataListNam !== ""){//不是分页查询的，自定义的key
    					table.loadData(data[_config.QryDataListNam]);
    				}else{
        				table.loadData(data.__PagingResult.data);
    				}

    			}
    		});
    	});
    	
    	$("#"+ _config.ClearID).bind('click',function(){
    		JrzlTools.confirm("确认清空吗？", "提示", function(confirm) {
    			if (confirm) {
    				if(null == _config.clearCallBack){
    	    			JrzlTools.alert("未配置清空回调函数。","提示")
    	    			return;
    	    		}
    	    		var flag = _config.clearCallBack( _config.UUID);
    	    		if(!flag){
    	    			self.hide();
    	    		}
    			}
    		});

    	});
    	//保存按钮
		$("#"+ _config.ConfirmID).bind('click',function(){
			var table = window[_config.SelectTableID];
    		var resList = table.getSelection();
    		if(null === resList){
    			JrzlTools.alert("请至少选择一条记录。","提示")
    			return;
    		}
    		if(null == _config.confirmCallBack){
    			JrzlTools.alert("未配置保存回调函数。","提示")
    			return;
    		}
    		var flag = _config.confirmCallBack(resList, _config.UUID);
    		if(!flag){
    			self.hide();
    		}
	    });
    	
    },
    hide:function(){
    	var self = this,
        _config = self.config;
   	    _config.win.hide();
    },
    close:function(){
    	var self = this,
        _config = self.config;
   	    _config.win.close();
    },
    show:function(){
    	var self = this,
        _config = self.config;
   	    _config.win.show();
	   	 var table = window[_config.SelectTableID];
	     var resList = table.getData();
	     table.loadData(resList);
    }
 };
