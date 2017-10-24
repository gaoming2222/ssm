//拼音全局变量
var g_py_SelectCfg = [];

var JrzlTools = {
		//关闭前清理数据
		destroy:function(){
			//清除拼音信息
			if(g_py_SelectCfg != null ){
				for(var i=0,len=g_py_SelectCfg.length;i<len;i++){
					g_py_SelectCfg[i].data.length=0;
					g_py_SelectCfg[i].data=[];
					g_py_SelectCfg[i] = null;
				}
				g_py_SelectCfg.length = 0;
				g_py_SelectCfg = 0;
			}
			//
			//释放jquery 对象
			try{
				jQuery.cleanData($(document.body)[0].getElementsByTagName("*"));
				jQuery.cleanData($(document));
			}catch(e){}

			//清理查询结果框
			var s = $(document).dataTableSettings;
	        if (s != undefined && s != 'undefined') {
				var rowelem = null;
				var cellelem = null;
				var k=0;
				var j=0;
	            for (var i=0,len = s.length; i < len && s[i] != null; i++)
	            {
	            	$("#" + s[i].sTableId).DataTable().destroy(true);
	                s.splice(i,1);
	            }
				rowelem = null;
				cellelem = null;
				k=null;
				j=null;
	        }
			s = null;
		},
		/**
		 * 获取视图X坐标
		 * @param arr 查询数组
		 * @param id  查询元素
		 * @returns true表示包含，false表示不包含
		 */
		getViewportScrollX : function () {
			var scrollX = 0;
			if (document.documentElement && document.documentElement.scrollLeft) {
			  scrollX = document.documentElement.scrollLeft;
			}
			else if (document.body && document.body.scrollLeft) {
			  scrollX = document.body.scrollLeft;
			}
			else if (window.pageXOffset) {
			  scrollX = window.pageXOffset;
			}
			else if (window.scrollX) {
			  scrollX = window.scrollX;
			}
			return scrollX;
		},
		/**
		 * 获取视图X坐标
		 * @param arr 查询数组
		 * @param id  查询元素
		 * @returns true表示包含，false表示不包含
		 */
		getViewportScrollY:function() {
		    var scrollY = 0;
		    if (document.documentElement && document.documentElement.scrollTop) {
		      scrollY = document.documentElement.scrollTop;
		    }
		    else if (document.body && document.body.scrollTop) {
		      scrollY = document.body.scrollTop;
		    }
		    else if (window.pageYOffset) {
		      scrollY = window.pageYOffset;
		    }
		    else if (window.scrollY) {
		      scrollY = window.scrollY;
		    }
		    return scrollY;
		  },
		/**
		 * 判断数组中是否包含元素
		 * @param arr 查询数组
		 * @param id  查询元素
		 * @returns true表示包含，false表示不包含
		 */
		containtElement:function(arr,id){
			if(arr==null||arr==undefined||arr.length==0||id==null||id==undefined||id.length==0){
				return false;
			}
			for(var i=0,len=arr.length;i<len;i++){
				if(arr[i]==id){
					return true;
				}
			}
			return false;
		} ,
		/**
		 * 获取一个UUID
		 * @returns 返回生成的UUID
		 */
        getUUID:function(){
			return (new UUID()).toString();
		},
		/**
		 * 将cfg中defaultCfg含有的字段值覆盖
		 * private
		 */
		_extend : function(defaultCfg, cfg){
			if(cfg == null || $.isEmptyObject(cfg)){
				return defaultCfg;
			}
			for(var i in defaultCfg){
				if(cfg[i] != undefined){
					defaultCfg[i] = cfg[i];
				}
			}
			return defaultCfg;
		},
		/**
		 * 克隆对象
		 */
	    cloneObject:function (obj){
	    	if( obj == undefined || obj == null ){
	    		return null;
	    	}
			var o = obj.constructor === Array ? [] : {};
			for(var i in obj){
				if(obj.hasOwnProperty(i)){
				   o[i] = typeof obj[i] === "object" ? JrzlTools.cloneObject(obj[i]) : obj[i];
				}
			}
			return o;
		},
		/**
		 * 格式化时间
		 * @param date 日期如new Date()
		 * @param format 格式如yyyyMMdd、yyyy-MM-dd等
		 * @returns 格式化后的日期字符串
		 */
		formatDate:function(date,format){
			var _year = date.getFullYear();
			var _month = date.getMonth() + 1,
				_month = _month < 10 ? ("0" + _month) : _month;
			var _day = date.getDate(),
				_day = _day < 10 ? ("0" + _day) : _day;
				var _hour = date.getHours(),
				_hour = _hour < 10 ? ("0" + _hour) : _hour;
				var  _minute  = date.getMinutes(),
				_minute = _minute < 10 ? ("0" + _minute) : _minute;
				var _second = date.getSeconds(),
				_second = _second < 10 ? ("0" + _second) : _second;

				return	format.replace(/yyyy/,_year).replace(/MM/,_month).replace(/dd/,_day).replace(/hh/,_hour).replace(/mm/,_minute).replace(/ss/,_second);
		},
		//获得字符串的实际长度，一个中文包含两个字符
		getRealLength:function(pValue){
		    var result = 0;
		    var value = $.trim(pValue);
		    for (var i = 0; i < value.length; i++) {
		        if ( escape(value.charAt(i)).indexOf("%u") >= 0
		        		|| escape(pValue.charAt(i)) == "%0A" || escape(pValue.charAt(i)) == "%0D%0A"){
		        	result = result + 2;
		        }
		        else{
		        	result = result + 1;
		        }
		    }
		    return result;
		},
		//获得字符串的实际长度，一个中文包含两个字符,与输入长度比较，大于输入长度返回1，等于返回0，小于返回-1
		compareRealLength:function(pValue,len){
		    var result = 0;
		    var value = $.trim(pValue);
		    var font_size = 12;
		    for (var i = 0,vlen=value.length; i < vlen; i++) {
		        if ( escape(value.charAt(i)).indexOf("%u") >= 0 ){
		        	result += font_size;
		        }
		        else{
		        		result += font_size*0.5;
		        }
		        if(result > len){
		        	return 1;
		        }
		    }
		    if(result == len){
	        	return 0;
	        }
		    if(result < len){
	        	return -1;
	        }
		},
		// 根据宽度截取字符串
		substringByWidth:function(str, width){
			var result = 0;
			var font_size = 12;
			for (var i = 0,slen=str.length; i < slen; i++) {
				if ( escape(str.charAt(i)).indexOf("%u") >= 0 ){
					result += font_size;
				}
				else{
					result += font_size*0.5;
				}

				if(result > width - 3*font_size*0.5){
					return str.substring(0,i) + "...";
				}
			}
		},
		//获得json对象的items的个数
		getJsonLength:function(json){
			 var jsonLength=0;
			   for(var item in json){
				   jsonLength++;
			   }
			 return jsonLength;
		},
		isPaas :function(reqUrl){
			if( reqUrl == null || reqUrl == "" ){
				reqUrl = window.location.host;
			}
			var index = reqUrl.toUpperCase().indexOf(".PAAS");
			return (index > 0);
		},
		//获取部署名
		getDeployName: function(){
			if(JrzlTools.isPaas()) {
				return '';
			}
			var localUrl = window.location.href;

			var index = localUrl.indexOf("/jrzl/");
			if(index==-1){
				index = localUrl.indexOf("/common/uic/");
			}
			var baseUrl = localUrl.substr(0,index);
			var lastIndex = baseUrl.lastIndexOf("/");
			var deployName = '';
			if(_isAjaxRequest == true) {
				deployName = baseUrl.substr(lastIndex,index);
			} else {
				deployName = baseUrl.substr(0,index);
			}
			return deployName;
		},
		//PaaS域名重写
		paasDomainRewrite: function(requestDomain){
			if(!JrzlTools.isPaas() || !JrzlTools.isPaas(requestDomain)) {
				return requestDomain;
			}
			var staIdx = 0;
			if( requestDomain.toLowerCase().indexOf("http://") == 0 ){
				staIdx = 7;
			}else if(requestDomain.toLowerCase().indexOf("https://") == 0){
				staIdx = 8;
			}else{
				return requestDomain;
			}
			var localDomain =  window.location.host;
			var prefix = requestDomain.substring(0, requestDomain.indexOf("."));
			var tail = localDomain.substring(localDomain.indexOf("."));
			var params = "";
			if(requestDomain.indexOf("/", staIdx+1) > 0){
				params = requestDomain.substring(requestDomain.indexOf("/", staIdx+1));
			}
			return prefix+tail+params;
		},
		//获得当前文件相对根目录的相对路径层级，以../../的形式返回字符串
		getPathLevel:function(){
			var localUrl = window.location.href;
			var index = localUrl.indexOf("/jrzl/");
			if(index==-1){
				index = localUrl.indexOf("/common/uic/");
			}
			var pathUrl = localUrl.substr(index);
			var lvls = pathUrl.split('/');
	        var len = lvls.length;
	        if(len>2){
	        	len=len-2;
	        }else{
	            len=0;
	        }
	        var str = "";
			for(var i=0;i<len;i++ ){
				str = str+"../";
			}
			return str;
		},
		// 判断对象是不是dom对象
		isDom:function(obj){
			return (typeof HTMLElement  === 'object') ?
		        	(obj instanceof HTMLElement) :
		    		(obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string');
		},
		//获得当前浏览器版本
		getBrowser:function (){
			   if(navigator.userAgent.indexOf("MSIE")>0) {
			        return "MSIE";
			   }
			   if(navigator.userAgent.indexOf("Firefox")>0){
			        return "Firefox";
			   }
			   if(navigator.userAgent.indexOf("Safari")>0) {
			        return "Safari";
			   }
			   if(navigator.userAgent.indexOf("Camino")>0){
			        return "Camino";
			   }
			   if(navigator.userAgent.indexOf("Gecko/")>0){
			        return "Gecko";
			   }
			   if(navigator.userAgent.indexOf("Chrome")>0){
			        return "Chrome";
			   }
			   return "";
		},
		/**
		 * jcr模板处理
		 * @param jcrPath
		 * @param cfg
		 * @returns
		 */
		tplcompile:function(jcrPath,cfg){
				return juicer(jcrPath,cfg);
		},
		/**
		 * grid默认的Render函数
		 */
		_gridDefaultRender : function(data, type, full, meta){
		    if (data == "undefined" || data == null || data == "") {
		      return "";
		  } else {
		      return data;
		  }
		},
		/**
		 * 创建数据查询gird列表
		 */
		queryGrid:function(gridCfg,columnCfg){
			var defaultGridCfg={
					id                 :  null,     //gird外层容器id（必选）
					action             :  null,     //数据ajax远程请求url
					localItems         :  null,     //本地数据json数组
					initable   		   :  false,    //是否需要在初始化时执行远程请求，只在items为null，且配置action时有效
					needOrderNum 	   :  false,    //是否需要行数据前的序号
					needCheckBox       :  false,    //是否需要行数据前的复选框
					disableTopCheckBox :  false,    //是否使表头checkbox disabled
					pageSize           :  50,       //grid页行数
					rowdbclick         :  null,     //自定义行双击事件
					title              :  null,     //grid的title
					height             :  400,      //grid数据高度,使用'auto'表示动态高度
					scrollX			   :  false,    //是否启用横向滚动条，true时 宽度需使用px表示
					footerBar		   :  true,     //底部分页信息/按钮显示区
					pagingInfo		   :  true,     //分页信息
					initParams         :  {},       //初始化请求的参数
					validated          :  false,    //是否需要校验请求参数
					afterLoaded	  	   :  null,      //数据加载完成回调函数
					drawCallback       :  null,
					searching	       :  false,	//搜索功能
				    searchInput	       :  false,	//搜索框input
				    indexWidth	       :  "6%" ,     //序号列的宽度，一般情况保持默认设置
				    clickCallback	   :  null,		 //checkbox勾选事件(如果有checkbox栏)，第一个参数为该行数据rowData,第二个参数为checkbox对象
				    preDataCallback    :  null,      //数据预处理回调函数
				    allSelectCallback  :  null,       //全选事件
				    multiPageSelect    :  false,	  //多页选择
				    primaryKey         :  "",	  //条目主键，唯一标识一条记录，用于多页选择
				    total			   :  false,    //总计
				    pageTotal		   :  false,    //分页合计选项
				    totalTextCol	   :  1,         //显示“合计”、“总计”的列数，从左侧第一列开始,total||pageTotal为true才有效
				    totalTextKey	   :  "totalTextKey",	//获取“总合计(**)”的Key,需要自定义才配
				    pageTotalTextKey   :  "pageTotalTextKey",//获取“本页合计(**)”的Key,需要自定义才配
				    isFloat		   	   :  true		//是否浮动显示内容，false表示不浮动显示内容，默认浮动
			};
			if(typeof(SYS_PAGESIZE)!= "undefined"){
				defaultGridCfg.pageSize = SYS_PAGESIZE;
			}
			//模板路径
			var jcrPath = "#"+JrzlTools.getPathLevel()+"common/juicertpl/querygrid/querygrid.jcr";

			var lgridCfg = JrzlTools._extend(defaultGridCfg,gridCfg || {});
			defaultGridCfg= null;

			if(lgridCfg==null||lgridCfg.id==null||lgridCfg.id.length==0||lgridCfg.id==undefined){
				JrzlTools.alert("gird配置参数中id不能为空。","提示 ");
				lgridCfg = null;
				return;
			}
			if(columnCfg==null||columnCfg.length==0){
				JrzlTools.alert("列配置不能为空。","提示 ");
				lgridCfg = null;
				return;
			}
			if(lgridCfg.action==null && lgridCfg.localItems==null){
				JrzlTools.alert("grid没有配置action和localItems，请至少配置其中一个。","提示 ");
				lgridCfg = null;
				return;
			}
			/**
			 * 是否是远程请求的判断
			 */
			var flag = true;
            if (typeof(_isAjaxRequest)!= "undefined") {
            	flag = _isAjaxRequest;
			}
            if(flag==false&&lgridCfg.localItems==null){
            	JrzlTools.alert(lgridCfg.id+"是本地数据形式，需要配置localItems。","提示 ");
            	lgridCfg = null;
            	return;
            }

            if(flag==false){
            	lgridCfg["isAjaxRequest"]=false;
            }else if(flag==true&&lgridCfg.action==null){
            	lgridCfg["isAjaxRequest"]=false;
            }else{
            	lgridCfg["isAjaxRequest"]=true;
            }

            lgridCfg["pathLevel"]  = JrzlTools.getPathLevel();
            lgridCfg["deployName"] = JrzlTools.getDeployName();
            lgridCfg["url"] =  JrzlTools.getDeployName()+lgridCfg["action"];
            lgridCfg["haveUrl"] = lgridCfg["action"] != null && lgridCfg["action"] != "";
            lgridCfg["pageSizeUrl"] = JrzlTools.getDeployName()+"/jrzl/pub/index/pageSizeModify.action";

			var sys_RequestPageId;
			if (typeof(SYS_REQUESTPAGEID)== "undefined") {
				 sys_RequestPageId = "pass";
			}else{
				 sys_RequestPageId = SYS_REQUESTPAGEID;
			}
			lgridCfg["SYS_REQUESTPAGEID"] = sys_RequestPageId;

			for(var i=0,len=columnCfg.length;i<len;i++){
				var defaultColumnCfg={
						property           :  null,      //属性id（非空）
						title              :  null,      //属性显示别名（非空）
						hidden             :  false,     //是否隐藏列（可选）
						width              :  null,      //自定义列宽度（大小或百分比）（可选）
						align              :  "center",  //字段水平排列方式（可选）
						sortable           :  true,      //字段是否可排序（可选）
						displayItems       :  null,      //字段值按displayItems中对应的值显示（可选）
						decorator          :  null,      //字段值按decorator制定的当时显示MoneyDecorator、DateDecorator
						thBorder           :  true,       //该列头部边框是否显示(默认显示)
						moneyException	   :  null,		  //money类型exception配置，只有当decorator为MoneyDecorator时生效
						renderer     :  "JrzlTools._gridDefaultRender"

				};
				columnCfg[i] = JrzlTools._extend(defaultColumnCfg,columnCfg[i] || {});
				defaultColumnCfg = null;
			}

			//初始化参数处理
			var paramList = [];
			for(var key in lgridCfg.initParams){
				var param = {name:key,value:(lgridCfg.initParams)[key]};
				paramList.push(param);
			}
			/*
			 * 80274970
			 * 增加money异常显示配置
			 */
			for(var i=0,len=columnCfg.length;i<len;i++){
				if(columnCfg[i].decorator == "MoneyDecorator" && columnCfg[i].moneyException != null && JrzlTools.getJsonLength(columnCfg[i].moneyException)){
					columnCfg[i].moneyException = JSON.stringify(columnCfg[i].moneyException).replace(/"/g,"\\\'");
				}
			}

			lgridCfg["paramList"] = paramList;
			var uuid = this.getUUID();
			lgridCfg["UUID"] = uuid;
			lgridCfg["columns"] = columnCfg;
			var html = juicer(jcrPath,lgridCfg);
		    var griddiv = $("#"+lgridCfg.id);
		    griddiv.append(html);

		    lgridCfg.length=0;
		    lgridCfg = null;
		    columnCfg.length=0;
		    columnCfg = null;
		    paramList.length=0;
		    paramList = null;
		    html = null;
		    griddiv = null;
		},

		/**
		 * 普通数据grid
		 */
		editGrid:function(gridCfg,columnCfg) {
				var defaultGridCfg={
						id                 :  null,     //gird外层容器id（必选）
						data               :  '[]',        //本地数据json数组
						needOrderNum 	   :  false,    //是否需要行数据前的序号
						needCheckBox       :  false,
						title              :  null,     //grid的title
						height             :  200,       //grid数据高度
						scrollX			   :  false,     // 横向滚动条 true时 列宽用px
						search             :  true,     //是否可搜索
						add                :  false,     //是否需要新增一行按钮
						modify             :  false,     //是否需要修改按钮
						remove             :  false,     //是否需要删除行按钮
						imports            :  false,     //是否需要导入按钮,导入按钮和导入处理函数handleImportData配合使用
						rowdbclick         :  null,     //自定义行双击事件
						clear              :  false,      //是否需要清空按钮
						handleImportData   :  null,        //导入数据处理函数
						customButtons      :  [],            //自定义按钮[{text:'add',handle:"addclick"},....]
						isFloat		   	   :  true		//是否浮动显示内容，false表示不浮动显示内容，默认浮动

				};
				//模板路径
				var jcrPath = "#"+JrzlTools.getPathLevel()+"common/juicertpl/editgrid/editgrid.jcr";

				gridCfg = JrzlTools._extend(defaultGridCfg,gridCfg || {});

				if(gridCfg==null||gridCfg.id==null||gridCfg.id.length==0||gridCfg.id==undefined){
					JrzlTools.alert("gird配置参数中id不能为空。","提示 ");
					return;
				}
				if(gridCfg.imports==true&&gridCfg.handleImportData==null){
					JrzlTools.alert("id为："+gridCfg.id+"的数据grid设置了导入按钮，需要设置导入处理函数配合使用。","提示 ");
					return;
				}
				if(columnCfg==null||columnCfg.length==0){
					JrzlTools.alert("id为："+gridCfg.id+"的数据grid列配置不能为空。","提示 ");
					return;
				}

				for(var i=0,len=columnCfg.length;i<len;i++){
					var defaultColumnCfg={
		            		property           :  null,      //属性id（非空）
		            		title              :  null,      //属性显示别名（非空）
		            		hidden             :  false,     //是否隐藏列（可选）
		            		width              :  null,      //自定义列宽度（大小或百分比）（可选）
		            		align              :  "center",  //字段水平排列方式（可选）
		            		sortable           :  true,      //字段是否可排序（可选）
		            		editable           :  true,      //字段是否可编辑
		            		type               :  null,      //字段类型,number(数值),date(日期),money(金额），email(邮件）,mobile(手机号）,checkbox(复选）,combobox(下拉）,null时表示是默认字符串类型
		            		moneyException	   :  null,      //money类型exception配置，只有当type为money时生效
		            		comboData          :  "[]",      //当type为combobox时，需要下拉框的下拉数据，格式为[{label:"label1",value:"value1"},{label:"label2",value:"value2"}]
		            		allowBlank         :  true,      //是否允许非空
		            		isUnique		   :  false,	 //该列数据是否唯一（没有重复）,默认允许
		            		maxLength		   :  null,
		            		regex              :  null ,     //自定义校验正则表达式
		            		regexText          :  "",     	 //自定义校验不通过提示（和regex配合使用)
		            		defaultValue       :  "",        //新增行时的默认值
		            		displayItems       :  null,      //字段值按displayItems中对应的值显示（可选）
		            		inlineEdit         :  false,
		            		inlineOption	   :  null,
		            		renderer     :  "JrzlTools._gridDefaultRender"


					};
					columnCfg[i] = JrzlTools._extend(defaultColumnCfg,columnCfg[i] || {});
				}
				var editColumnCfg = [];
				for(var i=0,len=columnCfg.length;i<len;i++){
					//if(!columnCfg[i].hidden){
						editColumnCfg.push(columnCfg[i]);
					//}
					/*
					 * 80274970
					 * 增加money异常显示配置
					 */
					if(columnCfg[i].type == "money" && columnCfg[i].moneyException != null && JrzlTools.getJsonLength(columnCfg[i].moneyException)){
						columnCfg[i].moneyException = JSON.stringify(columnCfg[i].moneyException).replace(/"/g,"\\\'");
					}
				}

				var dateImage = JrzlTools.getPathLevel() + "common/plugins/datatables-1.10.0/images/editor/calender.png";

				var buttonBar = false;
				if(gridCfg.add||gridCfg.modify||gridCfg.remove
					 ||gridCfg.imports||gridCfg.clear||gridCfg.customButtons.length>0){
					buttonBar = true;
				}

				var uuid = this.getUUID();
				gridCfg["pathLevel"]  = JrzlTools.getPathLevel();
				gridCfg["UUID"] = uuid;
				gridCfg["columns"] = columnCfg;
				gridCfg["editColumns"] = editColumnCfg;
				gridCfg["dateImage"] = dateImage;
				gridCfg["buttonBar"] = buttonBar;
				var html = juicer(jcrPath,gridCfg);
			    $("#"+gridCfg.id).append(html);

		},

		/**
		 * 文件上传，jcrPath:模板路径，uploadCfg上传文件相关配置
		 */
		fileUpload:function(uploadCfg){
			var defaultCfg={
			    id:null,            	//外层容器id（非空）
				max_file_size:20,  		//单位是mb（可选）
				max_file_number:10000,  //最多一次可上传的文件数（可选）
				initFiles : [],       	//初始化文件对象（已上传）格式{id:"ddd",FILEID:"ddd",name:"myfile.gif",size:1024,origSize:1024,loaded:1024}
				fileTypes : null          //上传文件类型，默认全部,格式'xlsx,xls'

			};
			//模板路径
			var jcrPath = "#"+JrzlTools.getPathLevel()+"common/juicertpl/plupload/upload.jcr";

			uploadCfg = JrzlTools._extend(defaultCfg,uploadCfg || {});
			if(uploadCfg==null||uploadCfg.id==null||uploadCfg.id.length==0||uploadCfg.id==undefined){
				JrzlTools.alert("上传控件配置参数中id不能为空。","提示 ");
				return;
			}
			if(uploadCfg.max_file_size < 50 ){
				uploadCfg.max_file_size = 50;
			}

			uploadCfg["reLoginUrl"] =  "/pageAuthValidate.do"; //超时重登录url

			uploadCfg["url"] =  JrzlTools.getDeployName()+"/jrzl/file/upload.do";
			uploadCfg["flash_url"] = JrzlTools.getPathLevel()+"common/plugins/plupload-2.1.1/Moxie.swf";
			uploadCfg["silverlight_url"] = JrzlTools.getPathLevel()+"common/plugins/plupload-2.1.1/Moxie.xap";

			//附件上传类型控制
		    if(uploadCfg.fileTypes != null && uploadCfg.fileTypes != ''){
			   	uploadCfg["fileTypesTips"] = "选择文件"+uploadCfg.fileTypes;
			   	uploadCfg["fileTypes"] = uploadCfg.fileTypes;
		    }
		   	else{
			   	uploadCfg["fileTypesTips"] = "所有文件";
			   	uploadCfg["fileTypes"] = "*";
		   	}

			uploadCfg["UUID"]=this.getUUID();
			var html = juicer(jcrPath,uploadCfg);
		    $("#"+uploadCfg.id).append(html);

		    // 初始化已上传文件
		    if(uploadCfg.initFiles != null && uploadCfg.initFiles.length > 0){
		    	var fileIds = "";
		    	for(var i in uploadCfg.initFiles){
			   		fileIds += "@" + uploadCfg.initFiles[i].FILEID;
			   		uploadCfg.initFiles[i].precent = "100%";
			   		uploadCfg.initFiles[i].status = plupload.DONE;
			   		uploadCfg.initFiles[i].destroy = function(){};
			   		uploadCfg.initFiles[i].getNative = function(){return null;};
			   		uploadCfg.initFiles[i].getSource = function(){return null;};
		    	}
		   		$("#"+uploadCfg.id).plupload('addFiles',uploadCfg.initFiles);
		   		$("#"+uploadCfg.id).attr("file",fileIds.substr(1));
		   	 }

		    html = null;
		},
		/**
		 * 检查附件是否提交完毕
		 */
		uploadComplete:function(id,callback){
			JrzlTools._checkStatus(id,callback);
		},
		_checkStatus :function(id,callback){
			var status = window["eval"].call(window, id+"_Completed");
			if(status==null){
				status = true;
			}
			if (status) {
				 JrzlTools.unloading();
		         callback();
		    }else{
		    	 JrzlTools.loading("上传附件中...");
		         setTimeout(function(){ JrzlTools.checkStatus(id,callback);}, 1000);
		         return;
		    }
		},
		/**
		 * 返回附件上传状态
		 */
		uploadCompleteStatus:function(id){
			var status = window["eval"].call(window, id+"_Completed");
			if(status==null){
				status = true;
			}
			return status;
		},
		/**
		 * 日期控件
		 */
		date:function(dateCfg){
			var defaultCfg={
					id    	: null,        //外层容器id（非空）
					format	:'yyyyMMdd',  //日期格式
					maxDate	: "",		  //最大日期(格式yyyy-MM-dd)
					minDate	: "",		  //最小日期(格式yyyy-MM-dd)
					change	: null,		  //change事件
					isShowToday : true,    //是否显示【今天】按钮
					readOnly: false 	  //日期输入框是否可编辑
				};
			dateCfg = JrzlTools._extend(defaultCfg,dateCfg || {});
			if(dateCfg==null||dateCfg.id==null||dateCfg.id.length==0||dateCfg.id==undefined){
				JrzlTools.alert("日期参数中id不能为空。","提示 ");
				return;
			}
			var originalDate = null;
			$("#"+dateCfg.id).bind("click",function(){
				WdatePicker({
					dateFmt	:	dateCfg.format,
					maxDate :	dateCfg.maxDate,
					minDate :	dateCfg.minDate,
					isShowToday : dateCfg.isShowToday,
					readOnly:	dateCfg.readOnly,
					onpicking:	function(){originalDate = $("#"+dateCfg.id).val();},
					onpicked:	function(){
						if(typeof dateCfg.change == "function" && originalDate != $("#"+dateCfg.id).val()){
							dateCfg.change();
						}
					}
				});
			});

		},
		/**
		 * 范围日期控件
		 */
		dateRange:function(dateCfg){
			var defaultCfg={
				    from	:	null,          //外层from容器id（非空）
				    to		:	null,          //外层to容器id(非空）
					format	:	'yyyyMMdd',    //日期格式
					isShowToday : true,		   //是否显示【今天】按钮
					minDate	: "",		       //最小日期(格式yyyy-MM-dd)
					change	: null,		       //change事件
					oncleared : null,           //点击【清除】触发事件
					readOnly: false 	        //日期输入框是否可编辑
				};
			dateCfg = JrzlTools._extend(defaultCfg,dateCfg || {});

			if(dateCfg==null||dateCfg.from==null||dateCfg.from.length==0||dateCfg.from==undefined){
				JrzlTools.alert("日期参数from不能为空。","提示 ");
				return;
			}
			if(dateCfg==null||dateCfg.to==null||dateCfg.to.length==0||dateCfg.to==undefined){
				JrzlTools.alert("日期参数to不能为空。","提示 ");
				return;
			}
			var originalFDate = null;
			$("#" + dateCfg.from).bind("click",function(){
				WdatePicker({
					dateFmt		:	dateCfg.format,
					isShowToday :   dateCfg.isShowToday,
					readOnly    :	dateCfg.readOnly,
					maxDate		:	'#F{$dp.$D(\''+dateCfg.to+'\')}',
					minDate 	:	dateCfg.minDate,
					onpicking:		function(){originalFDate = $("#"+dateCfg.from).val();},
					onpicked	:	function(){
										$("#"+dateCfg.from).parent().focus();
										if(typeof dateCfg.change == "function" && originalFDate != $("#"+dateCfg.from).val()){
											dateCfg.change();
										}
									},
					oncleared   : dateCfg.oncleared
				});
			});
			var originalTDate = null;
			$("#" + dateCfg.to).bind("click",function(){
				WdatePicker({
					dateFmt		:	dateCfg.format,
					isShowToday :   dateCfg.isShowToday,
					readOnly    :	dateCfg.readOnly,
					minDate		:	'#F{$dp.$D(\''+dateCfg.from+ '\')}',
					onpicking:		function(){originalTDate = $("#"+dateCfg.to).val();},
					onpicked	:	function(){
										$("#"+dateCfg.to).parent().focus();
										if(typeof dateCfg.change == "function" && originalTDate != $("#"+dateCfg.to).val()){
											dateCfg.change();
										}
									},
					oncleared   : dateCfg.oncleared
				});
			});

		},
		_fillPyData:function(pinyinId,bi,ei){
			  var pdata = g_py_SelectCfg[pinyinId].data;
	          for(var i=bi,len=pdata.length;i<ei && ei<len;i++){
	        	  ob = pdata[i];
	        	  if(ob.pinyins == undefined){
	        		  ob.pinyins =  (ob.label || ob.value ) + pinyinMakePy(ob.label || ob.value ).join(",");
	        	  }
	          }
	          pdata = null;

		},
		/**
		 * 自动完成选择
		 */
		autoCompleteSelect:function(selectCfg){
			var defaultCfg={
				    id:null,            //外层容器id(非空）
				    data:[],            //列表数据 （可选）
				    defaultValue:null,            //默认值
				    onchange:null,       //change回调 （可选）
				    clear:null,			//某些场景清空input框时调用回调函数
				    needFocus:false
				};
			if(selectCfg==null || selectCfg.id==null || selectCfg.id==undefined || selectCfg.id.length==0){
				JrzlTools.alert("自动完成控件的id不能为空。","提示 ");
				return;
			}
			if(selectCfg.data==null || selectCfg.data==undefined ){
				selectCfg.data = [];
			}

			//设置全局变量
			var pinyinId = selectCfg.id;
			g_py_SelectCfg[pinyinId]= JrzlTools._extend(defaultCfg,selectCfg || {});

			defaultCfg = null;
			selectCfg = null;

			var ei = 0;
			var dlen = g_py_SelectCfg[pinyinId].data.length;
			var ci = 0;
			while(ci < dlen){
				setTimeout("JrzlTools._fillPyData('"+pinyinId+"',"+ci+","+ci+"+500);",1000);
				ci=ci+500;
			}
			ei = null;
			$( "#"+pinyinId ).attr("CODE","");
		    $( "#"+pinyinId ).autocomplete({
			      autoFocus: false,
			      delay:0,
			      source: function( request, response ) {
			    	  var matcher = new RegExp( $.ui.autocomplete.escapeRegex( request.term ), "i" );
			    	  var result = {};
			    	  var j = 0;
			    	  for(var i=0,len=g_py_SelectCfg[pinyinId].data.length;i<len;i++){
			    		  ob = g_py_SelectCfg[pinyinId].data[i];
			    		  if(ob.pinyins == undefined){
			    			  ob.pinyins =  (ob.label || ob.value) + pinyinMakePy(ob.label || ob.value).join(",");
			    		  }
			    		  var flag = matcher.test( ob.pinyins );
			    		  if(flag){
			    			  result[j] =  ob;
			    			  j++;
			    		  }

			    		  //为了优化性能，只显示前100个匹配的数据
			    		  if(j >= 100){
			    			  break;
			    		  }
			    	  }
			    	  response(result);
			    	  result = null;
			    	  j = null;
			    	  matcher = null;
		          },
		          focus: function( event, ui ) {
			    	  if(g_py_SelectCfg[pinyinId].needFocus){
			    		  $(this).attr("CODE",ui.item.value);
				    	  $(this).val( ui.item.label );
			    	  }

			          return false;
			      },

			      select: function( event, ui ) {
			    	  event.preventDefault();
			    	  this.value =  ui.item.label;
			    	  $(this).attr("CODE",ui.item.value);

			    	  if(g_py_SelectCfg[pinyinId].onchange!=null){
				    		g_py_SelectCfg[pinyinId].onchange( $(this).val());
				    	 }
			      },
			      change: function(event,ui){
			    	 if(ui.item==null){
				    	  $(this).attr("CODE","");
			    	 }
			    	 if(g_py_SelectCfg[pinyinId].clear != null){
			    		 g_py_SelectCfg[pinyinId].clear();
			    	 }
			      }
			    });

		    if(g_py_SelectCfg[pinyinId].defaultValue!= null){
		    	for(var i=0,len=g_py_SelectCfg[pinyinId].data.length;i<len;i++){
			    	if(g_py_SelectCfg[pinyinId].data[i].value==g_py_SelectCfg[pinyinId].defaultValue){
			    		$( "#"+pinyinId ).val(g_py_SelectCfg[pinyinId].data[i].label);
			    		$( "#"+pinyinId ).attr("CODE",g_py_SelectCfg[pinyinId].data[i].value);
			    		break;
			    	}
			    }
			}
		    /*if(JrzlTools.getBrowser() == "MSIE"){
			    var changeCount = 0;
			    document.getElementById(pinyinId).attachEvent('onpropertychange', function (o){
			    	 if(changeCount == 0){
				         if (o.propertyName != 'value') return;
				         var label = $( "#"+pinyinId ).val();
				    	 for(var i=0,len=g_py_SelectCfg[pinyinId].data.length;i<len;i++){
					    	 if(g_py_SelectCfg[pinyinId].data[i].label==label){
					    		 $( "#"+pinyinId ).attr("CODE",g_py_SelectCfg[pinyinId].data[i].value);
					    		 if(g_py_SelectCfg[pinyinId].onchange!=null){
					    			// g_py_SelectCfg[pinyinId].onchange(g_py_SelectCfg[pinyinId].data[i].value);
					    		 }
					    		 break;
					    	 }
					     }
				    	 changeCount = 1;
			    	 }

			    });
		    }else{
		        var changeCountForChrome = 0 ;
			    $("#"+pinyinId).bind('input', function (){
			    	 if(changeCountForChrome == 0){
				         var label = $( "#"+pinyinId ).val();
				    	 for(var i=0,len=g_py_SelectCfg[pinyinId].data.length;i<len;i++){
					    	 if(g_py_SelectCfg[pinyinId].data[i].label==label){
					    		 $( "#"+pinyinId ).attr("CODE",g_py_SelectCfg[pinyinId].data[i].value);
					    		 if(g_py_SelectCfg[pinyinId].onchange!=null){
					    			// g_py_SelectCfg[pinyinId].onchange(g_py_SelectCfg[pinyinId].data[i].value);
					    		 }
					    		 break;
					    	 }
					     }
				    	 changeCountForChrome = 1;
			    	 }

			    });
		    }*/

		},
		/**
		 * 打开模态对话框
		 */
		openModalWindow: function(cfg){
			var defaultCfg={
					id                 :  null,     //内层容器id（必选）
					confirmOnClickClose:  false,
					title              :  "",     	//title
					height             :  600,      //模态框高度
					width              :  800 ,     //模态框高度
					clearBeforeClose   :  true,     //关闭前清空元素值
					beforeClose        :  null      // beforeClose callbacks

			};
			cfg = JrzlTools._extend(defaultCfg,cfg || {});
			if(cfg==null||cfg.id==null||cfg.id.length==0||cfg.id==undefined){
				JrzlTools.alert("模态框配置参数中id不能为空。","提示 ");
				return;
			}

			$( "#"+cfg.id ).dialog({
			      autoOpen: true,
			      confirmOnClickClose:cfg.confirmOnClickClose,
			      height: cfg.height,
			      width: cfg.width,
			      modal: true,
			      title:cfg.title,
			      draggable:true,
			      resizable:true,
			      beforeClose: function(){
				    if(cfg.clearBeforeClose){
				    	$( "#"+cfg.id ).find("input[type=text], textarea, select").afterTip("clear");
					    $( "#"+cfg.id ).find('input[type=text]').val("");
					    $( "#"+cfg.id ).find('textarea').val("");
					    $( "#"+cfg.id ).find('select').prop('selectedIndex', 0);
			        }
				    if(typeof cfg.beforeClose == "function"){
				    	cfg.beforeClose();
				    }
			      }
			 });

			var win = {
				hide:function(){
				    $( "#" +cfg.id).dialog( "close" );
			    },
			    show:function(){
				    $( "#" +cfg.id).dialog( "open" );
			    },
				close:function(){
			    	$( "#" +cfg.id).dialog( "close" );
			    }

			};
		    return win;
		},
		/**
		 * 页面绑定enter键查询功能
		 */
		  enterAutoQuery: function(config){
			var defaultCfg={
		      callbackFunc : null, //查询按钮执行的查询方法
		      id		   : null
			};
			config = JrzlTools._extend(defaultCfg,config || {});

			if(config==null || (config.callbackFunc == null && config.id == null) ){
				JrzlTools.alert("enter键查询功能配置参数中回调函数和id不能同时为空。","提示");
				return;
			}
			$(".inner-search-area").keydown(function(event){
			      var code = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
			      var activeType = document.activeElement.type;
			      if(activeType != 'button' && 13 == code){
			    	  if(config.id != null){
						   $("#" + config.id).focus();
						   return;
					  }
			    	  if(config.callbackFunc != null){
						   config.callbackFunc();
					  }
			       }
			});
		},
		/**
		 * 打开关闭搜索区
		 */
		searchAreaToggle:function(obj){
			$(".inner-search-area").toggle();
			$(obj).toggleClass("down");
		},
		/**
		 * 更多查询条件打开关闭
		 */
		moreSearchConditionToggle:function(obj){
			$(".search-condition").children("table").find('tr').each(function(index,item){
				if(index>1){
				  $(this).toggle();
				}
			});

			if($(obj).hasClass("more-condition-up")){
				$(obj).removeClass("more-condition-up");
			}else {
				$(obj).addClass("more-condition-up");
			}
		},
		//页面内提交等的进度条创建
		loading:function(msg){
			var pathLevel = JrzlTools.getPathLevel();
			LoadBar.loading(msg,pathLevel);
		},
		//页面内提交等的进度条取消
		unloading:function(){
			LoadBar.unloading();
		},
		//创建初始化页面的进度条
		createOnloadProgress:function (){
			var div_bg_var =$('<div class="loading-progress-bg" ></div>');
			var div_container_var =$('<div class="loading-progress-container" ></div>');
			var div_img_var = $('<div class="loading-progress-img"></div>');
			var div_text_var =$('<div class="loading-progress-txt" >页面加载中，请稍后...</div>');

			$(div_bg_var).append(div_container_var);
			$(div_container_var).append(div_img_var);
			$(div_container_var).append(div_text_var);
			$(document.body).append(div_bg_var);
		},
		//销毁初始页面的进度条
		distroyOnloadProgress:function (){
			if($(".loading-progress-img")!=null){
     			$(".loading-progress-img").remove();
     		}

			if($(".loading-progress-txt")!=null){
     			$(".loading-progress-txt").remove();
     		}

			if($(".loading-progress-container")!=null){
     			$(".loading-progress-container").remove();
     		}

			if($(".loading-progress-bg")!=null){
				$(".loading-progress-bg").remove();
			}

		},
		/**
		 * 销毁父页面进度条
		 */
		distroyProgress:function(id){
			if(typeof(window.parent.distroyTabProgress) == "undefined"){

			}else if(window.location.href==window.parent.location.href){

			}else{
               	window.parent.distroyTabProgress(frameElement.id);
			}
		},
		/**
		 * 百分比进度条
		 */
		progressBar:function(config){
			var defaultCfg={
				    id      :null,        //进度条id
				    label   :""		  //提交中文本
			};
			config = JrzlTools._extend(defaultCfg,config || {});

			var progressbar = $("#" + config.id),
				progressLabel = $('<div class="progress-label"><div class="label">'+ config.label +'</div><div class="precent"></div><div>');
			progressbar.append(progressLabel);
			var label = $(progressLabel).find(".label"),
				precent = $(progressLabel).find(".precent");

			progressbar.progressbar({
				value: false,
				change: function() {
					precent.text( progressbar.progressbar( "value" ) + "%" );
				 }
			});

			progressbar.clear = function(){
				progressbar.empty();
			};
			progressbar.setValue = function(val){
				progressbar.progressbar("option", "value", val);
			};
			progressbar.setLabel = function(label){
				progressbar.find(".label").text(label);
			};
			return progressbar;
		},

		/**
		 * 创建dhtmlxtabbar
		 */
		dhtmlxTabbar:function(){
			try{
				var tabbar = new dhtmlXTabBar("content", "top");
				tabbar.setImagePath("../../plugins/dhtmlxtabbar/imgs/");
				tabbar.setStyle("dhx_terrace");
				tabbar.setHrefMode("iframes");
				tabbar.enableAutoReSize(true,true);

				tabbar.attachEvent("onTabClose", function(id) {
				    try {
	                    var tabs = $("div[tab_id='"+id+"']").find("iframe[id^="+id+"_]");
	                    if (tabs && tabs.length > 0 && tabs[0].contentWindow && tabs[0].contentWindow.onTabClose) {
	                        return tabs[0].contentWindow.onTabClose();
	                    } else {
	                        return true;
	                    }
				    } catch (e) {
				        return true;
				    }
				});
				tabbar.attachEvent("onSelect", function(id,last_id,bar){
					var tab = bar.getTab(id);
					if(tab.refresh!=null && (tab.refresh==true || tab.refresh=="true")){
						bar.forceLoad(id);
					}
					tab = null;
			        return true;
			    });
				return tabbar;
			}finally{
				tabbar = null;
			}
		},
		/**
		 * 创建菜单
		 */
		accordionMenu:function(config){
			var menu =  new AccordionMenu(config);
			return menu;
		},
		/**
		 * 创建orctab
		 */
		orcTab:function(id,click){
			var tab= new OrcTab(id,click);
			return tab;
		},
		/**
		 * 画工作流图
		 */
		drawWf:function(config){
			var defaultCfg={
				    id            :null,        //外层容器id(非空）
				    nodeData      :null,        //节点数据
				    transitionData:null,   		//流转数据
				    nodeOnClick   :null,       	//点击事件
				    itemOnClick   :null         //自定义事件
				};
			config = JrzlTools._extend(defaultCfg,config || {});

			var canvas = $("#"+config.id);
			drawByData(canvas[0], config.nodeData, config.transitionData, config.isLocated, config.nodeOnClick,config.itemOnClick);
		},
		/**
		 * item选择
		 */
		treeItemsPicker:function(config){
			var defaultCfg={
				    dataSource           :null,       //数据源
				    confirmCallBack      :null,       //确定回调函数
				    title                :"",          //标题
				    lastItems            :[]           //上次选择记忆的items
			};
			config = JrzlTools._extend(defaultCfg,config || {});
			var treeItemsPicker = new TreeItemsPicker(config);
			return treeItemsPicker;
		},
		/**
		 * item多选
		 */
		itemMultiPicker:function(config){
			if(undefined == config.confirmCallBack || "" === config.confirmCallBack ){
				JrzlTools.alert("confirmCallBack为空！","提示");
				return;
			}

			var defaultCfg={
					itemQryGridUrl			:"",
					itemQryGridUrlParam  :{},       //固定参数
					QryDataListNam	:		"",  //查询列表在返回数据中对应的key值
				    confirmCallBack      :null,       //确定回调函数
				    title                :"",          //标题
				    InitData            :[],           //上次选择记忆的data
					beforeClose			 :null,           //关闭前的回调函数
					inputSearch:		 [],           // 搜索框的配置
		            itemColumnsCfg 		: [],//左侧列表列配置
	            	itemQryListCfg 		:[],//右侧列表列配置
				    width 				:618,           // modal框的宽度
				    itemTableWidth 		:260,           //左侧列表宽度
				    QryTableWidth 		:260,           //右侧列表宽度
				    isItemUnique		:null,          //左右两侧列表的记录比较函数
				    iDisplayLength:50,
				    Required : [],  			//search栏中的必填项
				    UsrNamSelectCfg:{},  //默认用户名选择窗口 部门选择参数
					UsrIDSelectCfg:{},  //默认用户ID选择窗口 部门选择参数
				    UserSelect:false,  //默认用户选择
				    DptSelectCfg:{}  //默认用户选择窗口 部门选择参数
			};
			if(config.UserSelect == true){
				//使用这个action时，如果出现action权限校验失败问题，需要在菜单栏对应的页面中配置这个action，在页面配置中配置action
				defaultCfg.title ="用户选择";         //标题
				defaultCfg.itemQryGridUrl = "/jrzl/pub/usermanage/usermngQuery.action";
				defaultCfg.inputSearch = [ //查询框配置
			        		            {
			         		            	id:"USR_NAM_LIK", //input框的id
			         		            	label:"姓名",//input框的label
			         		            	selectData:"" //下拉框数据
			         		             },
			        		             {
			         		            	id:"CMB_ID", //input框的id
			         		            	label:"一事通号",//input框的label
			         		            	selectData:"" //下拉框数据
			         		             },
			         		            {
			         		            	id:"DPT_UID", //input框的id
			         		            	label:"部门",//input框的label
			         		            	selectData:"", //下拉框数据
			         		            	DefaultVal:"",
			         		            	onchangeFn	: null,
			         		            	selectUrl : "/jrzl/pub/user/getDeptUserTree.action",
			         		            	selectParams : {
			         		            		FILTER_BY_DPT:true
			         		            	},
			         		            	ListNam		 : "deptList"
			         		             }
			        		];
				defaultCfg.inputSearch[0] = JrzlTools._extend(defaultCfg.inputSearch[0],config.UsrNamSelectCfg || {});
				defaultCfg.inputSearch[1] = JrzlTools._extend(defaultCfg.inputSearch[1],config.UsrIDSelectCfg || {});
				var DptSelectCfg = {};
				DptSelectCfg = JrzlTools._extend(defaultCfg.inputSearch[2], config.DptSelectCfg || {});
				defaultCfg.inputSearch[2] = DptSelectCfg;
				defaultCfg.itemColumnsCfg = [//左侧列表列配置
	            	                	{property:"USR_ID",width:"15%",title:"用户ID", hidden:true},
	            	                	{property:"CMB_ID",width:"15%",title:"一事通"},
	            	                	{property:"USR_NAM",width:"20%",title:"姓名"}];
	            defaultCfg.itemQryListCfg =[//右侧列表列配置
	            	                	{property:"USR_ID",width:"15%",title:"用户ID", hidden:true},
	            	                	{property:"CMB_ID",width:"15%",title:"一事通"},
	            	                	{property:"USR_NAM",width:"20%",title:"姓名"}];
	            defaultCfg.isItemUnique=function(item, newitem){ //两列表item的比较函数
	    	    							return item.USR_ID == newitem.USR_ID;
	            						};
			}
			config = JrzlTools._extend(defaultCfg,config || {});
			var itemMultiPicker = new ItemMultiPicker(config);
			return itemMultiPicker;
		},
		/**
		 * item单选
		 */
		itemSinglePicker:function(config){
			//选择用户数是需要配置UserSelect
			if(undefined == config.confirmCallBack || "" === config.confirmCallBack ){
				JrzlTools.alert("confirmCallBack为空！","提示");
				return;
			}

			var defaultCfg={
					url:"",
					urlParams           :{},       //固定参数
					QryDataListNam		:"",
					localData			:[],
				    confirmCallBack      :null,       //确定回调函数
				    title                :"用户选择",          //标题
					beforeClose			 :null,           //关闭前的回调函数
					inputSearch			 : [],           // 搜索框的配置
		            tableCfg 			 : [],
				    width 				 : 618,           // modal框的宽度
				    tableWidth 			 : 260,           //左侧列表宽度
				    iDisplayLength		 : 50,
				    clearCallBack 		 :null,
				    querybutton		: 		true,
	            	clearbutton		: 		true,
	            	confirmbutton	: 		true,
	            	UserSelect:false,  //默认用户选择
	            	Required : [],
	            	UsrNamSelectCfg:{},  //默认用户名选择窗口
					UsrIDSelectCfg:{},  //默认用户ID选择窗口
					DptSelectCfg:{}  //默认用户选择窗口 部门选择参数
			};
			if(config.UserSelect == true){
				//使用这个action是，需要在菜单栏对应的页面中配置这个action，在页面配置中配置action
				defaultCfg.url = "/jrzl/pub/usermanage/usermngQuery.action";
				defaultCfg.inputSearch = [ //查询框配置
			        		            {
			         		            	id:"USR_NAM_LIK", //input框的id
			         		            	label:"姓名",//input框的label
			         		            	selectData:"" //下拉框数据
			         		             },
			        		             {
			         		            	id:"CMB_ID", //input框的id
			         		            	label:"一事通",//input框的label
			         		            	selectData:"" //下拉框数据
			         		             },
			         		            {
			         		            	id:"DPT_UID", //input框的id
			         		            	label:"部门",//input框的label
			         		            	selectData:"", //下拉框数据
			         		            	DefaultVal:"",
			         		            	onchangeFn	: null,
			         		            	selectUrl : "/jrzl/pub/user/getDeptUserTree.action",
			         		            	selectParams : {
			         		            		FILTER_BY_DPT:true
			         		            	},
			         		            	ListNam		 : "deptList"
			         		             }
			        		];
				defaultCfg.inputSearch[0] = JrzlTools._extend(defaultCfg.inputSearch[0],config.UsrNamSelectCfg || {});
				defaultCfg.inputSearch[1] = JrzlTools._extend(defaultCfg.inputSearch[1],config.UsrIDSelectCfg || {});
				var DptSelectCfg = {};
				DptSelectCfg = JrzlTools._extend(defaultCfg.inputSearch[2],config.DptSelectCfg || {});
				defaultCfg.inputSearch[2] = DptSelectCfg;
				defaultCfg.tableCfg = [
	 		                	{property:"USR_ID",title:"用户ID", hidden:true},
			                	{property:"CMB_ID",width:"40%",title:"一事通"},
			                	{property:"USR_NAM",width:"40%",title:"姓名"}
			                	];
			}

			config = JrzlTools._extend(defaultCfg,config || {});
			var itemSinglePicker = new ItemSinglePicker(config);
			return itemSinglePicker;
		},
		/**
		 * item单选
		 */
		treeItemSinglePicker:function(config){
			var defaultCfg={
					searchDataSource	 :null,
				    url: null,
			    	params:null,
				    dataSource           :null,     //数据源
				    confirmCallBack      :null,     //确定回调函数
				    title                :"",       //标题
			 		clearCallBack 		 :null,
			 		loadAsyn             :false,
			 		selectAll			 :false, 	//是否可以选择目录
			 		search_leaves_only   :true,
			 		enableSearch 		 :true,
			 		isNeedClear          :true      //清空按钮是否显示
			};
			config = JrzlTools._extend(defaultCfg, config || {});
			var treeitemsinglepick = new Treeitemsinglepick(config);
			return treeitemsinglepick;
		},
		/**
		 * 系统配置
		 */
		systreePicker:function(config){
			var defaultCfg={
				    dataSource           :null,       //数据源
			 		selectAll			 :false, 	  //是否可以选择目录
			        treeDiv 			 :null,		  //树控件所在DIV ID
			        ready   : null
			};
			config = JrzlTools._extend(defaultCfg,config || {});
			var systreepick = new Systreepick(config);
			return systreepick;
		},

		/**
		 * 机构配置
		 */
		organtreePicker:function(config){
			var defaultCfg={
				    dataSource           :null,       //数据源
				    clickEvent           :null,       //点击事件
			 		selectAll			 :true, 	  //是否可以选择目录
			        treeDiv 			 :null,	  	  //树控件所在DIV ID
			        frameId 			 :null,		  //点击树节点显示相应url的frameId
			        loadAsyn : false,
			        ready : null

			};
			config = JrzlTools._extend(defaultCfg,config || {});
			var organtreepick = new Organtreepick(config);
			return organtreepick;
		},

		/**
		 * 用户选择控件
		 */
		userItemsPicker:function(config){
			var defaultCfg={
				    dataSource           :null,       //数据源
				    confirmCallBack      :null,       //确定回调函数
				    title                :"",          //标题
				    head				 :"提交至",
				    lastItems 		 	 :[]
			};
			config = JrzlTools._extend(defaultCfg,config || {});
			var userItemsPicker = new UserItemsPicker(config);
			return userItemsPicker;
		},

		/**
		 * 浮动提示
		 */
		popup:function(config){
			var defaultCfg={
					element		:	null,
					id			:	null,       //绑定的元素id
				    text		:	null,       //浮动提示信息
				    showType	:   "hover",	//浮动方式(hover/focus)
				    align		:	"bottom left", // 浮动位置
				    width		:	null,
				    height		:   null
				};
			config = JrzlTools._extend(defaultCfg,config || {});

			if(config ==null || (config.id==null && config.element==null)){
				JrzlTools.alert("浮动提示绑定id或元素不能同时为空。","提示 ");
				return;
			}

			config.element = (config.element == null) ? $("#"+ config.id) : config.element;

			var d = null;

			if(config==null||config.text==null||config.text.length==0||config.text==undefined){
				return;
			}
			//点击提示
			if(config.showType == "focus"){
				$(config.element).bind({
						focus:function(){
							d = dialog({
		    					align		:   config.align,
		    					content		: 	config.text,
		    					quickClose	: 	false,// 点击空白处快速关闭
		    					autofocus	: 	false,
		    					width		:   config.width,
		    					height		:	config.height

		    				});
							var e = this;
		    				setTimeout(function(){
		    					if(!e.parentNode){
		    						return;
		    					}
		    					d.show(e);
		    					tt = setTimeout(function(){
		    						d.remove();
		    					}, 10000);
		    				}, 500);
						},
						blur:function(){
							if(d!=null && !d.destroyed){
								clearTimeout(tt);
								d.remove();
							}
						}});
				}
			// hover提示
			else {
				var tt;
				$(config.element).on({
					mouseenter:function(){
					   if(d!=null && !d.destroyed){
							d.remove();
							if(tt != null) {
								clearTimeout(tt);
							}
					    }
						d = dialog({
	    					align		:  	config.align,
	    					content		:  	config.text,//popup[this.id],
	    					quickClose	:	false,// 点击空白处快速关闭
	    					autofocus	: 	false,
	    					width		:   config.width,
	    					height		:	config.height

	    				});
						var e = this;
						//1s浮动
	    				setTimeout(function(){
	    					if(!e.parentNode){
	    						return;
	    					}
	    					d.show(e);

	    					// 浮动提示框增加hover事件便于复制
	    					$(d.node).mouseover(function(){d.OVER = true;});
	    					$(d.node).mouseleave(function(){
	    						if(d != null && !d.destroyed){
	    							d.OVER = false;
	    							d.remove();
	    						}
	    					});
	    					// 5s消失
	    					d.tt = setTimeout(function(){
	    						d.remove();
	    					}, 10000);
	    				}, 1000);
					},
					mouseleave:function(){
						// 200ms内从触发元素移动浮动框
						setTimeout(function(){
							// hover浮动框，清楚5s定时器
							if(d != null && d.OVER){
								clearTimeout(d.tt);
								return;
							}
							if(d != null && !d.destroyed && !d.OVER){
								d.remove();
							}
						}, 200);

					}
				});
			}
		},

		/**
		 *   dataMonitor
		 *   页面数据监控对象
		 *
		 */
		dataMonitor:function(config){
			var defaultCfg={
					ids			:	null,       //特殊的id 或者form表单外部的元素 数组
					formName	:	null,       //页面form 表单的名称
				    fileUploadIds:  null,       //附件上传Id 数组
					filterIds   :   null        //需要过滤的元素id
				};
			config = JrzlTools._extend(defaultCfg,config || {});
			if(config == null){
				JrzlTools.alert("数据监控对象配置参数不能为空","提示 ");
				return;
			}
			if(config.formName ==null && config.ids ==null ){
				JrzlTools.alert("数据监控对象元素不能为空","提示 ");
				return;
			}
			function DataMon(config){
				 this.ids=config.ids;
				 this.formName=config.formName;
				 this.filterIds=config.filterIds;
				 this.fileUploadIds=config.fileUploadIds;
				 this.oldData={};
				 DataMon.prototype.init = function(){
					 var type="";
					 if( this.ids &&  this.ids.length>0){
					 for(var i=0;i<this.ids.length;i++){
						 type=$("#"+this.ids[i]).attr("type");
						 if(type=='checkbox' || type=='radio'){
						   this.oldData[this.ids[i]]=document.getElementById(this.ids[i]).checked;
						 }
						 else{
						   this.oldData[this.ids[i]]=$.trim(document.getElementById(this.ids[i]).value);
					     }
						}
					 }
					 if(this.fileUploadIds && this.fileUploadIds.length>0){
						 for(var i=0;i<this.fileUploadIds.length;i++){
							  this.oldData[this.fileUploadIds[i]]=$("#"+this.fileUploadIds[i]).attr("file");
						}
					 }
					 if(this.formName &&  this.formName!=""){
						  var elements = document[this.formName].elements;
						   if(elements.length>0){
					    	  for(var i=0,len=elements.length;i<len;i++){
					    		if(elements[i].id !=null &&elements[i].id != undefined && elements[i].id!=""){
					    			 type=$("#"+elements[i].id).attr("type");
									 if(type=='checkbox' || type=='radio'){
					    			    this.oldData[elements[i].id] = elements[i].checked;
									 }else{
										this.oldData[elements[i].id] = $.trim(elements[i].value);
									 }
					    		}
					    	  }
						   }
					 }

					 if(this.filterIds && this.filterIds.length>0){
						var id;
						for(var i=0;i<this.filterIds.length;i++){
							id=this.filterIds[i];
							if(id){
								delete this.oldData[id];
							}
						}
					 }
					 return this;
				 };
				 DataMon.prototype.update = function(){
					 var type;
					 for(var key in this.oldData){
						 type=$("#"+key).attr("type");
						 if(type=='checkbox' || type=='radio'){
							  this.oldData[key]=document.getElementById(key).checked;
						 }
						 else if(type=='file'){
							 this.oldData[key]=$("#"+key).attr("file");
						 }
					     else{
							 this.oldData[key]=$.trim(document.getElementById(key).value);
						}
					 }
				 };
				 DataMon.prototype.validate = function(){
					 var type;
					 for(var key in this.oldData){
						 type=$("#"+key).attr("type");
						 if(type=='checkbox' || type=='radio'){
							 if(this.oldData[key]!=document.getElementById(key).checked){
								 return false;
							 }
						 }
						 else if(type=='file'){
							 if(this.oldData[key]!= $.trim($("#"+key).attr("file"))){
								 return false;
							 }
						 }
						 else{
							 if(this.oldData[key]!= $.trim(document.getElementById(key).value)){
								 return false;
							 }
						 }
					 }
					 return true;
				 };
			};
			return new DataMon(config).init();
		},

		/**
		* 动态加载页面select标签数据
		*  ids: 页面dom id数组
		*  data:数据源JSON对象{A:"B",C:"D"} 或者数组[{key:"A",value:"B"},{key:"C",value:"D"}]
		*  flag：是否显示"--请选择--"
		*  dfVal：默认显示的数据
		*/
		loadSelectDomData:function (ids,data,flag,dfVal){
			var selectHtml="";
			if(flag){
				selectHtml+= "<option value=''>--请选择--</option>";
			}
			if(data) {
				if(data.constructor === Array){
					for(var i in data){
						selectHtml+= "<option value="+data[i].key+">"+data[i].value+"</option>";
					}
				}
				else{
					$.each(data, function(key, value){
					    selectHtml+= "<option value="+key+">"+value+"</option>";
					});
				}
			}
			if(ids){
				$.each(ids,function(i,id){
					$("#"+id).html(selectHtml);
					if(dfVal!=null){
						$("#"+id).val(dfVal);
					}
				});
			}
		},
		/**
		 * 本地保存
		 */
		sisyphus:function(config){
			var defaultCfg={
					onSave			:	function(){}, //保存数据时调用
					onBeforeRestore	:	function(){}, //加载保存数据前调用(点击确定前)
					onRestore		:	function(){}, //加载保存数据时调用(点击确定后)
					onRelease		:	function(){}  //释放本地存储
				};
			config = JrzlTools._extend(defaultCfg,config || {});
			var mySisyphus = $("form").sisyphus(config);

			return mySisyphus;
		},
		/**
		 * 打开Tab页
		 */
		addMainTab:function(id,text,url,otherSystem,curId,bizUid){
			if(window.top != null && window.top.addMainTab != undefined){
				if(!curId){
					curId = frameElement.id.replace(new RegExp("_DHTMLXTABBAR_IFRAME","g"),"");
				}
				window.top.addMainTab(id,text,url,otherSystem,curId,bizUid);
			}
			else if(url != null) {
				var index = url.indexOf("/jrzl/");
				url = JrzlTools.getPathLevel() + url.substring(index + 1);
				window.open(url);
			}
		},
		/**
		 * 关闭id的tab
		 */
		closeMainTab:function(id){
			if(window.top != null && window.top.closeMainTab != undefined){
				window.top.closeMainTab(id);
			}

		},
		/**
		 * 激活id的tab
		 */
		activeMainTab:function(id){
			if(window.top != null && window.top.activeMainTab != undefined){
				window.top.activeMainTab(id);
			}

		},
		/**
		 * 刷新id的tab
		 */
		refreshMainTab:function(id){
			if(window.top != null && window.top.refreshMainTab != undefined){
				window.top.refreshMainTab(id);
			}
		},
		/**
		 * 执行id的tab页中的方法
		 */
		executeMainTabFunc:function(id,func, args){
			if(window.top != null && window.top.executeMainTabFunc != undefined){
				window.top.executeMainTabFunc(id,func,args);
			}
		},
		/**
		 * 警告
		 */
		alert:function(msg,title,callback){
			jAlert(msg,title,callback);
		},

		/**
		 * confirm
		 */
		confirm:function(msg,title,callback){
			jConfirm(msg,title,callback);
		},
		/**
		 * 用户资料显示及短信发送
		 */
		userInfoViewer:function(config){
			var defaultCfg={
					id			:	null,     // 用户id
					localData	:	{}       // 本地数据
				};
			config = JrzlTools._extend(defaultCfg,config || {});
			if(config == null || config.id == null || $.trim(config.id).length == 0){
				JrzlTools.alert("用户ID为空。", "提示", null);
				return;
			}
			var userInfoViewer = new UserInfoViewer({userId : config.id, localData : config.localData});
			return userInfoViewer;
		},
		FormatInt:function(val){
			if(val == undefined || val == ""){
				return val;
			}
			return new BigDecimal(val+"").setScale(4, BigDecimal.ROUND_HALF_UP) + "";
		},
		deFormatInt:function(val){
			if(val == undefined || val == ""){
				return val;
			}
			val += "000000";
			return val;
		},
		/**
		 * 针对金额类型的输入框作千分位处理focus及blur事件
		 * @param config
		 */
		commaFormat:function(config){
			var defaultCfg = {
				id		:	null,       		//表单输入input元素Id,formId为null时生效
				formId	:	null,				//表单form元素Id,如果配置formId,则input元素Id忽略
				filter	:	[],					//使用表单配置时,需要过滤的元素Id,如["a","ab"]
				initVal	:	'0.00',				//表单初始值
			    maximum	:	'1000000000000000',	//最大值
			    minimum :	'-1000000000000000', //最小值
			    tips  :   null                 //提示中文名
		};
		config = JrzlTools._extend(defaultCfg,config || {});

		if( config == null || (config.id == null && config.formId == null)){
			JrzlTools.alert("绑定的表单Id或者元素Id不能同时为空。","提示 ");
			return;
		}

		var commafy = new Commafy();
		// 配置form表单
		if(config.formId != null){
			// 初始化:设置初始值、右对齐
			$("#" + config.formId).find(":text").each(function(i, e){
				if($.inArray($(e).attr("id"), config.filter) == -1){
					$(e).attr("style",commafy.rightStyle);
					$(e).val(config.initVal);
				}

			});
			// focus事件
			$("#" + config.formId).delegate("input","focus",function(){
				if($.inArray($(this).attr("id"), config.filter) != -1){
					return;
				}
				var self = this, num = $(self).val();

				$(this).attr("style",commafy.leftStyle);

				$(self).val(commafy.delCommafy(num));

				JrzlTools._moveCursorToEnd(self);
			});
			// blur事件
			$("#" + config.formId).delegate("input","blur",function(){
				if($.inArray($(this).attr("id"), config.filter) != -1){
					return;
				}
				var self = this, num = $(self).val(), flag;
				flag = commafy.isRightNum(num, config.maximum, config.minimum, config.tips);
				$(self).attr("style",commafy.rightStyle);
				if(flag == 1){
					return;
				} else if(flag != 0){
					JrzlTools.alert(flag, "警告");
					return;
				}
				num = commafy.addCommafy(num);
				$(self).val(num);
			});
		}
		// 配置input
		else{
			$("#" + config.id).attr("style",commafy.rightStyle);
			$("#" + config.id).val(config.initVal);

			$("#" + config.id).on({
				"focus":function(){
					var self = this, num = $(self).val();

					$(self).attr("style",commafy.leftStyle);

					$(self).val(commafy.delCommafy(num));
					JrzlTools._moveCursorToEnd(self);
				},
				"blur":function(){
					var self = this, num = $(self).val(), flag;
					flag = commafy.isRightNum(num, config.maximum, config.minimum, config.tips);
					$(self).attr("style",commafy.rightStyle);
					if(flag == 1){
						return;
					}
					else if(flag != 0){
						JrzlTools.alert(flag, "警告");
						return;
					}
					num = commafy.addCommafy(num);
					$(self).val(num);

				}
			});
		}},
		/**
		 * 对给定的金额数据作加千分位逗号处理
		 * @param num
		 */
		addCommafy : function(num){
			var commafy = new Commafy();
			return commafy.addCommafy(num);
		},
		/**
		 * 对千分位金额数据作去除千分位逗号处理
		 * @param num
		 * @returns
		 */
		delCommafy : function(num){
			var commafy = new Commafy();
			return commafy.delCommafy(commafy.addCommafy(num));
		},
		/**
		 * private
		 * 将input的TextRange焦点移动到末尾
		 */
		_moveCursorToEnd:function(obj){
			var len = obj.value.length;

			//IE
			if(obj.createTextRange) {
				var textRange = obj.createTextRange();
				textRange.moveStart('character',len);
	       	    textRange.collapse(true);
	       	    textRange.select();
			}
			//非IE
			else if(obj.setSelectionRange){
				obj.selectionStart = len;
			}
		},
		/**
		 * 填充输入框
		 * obj为json对象
		 */
		fillData:function(obj){
		 if(typeof obj == "object" && !obj.length
				 && Object.prototype.toString.call(obj).toLowerCase() == "[object object]"){
			 for(var id in obj){
				 var value = obj[id];
				 if(typeof value != "object"){
					 $("#" + id).val(value);
				 }
			 }
		 }
		},
		/**
		 * 将金额转为大写中文
		 */
		digitUppercase : function(n) {
			if (n == null || n == "" || isNaN(n)) {
				return "";
			}
			var fraction = [ '角', '分' ];
			var digit = [ '零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖' ];
			var unit = [ [ '元', '万', '亿' ], [ '', '拾', '佰', '仟' ] ];
			var head = n < 0 ? '负' : '';
			n = Math.abs(n);
			var s = '';
			for (var i = 0; i < fraction.length; i++) {
				s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
			}
			s = s || '整';
			n = Math.floor(n);
			for (var i = 0; i < unit[0].length && n > 0; i++) {
				var p = '';
				for (var j = 0; j < unit[1].length && n > 0; j++) {
					p = digit[n % 10] + unit[1][j] + p;
					n = Math.floor(n / 10);
				}
				s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
			}
			return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
		},
		/**
		 * 绑定金额转为大写中文事件
		 * inputId: input的id
		 * labelId：显示中文金额的label的id
		 */
		bindDigitUppercaseFunc : function(inputId, labelId) {
			$("#" + labelId).html(JrzlTools.digitUppercase($("#" + inputId).val()));
			$("#" + inputId).keyup(function(){
			  $("#" + labelId).html(JrzlTools.digitUppercase($(this).val()));
			});
		},
		/**
		 * 重定向或者打开新窗口，提交请求，支持跨域
		 * action: 需要打开的url
		 * data：需要提交的数据，key：名称 value：值
		 * n:是否打开新窗口，true：打开新窗口
		 */
		openBlank:function(action,data,n){
			var form = $("<form/>").attr('action',action).attr('method','post');
			if(n){
				form.attr('target',target)
			}
			var input='';
			$.each(data,function(i,n){
				input += '<input type="hidden" name="'+i+'" value="'+n+'" />';
			});
			form.append(input).appendTo("body").css('display','none').submit();
		},

		/**
		 * 比较基本信息,进行标红，下拉框和文本框
		 * data是获取到的数据
		 */
		compareBasinfo:function (data, moneyMap){
			$.each(data, function(key, value){
				if(undefined != $("#" + key)){
					if(("string" == typeof value || "number" ==  typeof value
							|| "boolean" == typeof value) && null != document.getElementById(key) ) {
						if("SELECT"==document.getElementById(key).nodeName){
							var val = $("#" + key).val();
							var tempval =$("#" + key).find("option[value='" + val + "']").text();
							if(tempval != value){
								$("#" + key).css("color","red");
								$("#" + key).css("font-weight","bold");
								$("#" + key).attr("title", "上一版本值:" + value);
							}else{
								$("#" + key).css("color","");
								$("#" + key).css("font-weight","normal");
								$("#" + key).removeAttr("title");
							}
						}else{
								var curval = $("#" + key).val();
								if(undefined != moneyMap && moneyMap[key]){
									curval = moneyMap[key];
								}
								if(curval != value){
									$("#" + key).css("color","red");
									$("#" + key).css("font-weight","bold");
									$("#" + key).attr("title", "上一版本值:" + value);
								}else{
									$("#" + key).css("color","");
									$("#" + key).css("font-weight","normal");
									$("#" + key).removeAttr("title");
								}
						}

					}
				}
			});
		},
		/**
		 * 比较grid
		 * 参数：data：上个版本的信息
		 * 		id： grid的字段名称
		 * 		gridinfo：使用者提供的grid信息 如:
		 * 		mygrid : {
					ListName: "CREDITPAGELIST",
					colName :
					{
						"1": "CR_ADD_MEAS",
						"2": "CR_ADD_BODY",
						"3": "CR_ADD_MEAS_RMK",
						"CR_ADD_MEAS":	"M_CTC_NAM" // 下拉框。留痕信息保存的是value，rowData中是key，这个字段做key-val转换
					},
					matchFunc : function(type, lastData, rowValue){ //默认函数。也可以自定义匹配函数
							return lastData[lastData.JSON_KEY] == rowValue[lastData.JSON_KEY];
					}
				}
		 *
		 */

		compareGird:function (prevData, id, gridinfo){
			if (null == prevData ||  undefined == prevData)
				return;

			if(undefined != $("#" + id)){
				var oTable = $("#" + id).dataTable(); //获取table所有的数据
				//$.each($("#" + id)[0].childNodes[2].childNodes, function(row, rowValue){ //每一行
				$.each(oTable.fnGetNodes(), function(row, rowValue){ //每一行
					var rowData = oTable.fnGetData(rowValue); //获取一行的数据
					var isfind = false; //是否匹配到
					if( undefined != prevData && undefined != prevData[gridinfo.ListName]){
						$.each(prevData[gridinfo.ListName], function(i, lastData){ //上一版本的每一行
							var ismatched = undefined == gridinfo.matchFunc ?
								lastData[lastData.JSON_KEY] == rowData[lastData.JSON_KEY] :
									gridinfo.matchFunc(id, lastData, rowData);
							if(ismatched){//找到匹配数据
								isfind = true;
								$.each(rowValue.childNodes, function(col, obj){ //每一行中的列
									var colname = gridinfo.colName[col];
									if(undefined == colname){
										return true;
									}else if( undefined == lastData[colname] ){
										obj.style.color = "red";
										obj.style.fontWeight = "bold";
										obj.title = "上一版本值为空";
									}else if(undefined != gridinfo.colName[colname]){ //对应的列存在
										//下拉框
										var colRealName = gridinfo.colName[colname];  //获取到真正的列名
										if( undefined == colRealName || undefined == rowData[colRealName]){
											return true;
										}
										//不相等
										if(lastData[colname] != rowData[colRealName]){
												obj.style.color = "red";
												obj.style.fontWeight = "bold";
												obj.title = "上一版本值:" + lastData[colname];
										}else{
											obj.style.color = "";
											obj.style.fontWeight = "normal";
											$("#" + obj.id).removeAttr("title");
										}
									}else{
										//不相等
										if(lastData[colname] != rowData[colname]){
											obj.style.color = "red";
											obj.style.fontWeight = "bold";
											obj.title = "上一版本值:" + lastData[colname];
										}else{
											obj.style.color = "";
											obj.style.fontWeight = "normal";
											$("#" + obj.id).removeAttr("title");
										}
									}
								});
							}
						});
					}
					if(!isfind){
						if (gridinfo.allColMarkRed){
							$.each(rowValue.childNodes, function(col, obj){ //未找到匹配的数据，整行标红
									obj.style.color = "red";
									obj.style.fontWeight = "bold";
									obj.title = "上一版本值为空";
							});
						}else{
							$.each(rowValue.childNodes, function(col, obj){ //标红信息给出的列
									if(undefined != gridinfo.colName[col]){
										obj.style.color = "red";
										obj.style.fontWeight = "bold";
										obj.title = "上一版本值为空";
									}
							});
						}
					}
				});
			}
		},
		getVdtResByNam:function(name){
			if(name == null || name == undefined || name ==""){
				return true;
			}
			return $.VdtResult[SYS_REQUESTPAGEID][name];
		},

    /**
     * 判断是否为GMS中配置的节假日
     * date: 日期, yyyyMMdd
     * options: {
     *     ccy: 币种, 可以是字符串或数组. 默认'CNY'.
     *     range: 包含之前n天或之后n天. 负数-n往前推n天, 正数n往后推n天, 默认0
     * }
     * 返回: true是节假日/false不是节假日
     */
    isGmsHoliday : function(date, options) {
        var defaultOptions = {
            "ccy" : 'CNY',
            "range" : 0
        };
        var opts = JrzlTools._extend(defaultOptions, options || {});

        // 处理ccy字符串或数组, 发给服务端的应是逗号分隔的字符串
        var ccyCode = null;
        if (opts.ccy instanceof Array) {
            for (var i in opts.ccy) {
                if (null == ccyCode) {
                    ccyCode = opts.ccy[i];
                } else {
                    ccyCode = ccyCode + ',' + opts.ccy[i];
                }
            }
        } else {
            ccyCode = opts.ccy;
        }
        var params = {
            "hldDate" : date,
            "ccyCode" : ccyCode,
            "BefOrAftDate" : opts.range
        };
        var result = false;
        Request.processDataRequest({
            url : "/jrzl/pub/holidaymanage/gmsholiday/checkGmsHoliday.action",
            customParams : params,
            callbackFunc : function(data) {
                if (data && data.ErrorNo == "0") {
                    result = data.isGmsHoliday;
                }
            },
            progress : false,
            validated : false,
            errorRedirect : false,
            async : false
        });
        return result;
    },
    getMapLength:function(DataMap){
    	var count = 0;
    	if(DataMap){
    		$.each(DataMap, function(key, value){
    			count++;
    		});
    	}
    	return count;
    },

    /*
     * 对明细页面进行赋值的值进行格式化，
     * 因为html的换行是</br>与\n不同
     * */
    formateHtmlText:function(val){
        if(JrzlTools.isEmpty(val)){
            return "";
        }
        return val.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&gt;\/br&gt;/g, "</br>").replace(/\n/g,"</br>").replace(/\s/g, "&nbsp;");
    },

    /*
     * 判断值是否为空/null/或者未定义
     * */
    isEmpty:function(value) {
        if ((undefined == value)|| (null == value) || ("" == value) ) {
            return true;
        } else {
            return false;
        }
    },
    kindeditor:function(cfg){
    	var defaultCfg = {
    			id : null,     //富文本框textarea的ID(必填)
    			themeType : 'default',
    			items : [ 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
    		   			'italic', 'underline', 'removeformat', 'hr', '|', 'justifyleft',
    					'justifycenter', 'justifyright', 'indent', 'outdent', '|', 'copy',
    					'paste', '|', 'screencut', 'link', 'table', '|', 'fullscreen',
    					'source', '|', 'about' ],
    			width : '100%',
    			height : '300px',
    			minHeight : 200,
    			resizeType : 1,//0 编辑框不能缩放   1可以纵向缩放  2横向纵向都能缩放
    			htmlTags : null,
    			readonlyMode : true //false不可编辑   true可编辑
    	}
		var lCfg = JrzlTools._extend(defaultCfg,cfg || {});
		defaultCfg= null;

		if(lCfg==null||lCfg.id==null||lCfg.id.length==0||lCfg.id==undefined){
			JrzlTools.alert("kindeditor配置参数中id不能为空。","提示 ");
			lCfg = null;
			return;
		}
    	return KindEditor.create('#'+lCfg.id, lCfg);
    },
    genTable:function(cfg){
    	var defaultCfg = {
    			tableid : null,
    			tableModelInfo : null,  //模板数据
    			tableInfoListMap :null, //默认值
    			callFun:null,   //调用函数：genTable生成表格 genViewTable生成明细表格 saveTable数据校验和拼接
    			isCheckNull:"Y" //对空值是否进行校验 Y：对空值根据配置进行校验；N：对空值跳过校验
    	}
		var lCfg = JrzlTools._extend(defaultCfg,cfg || {});
		defaultCfg= null;

		if(lCfg==null||lCfg.tableid==null||lCfg.tableid.length==0||lCfg.tableid==undefined){
			JrzlTools.alert("tableid不能为空。","提示 ");
			lCfg = null;
			return;
		}

		if(JrzlTools.isEmpty(lCfg.tableModelInfo)){
			JrzlTools.alert("没有需要加载的模板数据。","提示 ");
			lCfg = null;
			return;
		}

		if(JrzlTools.isEmpty(lCfg.callFun)){
			JrzlTools.alert("没有配置需要加载函数。","提示 ");
			lCfg = null;
			return;
		}

		if("genTable" == lCfg.callFun){
			return GenTable.genTable(lCfg);
		}else if("genViewTable" == lCfg.callFun){
			return GenTable.genViewTable(lCfg);
		}else if("saveTable" == lCfg.callFun){
			return GenTable.saveTable(lCfg);
		}

    }
};

//On creation of a UUID object, set it's initial value
function UUID(){
	this.id = this.createUUID();
};

// When asked what this Object is, lie and return it's value
UUID.prototype.valueOf = function(){ return this.id; };
UUID.prototype.toString = function(){ return this.id; };

//
// INSTANCE SPECIFIC METHODS
//

UUID.prototype.createUUID = function(){
	//
	// Loose interpretation of the specification DCE 1.1: Remote Procedure Call
	// described at http://www.opengroup.org/onlinepubs/009629399/apdxa.htm#tagtcjh_37
	// since JavaScript doesn't allow access to internal systems, the last 48 bits
	// of the node section is made up using a series of random numbers (6 octets long).
	//
	var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
	var dc = new Date();
	var t = dc.getTime() - dg.getTime();
	var tl = UUID.getIntegerBits(t,0,31);
	var tm = UUID.getIntegerBits(t,32,47);
	var thv = UUID.getIntegerBits(t,48,59) + '1'; // version 1, security version is 2
	var csar = UUID.getIntegerBits(UUID.rand(4095),0,7);
	var csl = UUID.getIntegerBits(UUID.rand(4095),0,7);

	// since detection of anything about the machine/browser is far to buggy,
	// include some more random numbers here
	// if NIC or an IP can be obtained reliably, that should be put in
	// here instead.
	var n = UUID.getIntegerBits(UUID.rand(8191),0,7) +
	UUID.getIntegerBits(UUID.rand(8191),8,15) +
	UUID.getIntegerBits(UUID.rand(8191),0,7) +
	UUID.getIntegerBits(UUID.rand(8191),8,15) +
	UUID.getIntegerBits(UUID.rand(8191),0,15); // this last number is two octets long
	return tl + tm  + thv  + csar + csl + n;
};


//
// GENERAL METHODS (Not instance specific)
//


// Pull out only certain bits from a very large integer, used to get the time
// code information for the first part of a UUID. Will return zero's if there
// aren't enough bits to shift where it needs to.
UUID.getIntegerBits = function(val,start,end){
	var base16 = UUID.returnBase(val,16);
	var quadArray = new Array();
	var quadString = '';
	var i = 0;
	for(i=0;i<base16.length;i++){
	quadArray.push(base16.substring(i,i+1));
	}
	for(i=Math.floor(start/4);i<=Math.floor(end/4);i++){
	if(!quadArray[i] || quadArray[i] == '') quadString += '0';
	else quadString += quadArray[i];
	}
	return quadString;
};

// Replaced from the original function to leverage the built in methods in
// JavaScript. Thanks to Robert Kieffer for pointing this one out
UUID.returnBase = function(number, base){
	return (number).toString(base).toUpperCase();
};

// pick a random number within a range of numbers
// int b rand(int a); where 0 <= b <= a
UUID.rand = function(max){
	return Math.floor(Math.random() * (max + 1));
};

// // input输入框鼠标hover时显示浮动框，显示完整内容
// var inputList = $("input[type='text']");
// for(var i=0;i<inputList.length;i++) {
// 	// 初始化，即使没有触发keyup事件，也能够弹出悬浮窗
// 	// TOBEFIXED 弹窗未弹出时，text取不到值
// 	JrzlTools.popup({
// 		id      :   $(inputList[i]).attr("id"),
// 		text    :   $(inputList[i]).val(),
// 		align   :   "bottom left"
// 	});
// 	// 每次触发keyup事件，更新弹出框内显示的内容
// 	$(inputList[i]).bind("keyup", function(e) {
// 		var config = {
// 			element :   e.currentTarget,
// 			text    :   $(e.currentTarget).val(),
// 			align   :   "bottom left"
// 		}
// 		JrzlTools.popup(config);
// 	});
// }
