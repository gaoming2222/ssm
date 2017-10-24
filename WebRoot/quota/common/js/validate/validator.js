﻿(function($){
	// 拦截form,在form提交前进行验证

	// 定义一个验证器
	var Validator =  {
		/**
		 * 初始化校验器
		 * 给配置的校验元素加上校验事件
		 */
		initValidate:function(pageValCfg) {
			var elementRules;
			if(pageValCfg == undefined || pageValCfg == null) {
				if (typeof(SYS_REQUESTPAGEID) != "undefined") {
			    	elementRules = vdt_fields[SYS_REQUESTPAGEID];
			    }
			    if(elementRules == null){
			    	elementRules = {};
			    }
			} else {
				elementRules = pageValCfg;
			}

			// 绑定定义校验元素change事件
			for(var key in elementRules){
				var obj = $("#"+key);
				elementRules[key]["KEYNAM"] = key;
	            $(obj).bind('change',elementRules[key], Validator.validateBefore);
		        $(obj).afterTip('init');
		        
		        $.VdtResult[SYS_REQUESTPAGEID]={};
		    }
		},
		/**
		 * 取消校验初始化
		 */
		unInitValidate:function() {
			var elementRules;
		    if (typeof(SYS_REQUESTPAGEID) != "undefined") {
		    	elementRules = vdt_fields[SYS_REQUESTPAGEID];
		    }
		    if(elementRules == null){
		    	elementRules = {};
		    }
			// 绑定定义校验元素change事件
			for(var key in elementRules){
				var obj = $("#"+key);
	            $(obj).unbind('change');
		        $(obj).afterTip('remove');
		    }
			$.VdtResult[SYS_REQUESTPAGEID]={};
		},

		/**
		 * 离开校验，由change事件触发
		 * @param change事件传入对象
		 */
		validateBefore:function(e) {
			var self = this, elementRule = e.data;
			var type		= 	elementRule.type,
				require 	= 	elementRule.require,
				maxlength 	= 	elementRule.maxlength,
				minlength 	= 	elementRule.minlength,
				pattern 	= 	elementRule.pattern,
				errorMsg 	= 	elementRule.errormsg,
				desc 		= 	elementRule.desc,
				callback 	= 	elementRule.callback;
				keyname		=	elementRule.KEYNAM;
			var value = $.trim($(self).val());
			
			if(type == "INT_RATE" || type == "MONEY"){
				value = JrzlTools.delCommafy(value);
			}
			//验证通过标识
			$.VdtResult[SYS_REQUESTPAGEID][keyname] = true;
			var flag = true;
			$(self).afterTip('clear');

			 // 非空校验
			if(require){
				if(value == null || value == '' || value.length == 0) {
					flag = false;
					$(self).afterTip('warn');
					JrzlTools.alert("“" + desc + "”" + vdt_hint["notnull"], "提示", function(){
						$(self).focus();
					});
					$.VdtResult[SYS_REQUESTPAGEID][keyname] = false;
					return;
				}
			}
			// 允许为空 且 value值为空时，直接返回通过校验，无需校验其余条件
			else if((callback == null || typeof callback == "undefined") && (value == null || value == '' || value.length == 0)){
				$(self).afterTip('ok');
				return;
			}

			var lengthReturn;
			if(type == "INTEGER"){
				lengthReturn = Validator.checkNumberValue(value, maxlength, minlength);
			}
			else{
				// 校验长度
				var realLength = JrzlTools.getRealLength(value);
				lengthReturn = Validator.checkLength(realLength, maxlength, minlength);
			}
			if(lengthReturn != null && !lengthReturn.flag){
				$(self).afterTip('warn');
				var tipMsg = "“" + desc + "”" + lengthReturn.tipMsg;
				JrzlTools.alert(tipMsg, "提示", function(){$(self).focus();});
				$.VdtResult[SYS_REQUESTPAGEID][keyname] = false;
				return;
			}

			// 正则表达式校验
			var matchReturn = Validator.match(e.data, value);
			if(matchReturn != null && !matchReturn.flag){
				$(self).afterTip('warn');
				if(matchReturn.type == "custom"){
					tipMsg = "“" + desc + "”" + errorMsg;
				}
				else if(matchReturn.type == "default"){
					tipMsg = "“" + desc + "”" + vdt_hint[type];
				}
				JrzlTools.alert(tipMsg,"提示",function(){$(self).focus();});
				$.VdtResult[SYS_REQUESTPAGEID][keyname] = false;
				return;
			}

			//自定义回调校验
			if(callback != null && callback != undefined && typeof (callback) != "undefined"){
				var result = window.eval(''+callback+'("' + self.id + '")');
				if(result != true){
					$(self).afterTip('warn');
					JrzlTools.alert(result,"提示",function(){
						if(!$(self).is(":hidden") && $(self).attr("type") != "hidden" && $(self).attr("disabled") != "disabled"){
							$(self).focus();
						}
					});
					$.VdtResult[SYS_REQUESTPAGEID][keyname] = false;
					return;
				}
			}
			// 校验通过
			$(self).afterTip('ok');
		},

		/**
		 * action提交校验
		 * @param action 提交的action
		 * @returns 通过返回true,否则返回false
		 */
		submitValidate:function(action) {

			var flag = true,
				elementRules = {},
				actionConfig  = vdt_actions[action];

			if(actionConfig == undefined || actionConfig == null){
				return flag;
			}

		    if (typeof(SYS_REQUESTPAGEID) != "undefined" && vdt_fields[SYS_REQUESTPAGEID] != null) {
		    	elementRules = vdt_fields[SYS_REQUESTPAGEID];
		    }
			var notnullElements = actionConfig.notnull,
				allcolsElements = actionConfig.allcols;

			for(var key in elementRules){
				// 填过提交所有参数 && key不在所有参数里面, 则不校验
				if(allcolsElements != null && allcolsElements.length > 0 && $.inArray(key, allcolsElements) == -1){
					continue;
				}

		        var obj = $("#" + key),
		        	elementRule = elementRules[key];
		        // 忽略隐藏元素
		        if(!obj.is(":visible") || obj.css("display") == 'none'){
		        	continue;
		        }
		        var type		= 	elementRule.type,
					maxlength 	= 	elementRule.maxlength,
					minlength 	= 	elementRule.minlength,
					pattern 	= 	elementRule.pattern,
					errorMsg 	= 	elementRule.errormsg,
					desc 		= 	elementRule.desc,
					callback 	= 	elementRule.callback;
		    	var value = $.trim($(obj).val());
				if(type == "INT_RATE" || type == "MONEY"){
					value = JrzlTools.delCommafy(value);
				}
		    	$(obj).afterTip('clear');

		    	// 非空校验
		        if($.inArray(key, notnullElements) != -1){
		        	if(value == null || value == '' || value.length == 0) {
		    			flag = false;
		    			$(obj).afterTip('warn');
		    			JrzlTools.alert("“" + desc + "”" + vdt_hint["notnull"],"提示",function(){
		    				if(!$(obj).is(":hidden") && $(obj).attr("type") != "hidden" && $(obj).attr("disabled") != "disabled"){
		    					$(obj).focus();
		    				}
		    			});
		    			break;
		    		}
		        }
		        // 允许为空且该元素正好为空，则不进行其余校验
		        else if((callback == null || typeof callback == "undefined")&&(value == null || value == '' || value.length == 0)){
		        	$(obj).afterTip('ok');
		        	continue;
		        }

		        var lengthReturn;
		        if(type == "INTEGER"){
					lengthReturn = Validator.checkNumberValue(value, maxlength, minlength);
				}
				else{
					// 校验长度
					var realLength = JrzlTools.getRealLength(value);
					lengthReturn = Validator.checkLength(realLength, maxlength, minlength);
				}
				if(lengthReturn != null && !lengthReturn.flag){
					flag = false;
					$(obj).afterTip('warn');
		    		var tipMsg = "“" + desc + "”" + lengthReturn.tipMsg;
		    		JrzlTools.alert(tipMsg,"提示",function(){
		    			if(!$(obj).is(":hidden") && $(obj).attr("type") != "hidden" && $(obj).attr("disabled") != "disabled"){
		    				$(obj).focus();
		    			}
		    		});
		    		break;
		    	}

		        // 正则表达式校验
		    	var matchReturn = Validator.match(elementRule, value);
		    	if(matchReturn != null && !matchReturn.flag){
		    		flag = false;
		    		$(obj).afterTip('warn');

		    		if(matchReturn.type == "custom"){
		    			tipMsg = "“" + desc + "”" + errorMsg;
		    		}
		    		else if(matchReturn.type == "default"){
		    			tipMsg = "“" + desc + "”" + vdt_hint[type];
		    		}

		    		JrzlTools.alert(tipMsg,"提示",function(){
						if(!$(obj).is(":hidden") && $(obj).attr("type") != "hidden" && $(obj).attr("disabled") != "disabled"){
							$(obj).focus();
						}
		    		});
		    		break;
		    	}
		    	//自定义回调校验
		    	if(callback != null && callback != undefined && typeof (callback) != "undefined"){
		    		var result = window.eval(''+callback+'("'+key+'")');
		    		if(result != true){
						$(obj).afterTip('warn');
						JrzlTools.alert(result,"提示",function(){
							if(!$(obj).is(":hidden") && $(obj).attr("type") != "hidden" && $(obj).attr("disabled") != "disabled"){
								$(obj).focus();
							}
						});
						flag = false;
						break;
					}
		    		else{
		    			continue;
		    		}
		    	}
		    	$(obj).afterTip('ok');
		    }
			return flag;
		},

		/**
		 * 局部区域校验
		 * @param id 某个区域的id，如弹出框则为弹框的id，会搜索其下的input、select等元素
		 */
		partValidate:function (id){
			var flag = true,
				elementRules = {};
			if (typeof(SYS_REQUESTPAGEID) != "undefined" && vdt_fields[SYS_REQUESTPAGEID] != null) {
				elementRules = vdt_fields[SYS_REQUESTPAGEID];
			}

			var validateElements = $("#" + id).find("input[type=text], textarea, select");

			$.each(validateElements, function(index, element){
				if(!$(element).is(":visible") || $(element).css("display") == 'none'){
		        	return;
		        }
				var id = element.id;
				$.VdtResult[SYS_REQUESTPAGEID][id] = true;
				if(elementRules[id] != undefined){
					var obj = $("#" + id),
		        		elementRule =   elementRules[id];
					var type		= 	elementRule.type,
						require 	= 	elementRule.require,
						maxlength 	= 	elementRule.maxlength,
						minlength 	= 	elementRule.minlength,
						pattern 	= 	elementRule.pattern,
						errorMsg 	= 	elementRule.errormsg,
						desc 		= 	elementRule.desc,
						callback 	= 	elementRule.callback;

					var value = $.trim($(obj).val());
					if(type == "INT_RATE" || type == "MONEY"){
						value = JrzlTools.delCommafy(value);
					}
					$(obj).afterTip('clear');

					// 非空校验
					if(require){
						if(value == null || value == '' || value.length == 0) {
			    			flag = false;
			    			$(obj).afterTip('warn');
			    			JrzlTools.alert("“" + desc + "”" + vdt_hint["notnull"],"提示",function(){
			    				if(!$(obj).is(":hidden") && $(obj).attr("type") != "hidden" && $(obj).attr("disabled") != "disabled"){
			    					$(obj).focus();
			    				}
			    			});
			    			$.VdtResult[SYS_REQUESTPAGEID][id] = false;
			    			return false;// $.each不能含有break,以return false代替break
			    		}
					}
					// 允许为空 且 value值为空时，直接返回通过校验，无需校验其余条件
					else if((callback == null || typeof callback == "undefined") && (value == null || value == '' || value.length == 0)){
						$(obj).afterTip('ok');
						return; // $.each不能含有continue,以return代替continue
					}

					var lengthReturn;
					if(type == "INTEGER"){
						lengthReturn = Validator.checkNumberValue(value, maxlength, minlength);
					}
					else{
						// 校验长度
						var realLength = JrzlTools.getRealLength(value);
						lengthReturn = Validator.checkLength(realLength, maxlength, minlength);
					}
					if(lengthReturn != null && !lengthReturn.flag){
			    		$(obj).afterTip('warn');
			    		var tipMsg = "“" + desc + "”" + lengthReturn.tipMsg;
			    		JrzlTools.alert(tipMsg,"提示",function(){
			    			if(!$(obj).is(":hidden") && $(obj).attr("type") != "hidden" && $(obj).attr("disabled") != "disabled"){
			    				$(obj).focus();
			    			}
			    		});
			    		$.VdtResult[SYS_REQUESTPAGEID][id] = false;
			    		flag = false;
			    		return flag;
			    	}

					 // 正则表达式校验
			    	var matchReturn = Validator.match(elementRule, value);
			    	if(matchReturn != null && !matchReturn.flag){
			    		flag = false;
			    		$(obj).afterTip('warn');

			    		if(matchReturn.type == "custom"){
			    			tipMsg = "“" + desc + "”" + errorMsg;
			    		}
			    		else if(matchReturn.type == "default"){
			    			tipMsg = "“" + desc + "”" + vdt_hint[type];
			    		}

			    		JrzlTools.alert(tipMsg,"提示",function(){
							if(!$(obj).is(":hidden") && $(obj).attr("type") != "hidden" && $(obj).attr("disabled") != "disabled"){
								$(obj).focus();
							}
			    		});
			    		$.VdtResult[SYS_REQUESTPAGEID][id] = false;
			    		flag = false;
			    		return flag;
			    	}
			    	//自定义回调校验
			    	if(callback != null && callback != undefined && typeof (callback) != "undefined"){
			    		var result = window.eval(''+callback+'("'+id+'")');
			    		if(result != true){
							$(obj).afterTip('warn');
							JrzlTools.alert(result,"提示",function(){
								if(!$(obj).is(":hidden") && $(obj).attr("type") != "hidden" && $(obj).attr("disabled") != "disabled"){
									$(obj).focus();
								}
							});
							$.VdtResult[SYS_REQUESTPAGEID][id] = false;
							flag = false;
							return false;
						}
			    		else{
			    			return;
			    		}
			    	}
			    	$(obj).afterTip('ok');
				}
			});
			return flag;
		},

		/**
		 * submit返回后台没有校验通过的字段警示
		 */
		afterSubmitWarn:function(id) {
			$("#" + id).afterTip('clear');
			$("#" + id).afterTip('warn');
		},

		/**
		 *
		 * 校验长度
		 * @param realLength 实际长度
		 * @param maxlength  最大长度
		 * @param minlength  最小长度
		 * @returns 通过:{flag:true, tipMsg:""},不通过:{flag:false, tipMsg:"不通过原因"}
		 */
		checkLength:function(realLength, maxlength, minlength){
			var tipMsg = "", flag = true;
			// 固定长度
			if(maxlength > 0 && minlength > 0 && maxlength == minlength){
				if(realLength != maxlength){
					flag = false;
					tipMsg = vdt_hint["length"].replace(/\{0\}/g, maxlength );
				}
			}else if(maxlength > 0 && minlength > 0){
				if(realLength > maxlength || realLength < minlength){
					flag = false;
					tipMsg = vdt_hint["rangelength"].replace(/\{0\}/g, minlength ).replace(/\{1\}/g, maxlength);
				}
			}else if(maxlength > 0 && realLength > maxlength){
				flag = false;
				tipMsg = vdt_hint["maxlength"].replace(/\{0\}/g, maxlength );
			}else if(minlength > 0 && realLength < minlength){
				flag = false;
				tipMsg = vdt_hint["minlength"].replace(/\{0\}/g, minlength );
			}

			return {flag:flag, tipMsg:tipMsg};
		},
		checkNumberValue:function(value, maxValue, minValue){
			var tipMsg = "", flag = true;
			if(maxValue != null || minValue != null){
				// 固定长度
				if(maxValue == minValue){
					if(value != maxValue){
						flag = false;
						tipMsg = vdt_hint["value"].replace(/\{0\}/g, maxValue );
					}
				}else if(minValue == null && value > maxValue){
					flag = false;
					tipMsg = vdt_hint["maxvalue"].replace(/\{0\}/g, maxValue );
				}
				else if(maxValue == null && value < minValue){
					flag = false;
					tipMsg = vdt_hint["minvalue"].replace(/\{0\}/g, minValue );
				}
				else if(value > maxValue || value < minValue){
					flag = false;
					tipMsg = vdt_hint["rangevalue"].replace(/\{0\}/g, minValue ).replace(/\{1\}/g, maxValue);
				}
			}

			return {flag:flag, tipMsg:tipMsg};
		},

		/**
		 * 正则匹配校验
		 * @param para 校验规则
		 * @param val 元素值
		 */
		match:function(para, val) {
			var flag = true;

			//默认的验证规则匹配
			if(para.type in vdt_default_pattern) {
				flag = new RegExp(vdt_default_pattern[para.type]).test(val);
				if(!flag){
					return {flag: flag, type : 'default'};
				}
			}

			// 自定义的验证规则匹配
			if(typeof para.pattern != 'undefined' && para.pattern.length != null && para.pattern.length > 0) {
				for(var i = 0, len = para.pattern.length; i < len; i++){
					flag = new RegExp(para.pattern[i]).test(val);
					if(!flag){
						return {flag: flag, type : 'custom'};
					}
				}
			}
			return {flag: flag};
		}
	};

	/**
	 * jQuery对象方法
	 * @param opr clear表示清楚校验标识;warn表示加校验不通过标识;ok表示加校验通过标识
	 */
	$.fn.afterTip = function(opr){
		if (typeof opr == 'string') {
			$.each(this, function(i, e){
				var span_id = $(e).attr("id")+"_span";

				if(opr=='init'){
					$(this).after('<span id="'+span_id+'" class="msg-wrap" ></span>');
				} else if(opr=="clear"){
					$(this).removeClass("red-border");//去除已有红边框
					$("#"+span_id).removeClass("n-ok");
					$("#"+span_id).removeClass("n-warn");
				} else if(opr=='warn'){
					$(this).addClass("red-border");//增加红边框
					$("#"+span_id).addClass("n-warn");
				} else if(opr=='ok'){
					$("#"+span_id).addClass("n-ok");
				} else if(opr=='remove') {
					$(this).removeClass("red-border");
					$("#"+span_id).remove();
				}
			});
		}
	};

	/**
	 * 校验器调用接口
	 * initValidate 初始化校验
	 * doValidate 提交校验
	 * showWarnTip 提交后校验
	 * partValidate 部分校验
	 */
	$.extend({
		VdtResult :{},
		initValidate : function(pageValCfg) {
			Validator.initValidate(pageValCfg);
		},
		unInitValidate : function() {
			Validator.unInitValidate();
		},
		doValidate: function(action) {
			return Validator.submitValidate(action);
		},
		showWarnTip : function(id) {
			Validator.afterSubmitWarn(id);
		},
		partValidate : function(id){
			return Validator.partValidate(id);
		}
	});

})(jQuery);



