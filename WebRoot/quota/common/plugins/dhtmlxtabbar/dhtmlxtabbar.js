//v.3.6 build 131023

/*
Copyright DHTMLX LTD. http://www.dhtmlx.com
You allowed to use this component or parts of it under GPL terms
To use it on other terms or get Professional edition of the component please contact us at sales@dhtmlx.com
*/
dhtmlx=function(a){for(var b in a)dhtmlx[b]=a[b];return dhtmlx};dhtmlx.extend_api=function(a,b,c){var d=window[a];if(d)window[a]=function(a){if(a&&typeof a=="object"&&!a.tagName){var c=d.apply(this,b._init?b._init(a):arguments),f;for(f in dhtmlx)if(b[f])this[b[f]](dhtmlx[f]);for(f in a)if(b[f])this[b[f]](a[f]);else f.indexOf("on")==0&&this.attachEvent(f,a[f])}else c=d.apply(this,arguments);b._patch&&b._patch(this);return c||this},window[a].prototype=d.prototype,c&&dhtmlXHeir(window[a].prototype,c)};
dhtmlxAjax={get:function(a,b){var c=new dtmlXMLLoaderObject(!0);c.async=arguments.length<3;c.waitCall=b;c.loadXML(a);return c},post:function(a,b,c){var d=new dtmlXMLLoaderObject(!0);d.async=arguments.length<4;d.waitCall=c;d.loadXML(a,!0,b);return d},getSync:function(a){return this.get(a,null,!0)},postSync:function(a,b){return this.post(a,b,null,!0)}};
function dtmlXMLLoaderObject(a,b,c,d){this.xmlDoc="";this.async=typeof c!="undefined"?c:!0;this.onloadAction=a||null;this.mainObject=b||null;this.waitCall=null;this.rSeed=d||!1;return this}dtmlXMLLoaderObject.count=0;
dtmlXMLLoaderObject.prototype.waitLoadFunction=function(a){var b=!0;return this.check=function(){if(a&&a.onloadAction!=null&&(!a.xmlDoc.readyState||a.xmlDoc.readyState==4)&&b){b=!1;dtmlXMLLoaderObject.count++;if(typeof a.onloadAction=="function")a.onloadAction(a.mainObject,null,null,null,a);if(a.waitCall)a.waitCall.call(this,a),a.waitCall=null}}};
dtmlXMLLoaderObject.prototype.getXMLTopNode=function(a,b){if(this.xmlDoc.responseXML){var c=this.xmlDoc.responseXML.getElementsByTagName(a);c.length==0&&a.indexOf(":")!=-1&&(c=this.xmlDoc.responseXML.getElementsByTagName(a.split(":")[1]));var d=c[0]}else d=this.xmlDoc.documentElement;if(d)return this._retry=!1,d;if(!this._retry&&_isIE)return this._retry=!0,b=this.xmlDoc,this.loadXMLString(this.xmlDoc.responseText.replace(/^[\s]+/,""),!0),this.getXMLTopNode(a,b);dhtmlxError.throwError("LoadXML","Incorrect XML",
[b||this.xmlDoc,this.mainObject]);return document.createElement("DIV")};dtmlXMLLoaderObject.prototype.loadXMLString=function(a,b){if(_isIE)this.xmlDoc=new ActiveXObject("Microsoft.XMLDOM"),this.xmlDoc.async=this.async,this.xmlDoc.onreadystatechange=function(){},this.xmlDoc.loadXML(a);else{var c=new DOMParser;this.xmlDoc=c.parseFromString(a,"text/xml")}if(!b){if(this.onloadAction)this.onloadAction(this.mainObject,null,null,null,this);if(this.waitCall)this.waitCall(),this.waitCall=null}};
dtmlXMLLoaderObject.prototype.loadXML=function(a,b,c,d){this.rSeed&&(a+=(a.indexOf("?")!=-1?"&":"?")+"a_dhx_rSeed="+(new Date).valueOf());this.filePath=a;this.xmlDoc=!_isIE&&window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP");if(this.async)this.xmlDoc.onreadystatechange=new this.waitLoadFunction(this);this.xmlDoc.open(b?"POST":"GET",a,this.async);d?(this.xmlDoc.setRequestHeader("User-Agent","dhtmlxRPC v0.1 ("+navigator.userAgent+")"),this.xmlDoc.setRequestHeader("Content-type",
"text/xml")):b&&this.xmlDoc.setRequestHeader("Content-type",this.contenttype||"application/x-www-form-urlencoded");this.xmlDoc.setRequestHeader("X-Requested-With","XMLHttpRequest");this.xmlDoc.send(c);this.async||(new this.waitLoadFunction(this))()};
dtmlXMLLoaderObject.prototype.destructor=function(){return this.setXSLParamValue=this.getXMLTopNode=this.xmlNodeToJSON=this.doSerialization=this.loadXMLString=this.loadXML=this.doXSLTransToString=this.doXSLTransToObject=this.doXPathOpera=this.doXPath=this.xmlDoc=this.mainObject=this.onloadAction=this.filePath=this.rSeed=this.async=this._retry=this._getAllNamedChilds=this._filterXPath=null};
dtmlXMLLoaderObject.prototype.xmlNodeToJSON=function(a){for(var b={},c=0;c<a.attributes.length;c++)b[a.attributes[c].name]=a.attributes[c].value;b._tagvalue=a.firstChild?a.firstChild.nodeValue:"";for(c=0;c<a.childNodes.length;c++){var d=a.childNodes[c].tagName;d&&(b[d]||(b[d]=[]),b[d].push(this.xmlNodeToJSON(a.childNodes[c])))}return b};function callerFunction(a,b){return this.handler=function(c){if(!c)c=window.event;a(c,b);return!0}}function getAbsoluteLeft(a){return getOffset(a).left}
function getAbsoluteTop(a){return getOffset(a).top}function getOffsetSum(a){for(var b=0,c=0;a;)b+=parseInt(a.offsetTop),c+=parseInt(a.offsetLeft),a=a.offsetParent;return{top:b,left:c}}
function getOffsetRect(a){var b=a.getBoundingClientRect(),c=document.body,d=document.documentElement,e=window.pageYOffset||d.scrollTop||c.scrollTop,g=window.pageXOffset||d.scrollLeft||c.scrollLeft,f=d.clientTop||c.clientTop||0,h=d.clientLeft||c.clientLeft||0,i=b.top+e-f,k=b.left+g-h;return{top:Math.round(i),left:Math.round(k)}}function getOffset(a){return a.getBoundingClientRect?getOffsetRect(a):getOffsetSum(a)}
function convertStringToBoolean(a){typeof a=="string"&&(a=a.toLowerCase());switch(a){case "1":case "true":case "yes":case "y":case 1:case !0:return!0;default:return!1}}function getUrlSymbol(a){return a.indexOf("?")!=-1?"&":"?"}function dhtmlDragAndDropObject(){if(window.dhtmlDragAndDrop)return window.dhtmlDragAndDrop;this.dragStartObject=this.dragStartNode=this.dragNode=this.lastLanding=0;this.tempDOMM=this.tempDOMU=null;this.waitDrag=0;window.dhtmlDragAndDrop=this;return this}
dhtmlDragAndDropObject.prototype.removeDraggableItem=function(a){a.onmousedown=null;a.dragStarter=null;a.dragLanding=null};dhtmlDragAndDropObject.prototype.addDraggableItem=function(a,b){a.onmousedown=this.preCreateDragCopy;a.dragStarter=b;this.addDragLanding(a,b)};dhtmlDragAndDropObject.prototype.addDragLanding=function(a,b){a.dragLanding=b};
dhtmlDragAndDropObject.prototype.preCreateDragCopy=function(a){if(!((a||window.event)&&(a||event).button==2)){if(window.dhtmlDragAndDrop.waitDrag)return window.dhtmlDragAndDrop.waitDrag=0,document.body.onmouseup=window.dhtmlDragAndDrop.tempDOMU,document.body.onmousemove=window.dhtmlDragAndDrop.tempDOMM,!1;window.dhtmlDragAndDrop.dragNode&&window.dhtmlDragAndDrop.stopDrag(a);window.dhtmlDragAndDrop.waitDrag=1;window.dhtmlDragAndDrop.tempDOMU=document.body.onmouseup;window.dhtmlDragAndDrop.tempDOMM=
document.body.onmousemove;window.dhtmlDragAndDrop.dragStartNode=this;window.dhtmlDragAndDrop.dragStartObject=this.dragStarter;document.body.onmouseup=window.dhtmlDragAndDrop.preCreateDragCopy;document.body.onmousemove=window.dhtmlDragAndDrop.callDrag;window.dhtmlDragAndDrop.downtime=(new Date).valueOf();a&&a.preventDefault&&a.preventDefault();return!1}};
dhtmlDragAndDropObject.prototype.callDrag=function(a){if(!a)a=window.event;dragger=window.dhtmlDragAndDrop;if(!((new Date).valueOf()-dragger.downtime<100)){if(!dragger.dragNode)if(dragger.waitDrag){dragger.dragNode=dragger.dragStartObject._createDragNode(dragger.dragStartNode,a);if(!dragger.dragNode)return dragger.stopDrag();dragger.dragNode.onselectstart=function(){return!1};dragger.gldragNode=dragger.dragNode;document.body.appendChild(dragger.dragNode);document.body.onmouseup=dragger.stopDrag;dragger.waitDrag=
0;dragger.dragNode.pWindow=window;dragger.initFrameRoute()}else return dragger.stopDrag(a,!0);if(dragger.dragNode.parentNode!=window.document.body&&dragger.gldragNode){var b=dragger.gldragNode;if(dragger.gldragNode.old)b=dragger.gldragNode.old;b.parentNode.removeChild(b);var c=dragger.dragNode.pWindow;b.pWindow&&b.pWindow.dhtmlDragAndDrop.lastLanding&&b.pWindow.dhtmlDragAndDrop.lastLanding.dragLanding._dragOut(b.pWindow.dhtmlDragAndDrop.lastLanding);if(_isIE){var d=document.createElement("Div");d.innerHTML=
dragger.dragNode.outerHTML;dragger.dragNode=d.childNodes[0]}else dragger.dragNode=dragger.dragNode.cloneNode(!0);dragger.dragNode.pWindow=window;dragger.gldragNode.old=dragger.dragNode;document.body.appendChild(dragger.dragNode);c.dhtmlDragAndDrop.dragNode=dragger.dragNode}dragger.dragNode.style.left=a.clientX+15+(dragger.fx?dragger.fx*-1:0)+(document.body.scrollLeft||document.documentElement.scrollLeft)+"px";dragger.dragNode.style.top=a.clientY+3+(dragger.fy?dragger.fy*-1:0)+(document.body.scrollTop||
document.documentElement.scrollTop)+"px";var e=a.srcElement?a.srcElement:a.target;dragger.checkLanding(e,a)}};dhtmlDragAndDropObject.prototype.calculateFramePosition=function(a){if(window.name){for(var b=parent.frames[window.name].frameElement.offsetParent,c=0,d=0;b;)c+=b.offsetLeft,d+=b.offsetTop,b=b.offsetParent;if(parent.dhtmlDragAndDrop){var e=parent.dhtmlDragAndDrop.calculateFramePosition(1);c+=e.split("_")[0]*1;d+=e.split("_")[1]*1}if(a)return c+"_"+d;else this.fx=c;this.fy=d}return"0_0"};
dhtmlDragAndDropObject.prototype.checkLanding=function(a,b){a&&a.dragLanding?(this.lastLanding&&this.lastLanding.dragLanding._dragOut(this.lastLanding),this.lastLanding=a,this.lastLanding=this.lastLanding.dragLanding._dragIn(this.lastLanding,this.dragStartNode,b.clientX,b.clientY,b),this.lastLanding_scr=_isIE?b.srcElement:b.target):a&&a.tagName!="BODY"?this.checkLanding(a.parentNode,b):(this.lastLanding&&this.lastLanding.dragLanding._dragOut(this.lastLanding,b.clientX,b.clientY,b),this.lastLanding=
0,this._onNotFound&&this._onNotFound())};
dhtmlDragAndDropObject.prototype.stopDrag=function(a,b){dragger=window.dhtmlDragAndDrop;if(!b){dragger.stopFrameRoute();var c=dragger.lastLanding;dragger.lastLanding=null;c&&c.dragLanding._drag(dragger.dragStartNode,dragger.dragStartObject,c,_isIE?event.srcElement:a.target)}dragger.lastLanding=null;dragger.dragNode&&dragger.dragNode.parentNode==document.body&&dragger.dragNode.parentNode.removeChild(dragger.dragNode);dragger.dragNode=0;dragger.gldragNode=0;dragger.fx=0;dragger.fy=0;dragger.dragStartNode=
0;dragger.dragStartObject=0;document.body.onmouseup=dragger.tempDOMU;document.body.onmousemove=dragger.tempDOMM;dragger.tempDOMU=null;dragger.tempDOMM=null;dragger.waitDrag=0};dhtmlDragAndDropObject.prototype.stopFrameRoute=function(a){a&&window.dhtmlDragAndDrop.stopDrag(1,1);for(var b=0;b<window.frames.length;b++)try{window.frames[b]!=a&&window.frames[b].dhtmlDragAndDrop&&window.frames[b].dhtmlDragAndDrop.stopFrameRoute(window)}catch(c){}try{parent.dhtmlDragAndDrop&&parent!=window&&parent!=a&&parent.dhtmlDragAndDrop.stopFrameRoute(window)}catch(d){}};
dhtmlDragAndDropObject.prototype.initFrameRoute=function(a,b){if(a)window.dhtmlDragAndDrop.preCreateDragCopy(),window.dhtmlDragAndDrop.dragStartNode=a.dhtmlDragAndDrop.dragStartNode,window.dhtmlDragAndDrop.dragStartObject=a.dhtmlDragAndDrop.dragStartObject,window.dhtmlDragAndDrop.dragNode=a.dhtmlDragAndDrop.dragNode,window.dhtmlDragAndDrop.gldragNode=a.dhtmlDragAndDrop.dragNode,window.document.body.onmouseup=window.dhtmlDragAndDrop.stopDrag,window.waitDrag=0,!_isIE&&b&&(!_isFF||_FFrv<1.8)&&window.dhtmlDragAndDrop.calculateFramePosition();
try{parent.dhtmlDragAndDrop&&parent!=window&&parent!=a&&parent.dhtmlDragAndDrop.initFrameRoute(window)}catch(c){}for(var d=0;d<window.frames.length;d++)try{window.frames[d]!=a&&window.frames[d].dhtmlDragAndDrop&&window.frames[d].dhtmlDragAndDrop.initFrameRoute(window,!a||b?1:0)}catch(e){}};_OperaRv=_KHTMLrv=_FFrv=_isChrome=_isMacOS=_isKHTML=_isOpera=_isIE=_isFF=!1;navigator.userAgent.indexOf("Macintosh")!=-1&&(_isMacOS=!0);navigator.userAgent.toLowerCase().indexOf("chrome")>-1&&(_isChrome=!0);
if(navigator.userAgent.indexOf("Safari")!=-1||navigator.userAgent.indexOf("Konqueror")!=-1)_KHTMLrv=parseFloat(navigator.userAgent.substr(navigator.userAgent.indexOf("Safari")+7,5)),_KHTMLrv>525?(_isFF=!0,_FFrv=1.9):_isKHTML=!0;else if(navigator.userAgent.indexOf("Opera")!=-1)_isOpera=!0,_OperaRv=parseFloat(navigator.userAgent.substr(navigator.userAgent.indexOf("Opera")+6,3));else if(navigator.appName.indexOf("Microsoft")!=-1){if(_isIE=!0,(navigator.appVersion.indexOf("MSIE 8.0")!=-1||navigator.appVersion.indexOf("MSIE 9.0")!=
-1||navigator.appVersion.indexOf("MSIE 10.0")!=-1||document.documentMode>7)&&document.compatMode!="BackCompat")_isIE=8}else navigator.appName=="Netscape"&&navigator.userAgent.indexOf("Trident")!=-1?_isIE=8:(_isFF=!0,_FFrv=parseFloat(navigator.userAgent.split("rv:")[1]));
dtmlXMLLoaderObject.prototype.doXPath=function(a,b,c,d){if(_isKHTML||!_isIE&&!window.XPathResult)return this.doXPathOpera(a,b);if(_isIE)return b||(b=this.xmlDoc.nodeName?this.xmlDoc:this.xmlDoc.responseXML),b||dhtmlxError.throwError("LoadXML","Incorrect XML",[b||this.xmlDoc,this.mainObject]),c!=null&&b.setProperty("SelectionNamespaces","xmlns:xsl='"+c+"'"),d=="single"?b.selectSingleNode(a):b.selectNodes(a)||[];else{var e=b;b||(b=this.xmlDoc.nodeName?this.xmlDoc:this.xmlDoc.responseXML);b||dhtmlxError.throwError("LoadXML",
"Incorrect XML",[b||this.xmlDoc,this.mainObject]);b.nodeName.indexOf("document")!=-1?e=b:(e=b,b=b.ownerDocument);var g=XPathResult.ANY_TYPE;if(d=="single")g=XPathResult.FIRST_ORDERED_NODE_TYPE;var f=[],h=b.evaluate(a,e,function(){return c},g,null);if(g==XPathResult.FIRST_ORDERED_NODE_TYPE)return h.singleNodeValue;for(var i=h.iterateNext();i;)f[f.length]=i,i=h.iterateNext();return f}};function j(){if(!this.catches)this.catches=[];return this}j.prototype.catchError=function(a,b){this.catches[a]=b};
j.prototype.throwError=function(a,b,c){if(this.catches[a])return this.catches[a](a,b,c);if(this.catches.ALL)return this.catches.ALL(a,b,c);alert("Error type: "+a+"\nDescription: "+b);return null};window.dhtmlxError=new j;
dtmlXMLLoaderObject.prototype.doXPathOpera=function(a,b){var c=a.replace(/[\/]+/gi,"/").split("/"),d=null,e=1;if(!c.length)return[];if(c[0]==".")d=[b];else if(c[0]=="")d=(this.xmlDoc.responseXML||this.xmlDoc).getElementsByTagName(c[e].replace(/\[[^\]]*\]/g,"")),e++;else return[];for(;e<c.length;e++)d=this._getAllNamedChilds(d,c[e]);c[e-1].indexOf("[")!=-1&&(d=this._filterXPath(d,c[e-1]));return d};
dtmlXMLLoaderObject.prototype._filterXPath=function(a,b){for(var c=[],b=b.replace(/[^\[]*\[\@/g,"").replace(/[\[\]\@]*/g,""),d=0;d<a.length;d++)a[d].getAttribute(b)&&(c[c.length]=a[d]);return c};
dtmlXMLLoaderObject.prototype._getAllNamedChilds=function(a,b){var c=[];_isKHTML&&(b=b.toUpperCase());for(var d=0;d<a.length;d++)for(var e=0;e<a[d].childNodes.length;e++)_isKHTML?a[d].childNodes[e].tagName&&a[d].childNodes[e].tagName.toUpperCase()==b&&(c[c.length]=a[d].childNodes[e]):a[d].childNodes[e].tagName==b&&(c[c.length]=a[d].childNodes[e]);return c};function dhtmlXHeir(a,b){for(var c in b)typeof b[c]=="function"&&(a[c]=b[c]);return a}
function dhtmlxEvent(a,b,c){a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent&&a.attachEvent("on"+b,c)}dtmlXMLLoaderObject.prototype.xslDoc=null;dtmlXMLLoaderObject.prototype.setXSLParamValue=function(a,b,c){if(!c)c=this.xslDoc;if(c.responseXML)c=c.responseXML;var d=this.doXPath("/xsl:stylesheet/xsl:variable[@name='"+a+"']",c,"http://www.w3.org/1999/XSL/Transform","single");if(d!=null)d.firstChild.nodeValue=b};
dtmlXMLLoaderObject.prototype.doXSLTransToObject=function(a,b){if(!a)a=this.xslDoc;if(a.responseXML)a=a.responseXML;if(!b)b=this.xmlDoc;if(b.responseXML)b=b.responseXML;if(_isIE){d=new ActiveXObject("Msxml2.DOMDocument.3.0");try{b.transformNodeToObject(a,d)}catch(c){d=b.transformNode(a)}}else{if(!this.XSLProcessor)this.XSLProcessor=new XSLTProcessor,this.XSLProcessor.importStylesheet(a);var d=this.XSLProcessor.transformToDocument(b)}return d};
dtmlXMLLoaderObject.prototype.doXSLTransToString=function(a,b){var c=this.doXSLTransToObject(a,b);return typeof c=="string"?c:this.doSerialization(c)};dtmlXMLLoaderObject.prototype.doSerialization=function(a){if(!a)a=this.xmlDoc;if(a.responseXML)a=a.responseXML;if(_isIE)return a.xml;else{var b=new XMLSerializer;return b.serializeToString(a)}};
dhtmlxEventable=function(a){a.attachEvent=function(a,c,d){a="ev_"+a.toLowerCase();this[a]||(this[a]=new this.eventCatcher(d||this));return a+":"+this[a].addEvent(c)};a.callEvent=function(a,c){a="ev_"+a.toLowerCase();return this[a]?this[a].apply(this,c):!0};a.checkEvent=function(a){return!!this["ev_"+a.toLowerCase()]};
a.eventCatcher=function(a){
	var c=[],d=function(){for(var d=!0,g=0;g<c.length;g++)if(c[g]!=null)var f=c[g].apply(a,arguments),d=d&&f;return d};
	d.addEvent=function(a){typeof a!="function"&&(a= window.eval(a) );return a?c.push(a)-1:!1};
	d.removeEvent=function(a){c[a]=null};return d
};
a.detachEvent=function(a){if(a!=!1){var c=a.split(":");this[c[0]].removeEvent(c[1])}};a.detachAllEvents=function(){for(var a in this)a.indexOf("ev_")==0&&(this.detachEvent(a),this[a]=null)};a=null};

//v.3.6 build 131023

/*
Copyright DHTMLX LTD. http://www.dhtmlx.com
You allowed to use this component or parts of it under GPL terms
To use it on other terms or get Professional edition of the component please contact us at sales@dhtmlx.com
*/




//above 是对dhtmlxcommon.min.js的拷贝************************************************























//v.3.6 build 131023

/*
Copyright DHTMLX LTD. http://www.dhtmlx.com
You allowed to use this component or parts of it under GPL terms
To use it on other terms or get Professional edition of the component please contact us at sales@dhtmlx.com
*/
/*_TOPICS_
@0:Initialization
@1:Visual appearence
@3:Event Handlers
*/


/**
*   @desc:  TabBar Object
*   @param: parentObject - parent html object or id of parent html object
*   @param: mode - tabbar mode - top.bottom,left,right; top is default
*   @param: height - height of tab (basis size)
*   @type: public
*   @topic: 0
*/
function dhtmlXTabBar(parentObject,mode,height){
	mode=mode||"top";
	dhtmlxEventable(this);

	this._hrefs = {}; //compatibility with 2.0

	this._s={};
	this._c={};

	this._s.mode=mode;
	this._s.scrolls=true;
	this._custom_height = height;
	this._s.line_height=(parseInt(height)||20)+3;//+3 to be compatible with 1.x sizes
	this._s.skin_line = 1;
	this._s.tab_margin = 0;
	this._s.expand = 0;
	this._s.ext_border = 2;

	this._s._bMode=(mode=="right"||mode=="bottom")?1:0;
	this._s._vMode=(mode=="right"||mode=="left")?1:0;

	this._dx=this._s._vMode?"height":"width";
	this._dy=this._s._vMode?"width":"height";

	switch(mode){
		case "top":
			this._py="top"; this._px="left"; this._pxc="right";
		break;
		case "bottom":
			this._py="bottom"; this._px="left"; this._pxc="right";
		break;
		case "right":
			this._py="right"; this._px="top"; this._pxc="bottom";
		break;
		case "left":
			this._py="left"; this._px="top"; this._pxc="bottom";
		break;
	}


	this._active= null;
    this._tabs = {};
    this._content = {};
    this._href={};
	this._rows=[];
    this._configs={};

	this._s._tabSize=150;

	this._styles={
		"default":{ left:3, right:3, select_shift:3, select_top:2, margin:1, offset:5, tab_color:"#F4F3EE", data_color:"#F0F8FF" },
		"winbiscarf":{ left:18, right:18, select_shift:3, select_top:2, margin:1, offset:5},
		"winscarf":{ left:18, right:4, select_shift:3, select_top:2, margin:5, offset:5},
		"modern":{ left:5, right:5, select_shift:3, select_top:2, margin:1, offset:5, tab_color:"#F4F3EE", data_color:"#F0F8FF" },
		"silver":{ left:7, right:7, select_shift:3, select_top:2, margin:1, offset:5, tab_color:"#F4F3EE", data_color:"#F0F8FF" },
		"dark_blue":{ left:2, right:2, select_shift:3, select_top:2, margin:1, offset:5 },
		"glassy_blue":{ left:2, right:3, select_shift:3, select_top:2, margin:1, offset:5 },
		"dhx_terrace":{ left:7, right:7, select_shift:0, select_top:0, margin:-1, offset:0, tab_color:"", data_color:"#ffffff" },

		"dhx_black":{ left:2, right:2, select_shift:3, select_top:0, margin:1, offset:5},
		"dhx_blue":{ left:2, right:2, select_shift:3, select_top:0, margin:1, offset:5, tab_color:"#F4F3EE", data_color:"#F0F8FF" },
		"dhx_skyblue":{ left:3, right:3, select_shift:0, select_top:0, margin:-1, offset:5 , data_color:"white", hover:true },
		"dhx_web":{ left:3, right:3, select_shift:1, select_top:0, margin:5, offset:15 , data_color:"white" }
	};

	if (typeof(parentObject)!="object"){
            parentObject = document.getElementById(parentObject);
	}

    this.entBox=parentObject;
    this.entBox.className+=" dhx_tabbar_zone_"+this._s.mode;
	if (dhtmlx.image_path) this.setImagePath(dhtmlx.image_path);

	this.setStyle("default"); this.__skin = false;
    this._createSelf();            //generate TabBar DOM structure

    if (_isIE) this.preventIECashing(true);
    return this;
}

dhtmlXTabBar.prototype={
	_get_size:function(name,alter){
		var size = this.entBox.getAttribute(name) || this.entBox.style[name] || (window.getComputedStyle?window.getComputedStyle(this.entBox,null)[name]:(this.entBox.currentStyle?this.entBox.currentStyle[name]:0))
		if ((size||"").indexOf("%")!=-1)
			this.enableAutoReSize(true,true);
		if (!size||size.indexOf("%")!=-1||size=="auto")
			size=alter+"px";
		return size;
	},

	setStyle:function(name){
		this.setSkin(name);
	},
	_getSkin:function(tab){
		//if (tab && tab.skin) return this._styles[tab.skin];
		return this._a;
	},
/**
*     @desc: set style used for tabbar
*     @type: public
*     @param: name - any valid style name
*     @topic: 0
*/
	setSkin:function(name){
		name=name.toLowerCase();
		if (!this._styles[name]) name="default";
		this._a=this._styles[name];
		this.skin=name;
		if (this._tabAll)
			this._tabAll.className='dhx_tabbar_zone dhx_tabbar_zone_'+this.skin;

		var sky_mode = name.indexOf("dhx_sky")==0;
		var simple_mode = name.indexOf("dhx_web")==0;
		var terrace_mode = name.indexOf("dhx_terrace")==0;

		if (terrace_mode&&!this._custom_height){
			this._s.line_height = 42;
			this._setRowSizes();
		}

		if (sky_mode)
			this._s.skin_line=0;
		if (simple_mode){
			this._s.line_height = 29;
			this._s.ext_border = -1;
			this._s.expand = true;
		}
		if (sky_mode) {
			this._s.line_height=26;
			this._setRowSizes();
			if (this._s.expand)
				this._s.tab_margin = -1;

			this._s.skin_line_x=true;
			this._s.skin_line=-3;
			var r = this._s._rendered;
			if (r) for (var i=0; i < r.length; i++) {
				r[i].parentNode.removeChild(r[i]);
			}

			var d1 = document.createElement("DIV");
			d1.className="dhx_tabbar_lineA";
			this._tabAll.appendChild(d1);
			var d2 = document.createElement("DIV");
			d2.className="dhx_tabbar_lineB";
			this._tabAll.appendChild(d2);

			var d3 = document.createElement("DIV");
			d3.className="dhx_tabbar_lineC";
			this._tabAll.appendChild(d3);

			var d4 = document.createElement("DIV");
			d4.className="dhx_tabbar_lineD";
			this._tabAll.appendChild(d4);

			this._getCoverLine();
			this._s._rendered = [d1,d2,d3,d4];

			if (this._s.expand){
				this._conZone.style.borderWidth="0px 0px 0px 0px";
				this._tabZone.firstChild.style.borderWidth="0px 0px 0px 0px";
				d3.style.borderWidth="0px 0px 0px 0px";
				d4.style.left="0px";
				d3.style.right="0px";
				d1.style.borderWidth="0px 0px 0px 0px";
				if (this._s.mode=="top")
					this._lineA.style.borderWidth="1px 0px 0px 0px";

				d2.style.left = "1px"

				this._s.ext_border = 0;
				//this._s.skin_line_x=false;
			}

			var f = function(){
				this._lineA.style[this._dx]="1px";
				var _quirks=(_isIE && document.compatMode == "BackCompat");
				var w = this._tabAll[this._s._vMode?"offsetHeight":"offsetWidth"]+(_quirks?2:0);
				if (this._lastActive)
					w=Math.max(w,this._lastActive.parentNode[this._s._vMode?"scrollHeight":"scrollWidth"]);
				if (w<6) return;

				d1.style[this._py]=parseInt(this._conZone.style[this._py])-3+"px";
				d1.style[this._dx]=w-2+"px";

				d2.style[this._py]=parseInt(this._conZone.style[this._py])-3+"px";
				d2.style[this._dx]=w-(_quirks?6:4)+(this._s.expand?2:0)+"px";

				d3.style[this._dy]=parseInt(this._tabZone.style[this._dy])-3+"px";
				this._lineA.style[this._dx]=w-2+"px";
			}

			f.call(this);
			var bf = this._checkScroll;
			this._checkScroll=function(){
				f.apply(this,arguments);
				bf.apply(this,arguments);
			}
			var bs = this._scrollTo;
			this._scrollTo=function(){
				bs.apply(this,arguments);
				f.apply(this,arguments);
			}
			/*var bf2=this.addTab;
			this.addTab=function(){
				bf2.apply(this,arguments);
				f.apply(this,arguments);
			}*/
		}
		if (this._a.data_color && this._conZone)
			this._conZone.style.backgroundColor=this._a.data_color;
		this.__skin = true;
	},
/**
*     @desc: enable / disable auto adjusting height and width to outer conteiner
*     @type: public
*     @param: mode - enable/disable
*     @topic: 0
*/

	enableAutoReSize:function(){
		var self=this;
		dhtmlxEvent(window,"resize",function(){
			window.setTimeout(function(){
				if (self && self._setSizes)
					self._setSizes();
			},1)
		})
	},
	_createSelf:function(){
        this._tabAll=document.createElement("DIV");
        this._tabZone=document.createElement("DIV");
        this._conZone=document.createElement("DIV");

        this.entBox.appendChild(this._tabAll);
        this._tabAll.appendChild(this._tabZone);
		this._tabAll.appendChild(this._conZone);
		 this._createChangeDiv();
        this._tabAll.className='dhx_tabbar_zone dhx_tabbar_zone_'+this.skin;
        if (this._s._vMode)
        	this._tabAll.className+='V';
        if (this._s._bMode)
            this._tabAll.className+='B';
        this._tabZone.className='dhx_tablist_zone';

        this._conZone.className='dhx_tabcontent_zone';
        if (this.entBox._hideBorders) {
        	this._conZone.style.borderLeft = this._conZone.style.borderRight = this._conZone.style.borderBottom = "0px solid white";
        }
        if (this._a.data_color)
        	this._conZone.style.backgroundColor=this._a.data_color;

        this._tabZone.onselectstart = function(){ return false; };
        this._tabZone.onclick = this._onClickHandler;
        this._tabZone.onmouseover = this._onMouseOverHandler;
        this._tabZone[_isFF?"onmouseout":"onmouseleave"] = this._onMouseOutHandler;
        this._tabZone.tabbar=this;

        this._createRow();

	},
	// 80274970
	_createChangeDiv:function(){
		var changeDiv = this._tabZone.change = [];
		changeDiv[0] = document.createElement("DIV");
		changeDiv[0].className="dhx_tab_change_left";
		changeDiv[0].setAttribute("id","dhx_tab_change_left");
		this._tabZone.appendChild(changeDiv[0]);


		changeDiv[1] = document.createElement("DIV");
		changeDiv[1].className="dhx_tab_change_right";
		changeDiv[1].setAttribute("id","dhx_tab_change_right");
		this._tabZone.appendChild(changeDiv[1]);

	},
	_createRow:function(){
		var z=document.createElement("DIV");
		z.setAttribute("id","dhx_tabbar_row_header");

    	z.className='dhx_tabbar_row';
    	z.tabCount=0;
    	this._tabZone.appendChild(z);

//		80274970
		$(z).css("left", 15);
		$(z).css("right", 15);
//		80274970


		this._rows[this._rows.length]=z;

        this._setRowSizes();
	},
	_removeRow:function(row){
    	row.parentNode.removeChild(row);
    	var z=[];
    	for (var i=0; i<this._rows.length; i++)
        	if (this._rows[i]!=row) z[z.length]=this._rows[i];
	    this._rows=z;
	},
	_setSizes:function(x,y){
		var dim=["clientHeight","clientWidth"];
		if (this._dx!="width") dim.reverse();

		var _quirks=(_isIE && document.compatMode == "BackCompat");
		var outerBorder=(this._conZone.offsetWidth-this._conZone.clientWidth);

		var _h=y||(this.entBox[dim[0]]+(_quirks?outerBorder:0));
		var _w=x||(this.entBox[dim[1]]+(_quirks?outerBorder:0));

		var _t=this._rows.length*(this._s.line_height-(this._s.skin_line_x?4:2))+(this._s.skin_line_x?2:0);
		this._tabZone.style[this._dy]=_t+"px";
		this._conZone.style[this._dy]=Math.max(0,_h-this._s.ext_border-_t-(this._s.skin_line_x?3:0)-this._s.tab_margin)+"px";
		this._conZone.style[this._dx]=Math.max(0,_w - (this._s.expand?0:2))+"px";
		//this._tabZone.style[this._py]=_t+"px";
		this._tabZone.style[this._py]=this._s.tab_margin+"px";
		this._conZone.style[this._py]=_t+this._s.tab_margin-this._s.skin_line+"px";
		this._checkScroll();

		var id = this.getActiveTab();
		if (id)	this.cells(id).activate();
		/*for (var id in this._content)
			if (this._content[id])
				this._content[id].adjustContent(this._content[id].parentNode,0,0,false,0);
				*/
	},
	_checkScroll:function(){
		if (this._lineA){
			this._lineA.style[this._dx]="1px";
			var _quirks=(_isIE && document.compatMode == "BackCompat");
			var w = this._tabAll[this._s._vMode?"offsetHeight":"offsetWidth"]+(_quirks?2:0);
			if (this._lastActive)
				w=Math.max(w,this._lastActive.parentNode[this._s._vMode?"scrollHeight":"scrollWidth"]);
			if (w>2)
				this._lineA.style[this._dx]=w-2+"px";
		}

//#scrollers:23052006{
		if (this._s._vMode || !this._s.scrolls) return; //only x-scrolls
		for (var i=0; i<this._rows.length; i++)
			if ((this._rows[i].scrollWidth-this._rows[i].offsetWidth)>32){
				this._showScroll(i);
			}
			else{
				this._hideScroll(i);
			}
//#}
	},
//#scrollers:23052006{
	_showScroll:function(i){
		var self = this;
		if (this._tabZone.change._scroll) return;
		this.callEvent("onBeforeShowScroll",[i]);
		var a= this._tabZone.change._scroll=[];
		a[0]=document.createElement("DIV");
		a[0].className="dhx_tab_scroll_left";
		a[0].setAttribute("id","dhx_tab_scroll_left");

		this._tabZone.change[0].appendChild(a[0]);


		a[1]=document.createElement("DIV");
		a[1].className="dhx_tab_scroll_right";
		a[1].setAttribute("id","dhx_tab_scroll_right");
		this._tabZone.change[1].appendChild(a[1]);
	},
	_hideScroll:function(i){

		if(this._tabZone.change._scroll){
		  this.callEvent("onBeforeHideScroll",[i]);
        }
		if (!this._tabZone.change._scroll) return;
		this._tabZone.change[0].removeChild(this._tabZone.change._scroll[0])
		this._tabZone.change[1].removeChild(this._tabZone.change._scroll[1])
		this._tabZone.change._scroll=null;
//		this._tabZone.change[1]._scroll=null;
	},
//#}
	_setRowSizes:function(){
		for (var i=0; i<this._rows.length; i++){
			this._rows[i].style[this._dy]=this._s.line_height+"px";
			this._rows[i].style[this._py]=i*(this._s.line_height-(this._s.skin_line_x?4:2))-((_isIE && !window.postMessage && this._s._bMode)?0:0)+"px";	//dirty!
			this._rows[i].style.zIndex=10+i;
		}
		this._setSizes();
	},
	_setTabSizes:function(row){
		var pos=this._a.offset;
		var px = this._s.align?this._pxc:this._px;
		for (var i=0; i < row.tabCount; i++) {
			var tab=row.childNodes[i];
			if (tab.style.display=="none") continue;
			tab.style[px]=pos-(this._lastActive==tab?this._a.select_shift:0)+"px";
			pos+=tab._size+this._a.margin;
		}
	},
/**
*   @desc: add tab to TabBar
*   @param: id - tab id
*   @param: text - tab content
*   @param: size - width(height) of tab
*   @param: position - tab index , optional
*   @param: row - index of row, optional  [only in PRO version]
*   @type: public
*   @topic: 1
*/
	//addTab:function(id, text,closable,refresh,size, position, row){
	addTab:function(options){
		var configs = {
		    	id                :  null,                      // tab页id
		    	text              :  null,                      //tab页标题
		    	closable          :  false,                     //是否可关闭
		    	refresh           :  false,                     // 切换到该页时是否刷新
		    	size              :  120,                       // 大小
		    	position          :  null,
		        row               :  null,
		        icon              :  null,                     //图标
		        popup             :  null,
		        otherSystem       :  false,                     //是否是外系统
		        oriID			  :  null
		    };

		for(var key in configs){
			if(options[key]){
				configs[key] = options[key];
			}
		}

		if (!this.__skin && dhtmlx.skin) this.setSkin(dhtmlx.skin);
			configs.row=configs.row||0;

//#multiline:23052006{
		for (var i=this._rows.length; i<=configs.row; i++)
        	this._createRow();
//#}
		var z=this._rows[configs.row].tabCount;
    	if ((!configs.position)&&(configs.position!==0)) configs.position=z;

	    var tab=this._createTab(configs.id, configs.text,configs.closable,configs.refresh,(configs.size=="*"?10:configs.size||this._s._tabSize),configs.icon,configs.popup,configs.otherSystem);
		this._addTab(this._rows[configs.row],tab,configs.size,configs.position);
		this._tabs[configs.id]=tab;
		this.cells(configs.id).hide();
		this._checkScroll();
		this._configs[configs.id] = configs;
		configs = null;
	},
	getIndex:function(id){
		var tab = this._tabs[id];
		if (tab){
			var row = tab.parentNode;
			for (var i=0; i<row.childNodes.length; i++)
				if (row.childNodes[i] == tab)
					return i;
		}

		return -1;
	},
	moveTab:function(id, index){
		var tab = this._tabs[id];
		if (tab){
			var from = this.getIndex(id);
			var row = tab.parentNode;
			index = Math.min(index, row.tabCount-1);

			if (from == index) return;
			if (from < index) index++;

			if(tab.parentNode.childNodes[index])
				tab.parentNode.insertBefore(tab, tab.parentNode.childNodes[index]);
			else
				tab.parentNode.appendChild(tab);
			this._setTabSizes(tab.parentNode);

		}
	},
/**
*   @desc: remove tab from tabbar
*   @param: tab - id of tab
*   @param: mode - if set to true, selection jump from current tab to nearest one
*   @type: public
*   @topic: 1
*/

	removeTab:function(id,mode){
	    var tab=this._tabs[id];
	    var tabWidth = 	tab.offsetWidth;
    	if (!tab) return;
		this.cells(id)._dhxContDestruct();

		if (this._content[id] && this._content[id].parentNode){
			var tabIFrame =this._content[id].getElementsByTagName('IFRAME')[0];
			/**
			 * Tab页关闭前执行函数onTabRemove
			 */
			try {
	            if(typeof tabIFrame.contentWindow.onTabRemove === 'function'){
	                tabIFrame.contentWindow.onTabRemove();
	            }
			} catch (e) {}

			if(tabIFrame){
				tabIFrame.src='about:blank';
				try{
					tabIFrame.contentWindow.document.write('');
					tabIFrame.contentWindow.document.clear();
					tabIFrame.contentWindow.document.close();
		        }catch(e){

		        }finally{
		        	try{
		        		tabIFrame.parentNode.removeChild(tabIFrame);
		        	}catch(e){}
		        }
				tabIFrame=null;
			}
			var isIE = window.navigator.userAgent.indexOf("MSIE") !== -1;
			if(isIE){
				CollectGarbage();
			}
			isIE = null;
			while (this._content[id].childNodes.length > 0) { this._content[id].removeChild(this._content[id].childNodes[0]); }
			this._content[id].parentNode.removeChild(this._content[id]);
		}
		this._content[id]=null;
		// 源页面ID
		var oriID = this._configs[id].oriID;
		if(oriID != null && this.getAllTabs().join(".").indexOf(oriID) != -1){
	    	tabbar.setTabActive(oriID);
	    }/**
	     * 关闭时 若只剩待办和抄送Tab页 则打开待办Tab 否则打开关闭Tab页前一页
	     */
	    else if(this.getAllTabs().length == 3){
	    	this.setTabActive(this.getAllTabs()[0]);
	    }else{
	    	this._goToAny(tab,mode);
	    }
		oriID = null;
		var row=tab.parentNode;
	    while (tab.childNodes.length > 0) { tab.removeChild(tab.childNodes[0]); }
		tab.innerHTML = "";
    	row.removeChild(tab);
    	row.tabCount--;

    	if ((row.tabCount==0)&&(this._rows.length>1))
        	this._removeRow(row);
        else
        	this._setTabSizes(row);

    	delete this._tabs[id];
    	delete this._configs[id];

	    if (this._lastActive==tab) this._lastActive=null;
	    var headerTab = document.getElementById("dhx_tabbar_row_header");
	    headerTab.scrollLeft=Math.max(0,headerTab.scrollLeft-tabWidth);
	    var scrollLeftNode = document.getElementById("dhx_tab_scroll_left");
	    var scrollRightNode = document.getElementById("dhx_tab_scroll_right");
	    if(scrollLeftNode){
	    	scrollLeftNode.style.left = scrollLeftNode.parentNode.scrollLeft+"px";
	    }
		if (!_isIE || window.XMLHttpRequest){
			if(scrollRightNode){
				scrollRightNode.style.right=scrollRightNode.parentNode.scrollLeft*(-1)+"px";
			}
		}

		this._setRowSizes();
		//销毁弹出提示
		$(tab.childNodes[0]).off("mouseenter").off("mouseleave");

	    tab = null;
	    headerTab = null;
	    scrollLeftNode = null;
	    scrollRightNode = null;
	    row= null;
	},
	_goToAny:function(tab,mode){
    	if (this._lastActive==tab){
        	if (mode && this.goToNextTab()==tab)
        		this.goToPrevTab();
        	if (this._lastActive==tab)
        		this._lastActive=null;
    	}
	},
	_createTab:function(id,text,closable,refresh,size,icon,popup,otherSystem){
 		var tab=document.createElement("DIV");
    	tab.className='dhx_tab_element dhx_tab_element_inactive';
    	var thml = "<span style='font-size:12px;white-space:nowrap;word-break:keep-all;overflow:hidden;text-overflow:ellipsis;''>"+text+"</span><div></div><div></div><div></div>";
    	if (closable) thml+="<IMG style='"+this._pxc+":6px; "+this._py+(this.skin=="dhx_web"?":7":":20")+"px; position:absolute;z-index:11;' src='"+this.imgUrl+this.skin+"/blank.gif' class='tab_close'>";
    	if(icon!=null){
    		//thml=thml+"<img style='left:10px; top:15px;height:16px;widht:16px; position:absolute;z-index:12;' src='"+this.imgUrl+this.skin+"/"+icon+".gif' >";
    	}
    	tab.innerHTML= thml;

    	/**
    	 * 80274970
    	 * 关闭\关闭其他\关闭所有
    	 */
    	if(id != "PUB_INDEX_TODONOTICE_TODONOTICE" && id != "PUB_INDEX_TODOTASK_TODOTASK" &&
    			id != "PUB_PORTAL_TODONOTICE_TODONOTIE" && id != "PUB_PORTAL_TODOTASK_TODOTASK" && id != "PUB_PORTAL_TODOTASK_MYTODOTASK" && id != "PUB_PORTAL_TODOTASK_TOREADTASK" && id != "PUB_DOC_DOCMANAGE"){
    	    if( $(tab).contextMenu ){
                $(tab).contextMenu('removeTab', {
                     bindings: {
                         'remove' : function(tab){
                            var tabId = $(tab).attr("tab_id");
                            tabbar.removeTab(tabId, true);
                         },
                         'removeOtherTabs': function(tab) {
                            var tabId = $(tab).attr("tab_id");
                            var tabs = tabbar._tabs;
                            if(tabId == undefined || tabs == null){
                                return;
                            }
                            for(var tab in tabs){
                                if(tab != tabId && tab != "PUB_INDEX_TODONOTICE_TODONOTICE" && tab != "PUB_INDEX_TODOTASK_TODOTASK" &&
                                        tab != "PUB_PORTAL_TODONOTICE_TODONOTICE" && tab != "PUB_PORTAL_TODOTASK_TODOTASK"){
                                    tabbar.removeTab(tab, true);
                                }
                            }
                         },
                         'removeAllTabs': function(tab) {
                            var tabs = tabbar._tabs;
                            if(tabs == null){
                                return;
                            }
                            for(var tab in tabs){
                                if(tab != "PUB_INDEX_TODONOTICE_TODONOTICE" && tab != "PUB_INDEX_TODOTASK_TODOTASK" &&
                                        tab != "PUB_PORTAL_TODONOTICE_TODONOTICE" && tab != "PUB_PORTAL_TODOTASK_TODOTASK"){
                                    tabbar.removeTab(tab, true);
                                }
                            }
                         }
                     },
                     onShowMenu: function(e, menu) {
                        var tabs = tabbar._tabs;
                        var len = 0;
                        for(var tab in tabs){
                            len++;
                        }
                        if(len == 3){
                            $('#removeOtherTabs', menu).remove();
                        }
                        return menu;
                     },
                     menuStyle: {
                            width:'60px',
                            border: 'none',
                            padding: '1px 1px 1px 4px'
                     },
                     itemStyle: {
                            color: '#3d3d3d'
                          },
                     itemHoverStyle: {
                            backgroundColor: '#C1D0ED'
                     }
                });
    	    }else{
    	        $(tab).contextmenu('removeTab', {
                    bindings: {
                        'remove' : function(tab){
                           var tabId = $(tab).attr("tab_id");
                           tabbar.removeTab(tabId, true);
                        },
                        'removeOtherTabs': function(tab) {
                           var tabId = $(tab).attr("tab_id");
                           var tabs = tabbar._tabs;
                           if(tabId == undefined || tabs == null){
                               return;
                           }
                           for(var tab in tabs){
                               if(tab != tabId && tab != "PUB_INDEX_TODONOTICE_TODONOTICE" && tab != "PUB_INDEX_TODOTASK_TODOTASK" &&
                                       tab != "PUB_PORTAL_TODONOTICE_TODONOTICE" && tab != "PUB_PORTAL_TODOTASK_TODOTASK"){
                                   tabbar.removeTab(tab, true);
                               }
                           }
                        },
                        'removeAllTabs': function(tab) {
                           var tabs = tabbar._tabs;
                           if(tabs == null){
                               return;
                           }
                           for(var tab in tabs){
                               if(tab != "PUB_INDEX_TODONOTICE_TODONOTICE" && tab != "PUB_INDEX_TODOTASK_TODOTASK" &&
                                       tab != "PUB_PORTAL_TODONOTICE_TODONOTICE" && tab != "PUB_PORTAL_TODOTASK_TODOTASK"){
                                   tabbar.removeTab(tab, true);
                               }
                           }
                        }
                    },
                    onShowMenu: function(e, menu) {
                       var tabs = tabbar._tabs;
                       var len = 0;
                       for(var tab in tabs){
                           len++;
                       }
                       if(len == 3){
                           $('#removeOtherTabs', menu).remove();
                       }
                       return menu;
                    },
                    menuStyle: {
                           width:'60px',
                           border: 'none',
                           padding: '1px 1px 1px 4px'
                    },
                    itemStyle: {
                           color: '#3d3d3d'
                         },
                    itemHoverStyle: {
                           backgroundColor: '#C1D0ED'
                    }
               });
    	    }
    	}


    	// 浮动提示
    	if(text.length>6){
    		JrzlTools.popup({
    			element : $(tab).children("span")[0],
    			text	: text,
    			align	: "top left"
    		});
    	}

    	tab.setAttribute("tab_id",id);
    	tab.setAttribute("tab_id_header",id);
    	tab.setAttribute("otherSystem",otherSystem);
    	tab._size=parseInt(size);
    	tab.style[this._dx]=parseInt(size)+"px";
    	tab.style[this._dy]=this._s.line_height+"px";
    	tab.style[this._py]=this._a.select_top+"px";
    	tab.skin=this.skin;
    	tab.refresh=refresh;
    	if (this._a.tab_color)
    		tab.style.backgroundColor=this._a.tab_color;
    	if (this._c[id])
        	tab.childNodes[0].style.cssText=this._c[id].color;

	    tab.childNodes[0].style["left"]="5px";
	    tab.childNodes[0].style["top"]="10px";
	    tab.childNodes[0].style["right"]="5px";
	    tab.childNodes[0].style["display"]="block";
	    tab.childNodes[0].style["width"]=size-40+"px";

    	this._img_all(tab);
    	if (closable){
    		var self=this;
    		tab.childNodes[4].onclick=function(e){ var id=this.parentNode.getAttribute("tab_id"); if (self.callEvent("onTabClose",[id])) self.removeTab(id,true); (e||event).cancelBubble=true; };
    	}
    	return tab;
	},
	_img_all:function(tab){
		var a=this._getSkin(tab);
		var pf=tab._active?1:4;
		//this._img(tab,pf+"_middle");
    	this._img(tab.childNodes[1],pf,this._px,a.left);
    	this._img(tab.childNodes[2],pf+2,this._pxc,a.right);
    	this._img(tab.childNodes[3],pf+1,this._px,parseInt(tab.style[this._dx])-(a.left+a.right),a.left);
    	//ff3.0 thinks that 2==3, waiting for 3.5
    	//tab.childNodes[1].style.backgroundRepeat="no-repeat";
	},
	_get_img_pos:function(ind){
		if (this._s._bMode && ind<7) ind=Math.abs(ind-6);
		ind=-5-ind*(this._s._vMode==1&&this.skin=="dhx_terrace"?245:45);
		if (this._s._vMode) return ind+"px 0px";
		else return "0px "+ind+"px";

	},
	_img:function(tag,y,pos,a,b){
		if (typeof(tag) == "undefined")
			return;
		tag.style.backgroundImage="url("+this.imgUrl+this.skin+"/"+this.skin+"_"+this._s.mode+".gif)";
		tag.style.backgroundPosition=this._get_img_pos(y);
		if (this._s._vMode == 1 && this.skin == "dhx_terrace") tag.style.width="240px";
		tag.style[this._py]="12px";
		if (pos){
			tag.style[this._dx]=Math.max(a,0)+"px";
			tag.style[pos]=(b||2)+"px";
		}
		//tag.style.backgroundPosition=this._px+" "+this._py;
	},
	_addTab:function(row,tab,size,position){
		var pos=this._a.offset;
		if (row.tabCount){
			var last=row.childNodes[row.tabCount-1];
			var pos=parseInt(last.style[this._s.align?this._pxc:this._px])+parseInt(last._size)+this._a.margin;
		}

		var next=row.childNodes[position];
		if (next)
			row.insertBefore(tab,next);
		else
			row.appendChild(tab);
		row.tabCount++;
		if (size=="*"){
			tab.style.whiteSpace="nowrap";
			this.adjustTabSize(tab);
		}

		tab.style[this._s.align?this._pxc:this._px]=pos+"px";
		if (position!=row.tabCount-1) this._setTabSizes(row);
	},
	adjustTabSize:function(tab,size){
		var a=this._getSkin(a);
		if (!size){
			tab.style.fontWeight="bold";
			tab.childNodes[3].style[this._dx] = tab.style[this._dx]="10px";
			size=tab[this._s._vMode?"scrollHeight":"scrollWidth"]+10+(this._close?20:0);
			tab.style.fontWeight="";
		}
		tab.style[this._dx]=size+"px";
		tab._size=size;

		this._img_all(tab);
	},
	_onMouseOverHandler:function(e){
		var target = this.tabbar._getTabTarget(e?e.target:event.srcElement);
        this.tabbar._showHover(target);
	},
	_onMouseOutHandler:function(e){
    	this.tabbar._showHover();
	},
	_showHover:function(tab){
		if (tab==this._lastHower) return;
		if (this._lastHower && this._lastHower != this._lastActive){
			var a=this._getSkin(this._lastHower);
			this._lastHower.className=this._lastHower.className.replace(/[ ]*dhx_tab_hover/gi,"");

			if (a.hover)
				this._img_all(this._lastHower);
			else{
				/**
				 * 80274970
				 * begin
				 */
				this._img(this._lastHower.childNodes[1],4,this._px,a.left);
		    	this._img(this._lastHower.childNodes[2],6,this._pxc,a.right);
		    	/**
				 * 80274970
				 * end
				 */
				this._img(this._lastHower.childNodes[3],5,this._px,parseInt(this._lastHower.style[this._dx])-(a.left+a.right),a.left);
			}

			//this._lastHower.style.zIndex=this._getCoverLine()._index-2;
			this._lastHower=null;

		}

		if (tab && ( tab == this._lastActive || tab._disabled)) return;

		this._lastHower=tab;
		if(tab){
			var a=this._getSkin(tab);
			tab.className+=" dhx_tab_hover";
			if (a.hover){
	    		this._img(tab.childNodes[1],7,this._px,a.left);
    			this._img(tab.childNodes[2],8,this._pxc,a.right);
			}
			/**
			 * 80274970
			 * begin
			 */
			this._img(tab.childNodes[1],1,this._px,a.left);
	    	this._img(tab.childNodes[2],3,this._pxc,a.right);
	    	/**
			 * 80274970
			 * end
			 */
			this._img(tab.childNodes[3],0,this._px,parseInt(tab.style[this._dx])-(a.left+a.right),a.left);
			//tab.style.zIndex=this._getCoverLine()._index-1;
		}

    },
    _getTabTarget:function(t){
		if (!t) return null;
    	while ((!t.className)||(t.className.indexOf("dhx_tab_element")==-1)){
        	if ((t.className)&&(t.className.indexOf("dhx_tabbar_zone")!=-1)) return null;
        	t=t.parentNode;
        	if (!t) return null;
        }
    	return t;
	},
	_onClickHandler:function(e){
		/**
		 * 80274970
		 */
		var src=e?e.target:event.srcElement;
        var target = this.tabbar._getTabTarget(src);
        if (target && !target._disabled){
	        this.tabbar._setTabActive(target);
        }else {
	    	var tabx = this.tabbar.getAllTabs();
	    	var parentRightOffset = $(this.tabbar.getTab(tabx[0])).parent().offset().left
	    					+ $(this.tabbar.getTab(tabx[0])).parent().width();
	    	var parentLeftOffset = $(this.tabbar.getTab(tabx[0])).parent().offset().left;

	    	if (src.className=="dhx_tab_scroll_right"){
	    		var lastTabOffset = $(this.tabbar.getTab(tabx[tabx.length - 1])).offset().left + 120;
	    		if( lastTabOffset <= parentRightOffset ){
	    			return;
	    		}
	    		var moveSize = 119;
	    		for(var i=tabx.length-1; i>=0;i--){
	    			if($(this.tabbar.getTab(tabx[i])).offset().left < parentRightOffset
	    					&& $(this.tabbar.getTab(tabx[i])).offset().left + 120 >= parentRightOffset){
	    				moveSize = $(this.tabbar.getTab(tabx[i])).offset().left + 120 - parentRightOffset + 3;
	    				break;
	    			}
	    		}

	    		for(var tab in tabx){
					var left = parseInt(this.tabbar.getTab(tabx[tab]).style.left);
					$(this.tabbar.getTab(tabx[tab])).css("left",left-moveSize);
				}
	    	}
	    	else if(src.className=="dhx_tab_scroll_left"){ //左边按钮
	    		var firstTabOffset = $(this.tabbar.getTab(tabx[0])).offset().left;
	    		if( firstTabOffset >= parentLeftOffset ){
	    			return;
	    		}
	    		var moveSize = 119;
	    		for(var i in tabx){
	    			if($(this.tabbar.getTab(tabx[i])).offset().left < parentLeftOffset
	    					&& $(this.tabbar.getTab(tabx[i])).offset().left + 120 > parentLeftOffset){
	    				moveSize = parentLeftOffset - $(this.tabbar.getTab(tabx[i])).offset().left + 3;
	    				break;
	    			}
	    		}

	    		for(var tab in tabx){
	    			var left = parseInt(this.tabbar.getTab(tabx[tab]).style.left);
					$(this.tabbar.getTab(tabx[tab])).css("left",left + moveSize);
				}
	    	}
	    }


		/*var src=e?e.target:event.srcElement;
        var target = this.tabbar._getTabTarget(src);
        if (target && !target._disabled)
	        this.tabbar._setTabActive(target);
	    else {
	    	var tag=null;
	    	if (src.className=="dhx_tab_scroll_left"){
	    		src.parentNode.scrollLeft=Math.max(0,src.parentNode.scrollLeft-src.parentNode.offsetWidth/2);
	    		tag=src;
	    		this.tabbar._setTabTop(this.tabbar._lastActive);
    		}
	    	else if (src.className=="dhx_tab_scroll_right"){
	    		src.parentNode.scrollLeft+=src.parentNode.offsetWidth/2;
	    		tag=src.previousSibling;
	    		this.tabbar._setTabTop(this.tabbar._lastActive);
    		}
    		if (tag && tag.parentNode&&tag.parentNode.tagName){
    			tag.style.left=tag.parentNode.scrollLeft+"px";
    			if (!_isIE || window.XMLHttpRequest)
    				tag.nextSibling.style.right=tag.parentNode.scrollLeft*(-1)+"px";
    			return false;
			}
	    }*/
	},
	_deactivateTab:function(){
		this._setTabInActive(this._lastActive);
		this._lastActive=null;
	},
	_setTabInActive:function(tab,mode){
		if (!tab || tab!=this._lastActive) return true;
		var a = this._getSkin(tab);
		var id = tab.getAttribute("tab_id");
		var px = this._s.align?this._pxc:this._px;

		tab.className=tab.className.replace("_active","_inactive");
		tab.style[this._py]=a.select_top+"px";
		tab.style[px]=parseInt(tab.style[px])+a.select_shift+"px";
	    tab.style[this._dx]=tab._size+"px";

		tab._active=false;
		if (a.tab_color)
        	tab.style.backgroundColor=a.tab_color;
        if (this._c[id])
        	tab.childNodes[0].style.cssText=this._c[id].color;

		this._img_all(tab);

		this.cells(id).hide();
	},
	_setTabActive:function(tab,mode){
		if (!tab) return true;
		var id = tab.getAttribute("tab_id");
		var last_id = this._lastActive?this._lastActive.getAttribute("tab_id"):null;
		var a = this._getSkin(tab);
		if (!mode){
			this.callEvent("onTabClick",[id,last_id]);
		}
		if( tab==this._lastActive) return true;
		if (!mode){
			if (!this.callEvent("onSelect",[id,last_id,this])) return;
		}
		var px = this._s.align?this._pxc:this._px;
		this._setTabInActive(this._lastActive);

	    tab.className=tab.className.replace("_inactive","_active");
	    tab.style[this._py]="0px";
	    tab.style[px]=parseInt(tab.style[px])-a.select_shift+"px";
	    tab.style[this._dx]=tab._size+a.select_shift*2+"px";

        tab._active=true;
        if (a.data_color)
        	tab.style.backgroundColor=a.data_color;
        if (this._c[id])
        	tab.childNodes[0].style.cssText=this._c[id].scolor;

    	//this._setContent(tab);
    	this._img_all(tab);
	    this._setTabTop(tab);

	    this._lastActive=tab;
	    this.cells(id).show();
	    this._scrollTo(tab);

	    return true;
	},
	_scrollTo:function(tab){
//#scrollers:23052006{
		if (!this._s.scrolls) return;
		if (tab.offsetLeft<tab.parentNode.scrollLeft || (tab.offsetLeft+tab.offsetWidth)>(tab.parentNode.scrollLeft+tab.parentNode.offsetWidth)){
			tab.parentNode.scrollLeft = tab.offsetLeft;
			var tag = tab.parentNode._scroll;
			if (tag && tag[0]){
				tag[0].style.left=tag[0].parentNode.scrollLeft+"px";
				if (!_isIE || window.XMLHttpRequest)
	    			tag[1].style.right=tag[1].parentNode.scrollLeft*(-1)+"px";
			}
		}
//#}
	},
	_setTabTop:function(tab){
        if(!tab)
            return false;
//#multiline:23052006{
		var t = this._rows.length-1;
		var row= null;
	    for (var i=0; i<this._rows.length; i++){
	    	row=this._rows[i];
	        if (row == tab.parentNode){
	        	if (i!=t){
	        		this._rows[i]=this._rows[t];
	        		this._rows[t]=row;
    	    	}
    	    	var line=this._getCoverLine();
    	    	row.appendChild(line);
    	    	line.style[this._dx]="1px";

    	    	var wh=(this._s._vMode?Math.max(this._tabZone.offsetHeight,row.scrollHeight):Math.max(this._tabZone.offsetWidth,row.scrollWidth));
    	    	if (wh>0)
    				line.style[this._dx]=wh+"px";
    	    	tab.style.zIndex=(line._index++);
    	    	break;
	    	}
	    }
	    t = null;
		row= null;
		this._setRowSizes();
//#}
	},
	_getCoverLine:function(){
		if (!this._lineA){
			this._lineA=document.createElement("div");
        	this._lineA.className="dhx_tablist_line";
        	this._lineA.style[this._py]=this._s.line_height-3-(this._s.skin_line_x?1:0)+"px";
        	this._lineA.style[this._dx]="100%";
        	this._lineA._index=1;
		}
		this._lineA.style.zIndex=(this._lineA._index++);

		return this._lineA;
	},
	cells:function(id){
		if (!this._tabs[id]) return null;
		if (!this._content[id]){
			var d=document.createElement("DIV");
			d.style.cssText="width:100%;height:100%;visibility:hidden;overflow:hidden;position:absolute;top:0px; left:0px;";
			d.setAttribute("tab_id",id);
			d.skin = this.skin;

			this._conZone.appendChild(d);
			(new dhtmlXContainer(d)).setContent(d);
			if (this.skin=="dhx_web" && d._setPadding) d._setPadding(1, "dhxcont_tabbar_dhx_web"); // for headerless cell use d._setPadding(0, "");
			d._isTabbarCell = true;
			this._content[id]=d;

			var self=this; //can cause memory leak
			d.show = function(){
				if (self._s.hide)
					this.style.display="";
				this.style.visibility="";
				this.style.zIndex="1";
				this.autoSize();
				this._activate();
			}
			d.hide = function(){
				if (self._s.hide){
					this.style.visibility="";
					this.style.display="none";
				} else
					this.style.visibility="hidden";
				this.style.zIndex=-1;
				if (self._hrfmode=="iframe") this.attachURL("javascript:false");
			}
			d.autoSize = function(){
				if (self._awdj || self._ahdj){
					var cont = (this.vs?this.vs[this.av].dhxcont.mainCont[this.av]:this.mainCont);
					if (!cont.offsetWidth)
						cont.style.width=Math.max(0,self.entBox.offsetWidth - 2)+"px";
					if (self._ahdj)
						cont.style.height="1px";

					var dim = this._getContentDim();
					if (self._awdj){
						self.entBox.style.width=dim[0]+2+"px";
						cont.style.width=dim[0]+"px";
					}
					if (self._ahdj){
						self._tabAll.style.height = self.entBox.style.height=dim[1]+self._rows.length*(self._s.line_height-2)+(self._s.expand?0:2)+2+"px";
						cont.style.height=dim[1]+"px";
					}
					self._setSizes();
					self._setTabTop(self._lastActive);
				}
			};
			d._activate=function(){
				if (this._delay)
					this._attachContent.apply(this,this._delay);
				this.activate();
				if (self._hrfmode!="iframe")
					this._delay=null;
			};
			d._doOnResize=function(){
				this.activate();
			};
			d.activate=function(){
				this.adjustContent(this.parentNode,0,0,false,0);
				d.updateNestedObjects();
			}
			d._doOnAttachStatusBar = d.activate;
			d._doOnAttachMenu = d.activate;
			d._doOnAttachToolbar = d.activate;
			d._getContentDim=function(){
				var cont = (this.vs?this.vs[this.av].dhxcont.mainCont[this.av]:this.mainCont);
				return [cont.scrollWidth,cont.scrollHeight];
			}
			d._doOnFrameContentLoaded=function(){
				if (self._awdj || self._ahdj)
					self.cells(id).autoSize();
				self.callEvent("onXLE",[]);
				self.callEvent("onTabContentLoaded",[this.getAttribute("tab_id")]);
			}
			d._doOnBeforeAttachURL=function(){
				self.callEvent("onXLS",[]);
			}
			d.adjustContent(d.parentNode,0,0,false,0);
		}
		return this._content[id];
	},
/**
*     @desc: forcing to load tab in question
*     @type: public
*     @param: tabId - id of tab in question
*     @param: href - new href, optional
*     @topic: 0
*/

	forceLoad:function(id,href){
        this.setContentHref(id,href||this._hrefs[id]);
        this.cells(id)._activate();
	},



/**
*     @desc: enable disable auto adjusting height and width   to inner content
*     @type: public
*     @param: autoWidth - enable/disable auto adjusting width
*     @param: autoHeight - enable/disable auto adjusting height
*     @topic: 0
*/

	enableAutoSize:function(autoWidth,autoHeight){
	    this._ahdj=convertStringToBoolean(autoHeight);
	    this._awdj=convertStringToBoolean(autoWidth);
	},

/**
*   @desc: reinitialize  tabbar
*   @type: public
*   @topic: 0
*/

	clearAll:function(){
		for (var id in this._tabs)
			this.removeTab(id,false);
		if (this._lineA){
			var line=this._getCoverLine();
			if (line.parentNode) line.parentNode.removeChild(line);
		}
	},
/**
*   @desc: enable mode, in which each tab has close button, mode will be applied to the tabs created AFTER command
*   @param: bool - false/true - enable/disable
*   @type: public
*   @topic: 1
*/

	enableTabCloseButton:function(mode){
		this._close = convertStringToBoolean(mode);
	},


	preventIECashing:function(mode){
    	this.no_cashe = convertStringToBoolean(mode);
    	if (this.XMLLoader) this.XMLLoader.rSeed=this.no_cashe;
	},
/**
*   @desc: switch tab to active state
*   @param: tabId - id of tab
*	@param: mode - if to run onSelect handler (true by default)
*	@param: text - Tab title
*   @type: public
*   @topic: 1
*/
	setTabActive:function(id,mode,text){
		/**
		 * 80274970
		 * 更新标题
		 */
		if(text != null && $.trim(text) != ''){
			$("div[tab_id='" + id + "'] span").text(text);
			$(this._tabs[id]).off("mouseenter").off("mouseleave");
		}

		this._setTabActive(this._tabs[id],mode);

		// 更新浮动提示
		if(text != null && text.length>6){
    		JrzlTools.popup({
    			element : this._tabs[id].childNodes[0],
    			text	: text,
    			align	: "top left"
    		});
    	}



		//焦点获取
		/*		if(window.frames[id+"_DHTMLXTABBAR_IFRAME"]){
			var inputs = window.frames[id+"_DHTMLXTABBAR_IFRAME"].document.getElementsByTagName("input");
		if(inputs != null && inputs.length>0){
				try {
					inputs[0].focus();
				}catch (e) {
					// TODO: handle exception
				}finally{
					inputs = null;
				}
			}
		}*/
	},
	setTabInActive:function(){
		var tab = this._lastActive;
		if (tab){
			this._deactivateTab();
			this._setTabTop(tab);
			this._getCoverLine();
		}
	},
/**
*     @desc: load tabbar from xml string
*     @type: public
*     @param: xmlString - XML string
*     @param: afterCall - function which will be called after xml loading
*     @topic: 0
*/

	loadXMLString:function(xmlString,call){
       	this.XMLLoader=new dtmlXMLLoaderObject(this._parseXML,this,true,this.no_cashe);
        this.XMLLoader.waitCall=call||0;
    	this.XMLLoader.loadXMLString(xmlString);
	},
/**
*     @desc: load tabbar from xml file
*     @type: public
*     @param: file - link too XML file
*     @param: afterCall - function which will be called after xml loading
*     @topic: 0
*/

	loadXML:function(url,call){
		this.callEvent("onXLS",[]);
		this.XMLLoader=new dtmlXMLLoaderObject(this._parseXML,this,true,this.no_cashe);
		this.XMLLoader.waitCall=call||0;
		this.XMLLoader.loadXML(url);
	},
	_parseXML:function(that,a,b,c,obj){
   		that.clearAll();
        var selected="";

        if (!obj) obj=that.XMLLoader;
          var atop=obj.getXMLTopNode("tabbar");
          var arows = obj.doXPath("//row",atop);
          var acs=atop.getAttribute("tabstyle");
          if (acs) that.setStyle(acs);

            that._hrfmode=atop.getAttribute("hrefmode")||that._hrfmode;
            that._a.margin =parseInt((atop.getAttribute("margin")||that._a.margin),10);

            acs=atop.getAttribute("align");
            if (acs)
            	that._s.align  = (acs=="right"||acs=="bottom");
            that._a.offset = parseInt((atop.getAttribute("offset")||that._a.offset),10);

            acs=atop.getAttribute("skinColors");
            if (acs) that.setSkinColors(acs.split(",")[0],acs.split(",")[1]);
            for (var i=0; i<arows.length; i++){
              var atabs = obj.doXPath("./tab",arows[i]);
                for (var j=0; j<atabs.length; j++){

                    var width=atabs[j].getAttribute("width");
                    var name=that._getXMLContent(atabs[j]);
                    var id=atabs[j].getAttribute("id");
                    that.addTab(id,name,width,"",i);
                    if (atabs[j].getAttribute("selected")) selected=id;
                    if (that._hrfmode)
                        that.setContentHref(id,atabs[j].getAttribute("href"));
                    else
                    for (var k=0; k<atabs[j].childNodes.length; k++){
						var cont=atabs[j].childNodes[k];
                        if (cont.tagName=="content"){
							if (cont.getAttribute("id"))
							   that.setContent(id,cont.getAttribute("id"));
							else
    	                        that.setContentHTML(id,that._getXMLContent(cont));
							}
					}
                }
            }
        if (selected) that.setTabActive(selected);
        that.callEvent("onXLE",[]);
    },
    adjustOuterSize:function(){
    	this._setSizes();
    },
	_getXMLContent:function(node){
       var text="";
       for (var i=0; i<node.childNodes.length; i++)
            {
                var z=node.childNodes[i];
                text+=(z.nodeValue===null?"":z.nodeValue);
            }
       return text;
	},
/**
*     @desc: enable/disable content zone (enabled by default)
*     @type: public
*     @param: mode - true/false
*     @topic: 0
*/

	enableContentZone:function(mode){
		this._conZone.style.display=((convertStringToBoolean(mode))?"":"none");
		this._setSizes();
	},
/**
*     @desc: enable/disable force hiding mode, solves IE problems with iframes in HTML content, but can cause problems for other dhtmlx components inside tabs
*     @type: public
*     @param: mode - true/false
*     @topic: 0
*/
	enableForceHiding:function(mode){
    	this._s.hide=convertStringToBoolean(mode);
	},

/**
*     @desc: set control size
*     @type: public
*     @param: width - new width
*     @param: height - new height
*     @topic: 0
*/

	setSize:function(x,y){
		this.entBox.style.width=x+"px";
		this.entBox.style.height=y+"px";
		this._setSizes();
	},
/**
*     @desc: allow to set skin specific color, must be used AFTER selecting skin
*     @type: public
*     @param: a_tab - color of activ tab
*     @param: p_tab - color of passive tab
*     @param: c_zone - color of content zone  (optional)
*     @topic: 0
*/

	setSkinColors:function(a,b,c){
		if (a) this._a.data_color=a;
		if (b) this._a.tab_color=b;
		var styleNode = document.createElement("style");
		styleNode.setAttribute("type", "text/css");
		styleNode.setAttribute("media", "screen");
		document.getElementsByTagName("head")[0].appendChild(styleNode);
		var lastStyle = document.styleSheets[document.styleSheets.length - 1];
		if(lastStyle.addRule)
			lastStyle.addRule("#"+this.entBox.id+" .dhx_tabcontent_zone > div", "background-color: "+(c||a)+";",0);
		else
			lastStyle.insertRule("#"+this.entBox.id+" .dhx_tabcontent_zone > div{ background-color: "+(c||a)+";}",0);
		this._conZone.style.backgroundColor=(c||a);
	},
/**
*   @desc: set specific colors for specific tab
*   @param: id - id of tab for which setting will be applied
*   @param: color - tab color
*   @param: color - scolor - color in selected state ( optional)
*   @param: css - css class will be attached to text of tab in question
*   @type: public
*   @topic: 1
*/

	setCustomStyle:function(id,color,scolor,style){
		var str="";
		this._c[id]={
			color:(";"+(color?("color:"+color+";"):"")+(style||"")),
			scolor:(";"+(scolor?("color:"+scolor+";"):"")+(style||""))
		};
		if (this._tabs[id])
			this._tabs[id].childNodes[0].style.cssText=((this._tabs[id]==this._lastActive)?this._c[id].scolor:this._c[id].color);

	},
/**
*   @desc: set path to image folder ( not affect already created element until their state changes )
*   @param: path - path to image folder
*   @type: public
*   @topic: 0
*/

	setImagePath:function(url){
		this.imgUrl=url;
	},
	getNext:function(tab,alt){
		alt=alt||"nextSibling";
		var next=tab[alt];
		if (next && next.className.indexOf("dhx_tab_element")==-1) next=null;
		if (!next && tab.parentNode[alt])
			next=tab.parentNode[alt].childNodes[0];
		return next||tab;
	},
/**
*     @desc: returns array of ids for all tabs
*     @type: public
*     @return: array
*     @topic: 0
*/
    getAllTabs:function(){
        var tabs = [];
        for(var id in this._tabs)
		    tabs.push(id);
		return tabs;
	},

	getTab:function(id){
		return this._tabs[id];
	},
/**
*     @desc: select tab next to active
*     @type: public
*     @return: id of current active tab
*     @topic: 0
*/

	goToNextTab:function(tab){
		do {tab=this.getNext(tab||this._lastActive)}while (!this._setTabActive(tab));
		return tab;
	},
/**
*     @desc: select tab previous to active
*     @type: public
*     @return: id of current active tab
*     @topic: 0
*/

	goToPrevTab:function(tab){
		do {tab=this.getNext((tab||this._lastActive),"previousSibling")}while (!this._setTabActive(tab));
		return tab;
	},
/**
*   @desc: disable tab in tabbar
*   @param: tab - id of tab
*   @param: mode - if set to true, selection jump from current tab to nearest one
*   @type: public
*   @topic: 1
*/

	disableTab:function(id){
		this._tabs[id]._disabled=true;
		this._tabs[id].className+=" dhx_tab_element_disabled";
		this._tabs[id].style.color="silver";
	},
/**
*   @desc: enable tab in tabbar
*   @param: tab - id of tab
*   @type: public
*   @topic: 1
*/

	enableTab:function(id){
		this._tabs[id]._disabled=false;
		if (this._tabs[id].className) this._tabs[id].className=this._tabs[id].className.replace(/dhx_tab_element_disabled/g,"");
		this._tabs[id].style.color="";
	},
/**
*   @desc: show hidden tab in tabbar
*   @param: tab - id of tab
*   @type: public
*   @topic: 1
*/

	showTab:function(id){
		var tab=this._tabs[id];
		tab.style.display="";
		this._setTabSizes(tab.parentNode);
	},
/**
*   @desc: hide tab in tabbar
*   @param: tab - id of tab
*   @param: mode - if set to true, selection jump from current tab to nearest one
*   @type: public
*   @topic: 1
*/

	hideTab:function(id, mode){
		var tab=this._tabs[id];
		tab.style.display="none";
		if (tab == this._lastActive && mode !== false)
			this.goToNextTab();
		this._setTabSizes(tab.parentNode);
	},
/**
*     @desc: get id of current active tab
*     @type: public
*     @return: id of current active tab
*     @topic: 0
*/

	getActiveTab:function(){
		if (!this._lastActive) return null;
		return this._lastActive.getAttribute("tab_id");
	},
/**
*   @desc: set label of tab
*   @param: tab - id of tab
*   @param: value -  new label
*   @param: size -  tab size
*   @type: public
*   @topic: 1
*/

	setLabel:function(id,text,size){
	    var activeTab = this.getActiveTab();
		this._tabs[id].firstChild.innerHTML=text;
		this.adjustTabSize(this._tabs[id],size);
		this._setTabSizes(this._tabs[id].parentNode);
		this._checkScroll();
	},
/**
*   @desc: get label of tab
*   @param: tab - id of tab
*   @type: public
*   @topic: 1
*/
	getLabel:function(id){
			return this._tabs[id].firstChild.innerHTML;
	},
/**
*   @desc:  set offset before first tab on tabbar
*   @param: offset - offset value
*   @type: public
*   @topic: 1
*/

	setOffset:function(n){
		this._a.offset=n*1;
	},
/**
*   @desc: enable/disable scrollers ( enabled by default )
*   @param: mode - true/false
*   @type: public
*   @edition: Professional
*   @topic: 0
*/
	enableScroll:function(mode){
		this._s.scrolls=convertStringToBoolean(mode);
	},
/**
*   @desc:  set distance between tabs
*   @param: margin - margin value
*   @type: public
*   @topic: 1
*/

	setMargin:function(n){
		this._a.margin=n*1;
	},
/**
*   @desc:  set align of tabs on tabbar
*   @param: align - left/right for gorizontal tabbar, top/bottom for vertical tabbar
*   @type: public
*   @topic: 1
*/

	setAlign:function(n){
		this._s.align=(n=="bottom"||n=="right");
	},
/**
*     @desc: return window of tab content for iframe based tabbar
*     @type: public
*     @param: tab_id - tab id
*     @topic: 1
*/
    tabWindow:function(tab_id){
		var win = null;
		if(this._content[tab_id]){
			var cell = this.cells(tab_id);
			win = (cell.vs?cell.vs[cell.av]:this._content[tab_id])._frame.contentWindow;
		}
    	return win;
    },
/**
*     @desc: set content of tab, as HTML string
*     @type: public
*     @param: id - id of tab
*     @param: html - html string
*     @topic: 1
*/
	setContentHTML:function(id,value){
		this.cells(id).attachHTMLString(value);
	},
/**
*     @desc: set content of tab
*     @type: public
*     @param: id - id of tab
*     @param: nodeId - id of container, or container object
*     @topic: 1
*/

	setContent:function(id,value){
		this.cells(id).attachObject(value);
		this.cells(id).activate();
	},
/**
*     @desc: set mode of loading external content
*     @type: public
*     @param: mode - href mode - ifram/iframes/ajax
*     @topic: 0
*/

	setHrefMode:function(mode){
        this._hrfmode=mode;
    },
/**
*     @desc: set content as a href to an external file
*     @type: public
*     @param: href - link too external file
*     @topic: 1
*/
	setContentHref:function(id,href){
		this._hrefs[id]=href;
		switch (this._hrfmode){
			case "iframes":
				this.cells(id).attachURL(href,false,id);
				break;
			case "iframe":
			case "iframes-on-demand":
				this.cells(id)._delay=["url",href,false];
				break;

			case "ajax":
				var cell=this.cells(id);
				var that=this;
				cell._delay=["urlajax",href,true];
				if (!cell.attachHTMLStringA){
					cell.attachHTMLStringA=cell.attachHTMLString;
					cell.attachHTMLString=function(str,xml){
						if (xml) str=that._getXMLContent(xml.doXPath("//content")[0]);
						return this.attachHTMLStringA(str);
					}
				}
				//this.cells._doOnAttachURL();
				break;
			case "ajax-html":
				this.cells(id)._delay=["urlajax",href,true];
				break;
		}
		if (this._tabs[id]==this._lastActive) this.cells(id).show(true);
	},
//#multiline:23052006{
/**
*   @desc: reformat tabbar to remove tab scrollers
*   @param: limit - width of tabbar zone, optional
*   @param: full - true | false - force to change size of tabs to make rows of equal width
*	@edition:  professional
*   @type: public
*   @topic: 1
*/

	normalize:function(limit,full){
		limit=limit||this._tabZone.offsetWidth;
		function correct_size(tab,i){
			tabs[i]._size=tabs[i]._size+(prev_size!=Infinity?(prev_size-size):0);
			tab.adjustTabSize(tabs[i],tabs[i]._size);
		}
		var tabs=[];
		for (var j=0; j<this._rows.length; j++)
			for (var i=0; i<this._rows[j].tabCount; i++)
				tabs.push(this._rows[j].removeChild(this._rows[j].childNodes[0]));
		this._tabZone.innerHTML="";
		this._rows=[];
		var t = this._lastActive; this._lastActive=null;
		this._createRow();

		var row=0;
		var size=this._a.offset;
		var prev_size=Infinity;
		var last_tab=null;

		var i=0;
		for (i; i<tabs.length; i++)
			if ((size + tabs[i]._size + this._a.margin) < limit){
			    this._rows[row].appendChild(tabs[i]);
				this._rows[row].tabCount++;
				size+=tabs[i]._size + this._a.margin;
				}
			else {
				if (full && size<prev_size) correct_size(this,i-1);
				this._createRow();
				i--;	row++;     prev_size=size; size=this._a.offset;
				continue;
			}
		if (full && size<prev_size && prev_size!=Infinity) correct_size(this,i-1);

		for (var j=0; j < this._rows.length; j++)
			this._setTabSizes(this._rows[j]);
		this._setSizes();
		if (this._lastActive=t) this._setTabTop(this._lastActive);
	},
//#}
	showInnerScroll: function(){
		for (var i in this._tabs){
			var scrfix = dhtmlx.$customScroll;
			if(this.cells(i).vs){
				var view = this.cells(i).av;
				if (scrfix)
					dhtmlx.CustomScroll.enable(this.cells(i).vs[view].dhxcont.mainCont[view]);
				else
					this.cells(i).vs[view].dhxcont.mainCont[view].style.overflow="auto";

			}
			else{
				if (scrfix)
					dhtmlx.CustomScroll.enable(this.cells(i).dhxcont.mainCont);
				else
					this.cells(i).dhxcont.mainCont.style.overflow="auto";

			}
		}
	},

/**
* @desc: returns the number of tabs in all rows
* @type: public
* @topic: 0
*/
	getNumberOfTabs:function (){
		var tc = 0;
		for(var i=0; i<this._rows.length; i++)
			tc+=this._rows[i].tabCount;
		return tc;
	},

	destructor:function(){
	},

	distroyProgressBar:function(id){
		var reg=new RegExp("_DHTMLXTABBAR_IFRAME","g"); //创建正则RegExp对象
		var progressId = id.replace(reg,"_DHTMLXTABBAR_PROGRESS_BAR");//+"";
		var progress = document.getElementById(progressId);
		if(progress!=null){
			progress.style.display="none";
		}
		reg= null;
		progressId = null;
		progress = null;
	}

}




































if (!window.dhtmlXContainer){
window.dhtmlXContainer=function(obj) {

	var that = this;

	this.obj = obj;
	this.dhxcont = null;

	this.setContent = function(data) {
		this.dhxcont = data;
		this.dhxcont.innerHTML = "<div id='dhxMainCont' class='dhxcont_main_content'></div>"+
					 "<div id='dhxContBlocker' class='dhxcont_content_blocker' style='display: none;'></div>";
		this.dhxcont.mainCont = this.dhxcont.childNodes[0];

		var progressBg=document.createElement('DIV');
		progressBg.className="loading_bg";
		progressBg.style.display="none";
		var id = data.getAttribute("tab_id");
		var reg=new RegExp("\\.","g"); //创建正则RegExp对象
		var progressId = id.replace(reg,"_")+"_DHTMLXTABBAR_PROGRESS_BAR";
		progressBg.setAttribute("id",progressId);
		this.dhxcont.mainCont.appendChild(progressBg);

		var pogressContainer = document.createElement('DIV');
		pogressContainer.className = "loading_container";

		progressBg.appendChild(pogressContainer);

		var img_var = document.createElement('DIV');
		img_var.className = "loading_img";

		var txt_var = document.createElement('DIV');
		txt_var.className = "loading_txt";
		txt_var.innerText = "页面加载中，请稍候..."

		pogressContainer.appendChild(img_var);
		pogressContainer.appendChild(txt_var);


		this.obj.dhxcont = this.dhxcont;
	}

	this.obj._genStr = function(w) {
		var s = ""; var z = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		for (var q=0; q<w; q++) { s = s + z.charAt(Math.round(Math.random() * z.length)); }
		return s;
	}

	this.obj.setMinContentSize = function(w, h) {
		this._minDataSizeW = w;
		this._minDataSizeH = h;
	}

	this.obj.moveContentTo = function(cont) {


		cont.updateNestedObjects();
	}

	this.obj.adjustContent = function(parentObj, offsetTop, marginTop, notCalcWidth, offsetBottom) {
		this.dhxcont.style.top = offsetTop+"px";
		this.dhxcont.style.left = "0px";

		if (notCalcWidth == true) {

		} else {
			this.dhxcont.style.width = parentObj.clientWidth+"px";
		}
		// park check
		var px = parentObj.clientHeight-offsetTop;
		if (px < 0) { px = 0; }
		//
		this.dhxcont.style.height = px+(marginTop!=null?marginTop:0)+"px";
		if (notCalcWidth == true) {

		} else {
			if (this.dhxcont.offsetWidth > parentObj.clientWidth) {
				this.dhxcont.style.width = Math.max(0,parentObj.clientWidth*2-this.dhxcont.offsetWidth)+"px";
			}
		}

		if (this.dhxcont.offsetHeight > parentObj.clientHeight - offsetTop) {


			// park check
			var px = (parentObj.clientHeight-offsetTop)*2-this.dhxcont.offsetHeight;
			if (px < 0) { px = 0; }
			//
			this.dhxcont.style.height = px+"px";

		}
		if (offsetBottom) {
			if (!isNaN(offsetBottom)) this.dhxcont.style.height = parseInt(this.dhxcont.style.height)-offsetBottom+"px";
		}
		// main window content
		// menu, toolbar, statusbar should be included
		//this.dhxcont.mainCont = this._engineGetWindowContent(win);//data.childNodes[0];


		if (this._minDataSizeH != null) {
			if (parseInt(this.dhxcont.style.height) < this._minDataSizeH) {
				// height for menu/toolbar/status bar should be included
				this.dhxcont.style.height = this._minDataSizeH+"px";
			}
		}
		if (this._minDataSizeW != null) {
			if (parseInt(this.dhxcont.style.width) < this._minDataSizeW) {
				this.dhxcont.style.width = this._minDataSizeW+"px";
			}
		}

		if (notCalcWidth == true) {

		} else {
			this.dhxcont.mainCont.style.width = this.dhxcont.clientWidth+"px";
		}

		var menuOffset = (this.menu!=null?(!this.menuHidden?this.menuHeight:0):0);
		var toolbarOffset = (this.toolbar!=null?(!this.toolbarHidden?this.toolbarHeight:0):0);
		var statusOffset = (this.sb!=null?(!this.sbHidden?this.sbHeight:0):0);

		this.dhxcont.mainCont.style.height = this.dhxcont.clientHeight-menuOffset-toolbarOffset-statusOffset+"px";
	}
	this.obj.updateNestedObjects = function() {
	}


	/**
	*   @desc: attaches an object into a window
	*   @param: obj - object or object id
	*   @param: autoSize - set true to adjust a window to object's dimension
	*   @type: public
	*/
	this.obj.attachObject = function(obj, autoSize) {
		if (typeof(obj) == "string") { obj = document.getElementById(obj); }
		if (autoSize) {
			obj.style.visibility = "hidden";
			obj.style.display = "";
			var objW = obj.offsetWidth;
			var objH = obj.offsetHeight;
		}
		this._attachContent("obj", obj);
		if (autoSize && this._isWindow) {
			obj.style.visibility = "";
			this._adjustToContent(objW, objH);
			// this._engineAdjustWindowToContent(this, objW, objH);
		}
	}
	/**
	*   @desc: appends an object into a window
	*   @param: obj - object or object id
	*   @type: public
	*/
	this.obj.appendObject = function(obj) {
		if (typeof(obj) == "string") { obj = document.getElementById(obj); }
		this._attachContent("obj", obj, true);
	}
	/**
	*   @desc: attaches an html string as an object into a window
	*   @param: str - html string
	*   @type: public
	*/
	this.obj.attachHTMLString = function(str) {
		this._attachContent("str", str);
		var z=str.match(/<script[^>]*>[^\f]*?<\/script>/g)||[];
		for (var i=0; i<z.length; i++){
			var s=z[i].replace(/<([\/]{0,1})script[^>]*>/g,"")
			if (window.execScript){
				var url = z[i].match(/<script[^>]*src\s*=\s*("|')([^"']+)("|')/);
				if (url)
					var s = dhtmlxAjax.getSync(url[2]).xmlDoc.responseText;
				if (s)
					window.execScript(s);
			}
			else window.eval(s);
		}
	}
	/**
	*   @desc: attaches an url into a window
	*   @param: url
	*   @param: ajax - loads an url with ajax
	*   @type: public
	*/
	this.obj.attachURL = function(url, ajax,id) {
		this._attachContent((ajax==true?"urlajax":"url"), url, false,id);
	}
	// attach content obj|url
	this.obj._attachContent = function(type, obj, append,id) {
		// clear old content
		if (append !== true && type != "url") {
			while (that.dhxcont.mainCont.childNodes.length > 0) { that.dhxcont.mainCont.removeChild(that.dhxcont.mainCont.childNodes[0]); }
		}
		// attach
		if (type == "url") {
			var reg=new RegExp("\\.","g"); //创建正则RegExp对象
			var progressId = id.replace(reg,"_")+"_DHTMLXTABBAR_PROGRESS_BAR";
			var progress = document.getElementById(progressId);
			if(progress!=null){
				progress.style.display="block";
			}
			progress = null;
			var	fr = document.getElementById(id+"_DHTMLXTABBAR_IFRAME");
			if(fr == null){
				fr = document.createElement("IFRAME");
				fr.frameBorder = 0;
				fr.border = 0;
				fr.style.width = "100%";
				fr.style.height = "100%";
				fr.setAttribute("name",id+"_DHTMLXTABBAR_IFRAME");
				fr.setAttribute("id",id+"_DHTMLXTABBAR_IFRAME");

				var tabHeaderObj = $('div [tab_id_header='+id+']');
				//var obj = $("div [otherSystem='true']");
				if(tabHeaderObj.length>0){
				   var otherSystem = $(tabHeaderObj).attr("otherSystem")	;
				   if(otherSystem=="true"){
					   if (fr.attachEvent){
							fr.attachEvent("onload", function(){
								var progress = document.getElementById(progressId);
								if(progress!=null){
									progress.style.display="none";
								}
								progress = null;
							});
						}else {
							fr.onload = function(){
								var progress = document.getElementById(progressId);
								if(progress!=null){
									progress.style.display="none";
								}
								progress = null;
							};
						}
				   }
				   otherSystem = null;
				}
				tabHeaderObj = null;
				/*
				*/
				that.dhxcont.mainCont.appendChild(fr);
			}
			else{
				fr.src = 'about:blank';
		        try{
		        	fr.contentWindow.document.write('');
		        	fr.contentWindow.document.clear();
		        }catch(e){}
		        finally{
					var isIE = window.navigator.userAgent.indexOf("MSIE") !== -1;
					if(isIE){
						CollectGarbage();
					}
					isIE = null;
		        }
			    //以上可以清除大部分的内存和文档节点记录数了
			}


			fr.src = obj;
			this._frame = fr;
			if (this._doOnFrameContentLoaded) this._doOnFrameContentLoaded(true);
			fr = null;
		} else if (type == "urlajax") {
			var t = this;
			var xmlParser=function(){
				t.attachHTMLString(this.xmlDoc.responseText,this);
				if (t._doOnFrameContentLoaded) t._doOnFrameContentLoaded(false);
				this.destructor();
			}
			var xmlLoader = new dtmlXMLLoaderObject(xmlParser, window);
			xmlLoader.loadXML(obj);
			if (t._doOnBeforeAttachURL) t._doOnBeforeAttachURL(false);
		} else if (type == "obj") {
			that.dhxcont._frame = null;
			that.dhxcont.mainCont.appendChild(obj);
			// this._engineGetWindowContent(win).style.overflow = (append===true?"auto":"hidden");
			// win._content.childNodes[2].appendChild(obj);
			that.dhxcont.mainCont.style.overflow = (append===true?"auto":"hidden");
			obj.style.display = "";
		} else if (type == "str") {
			that.dhxcont._frame = null;
			that.dhxcont.mainCont.innerHTML = obj;
		}
	}


	this.obj._dhxContDestruct = function() {
	}

}

}

//tabbar
(function(){

	dhtmlx.extend_api("dhtmlXTabBar",{
		_init:function(obj){
			return [obj.parent,obj.mode,obj.height];
		},
		tabs:"tabs",
		skin:"setSkin",
		offset:"setOffset",
		margin:"setMargin",
		image_path:"setImagePath",
		href_mode:"setHrefMode",
		align:"setAlign",
		xml:"loadXML",
		close_button:"enableTabCloseButton",
		scroll:"enableScroll",
		forced:"enableForceHiding",
		content_zone:"enableContentZone",
		size_by_content:"enableAutoSize",
		auto_size:"enableAutoReSize"
	},{
		tabs:function(arr){
			for (var i=0; i<arr.length; i++){
				var t=arr[i];
				this.addTab(t.id,t.label, t.width, t.index, t.row);
				if (t.active) this.setTabActive(t.id);
			}
		}
	});

})();
