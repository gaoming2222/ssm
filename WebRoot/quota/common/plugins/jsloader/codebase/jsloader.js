/*
    ********** In **********
    Project Home: http://injs.org

    Author: Guokai
    Gtalk: badkaikai@gmail.com
    Blog: http://benben.cc
    Licence: MIT License
    Version: 0.2.0-stable

    Philosophy: Just in time.
    Build: 110428120728
*/
var gPluginMod = {};
var gExcl_pages = {};
var gBasePath="";
~function() {
//    var __head = document.head || document.getElementsByTagName('head')[0];
    var __waterfall = {};
    var __loaded = {};
    var __loading = {};
    var __globals = [];
    var __configure = {autoload: false, core: '', serial: false};
    var __in;

    // mapping for `In.load`
    // This method used for loading javascript or
    // style files asynchronous and non-blocking.

    var __load = function(url, type, charset, callback) {
        if(__loading[url]) {
            if(callback) {
                setTimeout(function() {
                    __load(url, type, charset, callback);
                }, 1);
                return;
            }
            return;
        }

        if(__loaded[url]) {
            if(callback) {
                callback();
                return;
            }
            return;
        }

        __loading[url] = true;

        var ts = new Date().toDateString().replace(/ /g, "");
        var pureurl = url.split('?')[0];
        var n, t = type || pureurl.toLowerCase().substring(pureurl.lastIndexOf('.') + 1);

        if(t === 'js') {
            n = document.createElement('script');
            n.type = 'text/javascript';
            n.src = url + "?ts=" + ts;
            n.async = 'true';
            if(charset) {
                n.charset = charset;
            }
        } else if(t === 'css') {
            n = document.createElement('link');
            n.type = 'text/css';
            n.rel = 'stylesheet';
            n.href = url;
            __loaded[url] = true;
            __loading[url] = false;
            var head = document.head || document.getElementsByTagName('head')[0];
            head.appendChild(n);
            head = null;
            if(callback) callback();
            return;
        }

        n.onload = n.onreadystatechange = function() {
            if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                __loading[url] = false;
                __loaded[url] = true;

                if(callback) {
                    callback();
                }
                this.onload = this.onreadystatechange = null;
            }
        };

        n.onerror = function() {
            __loading[url] = false;

            if(callback) {
                callback();
            }

            this.onerror = null;
        };

        var head = document.head || document.getElementsByTagName('head')[0];
        head.appendChild(n);
        n = null;
        head = null;
    };

    // private method, analyze the dependency.
    // This is the core function for dependency management.

    var __analyze = function(array) {
        var riverflow = [];

        for(var i = array.length-1; i >= 0; i--) {
            var current = array[i];

            if(typeof(current) === 'string') {
                if(!__waterfall[current]) {
                    //console && console.warn && console.warn('In Error :: Module not found: ' + current);
                    continue;
                }

                riverflow.push(current);
                var relylist = __waterfall[current].rely;

                if(relylist) {
                    riverflow = riverflow.concat(__analyze(relylist));
                }
            } else if(typeof(current) === 'function') {
                riverflow.push(current);
            }
        }

        return riverflow;
    };

    // private method, serial process.
    // This method used for loading modules in serial.

    var __stackline = function(blahlist) {
        var o = this;

        this.stackline = blahlist;
        this.current = this.stackline[0];
        this.bag = {returns: [], complete: false};

        this.start = function() {
            if(typeof(o.current) != 'function' && __waterfall[o.current]) {
                __load(__waterfall[o.current].path, __waterfall[o.current].type, __waterfall[o.current].charset, o.next);
            } else {
                o.bag.returns.push(o.current());
                o.next();
            }
        };

        this.next = function() {
            if(o.stackline.length == 1 || o.stackline.length < 1) {
                o.bag.complete = true;
                if(o.bag.oncomplete) {
                    o.bag.oncomplete(o.bag.returns);
                }
                return;
            }

            o.stackline.shift();
            o.current = o.stackline[0];
            o.start();
        };
    };

    // private method, parallel process.
    // This method used for loading modules in parallel.

    var __parallel = function(blahlist, callback) {
        var length = blahlist.length;
        var hook = function() {
            if(!--length && callback) callback();
        };

        if(length == 0) {
            callback && callback();
            return;
        };

        for(var i = 0; i < blahlist.length; i++) {
            var current = __waterfall[blahlist[i]];

            if(typeof(blahlist[i]) == 'function') {
                blahlist[i]();
                hook();
                continue;
            }

            if(typeof(current) === 'undefined') {
               // console && console.warn && console.warn('In Error :: Module not found: ' + blahlist[i]);
                hook();
                continue;
            }

            if(current.rely && current.rely.length != 0) {
                __parallel(current.rely, (function(current) {
                    return function() {
                        __load(current.path, current.type, current.charset, hook);
                    };
                })(current));
            } else {
                __load(current.path, current.type, current.charset, hook);
            }
        }
    };

    // mapping for `In.add`
    // This method used for adding module.

    var __add = function(name, config) {
        if(!name || !config || !config.path) return;
        __waterfall[name] = config;
    };

    // mapping for `In.adds`
    // This method used for adding modules.

    var __adds = function(config) {
        if(!config.modules) return;

        for(var module in config.modules) {
            if(config.modules.hasOwnProperty(module)) {
                var module_config = config.modules[module];

                if(!config.modules.hasOwnProperty(module)) continue;
                if(config.type && !module_config.type) module_config.type = config.type;
                if(config.charset && !module_config.charset) module_config.charset = config.charset;
                __add.call(this, module, module_config);
            }
        }
    };

    // mapping for `In.config`
    // This method used for change the default config.

    var __config = function(name, conf) {
        __configure[name] = conf;
    };

    // mapping for `In.css`
    // This method used for insert inline css to your page dynamically.

    var __css = function(csstext) {
        var css = document.getElementById('in-inline-css');

        if(!css) {
            css = document.createElement('style');
            css.type = 'text/css';
            css.id = 'in-inline-css';
            var head = document.head || document.getElementsByTagName('head')[0];
            head.appendChild(css);
            head = null;
        }

        if(css.styleSheet) {
            css.styleSheet.cssText = css.styleSheet.cssText + csstext;
        } else {
        	var textNode = document.createTextNode(csstext);
            css.appendChild(textNode);
            textNode = null;
        }
        css = null;
    };

    // mapping for `In.later`
    // This method used for loading modules delay time specified.

    var __later = function() {
        var args = [].slice.call(arguments);
        var timeout = args.shift();

        window.setTimeout(function() {
            __in.apply(this, args);
        }, timeout);
    };

    // mapping for `In.ready`
    // This method used for loading modules while domready.

    var __ready = function() {
        var args = arguments;

        __contentLoaded(window, function() {
            __in.apply(this, args);
        });
    };

    var __global = function() {
        var args = arguments[0].constructor === Array ? arguments[0] : [].slice.call(arguments);

        __globals = __globals.concat(args);
    };

    // mapping for `In`
    // This is the main function, also mapping for method `use`.

    var __in = function() {
        var args = [].slice.call(arguments);
        if(args.length==1 && args[0] instanceof Array ){
        	args = args[0];
        }
        if(__globals.length) {
            args = __globals.concat(args);
        }

        if(__configure.serial) {
            if(__configure.core && !__loaded[__configure.core]) {
                args = ['__core'].concat(args);
            }

            var blahlist = __analyze(args).reverse();
            var stack = new __stackline(blahlist);

            stack.start();
            return stack.bag;
        }

        if(typeof(args[args.length-1]) === 'function') {
            var callback = args.pop();
        }

        if(__configure.core && !__loaded[__configure.core]) {
            __parallel(['__core'], function() {
                __parallel(args, callback);
            });
        } else {
            __parallel(args, callback);
        }
    };

    // private method, contentLoaded.
    // This method used for domready.

    var __contentLoaded = function(win,fn) {
        var done = false, top=true,
            doc = win.document, root = doc.documentElement,
            add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
            rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
            pre = doc.addEventListener ? '' : 'on',

            init = function(e) {
                if(e.type == 'readystatechange' && doc.readyState != 'complete') return;
                (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
                if(!done && (done=true)) fn.call(win, e.type || e);
            },

            poll = function() {
                try {root.doScroll('left');} catch(e) {setTimeout(poll, 50);return;}
                init('poll');
            };

        if(doc.readyState == 'complete') {
            fn.call(win, 'lazy');
        } else {
            if(doc.createEventObject && root.doScroll) {
                try {top =! win.frameElement;} catch(e) {}
                if(top) poll();
            }

            doc[add](pre + 'DOMContentLoaded', init, false);
            doc[add](pre + 'readystatechange', init, false);
            win[add](pre + 'load', init, false);
        }
    };

    // private method, initialize.
    // This is a self-executing function while in.js loaded.

    void function() {
        var myself = (function() {
        	var scripts = null;
        	try{
	            scripts = document.getElementsByTagName('script');
	            return scripts[scripts.length - 1];
        	}finally{
        		scripts = null;
        	}
        })();

        var autoload = myself.getAttribute('autoload');
        var core = myself.getAttribute('core');
        if(core) {
            __configure['autoload'] = window[ "eval" ].call( window, autoload );
            __configure['core'] = core;
            __add('__core', {path: __configure.core});
        }

        // autoload the core files
        if(__configure.autoload && __configure.core) {
            __in();
        }
    }();

    // Bind the private method to in.

    __in.add = __add;
    __in.adds = __adds;
    __in.config = __config;
    __in.css = __css;
    __in.later = __later;
    __in.load = __load;
    __in.ready = __ready;
    __in.global = __global;
    __in.use = __in;
    this.In = __in;
}();


