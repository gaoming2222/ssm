
function ItemMultiPicker(options) {
      this.config = {
    		  	localData				:		 [], //本地数据
                itemQryGridUrl			:		"",
                itemQryGridUrlParam		:		{},
		    	QryDataListNam	:		"",  //查询列表在返回数据中对应的key值
                InitData				: 		[],
                title       			:		 null,
                height 					:		"auto",
                width 					:		0,
                itemTableWidth 			:		0,
                QryTableWidth 			:		0,
                confirmCallBack			:		null,
                beforeClose 			: 		null,
                inputSearch				:		[],
                itemColumnsCfg 			: 		[],
                itemQryListCfg 			:		[],
                isItemUnique 			: 		null,
            	iDisplayLength			:		50,
            	itemMoveLeftbutton		: 		true,
            	itemRemovebutton		: 		true,
            	itemRemoveAllbutton		: 		true,
            	itemQuerybutton			:		true,
            	saveitembutton			:		true,
            	Required 				: 		[]
        };

      this.config = $.extend(this.config, options || {});
      var uuid = JrzlTools.getUUID();
      this.config["UUID"] = uuid;
      this.config["itemQueryID"] = "itemQueryID"+ uuid;
      this.config["saveitemID"] = "saveitemID"+ uuid;
      this.config["itemTableID"] = "itemTableID"+ uuid;
      this.config["itemQryTableID"] = "itemQryTableID"+ uuid;
      this.config["itemMulitiDivID"] = "itemMulitiDivID"+ uuid;

      this.config["itemMoveLeftID"] = "itemMoveLeftID"+ uuid;
      this.config["itemRemoveID"] = "itemRemoveID"+ uuid;
      this.config["itemRemoveAllID"] = "itemRemoveAllID"+ uuid;
      this.init();
 }

