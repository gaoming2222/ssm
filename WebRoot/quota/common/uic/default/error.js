window_onload = function (){
	$("#common_error_msg").html(Request.getUrlParam("errorMsg"));
};

function closeWindow(){
	var pageId = Request.getUrlParam("SYS_REQUESTPAGEID");
	if(pageId!=null && pageId!="pass"){
		JrzlTools.closeMainTab(pageId);
	}
}