~function() {
	var __config = {path: '', main:'',plugins:[]};
	var __jsLoader;

	__getPathLevel= function(){
		var localUrl = window.location.href;
		var index = localUrl.indexOf("/GridManager/");
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
	};

	__getbaseRealPath= function(){
		var localUrl = window.location.href;
		var index = localUrl.indexOf("/GridManager/");
		if(index==-1){
			index = localUrl.indexOf("/common/uic/");
		}
		return localUrl.substr(0,index);
	};

	__eachReverse = function (ary, func) {
        if (ary) {
            var i;
            for (i = ary.length - 1; i > -1; i -= 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    };

	__amnotuse = function (scripts) {
        __eachReverse(scripts, function (script, a, b) {

        });
    };

	__getMainJsContent = function(mainJs){
		 var factories = [function() { return new ActiveXObject("Msxml2.XMLHTTP"); },function() { return new XMLHttpRequest(); },function() { return new ActiveXObject("Microsoft.XMLHTTP"); }];
		 var request;
	 	 for(var i = 0; i < factories.length; i++) {
	 	     try {
	 	            request = factories[i]();
	 	            if (request != null)  break;
	 	     }
	 	     catch(e) { continue;}
	 	 }

	 	 request.open("GET", mainJs, false);
	 	 try{
	 		 request.send(null);
	 	 }catch(e){
	 		 return null;
	 	 }

	 	 if ( request.status == 404 || request.status == 2 ||(request.status == 0 && request.responseText == '') ) {
	 		 return null;
	 	 }
	 	 return request.responseText;

	};

	__parseDependencies = function(content){
		var re = /JrzlTools((.|\n)*?)\(/g;
		var results = content.match(re);
		if(results!=null){
			for(var i = 0,len=results.length;i<len;i++){
				results[i]=results[i].replace('JrzlTools.','').replace('\(','');
			}
		}
		return results==null?[]:results;
	};

	void function(){
		var myself = (function() {
			var loaderJs ;
            var scripts = document.getElementsByTagName('script');
            __eachReverse(scripts, function (script) {
                dataMain = script.getAttribute('main');
                if (dataMain) {
                	loaderJs = script;
                }
            });
            return loaderJs;
        })();

		if(myself==null)return;
        var main = myself.getAttribute('main');
        __config['path'] = __getPathLevel();
        //保持到全局变量中
        gBasePath= __config['path'] ;
        __config['main'] = main;

        var pluginMappings = [];
        var content = __getMainJsContent(main);

        if(content==null){
           alert(main+"配置有误。");
        }else{
        	pluginMappings = __parseDependencies(content);
        }

        __config["plugins"] = pluginMappings;
        pluginMappings = null;
        content = null;
	}();


	var indexcss  = [
	                 	{path:'css/index.css',type:'css',charset:'utf-8'}
	                 ];

	var commoncss = [
	                 	{path:__config['path']+'common/uic/default/css/common.css',type:'css',charset:'utf-8'}
		             ];

	var baseMod = {
	                 "jquery"       : {path:__config['path']+'common/plugins/jQuery-1.8.2/jquery.min.js',type:'js',charset:'utf-8'},
	                 //"global"       : {path:__config['path']+'jrzl/global.js',type:'js',charset:'utf-8'}

	               };
	var baseExtMod = {
			"jspluginmodcore"  : {path:__config['path']+'common/plugins/jsloader/codebase/jspluginmod.js',type:'js',charset:'utf-8'},

			//"jspluginmodpub"   : {path:__config['path']+'jrzl/pub/common/jspluginmod.js',type:'js',charset:'utf-8'},
			//"jspluginmodcrrsk" : {path:__config['path']+'jrzl/crrsk/common/jspluginmod.js',type:'js',charset:'utf-8'},

			//"exclusivepagepub"  : {path:__config['path']+'jrzl/pub/common/exclusivepages.js',type:'js',charset:'utf-8'},
			//"exclusivepagecrrsk": {path:__config['path']+'jrzl/crrsk/common/exclusivepages.js',type:'js',charset:'utf-8'},
            //"exclusivepageprjmng": {path:__config['path']+'jrzl/prjmng/common/exclusivepages.js',type:'js',charset:'utf-8'},

            "jrzltoolscore"	: {path:__config['path']+'common/js/jrzltools.js',type:'js',charset:'utf-8'},
            "validatecore"	: {path:__config['path']+'common/js/validate/regulations.js',type:'js',charset:'utf-8'},
            "validatebase"  : {path:__config['path']+'common/js/validate/regbase.js',type:'js',charset:'utf-8'}
	};

	var coreMod = {


			"jrzlbase"    : [
			                 {path:__config['path']+'common/js/jrzlbase.js',type:'js',charset:'utf-8'},
			                 {path:__config['path']+'common/plugins/jsTree-3.0.8/themes/default/style.css',type:'css',charset:'utf-8'},
                          	         {path:__config['path']+'common/plugins/jsTree-3.0.8/jstree.js',type:'js',charset:'utf-8'}
			                 ],

			"jrzltools"   : [
			                  //{path:__config['path']+'jrzl/pub/common/jrzltools.js',type:'js',charset:'utf-8'},
			                  //{path:__config['path']+'jrzl/crrsk/common/jrzltools.js',type:'js',charset:'utf-8'},
			                  {path:__config['path']+'common/plugins/bigdecimal/BigDecimal.min.js',type:'js',charset:'utf-8'}
			                 ],

			"makepy"      : [
			                 {path:__config['path']+'common/js/makepy/makepy.js',type:'js',charset:'utf-8'}
			                 ],

			"jqueryui"    : [
			                 {path:__config['path']+'common/plugins/jquery-ui-1.10.4/jquery-ui.css',type:'css',charset:'utf-8'},
			                 {path:__config['path']+'common/plugins/jquery-ui-1.10.4/jquery-ui.js',type:'js',charset:'utf-8'}
			                 ],

            "validate"   :	[
			                 {path:__config['path']+'common/js/validate/validator.css',type:'css',charset:'utf-8'},
  		                   	 {path:__config['path']+'common/js/validate/validator.js',type:'js',charset:'utf-8'}
  		                   	],

  		    "juicer"     : [
  		                    {path:__config['path']+'common/plugins/juicer/juicerOn.js',type:'js',charset:'utf-8'}
  		                    ],

			"json2"     : [
			               {path:__config['path']+'common/plugins/json2/json2.js',type:'js',charset:'utf-8'}
			               ],

           	"poshytip"  : [
   	                   	    {path:__config['path']+'common/plugins/poshytip-1.2/jquery.poshytip.css',type:'css',charset:'utf-8'},
   	                   	    {path:__config['path']+'common/plugins/poshytip-1.2/jquery.poshytip.js',type:'js',charset:'utf-8'}
          	              ],
			"filedownload"   :[
			                   {path:__config['path']+'common/plugins/filedownload/jQuery.fileDownload.js',type:'js',charset:'utf-8'}
			                   ],

			 "jalert"    :[
			               {path:__config['path']+'common/js/jalert/jAlert.css',type:'css',charset:'utf-8'},
			               {path:__config['path']+'common/js/jalert/jAlert.js',type:'js',charset:'utf-8'}
			              ],

              "loadbar"  :[
 			               {path:__config['path']+'common/js/loadbar/loadbar.css',type:'css',charset:'utf-8'},
 			               {path:__config['path']+'common/js/loadbar/loadbar.js',type:'js',charset:'utf-8'}
 			              ],
 			   "popup"  : [
 			               {path:__config['path']+'common/plugins/artdialog/css/ui-dialog.css',type:'css',charset:'utf-8'},
 			               {path:__config['path']+'common/plugins/artdialog/dialog.js',type:'js',charset:'utf-8'}
 			               ]
	};

	var __allscriptfiles = {};

	var __baseAlias = [];
	var __baseExtAlias = [];
	var __coreJsAlias = [];
	var __pluginJsAlias=[];

	var __mainloadcallback = function (){
		//销毁加载临时对象
		allscriptfiles = {};
		baseAlias = [];
		jsAlias = [];
		__config = [];
		__jsLoader = [];
		this.In = null;
		$.initValidate();//初始化校验
		onloadHandler();
	};

	var __jsalisloadcallback = function (){
		In("main",__mainloadcallback);
	};

	/**
	 * 4.gPluginMod插件js等
	 */
	var __pluginJsLoadCallback = function(){
		//预装入插件js
		for(var i = 0,len = __config["plugins"].length;i<len;i++){
			var key = __config["plugins"][i];
			if(gPluginMod[key]==null)continue;
			for(var j = 0,jLen = (gPluginMod[key]).length;j<jLen;j++){
				if(__allscriptfiles[(gPluginMod[key])[j].path+(gPluginMod[key])[j].type] == null){
					In.add(key+j,(gPluginMod[key])[j]);
					__pluginJsAlias.push(key+j);
					__allscriptfiles[(gPluginMod[key])[j].path+(gPluginMod[key])[j].type]='1';
				}
			}
		}

		//预装入主js
		In.add('main',{path:__config['main'],type:'js',charset:'utf-8'});

		__pluginJsAlias.push(__jsalisloadcallback);
		In(__pluginJsAlias);
	};
	/**
	 * 3.coreMod
	 */
	var __coreJsLoadCallback = function(){
		//预装入核心js
		for(var key in coreMod){
			for(var i = 0,len = (coreMod[key]).length;i<len;i++){
				if(__allscriptfiles[(coreMod[key])[i].path+(coreMod[key])[i].type] == null){
					In.add(key+i,(coreMod[key])[i]);
					__coreJsAlias.push(key+i);
					__allscriptfiles[(coreMod[key])[i].path+(coreMod[key])[i].type]='1';
				}
			}

		};

		__coreJsAlias.push(__pluginJsLoadCallback);
		In(__coreJsAlias);
	};

	/**
	 * 2.baseExtMod
	 */
	var __baseExtLoadCallback = function(){

		for(var key in baseExtMod){
			if(__allscriptfiles[baseExtMod[key].path+baseExtMod[key].type] == null){
				In.add(key,baseExtMod[key]);
				__baseExtAlias.push(key);
				__allscriptfiles[baseExtMod[key].path+baseExtMod[key].type]='1';
			}
		}

		__baseExtAlias.push(__coreJsLoadCallback);
		In(__baseExtAlias);

	};

	/**
	 * 1.基础js\css等
	 */
	void function(){
		//预装入基础js
		for(var key in baseMod){
			if(__allscriptfiles[baseMod[key].path+baseMod[key].type] == null){
				In.add(key,baseMod[key]);
				__baseAlias.push(key);
				__allscriptfiles[baseMod[key].path+baseMod[key].type]='1';
			}
		}

		//预装入css
		if(__config['main'] == "index.js"){
			for(var i = 0,len = indexcss.length;i<len;i++){
				if(__allscriptfiles[indexcss[i].path+indexcss[i].type] == null){
					In.add('indexcss'+i,indexcss[i]);
					__baseAlias.push('indexcss'+i);
					__allscriptfiles[indexcss[i].path+indexcss[i].type]='1';
				}
			}
		}else{
			for(var i = 0,len = commoncss.length;i<len;i++){
				if(__allscriptfiles[commoncss[i].path+commoncss[i].type] == null){
					In.add('commoncss'+i,commoncss[i]);
					__baseAlias.push('commoncss'+i);
					__allscriptfiles[commoncss[i].path+commoncss[i].type]='1';
				}
			}
		}

		//装入baseMod
		__baseAlias.push(__baseExtLoadCallback);
		In(__baseAlias);
	}();

}();