ItemMultiPicker.prototype = {
    constructor: ItemMultiPicker,
    init: function(options){
        var self = this;
        _config = self.config;
        self._renderUI();
        // 绑定事件
        self._bindEnv();

        //初始化查询，在搜索必填项未设置的时候可初始化
        if (null == _config.Required || _config.Required.length || _config.Required.length == 0) {
        	document.getElementById(_config.itemQueryID).click();
		}

    },
    _renderUI:function(){
        var self = this,
        _config = self.config;

        var htmlHeader = '<div class="jrzlSelectTree" id="'+ _config.itemMulitiDivID + '" style="display:none;">';
        var htmlSerarch ='<table border="0" width="'+ _config.width + '" >';
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
                +'	<td class="head">'+Required2 + inputlabel1+'：</td>'
                +'	<td class="content">'
                +'		<input type="text" id="'+ inputid1 + '" style="width: 80%;" /></td>'
                +'</tr>';
            }else{
                var inputid = _config.inputSearch[i].id + _config.UUID;
                var inputlabel = _config.inputSearch[i].label;

                var Required1 = "";
                if (JrzlTools.containtElement(_config.Required, _config.inputSearch[i].id))
                	Required1 = "<font style='color:red;'>*</font>";

                inputItem  =
                   '<tr height="35px">'
                +'	<td class="required">&nbsp;</td>'
                +'	<td class="head">'+ Required1 +inputlabel+ '：</td>'
                +'	<td class="content">'
                +'		<input type="text" id="'+ inputid + '" style="width: 80%;"/></td>'
                +'	<td align="center" colspan="3">'
                +'	 	<input type="button" class="common-button" id ="'+ _config.itemQueryID + '" value="查询" />'
                +'	 	<input type="button" class="common-button" id ="'+ _config.saveitemID + '" value="保存" />'
                +'	</td>'
                +'</tr>';
            }
            htmlSerarch += inputItem;
        }
        if(i <  _config.inputSearch.length+1){
            htmlSerarch += '<tr height="35px">'
                  +'	<td align="center" colspan="6">'
                +'	 	<input type="button" class="common-button" id ="'+ _config.itemQueryID + '" value="查询" />'
                +'	 	<input type="button" class="common-button" id ="'+ _config.saveitemID + '" value="保存" />'
                +'	</td>'
                +'</tr>';
        }


        htmlSerarch += '</table>';
        var htmltable = '<table border="0"  height="250px">'
            +'	<tr height="250px">'
            +'	<td width="'+_config.itemTableWidth + 'px">'
            +'		<div class="inner-list-area">'
            +'			<table id="'+ _config.itemTableID + '">'
            +'				<thead>'
            +'				<tr><div style="text-align:center;background-color:#f3f4f6;font-family:Microsoft YaHei;font-size:14px;">已添加</div></tr>'
            +'				</thead>'
            +'			</table>'
            +'		</div>'
            +'	</td>'
            +'	<td align="center" width="68px" valign="middle">'
            +'		<div style="display:block;" >'
            +'			<input type="button"  class="button-left" id="'+ _config.itemMoveLeftID + '" value="左移" style="margin-bottom: 5px"/>'
            +'			<input type="button" class="button-remove"  id="'+ _config.itemRemoveID + '" value="移除"  style="margin-bottom: 5px"/>'
            +'		    <input type="button"  class="button-clear" id="'+ _config.itemRemoveAllID + '" value="清空"  style="margin-bottom: 5px"/>'
            +'		</div>'
            +'	</td>'
            +'	<td width="'+_config.QryTableWidth + 'px">'
            +'		<div class="inner-list-area">'
            +'			<table id="'+ _config.itemQryTableID + '">'
            +'				<thead>'
            +'				<tr><div style="text-align:center;font-family:Microsoft YaHei;background-color:#f3f4f6;font-size:14px;">待添加</div></tr>'
            +'				</thead>'
            +'			</table>'
            +'		</div>'
            +'	</td>'
            +'</tr>'
        +'</table>';
        var htmltail ='</div>';

        var html = htmlHeader + htmlSerarch + htmltable + htmltail;

        var mainObj = $(html);
        $(document.body).append(mainObj);

        _config.win = JrzlTools.openModalWindow({
            id:_config.itemMulitiDivID,
            title:_config.title,
            height: _config.height,
            width: _config.width,
            beforeClose:function(){
                if(_config.beforeClose){
                    _config.beforeClose(_config.UUID);
                }
            }
        });
        //根据配置隐藏按钮
    	if(false == _config.MoveLeftbutton){
    		$("#"+ _config.itemMoveLeftID).css("display", "none");
    	}
    	if(false == _config.Removebutton){
    		$("#"+ _config.itemRemoveID).css("display", "none");
    	}
    	if(false == _config.RemoveAllbutton){
    		$("#"+ _config.itemRemoveAllID).css("display", "none");
    	}
    	if(false == _config.Querybutton){
    		$("#"+ _config.itemQueryID).css("display", "none");
    	}
    	if(false == _config.SaveRole){
    		$("#"+ _config.saveitemID).css("display", "none");
    	}
        //初始化搜索框
        for(var i = 0; i<  _config.inputSearch.length; i += 1){
            var inputid = _config.inputSearch[i].id + _config.UUID;
            var datalist = _config.inputSearch[i].selectData;
            var selectUrl = _config.inputSearch[i].selectUrl;
            var ListNam = _config.inputSearch[i].ListNam;
            //优先使用本地数据
            if(null !== datalist &&   undefined !== datalist  && "" !== datalist){
                JrzlTools.autoCompleteSelect({
                    id : inputid,
                    data : datalist
                });
            }else if(  undefined !== selectUrl && "" !== selectUrl){
            	Request.processDataRequest( {
        			url : selectUrl,
        			localStorage : null,
        			errorRedirect : true,
        			customParams : _config.inputSearch[i].selectParams,
        	        callbackFunc : function(data){
        	        	if(data[ListNam]){
        	        		JrzlTools.autoCompleteSelect({
            	        		id : inputid,
            	        		data : data[ListNam]
            	        	});
        	        	}else{
        	        		JrzlTools.autoCompleteSelect({
            	        		id : inputid,
            	        		data : data.ITEMPICKSEARCHLIST
            	        	});
        	        	}

        	        }
        		});
            }
        }
        // 左边选择的用户列表
        var userGridCfg = {
                id : _config.itemTableID,
                search : false,
                height : 190,
                needOrderNum : false};
        var userQryGridCfg = {
                id :  _config.itemQryTableID,
                search : false,
                needCheckBox : true,
                height : 190,
                needOrderNum : false};
        JrzlTools.editGrid(userGridCfg, _config.itemColumnsCfg);
        JrzlTools.editGrid(userQryGridCfg, _config.itemQryListCfg);
        var table = window[_config.itemTableID];
        table.loadData(_config.InitData);
    },
    _getDataArrUnique:function(QryData, selectedData){
    	var self = this,
        _config = self.config;
    	var DataArr= [];
    	if(null != _config.isItemUnique){
            $.each(QryData, function(i, newitem){
                var itemExist = false;
                $.each(selectedData, function(i, item){
                    if(_config.isItemUnique(item, newitem)){
                    	itemExist = true;
                    	return;
                    }
                });
                if(false == itemExist){
                	DataArr.push(newitem);
                }
            });
        	return DataArr;
        }else{
        	return QryData;
        }
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
        	//使用本地查询数据
        	if(0 !== _config.localData.length){
    			var table = window[_config.SelectTableID];
    			table.loadData(_config.localData);
    			return;
    		}
        	//向后台请求查询数据
            var params = {
                    iDisplayLength : _config.iDisplayLength
            };
            if(null !== _config.itemQryGridUrlParam){
                $.each(_config.itemQryGridUrlParam, function(key, val){
                    params[key] = val;
                });
            }
            for(var i = 0; i<  _config.inputSearch.length; i ++){
                var inputid = _config.inputSearch[i].id ;
                var datalist = _config.inputSearch[i].selectData;
                if($("#"+ inputid + _config.UUID).attr("code")){
                    params[inputid] =  $.trim($("#"+ inputid + _config.UUID).attr("code"));
                }else{
                    params[inputid] =  $.trim($("#"+ inputid + _config.UUID).val());
                }
                if(undefined != _config.inputSearch[i].DefaultVal && "" == params[inputid]){
                	params[inputid] =  _config.inputSearch[i].DefaultVal;
        		}
                if (JrzlTools.containtElement(_config.Required, inputid ) && params[inputid] == ""){
                	JrzlTools.alert("请输入"+_config.inputSearch[i].label,"提示")
         			return;
                 }

            };// 列表查询参数
            Request.processDataRequest({
                url:_config.itemQryGridUrl,
                localStorage:null,
                errorRedirect:true,
                progress		: true,
    			progressText      :  "正在查询，请稍候...",      //进度条提示
                customParams:params,
                callbackFunc:function(data){
                    var itemTable = window[_config.itemTableID];
                    var QryData = [];
                    if(data.ITEMSINGLEPICKLIST){//不是分页查询的，ITEMSINGLEPICKLIST是对应的key
                    	QryData = data.ITEMSINGLEPICKLIST;
    				}else if(_config.QryDataListNam !== ""){//不是分页查询的，ITEMSINGLEPICKLIST是对应的key
    					QryData = data[_config.QryDataListNam];
    				}else{
    					QryData =data.__PagingResult.data;
    				}
                    var selectedData = itemTable.getData();
                    var DataArr= self._getDataArrUnique(QryData, selectedData);
                    var table = window[_config.itemQryTableID];
                    table.loadData(DataArr);
                }
            });
        });
        //保存
        $("#"+ _config.saveitemID).bind('click',function(){

            var table = window[_config.itemTableID];
            var resList = table.getData();
            var flag = _config.confirmCallBack(resList);
            if(!flag){
                self.hide();
            }
        });
        // 左移
        $("#"+ _config.itemMoveLeftID).bind('click',function(){
            var itemQryTable = window[_config.itemQryTableID];
            var itemTable = window[_config.itemTableID];
            var alldata = itemQryTable.getMultiSelection();
            if(alldata && alldata.length > 0){
            }else {
                JrzlTools.alert('请勾选记录。', '提示');
                return;
            }
            // 判断用户是否存在
            var rolitem = itemTable.getData();
            var additemList = [];
            if(null != _config.isItemUnique){
                $.each(alldata, function(i, newitem){
                    var itemExist = false;
                    $.each(rolitem, function(i, item){
                        if(_config.isItemUnique(item, newitem)){
                            itemExist = true;
                            return;
                        }
                    });
                    if (!itemExist) {
                        additemList.push(newitem);
                    }
                });
            }else{
                additemList = alldata;
            }
            itemTable.loadData(rolitem.concat(additemList));
            var DataArr= self._getDataArrUnique(itemQryTable.getData(), rolitem.concat(additemList));
            itemQryTable.loadData(DataArr);
/*          if(additemList.length > 0){
                itemTable.loadData(rolitem.concat(additemList));
            }else{
                JrzlTools.alert('所勾选项已添加，请勿重复添加。', '提示');
            }*/
        });
        //移除
        $("#"+ _config.itemRemoveID).bind('click',function(){

            var itemTable = window[_config.itemTableID];
            var mygridSelected =  itemTable.getSelection();
            if (mygridSelected == null){
                JrzlTools.alert("请至少选择一条需要删除记录。","提示");
                return;
            }

            var rolitem = itemTable.getData();
            var newRolitem = [];
        	var itemQryTable = window[_config.itemQryTableID];
        	var QryData = itemQryTable.getData();
            $.each(rolitem, function(i, item){
                if(item != mygridSelected) {
                    newRolitem.push(item);
                }
            });
            if(self.config.Required.length == 0){
                document.getElementById(self.config.itemQueryID).click();
            }
            itemTable.loadData(newRolitem);
        });
        //清空
        $("#"+ _config.itemRemoveAllID).bind('click',function(){

            JrzlTools.confirm("确认清空吗？", "提示", function(confirm) {
                if (confirm) {
                    var itemTable = window[_config.itemTableID];
                    itemTable.loadData([]);
                    if(self.config.Required.length == 0){
                    	document.getElementById(self.config.itemQueryID).click();
                    }
                }
            });
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
       var table = window[_config.itemTableID];
       var resList = table.getData();
       table.loadData(resList);
       var Qrytable = window[_config.itemQryTableID];
       var QryresList = Qrytable.getData();
       Qrytable.loadData(QryresList);
    }
 };
