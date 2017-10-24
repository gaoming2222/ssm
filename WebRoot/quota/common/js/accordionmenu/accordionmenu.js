/**
 * AccordionMenu 菜单控件
 * @param options
 * @return
 */
 function AccordionMenu(options) {
    this.config = {
    	id                  :     null,                         //外层容器的id
    	containerId         : null,                             //组装#后的id
        menuArrs            :  null,                            //数据源
        type                :  'click',                         //item事件类型
        renderCallBack      :  null,                           //渲染后触发的事件
        clickItemCallBack   : null,                             //item点击后的事件
        menuType			: null								//菜单类型，1:首页菜单；2：搜索菜单；3：收藏夹
    };

    this.accordionNodes={

    };
    this.cache = {

    };
    this.init(options);

 }


 AccordionMenu.prototype = {
    constructor: AccordionMenu,
    init: function(options){
        this.config = $.extend(this.config,options || {});
        this.config.containerId ="#"+ this.config.id;
        var self = this,
            _config = self.config,
            _cache = self.cache;

        $(_config.containerId).each(function(index,item){

            self._renderHTML(item);
            // 绑定事件
            self._bindEnv(item);
            //弹出设置
            self._popupSet(item);

        });
    },
    _renderHTML: function(container){
        var self = this,
            _config = self.config,
            _cache = self.cache;
        var ulhtml = '<ul>';
        $(_config.menuArrs).each(function(index,item){
        	var menuType = _config.menuType;
        	var imgCss = '';
        	if("3" == menuType){//收藏夹菜单图片样子转换
        		imgCss = item.id;
        	}else{
        		imgCss = item.id;
        	}
            var lihtml;
        	if(item.leaf){
        		lihtml =  '<li id="'+item.id+'"  '+self.config.id+'="true"><table><tr ><td align="left"><img src="images/blank.gif" class="first-level-leaf" alt=""/><span>'+item.name+'</span></td><td align="right"></td></tr></table>';
        	}else{
	        	lihtml = '<li id="'+item.id+'"><table><tr ><td align="left"><img src="images/blank.gif" class="icon-default '+imgCss+'" alt=""/><span>'+item.name+'</span></td><td align="right"><img src="images/blank.gif" class="first-level-fold" alt=""/></td></tr></table>';
	        	if(item.disable==true){
	        		lihtml = '<li id="'+item.id+'"><table><tr ><td align="left"><img src="images/blank.gif" class="icon-default '+imgCss+'" alt=""/><span class="disable" >'+item.name+'</span></td><td align="right"><img src="images/blank.gif" class="first-level-fold" alt=""/></td></tr></table>';
	        	}
	        	if(item.old==true){
	        		lihtml = '<li id="'+item.id+'"><table class="old-leasing-system"><tr ><td align="left"><img src="images/blank.gif" class="icon-default '+imgCss+'" alt=""/><span>'+item.name+'</span></td><td align="right"><img src="images/blank.gif" class="first-level-fold" alt=""/></td></tr></table>';
	        	}
        	}

        	var childHtml = '';
            if(item.children && item.children.length > 0) {
            	childHtml = self._createSubMenu(item.children,self);
            }else{
            	lihtml = lihtml+'<ul></ul>';
            }
            self.accordionNodes[item.id] = item;
            lihtml = lihtml+childHtml+'</li>';
            ulhtml=ulhtml+lihtml;
        });
        ulhtml=ulhtml+'</ul>';
        $(container).html(ulhtml);

        //一级菜单多于6个字浮动提示 二级菜单多于12个字浮动提示 三级菜单多于10个字浮动提示
        $(_config.menuArrs).each(function(index,item){
	        if( item.name && item.name.length > 6 ){
	        	JrzlTools.popup({
	        		element	:	$("#"+item.id+" table"),
	        		text	:	item.name,
	        		align	:	"bottom left"
	        	});
	    	}
	        var secondMenu = item.children;
	        for(var i in secondMenu){
	        	if( JrzlTools.getRealLength(secondMenu[i].name) > 24 ){
	        		JrzlTools.popup({
		        		element	:	$("#"+secondMenu[i].id+" > a"),
		        		text	:	secondMenu[i].name,
		        		align	:	"bottom left"
		        	});
	        	}

		        var thirdMenu = secondMenu[i].children;
		        for(var j in thirdMenu){
		        	if(JrzlTools.getRealLength(thirdMenu[j].name) > 20){
		        		JrzlTools.popup({
				       		element	:	$("#"+thirdMenu[j].id+" > a"),
				       		text	:	thirdMenu[j].name,
				       		align	:	"bottom left"
				       	});
		        	}
		        }
	       }
        });

         _config.renderCallBack && $.isFunction(_config.renderCallBack) && _config.renderCallBack();

        // 文字缩进
        self._levelIndent($(container).children('ul').first());
    },
    /**
     * 创建子节点
     * @param children  子节点数据源
     * @param accordionObj 菜单对象
     * @return
     */
    _createSubMenu: function(children,accordionObj){
        var self = accordionObj,
            _config = self.config,
            _cache = self.cache;

        var subUl = '<ul>',
            callee = arguments.callee,
            subLi,
            atag;

        $(children).each(function(index,item){
            var url = item.url || 'javascript:void(0)';
            subLi = '<li id="'+item.id+'"  '+accordionObj.config.id+'="true" >';
            aTag = '';
            if(item.disable==true&&!item.leaf){
            	aTag = '<a class="disable"><img src="images/blank.gif" class="img1" alt=""/>'+item.name+'</a>';
        	}else if(item.disable==true&&item.leaf){
        		aTag = '<a class="disable"><img src="images/blank.gif" class="img2" alt=""/>'+item.name+'</a>';
        	}else if(item.disable!=true&&!item.leaf){
        		aTag = '<a><img src="images/blank.gif" class="img1" alt=""/>'+item.name+'</a>';
        	}else{
        		aTag = '<a><img src="images/blank.gif" class="img2" alt=""/>'+item.name+'</a>';
        	}


            if( item.access==false && item.leaf){
            	aTag = '<a class="noaccess"><img src="images/blank.gif" class="img2" alt=""/>'+item.name+'</a>';
            }

            subLi = subLi + aTag;
            var childHtml='';
            if(!item.leaf) {
            	childHtml = callee(item.children,accordionObj);
            }

            subLi = subLi+childHtml+'</li>';

            self.accordionNodes[item.id] = item;

            subUl = subUl + subLi ;
        });
        subUl = subUl +'</ul>';
        return subUl;
    },
    /**
     * 层级缩进
     * @param ulList
     * @return
     */
    _levelIndent: function(ulList){
        var self = this,
            _config = self.config,
            _cache = self.cache,
            callee = arguments.callee;

        var initTextIndent = 0,
            lev = 1,
            $oUl = $(ulList);

        while($oUl.find('ul').length > 0){
            initTextIndent = parseInt(initTextIndent,10) + 2  + 'em';
            $oUl.children().children('ul').addClass('lev-' + lev)
                        .children('li').css('text-indent', initTextIndent);
            $oUl = $oUl.children().children('ul');
            lev++;
        }
        $(ulList).find('ul').hide();
        /*
        if(self.config.containerId!="#my_menu"){
          $(ulList).find('ul:first').show();
          $(ulList).find('h2:first').toggleClass('h2click',true);
        }   */
    },
    /**
     * 绑定事件
     */
    _bindEnv: function(container) {
        var self = this,
            _config = self.config;
        $('h2,a,table',container).unbind(_config.type);
        $('h2,a,table',container).bind(_config.type,function(e){
           var id = $(this).parent('li').attr("id");
           var item = self.accordionNodes[id];
        	if($(this).is('h2')){
        	    $(this).toggleClass('h2click');
            };
            if($(this).is('table')){
            	if(item.disable != true){
            		$(this).find('span').toggleClass('click');
            		// 一级菜单目录展开 给下一个目录加上边框

            	}
            }
            if($(this).is('a')){
            	//$(container).find('a').removeClass('search');
            	$(container).find('a').removeClass('leafclick');
            	if(item.disable!=true){
	            	if(item.leaf){
	            		  $(this).toggleClass('leafclick');
		            }else{
		              	  $(this).toggleClass('parentclick');
		            }
            	}
            }

            if($(this).siblings('ul').find("li").length > 0) {
                $(this).siblings('ul').slideToggle(100).end().children('img').toggleClass('unfold');

                if($(this).parent().next().find('table').length > 0){
        			var borderTop = $(this).parent().next().children('table').css('border-top-style');
        			if( borderTop == "none" ){
        				$(this).parent().next().children('table').css('border-top',"1px solid #afb7bd");
        			}
        			else{
        				$(this).parent().next().children('table').css('border-top-style',"none");
        			}
        		}
            }
            $(this).find('img.first-level-fold').toggleClass('unfold');


            _config.clickItemCallBack && $.isFunction(_config.clickItemCallBack) && _config.clickItemCallBack(item);
        });
    },
    /**
     * 弹出设置
     */
    _popupSet:function(container){
    	 var self = this,
         _config = self.config;

    	 JrzlTools.popup({
    		 element :  $('a.disable',container),
    		 text	:	"尚在建设中",
    		 align	:	"bottom left"
    	 });

    	 JrzlTools.popup({
    		 element :  $('a.noaccess',container),
    		 text	:	"无权限",
    		 align	:	"bottom left"
    	 });
    },
    /**
     * 展开目录
     * @param obj
     * @return
     */
    _foldParent:function(obj){
    	  obj.parents('ul').slideDown(200).end();
    	  var i =0;
    	  while( obj.parent('li').parent('ul').siblings('table').length==0 && i <10){
    	  	obj.parent('li').parent('ul').parent('li').children('a').children('img').toggleClass('unfold',true);
    	  	obj.parent('li').parent('ul').parent('li').children('a').toggleClass('parentclick',true);
    	  	obj=obj.parent('li').parent('ul');
    	  	i++;
    	  }
    	  obj.parent('li').parent('ul').parent('li').children('table').find('span').addClass('click');
    	  obj.parent('li').parent('ul').parent('li').children('table').find('img.first-level-fold').addClass('unfold');;

    },
    /**
     * 高亮匹配关键字
     * @param node
     * @param word
     * @return
     */
    _highlightWord: function (node, word) {
        var tempNodeVal = $(node).text().toLowerCase();
        var tempWordVal = word.toLowerCase();
        if (tempNodeVal.indexOf(tempWordVal) != -1) {
                var img = $(node).children("img").first();
                var nv = $(node).text();
                var ni = tempNodeVal.indexOf(tempWordVal);
                var before = document.createTextNode(nv.substr(0, ni));
                var docWordVal = nv.substr(ni, word.length);
                var after = document.createTextNode(nv.substr(ni + word.length));
                var hiwordtext = document.createTextNode(docWordVal);
                var hiword = document.createElement("span");
                hiword.className = "highlight";
                hiword.appendChild(hiwordtext);
                $(node).text("");
                $(node).append($(img));
                $(img).after(after);
                $(img).after(hiword);
                $(img).after(before);
        }

   },
   /**
    * 去除高亮
    * @param node
    * @return
    */
   _unHighlightWord: function(node){
	   var img = $(node).children("img").first();
       var nv = $(node).text();
       var textNode = document.createTextNode(nv);
       $(node).text("");
       $(node).append($(img));
       $(img).after(textNode);
   },
   /**
    * 菜单搜索
    * @param search_text
    * @return
    */
   searchMenu:function(search_text){
    	   var self = this,
           _config = self.config;

    	  //收缩并将原来的高亮去除
    	  $(self.config.containerId).children('ul').find("ul").slideUp(100).end();
    	  $(self.config.containerId).find('img').removeClass('unfold');
    	  $(self.config.containerId).find('span').removeClass('click');
    	  $(self.config.containerId).find('a').removeClass('parentclick');
    	  $(self.config.containerId).find('a').removeClass('leafclick');

    	  $(self.config.containerId).find('a').each(function(index,item){
    		  self._unHighlightWord($(this));
    	  });
    	  search_text = $.trim(search_text);
          var flag = false;
    	  //展开并高亮
    	  $(self.config.containerId).find('a').each(function(index,item){
    		  if (search_text.length === 0) return false;
        	  var array = new Array();
        	  array = search_text.split(" ");

              if ( ($(this).text().indexOf(search_text)>=0)){
            	  flag = true;
            	  self._highlightWord($(this), search_text);
     	  	  	  self._foldParent($(this));
     	  	  }
    	  });
    	  if(!flag && search_text.length > 0 ){
    		  JrzlTools.alert("搜索的菜单不存在。", "提示", null);
    	  }
    },
    /**
     * 获得所有节点
     * @return
     */
    getAllNodes:function(){
    	  var self = this;
    	  return self.accordionNodes;
    },
    /**
     * 销毁菜单
     * @return
     */
    distroy:function(){
    	var self = this,
    	    _config = self.config;
    	$(_config.containnerId).find("table").unbind(_config.type);;
    	$(_config.containnerId).find("a").unbind(_config.type);
    	$(_config.containnerId).find("h2").unbind(_config.type);
    	self.accordionNodes={};
    	$(_config.containerId).html("");
    }
 };






 /*
  * ContextMenu - jQuery plugin for right-click context menus
  *
  * Author: Chris Domigan
  * Contributors: Dan G. Switzer, II
  * Parts of this plugin are inspired by Joern Zaefferer's Tooltip plugin
  *
  * Dual licensed under the MIT and GPL licenses:
  *   http://www.opensource.org/licenses/mit-license.php
  *   http://www.gnu.org/licenses/gpl.html
  *
  * Version: r2
  * Date: 16 July 2007
  *
  * For documentation visit http://www.trendskitchens.co.nz/jquery/contextmenu/
  *
  */

 (function($) {

  	var menu, shadow, trigger, content, hash, currentTarget;
   var defaults = {
     menuStyle: {
       listStyle: 'none',
       padding: '1px',
       margin: '0px',
       backgroundColor: '#fff',
       border: '1px solid #999',
       width: '105px'
     },
     itemStyle: {
       margin: '0px',
       color: '#000',
       display: 'block',
       cursor: 'default',
       padding: '1px',
       border: '1px solid #fff',
       backgroundColor: 'transparent'
     },
     itemHoverStyle: {
       border: '1px solid #0a246a',
       backgroundColor: '#b6bdd2'
     },
     eventPosX: 'pageX',
     eventPosY: 'pageY',
     shadow : true,
     onContextMenu: null,
     onShowMenu: null
  	};

   $.fn.contextMenu = function(id, options) {
     if (!menu) {                                      // Create singleton menu
       menu = $('<div id="jqContextMenu"></div>')
                .hide()
                .css({position:'absolute', zIndex:'500'})
                .appendTo('body')
                .bind('click', function(e) {
                  e.stopPropagation();
                });
     }
     if (!shadow) {
       shadow = $('<div></div>')
                  .css({backgroundColor:'#000',position:'absolute',opacity:0.2,zIndex:499})
                  .appendTo('body')
                  .hide();
     }
     hash = hash || [];
     hash.push({
       id : id,
       menuStyle: $.extend({}, defaults.menuStyle, options.menuStyle || {}),
       itemStyle: $.extend({}, defaults.itemStyle, options.itemStyle || {}),
       itemHoverStyle: $.extend({}, defaults.itemHoverStyle, options.itemHoverStyle || {}),
       bindings: options.bindings || {},
       shadow: options.shadow || options.shadow === false ? options.shadow : defaults.shadow,
       onContextMenu: options.onContextMenu || defaults.onContextMenu,
       onShowMenu: options.onShowMenu || defaults.onShowMenu,
       eventPosX: options.eventPosX || defaults.eventPosX,
       eventPosY: options.eventPosY || defaults.eventPosY
     });

     var index = hash.length - 1;
     $(this).bind('contextmenu', function(e) {
       // Check if onContextMenu() defined
       var bShowContext = (!!hash[index].onContextMenu) ? hash[index].onContextMenu(e) : true;
       if (bShowContext) display(index, this, e, options);
       return false;
     });
     return this;
   };

   function display(index, trigger, e, options) {
     var cur = hash[index];
     content = $('#'+cur.id).find('ul:first').clone(true);
     content.css(cur.menuStyle).find('li').css(cur.itemStyle).hover(
       function() {
         $(this).css(cur.itemHoverStyle);
       },
       function(){
         $(this).css(cur.itemStyle);
       }
     ).find('img').css({verticalAlign:'middle',paddingRight:'2px'});

     // Send the content to the menu
     menu.html(content);

     // if there's an onShowMenu, run it now -- must run after content has been added
 		// if you try to alter the content variable before the menu.html(), IE6 has issues
 		// updating the content
     if (!!cur.onShowMenu) menu = cur.onShowMenu(e, menu);

     $.each(cur.bindings, function(id, func) {
       $('#'+id, menu).bind('click', function(e) {
         hide();
         func(trigger, currentTarget);
       });
     });

     /**
      * 80274970
      * 超出屏幕右边缘的时候，重新计算位置
      */
     var screenWith = document.body.clientWidth,
     	menuRightPos = e[cur.eventPosX] + 67,
     	diff = 0;
     if(menuRightPos >= screenWith){
    	 diff = menuRightPos - screenWith;
     }

     menu.css({'left':e[cur.eventPosX]-diff,'top':e[cur.eventPosY]}).show();
     if (cur.shadow) shadow.css({width:menu.width(),height:menu.height(),left:e.pageX+2-diff,top:e.pageY+2}).show();
     $(document).one('click', hide);
   }

   function hide() {
     menu.hide();
     shadow.hide();
   }

   // Apply defaults
   $.contextMenu = {
     defaults : function(userDefaults) {
       $.each(userDefaults, function(i, val) {
         if (typeof val == 'object' && defaults[i]) {
           $.extend(defaults[i], val);
         }
         else defaults[i] = val;
       });
     }
   };

 })(jQuery);

 $(function() {
   $('div.contextMenu').hide();
 });
