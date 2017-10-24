/**
 * 可互操作的tab
 * @param id  tab容器id 
 * @param click 是否可点击切换tab
 * @return
 */
function OrcTab(id,click){
	this.containerId = id;
	if(click==null){
	   click=true;	
	}
	var isIE     = navigator.appName.indexOf("Microsoft")!= -1 ;
	var isIE7    = isIE && (navigator.appVersion.indexOf("MSIE 7.0")!=-1);
	var isIE6    = isIE && (navigator.appVersion.indexOf("MSIE 6.0")!=-1);
	this.className = {"orc-tab-div":"orc-tab-div","orc-tab-active":"orc-tab-active"};
	
//	if(isIE6 || isIE7){
//		this.className["orc-tab-div"] = "orc-tab-div-ie7";
//		this.className["orc-tab-active"] = "orc-tab-active-ie7";
//	}
	
	this.init(id,click);
}

OrcTab.prototype = {
		init:function(id,click){
	          var self = this;
	          self._renderHTML(id,click);
	          
        },
        _renderHTML: function(id,click){
        	var self = this,
            _className = self.className;
        	$("#"+id).children("ul").addClass("orc-tab-ul");
        	
			$("#"+id).children("ul").find("li").addClass("orc-tab-li");
			var tabLen = $("#"+id + "> ul").children("li").length;
			$("#"+id).children("ul").find("li").each(function(index,item){
				if(index < tabLen - 1){
					$(item).after("<div class='orc-tab-cutline'></div>");
				}			
		        $($(item).attr("href")).addClass(_className["orc-tab-div"]);
		        if(index==0){
		        	 $($(item).attr("href")).addClass(_className["orc-tab-active"]);
		        	 $(item).addClass("orc-tab-selected");
		         }

			});
            if(click){
				$("#"+id).children("ul").find("li").each(function(index,item) {
					if($(item).attr("click")=="false"){
					   return;	
					}
					$(item).bind('click',function(){
					   $("#"+id).children("ul").find("li").removeClass("orc-tab-selected");
					   $(item).addClass("orc-tab-selected");
					   $("#"+id).children("ul").find("li").each(function(index,item){
						   $($(item).attr("href")).removeClass(_className["orc-tab-active"]);
					   });
					   $($(item).attr("href")).addClass(_className["orc-tab-active"]);     
					});
				
			     });
            }
        },
        openTab:function(id){
        	var self = this;
        	 _className = self.className;
        	$("#"+self.containerId).children("ul").find("li").removeClass("orc-tab-selected");
        	$("#"+self.containerId).children("ul").find("li").each(function(index,item){
        		$($(item).attr("href")).removeClass(_className["orc-tab-active"]);        		
        	});
        	
        	$('li[href="'+id+'"]').addClass("orc-tab-selected");;
        	$(id).addClass(_className["orc-tab-active"]);
        },
        openNext:function(){
        	var self = this;
        	_className = self.className;
        	var nowIndex = $("#"+self.containerId).children("ul").find("li.orc-tab-selected").first().index("li");
        	
        	$("#"+self.containerId).children("ul").find("li").removeClass("orc-tab-selected");
        	$("#"+self.containerId).children("ul").find("li").each(function(index,item){
        		$($(item).attr("href")).removeClass(_className["orc-tab-active"]);
        	});
        	
        	$("#"+self.containerId).children("ul").find("li").eq(nowIndex+1).addClass("orc-tab-selected");
        	
        	$($("#"+self.containerId).children("ul").find("li").eq(nowIndex+1).attr("href")).addClass(_className["orc-tab-active"]);
        },
        openPrevious:function(){
        	var self = this;
        	_className = self.className;
        	var nowIndex = $("#"+self.containerId).children("ul").find("li.orc-tab-selected").first().index("li");
        	
        	$("#"+self.containerId).children("ul").find("li").removeClass("orc-tab-selected");
        	$("#"+self.containerId).children("ul").find("li").each(function(index,item){
        		$($(item).attr("href")).removeClass(_className["orc-tab-active"]);
        	});
        	
        	$("#"+self.containerId).children("ul").find("li").eq(nowIndex-1).addClass("orc-tab-selected");
        	
        	$($("#"+self.containerId).children("ul").find("li").eq(nowIndex-1).attr("href")).addClass(_className["orc-tab-active"]);
        },
        getSelectedTab:function(){
        	var self = this;
        	_className = self.className;
        	var selectedTabInfo = {};
        	var curTab = $("#"+self.containerId).children("ul").find("li.orc-tab-selected");        	
        	selectedTabInfo.href = curTab.attr("href");
        	if(curTab.attr("id") != undefined){
        		selectedTabInfo.id = curTab.attr("id");
        	}
        	return selectedTabInfo;
        }
};
