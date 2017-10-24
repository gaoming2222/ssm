var _isAjaxRequest = false;// 是否是远程请求
var SYS_REQUESTPAGEID = "PRJMNG_QUOTA_QUOTAIMPORT";
var initData = null;//用于存储返回的数据
var data = null;
var quotaId = "001";
windowHandler.onload = function() {
    //$.alerts.draggable = false;
    // 通过ajax或本地数据的方式获取数据，部署时将localStorage去除
	curNod = Request.getUrlParam("curNod");//获取当前节点
	isDefault = Request.getUrlParam("isDefault");
    handleInitData(data);

    var map = {};
	map['A'] = "委外投资";
	map['B'] = "公募债基通道";
	map['C'] = "金牛系列";
	JrzlTools.loadSelectDomData([ "quota_type" ], map, true, null);


	JrzlTools.queryGrid(gridCfg, columnsCfg);
	JrzlTools.queryGrid(gridAtchCfg, columnsAtchCfg); //初始化grid和columns 初始化为queryGrid
};
//初始化管理员面元素
function handleInitData(data) {
	var columnsCfg = null;

	if(true){
	    JrzlTools.dateRange({
	        from : "DUE_DTE_STRT",
	        to : "DUE_DTE_END",
	        readOnly : true
	    });

	    //对应不同的流程节点显示不同的页面内容
	    /*
	     * todo
	     */


	    //查询 显示界面信息
	    /*
	     * todo
	     */


	} else {
		JrzlTools.alert("初始化额度管理页面失败，请联系管理员", "提示");
	}

    JrzlTools.distroyProgress(SYS_REQUESTPAGEID);
}


var columnsCfg = [ {
    property : "IMPORT_ID",
    title : "额度导入编号",
    hidden: true,
    align : "center"
}, {
    property : "CLIENT_NAM",
    title : "客户名称",
    width : "100px",
    align : "center"
}, {
    property : "CORE_SYS_CLIENT_ID",
    title : "核心系统客户号",
    width : "100px",
    align : "center"
},{
    property : "TRADE",
    title : "行业",
    width : "100px",
    align : "center"
},{
    property : "BOND_COD",
    title : "债券代码",
    width : "100px",
    align : "center"
},{
    property : "BOND_TYPE",
    title : "债券类别",
    width : "100px",
    align : "center"
}, {
    property : "CURRENCY",
    title : "币种",
    width : "100px",
    align : "center"
}, {
    property : "BOND_POSITION",
    title : "债券头寸",
    width : "100px",
    align : "center"
}, {
    property : "INVEST_CHANNEL",
    title : "投资渠道",
    width : "100px",
    align : "center"
},{
    property : "DUE_DAT",
    title : "债券到期日",
    width : "100px",
    align : "center"
},{
    property : "VEST_DAT",
    title : "行权日",
    width : "100px",
    align : "center"
}];

var gridCfg = {
    id: "prvGrid",
    action: "",//分页查询
    localItems: "localItems",
    needOrderNum: true,
    needCheckBox :false,
    scrollX:true,
    initable: false,
    primaryKey:"IMPORT_ID",
    multiPageSelect:true
};

