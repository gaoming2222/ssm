$().ready(function(){
	var url = document.URL;
	var pos = url.indexOf(getDeployName())-1;
	$("#common_error_msg").text("页面不存在：" + url.substring(pos));

	var progress = window.parent.$(".loading_bg");
	$(progress[2]).css("display","none");
	
});
	


