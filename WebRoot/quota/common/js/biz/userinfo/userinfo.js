/**
 *  用户资料显示及短信发送控件
 */
function UserInfoViewer(options){
	this.config = {
			userId		: null,
			localData	: null
	};
	var uuid = JrzlTools.getUUID();

	this.config = $.extend(this.config, options || {});

	if(this.config.userId == null){
		JrzlTools.alert('用户ID不能为空！',"提示", null);
    	return;
	}

	this.config.id = 'user-info-view-id' + uuid;
	this.config.userNameId = 'user-name-id' + uuid;
	this.config.userDepId = 'user-dep-id' + uuid;
	this.config.userSuperiorId = 'user-superior-id' + uuid;
	this.config.userMobileId = 'user-mobile-id' + uuid;
	this.config.userTelId = 'user-tel-id' + uuid;
	this.config.userOaId = 'user-oa-id' + uuid;
	this.config.userEmailId = 'user-email-id' + uuid;
	this.config.userSexId = 'user-sex-id' + uuid;
	this.config.closeBtnId = 'close-btn-id' + uuid;

	this.config.noticeId = 'notice-send-id' + uuid;
	this.config.noticeContentId = 'notice-content-id' + uuid;
	this.config.noticeSendBtnId = 'send-btn-id' + uuid;
	this.config.noticeCloseBtnId = 'notice-close-btn-id' + uuid;

	this.config.userInfoWin = null;
	this.config.msgSendWin = null;

    this.init();
}

