var LoadBar = {};
function exist(id) {
    var obj = document.getElementById(id);
    if (obj) { return true }
    else { return false }
}

function getsize() {
    var x, h, y, s;
    if (self.innerHeight) {// all except Explorer
        x = self.innerWidth;
        h = self.innerHeight;
        s = self.pageYOffset;
    }
    else if (document.documentElement && document.documentElement.clientHeight) {// Explorer 6 Strict Mode
        x = document.documentElement.clientWidth;
        h = document.documentElement.clientHeight;
        s = document.documentElement.scrollTop;
    }
    else
        if (document.body) {// other Explorers
        x = document.body.clientWidth;
        h = document.body.clientHeight;
        s = document.body.scrollTop;
    }
    y = h + s;
    return { x: x, h: h, y: y, s: s };
}
var setNewHeight = function() {
    if (!exist("Sys_Jrzl_Loading_Bar_Shadow")) return;
    var loadingShadow = document.getElementById("Sys_Jrzl_Loading_Bar_Shadow");
    setTimeout(function() {
        var newloadsize = getsize();
        loadingShadow.style.height = (newloadsize.s == 0 ? "100%" : newloadsize.y + "px");
    }, 100);
}

LoadBar.loading = function(content,pathLevel) {
	var imgSrc = pathLevel+"common/js/loadbar/images/spinningwheel.gif";
    var loadsize = getsize();
    var loadingShadow;
    if (parent && parent.document.getElementById("Sys_Jrzl_Loading_Bar_Shadow")) return;
    if (!exist("Sys_Jrzl_Loading_Bar_Shadow")) {
        loadingShadow = document.createElement("div");
        loadingShadow.id = "Sys_Jrzl_Loading_Bar_Shadow";
        loadingShadow.style.width = "100%";
        loadingShadow.style.height = (loadsize.s == 0 ? "100%" : loadsize.y + "px");
        document.body.appendChild(loadingShadow);

        if (window.addEventListener) {
            window.addEventListener("resize", setNewHeight, false);
            window.addEventListener("scroll", setNewHeight, false);
        }
        else {
            window.attachEvent("onresize", setNewHeight);
            window.attachEvent("onscroll", setNewHeight);
        }
    }
    
    var loadingDiv;
    if (!exist("Sys_Jrzl_Loading_Bar_Div")) {
        loadingDiv = document.createElement("div");
        loadingDiv.id = "Sys_Jrzl_Loading_Bar_Div";
        loadingDiv.style.width = "500px";
        loadingDiv.style.height = "35px";
        loadingDiv.style.left = (loadsize.x - 500) / 2 + 'px';
        loadingDiv.style.top = (loadsize.h - 35) / 2 + loadsize.s + 'px';
        document.body.appendChild(loadingDiv);
    }
    else {
        loadingDiv = document.getElementById("Sys_Jrzl_Loading_Bar_Div");
    }
    
    if (content) {
        loadingDiv.innerHTML = "<div class='loadingMsg'><img src='"+imgSrc+"' align='absbottom' />" + content + "</div>";
    }
    else {
        loadingDiv.innerHTML = "<div class='loadingMsg'><img src='"+imgSrc+"' align='absbottom' />页面加载中，请稍候...</div>";
    }
	imgSrc  = null;
    loadsize = null;
    loadingShadow = null;
    loadingDiv = null; 
};
LoadBar.unloading = function() {
    var loadingShadow = document.getElementById("Sys_Jrzl_Loading_Bar_Shadow");
    var loadingDiv = document.getElementById("Sys_Jrzl_Loading_Bar_Div");
    if (window.addEventListener) {
        window.removeEventListener("resize", setNewHeight, false);
        window.removeEventListener("scroll", setNewHeight, false);
    }
    else {
        window.detachEvent("onresize", setNewHeight);
        window.detachEvent("onscroll", setNewHeight);
    }
    if (loadingShadow) {
        loadingShadow.parentNode.removeChild(loadingShadow);
    }
    if (loadingDiv) {
        loadingDiv.parentNode.removeChild(loadingDiv);
    }
    loadingShadow = null; 
    loadingDiv = null;   
};