function renderTimeStamp(data,type,full,meta) {
	if (!data) { // 不显示null
        return "";
    } else {
        try {
            var date = new Date();
            date.setTime(data);
            return JrzlTools.formatDate(date, "yyyy-MM-dd hh:mm:ss");
        } catch (e) {
            //console.log(e);
            return "";
        }
    }
}
// 查询----------start
function query_onclick() {
    var params = {

    };
    if (todoFlag) {
    	params.todoFlag = "Y";
    	params.isDefault = isDefault;
    };
    prvGrid.onquery(params);
}
// 导入-------------start
var win;
function import_onclick() {
	JrzlTools.fileUpload({
		id : "uploader_ATCH",
		max_file_size : 50
	});
	$("#showUploadAtch .plupload_filelist_content").css({
		height : "245px",
		overflow : "auto",
		background : "url(../../../common/uic/default/images/Cloud.png) no-repeat",
		width: "530px"});

	win = JrzlTools.openModalWindow({
		id : "showUploadAtch",
		title : "文件导入",
		height :'auto',
		width : 550,
	    beforeClose:closewindews
	});
}
function closewindews() {
	uploader_ATCH.distroy();
}
function uploadAtch(){
	//uploader_ATCH.distroy();
}
function closeAtch_onclick(){
	//uploader_ATCH.distroy();
}
//导入grid和columns
var columnsAtchCfg=[{
	property:"ATCH_UID",
	title:"附件UID",
	hidden:true
},{
	property:"NAME",
	title:"附件名称",
	renderer : "renderer_downloadAtch",
	sortable:false
},{
	property:"CRT_USR_NAM",
	title:"上传人",
	sortable:false
},{
	property:"SAV_ORG_NAM",
	title:"所属机构",
	sortable:false
},{
	property:"CRT_TIM",
	title:"上传日期",
	renderer: "renderTimeStamp",
	sortable:true
}
];
var gridAtchCfg = {
  id:"atchGrid",
  needOrderNum: true,
  needCheckBox :false,
  localItems: "localArchItems",
  initable: false,
  pageSize: 5,
  height :200,
  primaryKey:"ATCH_UID",
  multiPageSelect:true
};



//导入-------------end

// #localdata定义----------start
var localItems = null;
// #localdata赋值---------start
localItems = [ {
    "IMPORT_ID" : "ED80234497",
    "CLIENT_NAM" : "GAOMING",
    "CORE_SYS_CLIENT_ID" : "4497",
    "TRADE" : "国标行业",
    "BOND_COD" : "0001",
    "BOND_TYPE" : "类别1",
    "CURRENCY" : "CNY",
    "BOND_POSITION" : "8023",
    "INVEST_CHANNEL" : "委外投资",
    "DUE_DAT" : "2017-08-21",
    "VEST_DAT" : "2017-08-21"
}, {
	"IMPORT_ID" : "ED80234499",
    "CLIENT_NAM" : "MING",
    "CORE_SYS_CLIENT_ID" : "4499",
    "TRADE" : "国标行业",
    "BOND_COD" : "0002",
    "BOND_TYPE" : "类别2",
    "CURRENCY" : "CNY",
    "BOND_POSITION" : "8023",
    "INVEST_CHANNEL" : "金牛系列",
    "DUE_DAT" : "2017-08-21",
    "VEST_DAT" : "2017-08-21"
}, {
	"IMPORT_ID" : "ED80234497",
    "CLIENT_NAM" : "GAOMING",
    "CORE_SYS_CLIENT_ID" : "4497",
    "TRADE" : "国标行业",
    "BOND_COD" : "0003",
    "BOND_TYPE" : "类别3",
    "CURRENCY" : "CNY",
    "BOND_POSITION" : "8023",
    "INVEST_CHANNEL" : "委外投资",
    "DUE_DAT" : "2017-08-21",
    "VEST_DAT" : "2017-08-21"
}, {
	"IMPORT_ID" : "ED80234497",
    "CLIENT_NAM" : "GAOMING",
    "CORE_SYS_CLIENT_ID" : "4497",
    "TRADE" : "国标行业",
    "BOND_COD" : "0004",
    "BOND_TYPE" : "类别4",
    "CURRENCY" : "CNY",
    "BOND_POSITION" : "8023",
    "INVEST_CHANNEL" : "金牛系列",
    "DUE_DAT" : "2017-08-21",
    "VEST_DAT" : "2017-08-21"
}, {
	"IMPORT_ID" : "ED80234497",
    "CLIENT_NAM" : "GAOMING",
    "CORE_SYS_CLIENT_ID" : "4497",
    "TRADE" : "国标行业",
    "BOND_COD" : "0005",
    "BOND_TYPE" : "类别5",
    "CURRENCY" : "CNY",
    "BOND_POSITION" : "8023",
    "INVEST_CHANNEL" : "公募债基通道",
    "DUE_DAT" : "2017-08-21",
    "VEST_DAT" : "2017-08-21"
} ];

localInitData = {
	BIZ_STS : {

    },

};

localRespData = {
    "ErrorNo": "0"
};
// #localdata赋值---------end