UserInfoViewer.prototype = {
	constructor:UserInfoViewer,
	init:function(options){
		var self = this;

		self._renderInfoWin();
		self._bindInfoEnv();
	},
	_renderInfoWin:function(){
		var self = this,
        _config = self.config;

		var html =
			'<div id="'+ _config.id +'" class="outer-area" style="display: none">'+
				'<div class="inner-data-area" style="border-style: none; padding-bottom: 10px;" >'+
					'<table id="datatable" style="background-color: #f3f4f6;">'+
						/*'<tr>'+
							'<td class="required">&nbsp;</td>'+
							'<td class="head">个人资料</td>'+
							'<td class="content"></td>'+
							'<td class="required">&nbsp;</td>'+
							'<td class="head"></td>'+
							'<td class="content">'+
								'<input type="button" id="'+ _config.closeBtnId +'" class="common-button"  value="关闭">'+
							'</td>'+
						'</tr>'+*/
						'<tr>'+

							'<td class="head">姓名：</td>'+
							'<td class="content">'+
								'<input type="text" id="'+ _config.userNameId +'" name="USERNAME"  readonly />'+
							'</td>'+

							'<td class="head">性别：</td>'+
							'<td class="content">'+
								'<input type="text" id="'+ _config.userSexId +'" name="USERSEX"  readonly />'+
							'</td>'+
						'</tr>'+
						'<tr>'+

							'<td class="head">所属部门：</td>'+
							'<td class="content">'+
								'<input type="text" id="'+ _config.userDepId +'" name="USERDEPARTMENT" readonly />'+
							'</td>'+

							'<td class="head">直属领导：</td>'+
							'<td class="content">'+
								'<input type="text" id="'+ _config.userSuperiorId +'" name="USERSUPERIOR" readonly />'+
							'</td>'+
						'</tr>'+
						'<tr>'+

							'<td class="head">手机号：</td>'+
							'<td class="content">'+
								'<a id="'+ _config.userMobileId +'" name="USERMOBILE" ></a>'+
							'</td>'+

							'<td class="head">电话：</td>'+
							'<td class="content">'+
								'<input type="text" id="'+ _config.userTelId +'" name="USERTEL" readonly />'+
							'</td>'+
						'</tr>'+
						'<tr>'+

							'<td class="head">一事通号：</td>'+
							'<td class="content">'+
								'<input type="text" id="'+ _config.userOaId +'" name="USEROAID" readonly />'+
							'</td>'+

							'<td class="head">电子邮件：</td>'+
							'<td class="content">'+
								'<input type="text" id="'+ _config.userEmailId +'" name="USEREMAIL" readonly />'+
							'</td>'+
						'</tr>'+
					'</table>'+
				'</div>'+
			'</div>';
		var mainObj = $(html);
    	$(document.body).append(mainObj);


    	Request.processDataRequest({
    		url : "/jrzl/pub/index/getuserbyid.action",
    		localStorage : _config.localData,
    		errorRedirect : false,
    		customParams : {'USERID' : _config.userId},
    		callbackFunc : function(data){
    			if(data != null){
    				$("#"+_config.userNameId).val(data.USERNAME);
    				$("#"+_config.userDepId).val(data.USERDEPARTMENT);
    				$("#"+_config.userSuperiorId).val(data.USERSUPERIOR);
    				$("#"+_config.userMobileId).text(data.USERMOBILE);
    				$("#"+_config.userTelId).val(data.USERTEL);
    				$("#"+_config.userOaId).val(data.USEROAID);
    				$("#"+_config.userEmailId).val(data.USEREMAIL);
    				if(data.USERSEX == 'f'){
    					$("#"+_config.userSexId).val('女');
    				}
    				else if(data.USERSEX == 'm'){
    					$("#"+_config.userSexId).val('男');
    				}
    			}
    			_config.userInfoWin = JrzlTools.openModalWindow({
    	    		id : _config.id,
    				title : "用户资料",
    				height : "auto",
    				width : 750
        		});
    			$("#"+_config.id).focus();
    		}
    	});


	},
	_bindInfoEnv:function(){
		var self = this,
		_config = self.config;

		// 用户信息窗口关闭按钮
		$("#"+_config.closeBtnId).bind('click', function(){
			_config.userInfoWin.close();
		});

		// 用户手机号点击事件
		$("#"+_config.userMobileId).bind('click', function(){
			self._renderSendWin();
			self._bindNoticeEnv($.trim($("#"+_config.userMobileId).text()));
		});
	},
	_bindNoticeEnv:function(mobile){
		var self = this,
		_config = self.config;

		// 短信发送窗口关闭按钮
		$("#"+_config.noticeCloseBtnId).bind('click',function(){
			_config.msgSendWin.close();
		});
		// 短信发送按钮
		$("#"+_config.noticeSendBtnId).bind('click',function(){
			if($("#"+_config.noticeContentId).val() == ""){
				JrzlTools.alert("发送内容不能为空。","警告",null);
				return;
			}
			Request.processDataRequest({
				url : "/jrzl/pub/index/msgSend.action",
				errorRedirect : false,
				submitConfirm : true,
				confirmText   : "确认发送?",
				validated:true,
				customParams : {'NOTCONT' : $("#"+_config.noticeContentId).val(),'USERMOBILE' : mobile},
				callbackFunc : sendMsgHandler
			});
		});
		// 非空校验
		$("#"+_config.noticeContentId).bind('blur',function(event){
			if(JrzlTools.getBrowser() == "MSIE"){
				if( document.activeElement.id == _config.noticeCloseBtnId
						|| document.activeElement.className.indexOf('ui-dialog-titlebar-close') != -1){
					return;
				}
			}
			else{
				if(event.relatedTarget.id == _config.noticeCloseBtnId){
					return;
				}
			}

			if($("#"+_config.noticeContentId).val() == ""){
				$(this).addClass("red-border");
				if($(this).next(".msg-wrap").length == 0){
					$(this).after('<span class="msg-wrap n-warn"></span>');
				}
				else{
					$(this).next('.msg-wrap').removeClass("n-ok").addClass("n-warn");
				}
			}
			else{
				$(this).removeClass("red-border");
				if($(this).next(".msg-wrap").length == 0){
					$(this).after('<span class="msg-wrap n-ok"></span>');
				}
				else{
					$(this).next('.msg-wrap').removeClass("n-warn").addClass("n-ok");
				}
			}
		});

		function sendMsgHandler(data){
			if(data != null && data.ErrorNo == '0'){
				_config.msgSendWin.close();
				JrzlTools.alert("短信发送成功。", "提示");
			}

		}
	},
	_renderSendWin:function(){
		var self = this,
		_config = self.config;

		var html =
			'<div id="'+ _config.noticeId +'" class="outer-area" style="display: none; overflow: hidden; padding: 0px;">'+
				'<div class="inner-data-area" id="sendInfo" style="overflow:hidden; border-style: none;">'+
					'<table id="datatable" style="background-color: #f3f4f6;">'+
						'<tr>'+
							'<td style="color: red;width: 6%; text-align: right;">*</td>'+
							'<td style="width: 15%;text-align:right;">知会方式:</td>'+
							'<td style="width: 75%;">'+
								'<input type="checkbox" id="NOTICEENABLESMS" name="NOTICEENABLESMS" disabled checked="checked" />短信'+
							'</td>'+
						'</tr>'+

						'<tr>'+
							'<td style="color: red;width: 6%; text-align: right;">*</td>'+
							'<td style="width: 15%;text-align:right;">通知内容:</td>'+
							'<td style="width: 75%;">'+
								'<textarea  rows="7" style="overflow: auto; resize:none" name="NOTCONT" id="'+ _config.noticeContentId +'"></textarea>'+
							'</td>'+
						'</tr>'+
					'</table>'+
				'</div>'+
				'<div class="send-button-area" >'+
						'<input type="button" id="'+ _config.noticeSendBtnId +'" style="margin-right:20px;" name="send" value="发送" class="common-button" />'+
						'<input type="button" id="'+ _config.noticeCloseBtnId +'" name="close" value="关闭" class="common-button" />'+
				'</div>'+
			'</div>';

		var mainObj = $(html);
    	$(document.body).append(mainObj);

    	_config.userInfoWin.close();

    	_config.msgSendWin = JrzlTools.openModalWindow({
    		id :  _config.noticeId,
    		title : "信息发送",
    		height : 'auto',
    		width : 400
    	});
	}

};