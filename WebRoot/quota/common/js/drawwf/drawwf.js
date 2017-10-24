/**
 *
 */
(function() {

	/**
	 * 流程图绘制
	 * @param canvas html canvas元素
	 * @param xmlStr 流程节点列表
	 * @param lytStr 流程执行状态
	 * @param isLocated 节点已经由用户设定坐标
	 * @param callBack 流程节点点击回调函数
	 * @returns {WfCanvas}
	 */
	function WfCanvasDraw(canvas, xmlStr, lytStr, isLocated, callBack,itemOnClick){
		var currentSteps = [];
		var historySteps = [];
		if(lytStr == null) lytStr = [];
		var
			cvs = $(canvas),
			fontFamily = "宋体",//"Microsoft YaHei",
			fontSize = 12,

			font = "normal " + fontSize + "px " + fontFamily,
			//labelFontSize = 6,
			//labelFont = "normal normal normal " + labelFontSize + "px " + fontFamily,
			fontColor = "black",
			borderColor = "#b8b8b8",
			stepColor = "#ddd6d6", //待执行节点
			lineColor = "#ddd6d6",
			lineWentColor = "#038654",
			lineRtnColor = "#6cd8f4",
			shadowOffset = 3;
			initActionCorlor = "#EEEEEE",
			currentStepColor = "#ff7b7b", //当前节点
			historyStepColor = "#6cd8f4", //历史节点
			shadwColor = "#d0d0d0",
			ctx = null,
			//定义路径 对象
			paths = {},
			//根据坐标获取node
			nodeByCrd={};
			//loadCss("../../../../common/js/drawwf/drawwf.css"); //导入弹窗CSS

		/**
		 * 画流程图2
		 */
		function drawByData(){
			//生成Node
			//生成path
			layoutCells();
			//根据节点列表确定位置

			//计算坐标
			calPositions();

			//点击事件
			nodeOnclick();

			//设定canvas尺寸
			calCanvasSize();

			//画图
			$.each(xmlStr, function(id, node){
				drawNode(node);
			});
			//画线
			$.each(paths, function(id, path){
				drawConnector(path, "");
			});
			$.each(paths, function(id, path){
				drawConnector(path, "done");
			});

		}

		function layoutCells(){
			//计算布局
			var startNode = -1;
			//寻找起始结点
			$.each(xmlStr, function(id, nodeInfo){
				if( nodeInfo.type == 'start' ){
					startNode = nodeInfo;
					nodeInfo.id = id;//在起始点的nodeInfo中插入id
				}
				var nodePosKey = nodeInfo.row+"_"+nodeInfo.col;
				nodeByCrd[nodePosKey] = nodeInfo;
			});
			//工作流未定义起始点
			if( startNode == -1 ){
				//alert('错误的工作流定义,没有初始节点!');
				return ;
			}

			goThroughNodes(startNode, []);
		}

		function goThroughNodes(node, trace){
			//引入node.visited属性表示是否被计算
			if( node.visited == undefined || node.visited == false){
				node.visited = true;
				trace.push(node.id);//结点未经计算，结点id加入trace,首次调用只有startNode含有node.id
			}else{
				return ;
			}

			//根据流程列表生成 执行状态 正在执行 已执行
			for(var t=0; t<lytStr.length; t++){

				var nodeDone = lytStr[t].id.split("->");
				if(nodeDone[0] == node.id){
					if(nodeDone.length == 1)
						node.status = 'current';
					else{
						node.status = 'history';
					}
				}
			}
			//未执行到的结点状态
			if( node.status == undefined || node.status == '' ){
				node.status='future';
			}

			var transitions = node.transitions;
			if(transitions == undefined || node.type == 'end'){
				return ;
			}

			for(var i=0;i<transitions.length; i++){//针对一个结点的 多个不同转换条件的路径
				var toNodeId = transitions[i];
				var nextNode = xmlStr[toNodeId];
				nextNode.id = toNodeId;
				//生成连线node表示当前结点，nextNode表示目标结点
				var pathId = node.id+'->'+nextNode.id;//一条转换路径的路径id表示法
				//路径对象 结构
				var pathObj = {
							id: pathId,
							linewidth: 1,
							src: node,
							target: nextNode,
							status:"",
							isWayBack:false,//是否回退
							routings: []
				};
				for(var t=0; t<lytStr.length; t++){
					var pathDone = lytStr[t];
					if(pathDone.id == pathObj.id)
						pathObj.status = "done";
				}

				//类似于Map，以路径id为Key，路径对象为value
				paths[pathId] = pathObj;//


				//如果nextNode已经被计算 且 目标结点在当前结点上面
				if(nextNode.row <= node.row){

					var isParent = false;
					//遍历已经计算过的结点
					for(var t=0; t<trace.length; t++){
						if( trace[t] == nextNode.id ){//判断nextNode是否在已经计算结点之列，如果在，则表示node和nextNode双向路径，当前路径表示退回路径
							isParent = true;
							break;
						}
					}
					if( isParent ){//如果在，则表示node和nextNode双向路径，当前路径表示退回路径，标记为路径对象isWayBack = true
						pathObj.isWayBack = true;
						continue;	//如果是退回路径，则继续计算下一个目标结点
						}
				}

			}
			//当前结点针对transitions->trans处理完毕后，接着以transitions->trans中的toNodeId所指的node为参数，递归计算布局
			for(var i=0;i<transitions.length; i++){
				var toNodeId = transitions[i];
				var nextNode = xmlStr[toNodeId];
				var newTrace = [];
				for(var t=0; t<trace.length; t++){
					newTrace.push(trace[t]);
				}
					goThroughNodes(nextNode, newTrace);
				}
		}

		function calPositions(){
			//生成节点坐标
			var rowHeight = 46, rowpadding = 15, rowWidth = 130, interval = 2,colpadding=30;
			$.each(xmlStr, function(id, node){
				node.height=rowHeight;
				node.width=rowWidth;
				node.x= (node.col-1) * (rowWidth + colpadding*2+interval) + colpadding;
				node.y= (node.row-1) * (rowHeight + rowpadding*2+interval) + rowpadding;
			});
			//生成连线坐标
			$.each(paths, function(id, path){
				var interval = 20, from = 0, to = 0, routings = [];
				var srcNode = path.src;
				var targetNode = path.target;

				var reversePathId = targetNode.id+"->"+srcNode.id;
				var reversePath = paths[reversePathId];
				var hashReverse = false;
				if( reversePath != undefined){
					hashReverse = true;
				}
				//每个节点共有12个出入口,四条边上各有3个
				if( srcNode.jointLoc == undefined ||  srcNode.jointLoc.length == 0 ){
					srcNode.jointLoc = [
					    {x:srcNode.x+35, y:srcNode.y}, {x:srcNode.x+65, y:srcNode.y}, {x:srcNode.x+95, y:srcNode.y},
						{x:srcNode.x, y:srcNode.y+10}, {x:srcNode.x+rowWidth, y:srcNode.y+10},
						{x:srcNode.x, y:srcNode.y+23}, {x:srcNode.x+rowWidth, y:srcNode.y+23},
						{x:srcNode.x, y:srcNode.y+36}, {x:srcNode.x+rowWidth, y:srcNode.y+36},
						{x:srcNode.x+35, y:srcNode.y+rowHeight}, {x:srcNode.x+65, y:srcNode.y+rowHeight}, {x:srcNode.x+95, y:srcNode.y+rowHeight}
					];
				}
				if( targetNode.jointLoc == undefined ||  targetNode.jointLoc.length == 0 ){
					targetNode.jointLoc =[{x:targetNode.x+35, y:targetNode.y}, {x:targetNode.x+65, y:targetNode.y}, {x:targetNode.x+95, y:targetNode.y},
					                      {x:targetNode.x, y:targetNode.y+10}, {x:targetNode.x+rowWidth, y:targetNode.y+10},
					                      {x:targetNode.x, y:targetNode.y+23}, {x:targetNode.x+rowWidth, y:targetNode.y+23},
					                      {x:targetNode.x, y:targetNode.y+36}, {x:targetNode.x+rowWidth, y:targetNode.y+36},
							{x:targetNode.x+35, y:targetNode.y+rowHeight}, {x:targetNode.x+65, y:targetNode.y+rowHeight}, {x:targetNode.x+95, y:targetNode.y+rowHeight}
						];
				}

				if( srcNode.col == targetNode.col ){
					//同一列
					if( srcNode.row < targetNode.row ){
						//下方
						//相隔数个节点的下方
						var directDown = true;
						for( var i=srcNode.row+1; i<targetNode.row; i++ ){
							var lowNodeKey = i+"_"+srcNode.col;
							if( nodeByCrd[lowNodeKey] != undefined ){
								//失败 右侧有节点阻碍
								directDown = false;
								break;
							}
						}
						if(directDown){
							if(hashReverse){
								routings.push(srcNode.jointLoc[9]);
								routings.push(targetNode.jointLoc[0] );
							}else{
								routings.push(srcNode.jointLoc[10]);
								routings.push(targetNode.jointLoc[1] );
							}
						}else{
							if( hashReverse ){
								routings.push(srcNode.jointLoc[4]);
								routings.push( {x:srcNode.jointLoc[4].x+20, y:srcNode.jointLoc[4].y} );
								routings.push( {x:srcNode.jointLoc[4].x+20, y:targetNode.jointLoc[8].y} );
								routings.push(targetNode.jointLoc[8] );
							}else{
								routings.push(srcNode.jointLoc[6]);
								routings.push( {x:srcNode.jointLoc[6].x+20, y:srcNode.jointLoc[6].y} );
								routings.push( {x:srcNode.jointLoc[6].x+20, y:targetNode.jointLoc[6].y} );
								routings.push(targetNode.jointLoc[6] );
							}
						}
					}else if(srcNode.row > targetNode.row){
						//上方
						//是否可以直接上去
						var directUp = true;
						for( var i=targetNode.row+1; i<srcNode.row; i++ ){
							var upperNodeKey = i+"_"+srcNode.col;
							if( nodeByCrd[upperNodeKey] != undefined ){
								//失败 上方有节点阻碍
								directUp = false;
								break;
							}
						}

						if(directUp){
							if(hashReverse){
								routings.push(srcNode.jointLoc[2]);
								routings.push(targetNode.jointLoc[11] );
							}else{
								routings.push(srcNode.jointLoc[1]);
								routings.push(targetNode.jointLoc[10] );
							}
						}else{
							if( hashReverse ){
								routings.push(srcNode.jointLoc[4]);
								routings.push( {x:srcNode.jointLoc[4].x+20, y:srcNode.jointLoc[4].y} );
								routings.push( {x:srcNode.jointLoc[4].x+20, y:targetNode.jointLoc[8].y} );
								routings.push(targetNode.jointLoc[8] );
							}else{
								routings.push(srcNode.jointLoc[6]);
								routings.push( {x:srcNode.jointLoc[6].x+20, y:srcNode.jointLoc[6].y} );
								routings.push( {x:srcNode.jointLoc[6].x+20, y:targetNode.jointLoc[6].y} );
								routings.push(targetNode.jointLoc[6] );
							}
						}

					}
				}else if(srcNode.row == targetNode.row ){
					//同一行
					if( srcNode.col < targetNode.col ){
						//右侧
						if( hashReverse ){
							routings.push(srcNode.jointLoc[4]);
							routings.push(targetNode.jointLoc[3] );
						}else{
							routings.push(srcNode.jointLoc[6]);
							routings.push(targetNode.jointLoc[5] );
						}
					}else if(srcNode.col > targetNode.col){
						//左侧
						if( hashReverse ){
							routings.push(srcNode.jointLoc[7]);
							routings.push(targetNode.jointLoc[8] );
						}else{
							routings.push(srcNode.jointLoc[5]);
							routings.push(targetNode.jointLoc[6] );
						}
					}
				}else if(srcNode.col < targetNode.col) {
					//目标节点在右方
					if( srcNode.row < targetNode.row ){
						//右下方
						var rightRectDown = true;
						var downRectRight = true;

						for( var i=srcNode.col+1; i<=targetNode.col; i++ ){
							var rightNodeKey = srcNode.row+"_"+i;
							if( nodeByCrd[rightNodeKey] != undefined ){
								//失败 右侧有节点阻碍
								rightRectDown = false;
								break;
							}
						}
						for( var i=srcNode.row+1; i<=targetNode.row; i++ ){
							var bottomeNodeKey = i+"_"+srcNode.col;
							if( nodeByCrd[bottomeNodeKey] != undefined ){
								//失败 下侧有节点阻碍
								downRectRight = false;
								break;
							}
						}
						if(rightRectDown){
							//右下
							if( hashReverse ){
								routings.push(srcNode.jointLoc[4]);
								routings.push( {x:targetNode.jointLoc[0].x, y:srcNode.jointLoc[4].y} );
								routings.push(targetNode.jointLoc[0]);
							}else{
								routings.push(srcNode.jointLoc[6]);
								routings.push( {x:targetNode.jointLoc[1].x, y:srcNode.jointLoc[6].y} );
								routings.push(targetNode.jointLoc[1]);
							}
						}else if(downRectRight){
							//下右
							if( hashReverse ){
								routings.push(srcNode.jointLoc[9]);
								routings.push( {x:srcNode.jointLoc[9].x, y:targetNode.jointLoc[3].y} );
								routings.push(targetNode.jointLoc[3]);
							}else{
								routings.push(srcNode.jointLoc[10]);
								routings.push( {x:srcNode.jointLoc[10].x, y:targetNode.jointLoc[5].y} );
								routings.push(targetNode.jointLoc[5]);
							}
						}else{
							routings.push(srcNode.jointLoc[4]);
							routings.push( {x:targetNode.jointLoc[0].x, y:srcNode.jointLoc[4].y} );
							routings.push(targetNode.jointLoc[0]);
						}
					}else{
						//右上方
						var rightRectUp = true;
						var upRectRight = true;

						for( var i=srcNode.col+1; i<=targetNode.col; i++ ){
							var rightNodeKey = srcNode.row+"_"+i;
							if( nodeByCrd[rightNodeKey] != undefined ){
								//失败 右侧有节点阻碍
								rightRectUp = false;
								break;
							}
						}
						for( var i=srcNode.row-1; i>=targetNode.row; i-- ){
							var topNodeKey = i+"_"+srcNode.col;
							if( nodeByCrd[topNodeKey] != undefined ){
								//失败 正上方有节点阻碍
								upRectRight = false;
								break;
							}
						}

						if(rightRectUp){
							//右侧没有节点 直接从右边走直角上去
							if( hashReverse ){
								routings.push(srcNode.jointLoc[4]);
								routings.push( {x:targetNode.jointLoc[11].x, y:srcNode.jointLoc[4].y} );
								routings.push(targetNode.jointLoc[11]);
							}else{
								routings.push(srcNode.jointLoc[6]);
								routings.push( {x:targetNode.jointLoc[10].x, y:srcNode.jointLoc[6].y} );
								routings.push(targetNode.jointLoc[10]);
							}
						}else if(upRectRight){
							//上边没有节点 直接从上面走直角向右
							if( hashReverse ){
								routings.push(srcNode.jointLoc[2]);
								routings.push( {x:srcNode.jointLoc[2].x, y:targetNode.jointLoc[7].y} );
								routings.push(targetNode.jointLoc[7]);
							}else{
								routings.push(srcNode.jointLoc[1]);
								routings.push( {x:srcNode.jointLoc[1].x, y:targetNode.jointLoc[5].y} );
								routings.push(targetNode.jointLoc[5]);
							}
						}else{
							//右侧和正上都有节点
							routings.push(srcNode.jointLoc[4]);
							routings.push( {x:srcNode.jointLoc[4].x+20, y:srcNode.jointLoc[4].y} );
							routings.push( {x:srcNode.jointLoc[4].x+20, y:targetNode.jointLoc[3].y} );
							routings.push(targetNode.jointLoc[3]);
						}
					}
				}else{
					//目标节点在左方
					if( srcNode.row < targetNode.row ){
						//左下方
						var leftRectDown = true;
						var downRectLeft = true;

						for( var i=targetNode.col; i<srcNode.col; i++ ){
							var leftNodeKey = srcNode.row+"_"+i;
							if( nodeByCrd[leftNodeKey] != undefined ){
								//失败 有节点阻碍
								leftRectDown = false;
								break;
							}
						}
						for( var i=srcNode.row+1; i<=targetNode.row; i++ ){
							var bottomeNodeKey = i+"_"+srcNode.col;
							if( nodeByCrd[bottomeNodeKey] != undefined ){
								//失败 有节点阻碍
								downRectLeft = false;
								break;
							}
						}

						if(leftRectDown){
							//左下
							if( hashReverse ){
								routings.push(srcNode.jointLoc[7]);
								routings.push( {x:targetNode.jointLoc[0].x, y:srcNode.jointLoc[7].y} );
								routings.push(targetNode.jointLoc[0]);
							}else{
								routings.push(srcNode.jointLoc[5]);
								routings.push( {x:targetNode.jointLoc[1].x, y:srcNode.jointLoc[5].y} );
								routings.push(targetNode.jointLoc[1]);
							}

						}else if(downRectLeft){
							//下左
							if( hashReverse ){
								routings.push(srcNode.jointLoc[9]);
								routings.push( {x:srcNode.jointLoc[9].x, y:targetNode.jointLoc[8].y} );
								routings.push(targetNode.jointLoc[8]);
							}else{
								routings.push(srcNode.jointLoc[10]);
								routings.push( {x:srcNode.jointLoc[10].x, y:targetNode.jointLoc[6].y} );
								routings.push(targetNode.jointLoc[6]);
							}
						}else{
							routings.push(srcNode.jointLoc[7]);
							routings.push( {x:targetNode.jointLoc[0].x, y:srcNode.jointLoc[7].y} );
							routings.push(targetNode.jointLoc[0]);
						}

					}else{
						//左上方

						if( srcNode.col == targetNode.col + 1 ){
							//左上紧挨着
							var topNodeKey = (srcNode.row-1)+"_"+srcNode.col;
							if( nodeByCrd[topNodeKey] != undefined && nodeByCrd[topNodeKey].type!='' ){
								//上侧有节点
								routings.push(srcNode.jointLoc[4]);
								routings.push( {x:srcNode.jointLoc[4].x+20, y:srcNode.jointLoc[4].y} );
								routings.push( {x:srcNode.jointLoc[4].x+20, y:targetNode.jointLoc[3].y} );
								routings.push(targetNode.jointLoc[3]);
							}else{
								//上侧没有节点 直接从上边走直角过去
							}
						}else{
							//左上跨越多列
						}

						var leftRectUp = true;
						var upRectLeft = true;

						for( var i=targetNode.col; i<srcNode.col; i++ ){
							var leftNodeKey = srcNode.row+"_"+i;
							if( nodeByCrd[leftNodeKey] != undefined ){
								//失败 有节点阻碍
								leftRectUp = false;
								break;
							}
						}
						for( var i=srcNode.row-1; i>=targetNode.row; i-- ){
							var bottomeNodeKey = i+"_"+srcNode.col;
							if( nodeByCrd[bottomeNodeKey] != undefined ){
								//失败 有节点阻碍
								upRectLeft = false;
								break;
							}
						}

						if(leftRectUp){
							//左上
							if( hashReverse ){
								routings.push(srcNode.jointLoc[7]);
								routings.push( {x:targetNode.jointLoc[11].x, y:srcNode.jointLoc[7].y} );
								routings.push(targetNode.jointLoc[11]);
							}else{
								routings.push(srcNode.jointLoc[5]);
								routings.push( {x:targetNode.jointLoc[10].x, y:srcNode.jointLoc[5].y} );
								routings.push(targetNode.jointLoc[10]);
							}
						}else if(upRectLeft){
							//上左
							if( hashReverse ){
								routings.push(srcNode.jointLoc[2]);
								routings.push( {x:srcNode.jointLoc[2].x, y:targetNode.jointLoc[8].y} );
								routings.push(targetNode.jointLoc[8]);
							}else{
								routings.push(srcNode.jointLoc[1]);
								routings.push( {x:srcNode.jointLoc[1].x, y:targetNode.jointLoc[6].y} );
								routings.push(targetNode.jointLoc[6]);
							}
						}else{
							routings.push(srcNode.jointLoc[7]);
							routings.push( {x:targetNode.jointLoc[11].x, y:srcNode.jointLoc[7].y} );
							routings.push(targetNode.jointLoc[11]);
						}
					}
				}

				path.routings = routings;
			});
		}


		/**
		 * 画连接
		 * @param c
		 * @param status 画那种状态的线
		 */
		function drawConnector(c, status) {
			if( c.status != status ){
				return ;
			}
			var points = c.routings;
			if( points == undefined || points.length == 0 ){
				return ;
			}
			var last = points.length - 1;

			// 画线
			if( c.status=="done" ){
				ctx.strokeStyle = lineRtnColor;
			}else{
				ctx.strokeStyle = lineColor;
			}
			for (var i = 0; i < last; i++) {
				drawLine(points[i], points[i+1]);
			}

			// 画箭头
			drawArrow(points[last-1], points[last]);
		};

		//计算并设置画布尺寸
		function calCanvasSize() {
			//alert($.support);
			if ($.browser.msie && /^[678]./.test($.browser.version)) {
		        G_vmlCanvasManager.initElement(canvas);
		    }

			ctx = canvas.getContext("2d");
			var minx = 0, miny = 0, maxx = 0, maxy=0;
			$.each(xmlStr, function(id, node) {
				if(node.id != null){
					minx = Math.min(minx, node.x);
					miny = Math.min(miny, node.y);
					maxx = Math.max(maxx, node.x + node.width);
					maxy = Math.max(maxy, node.y + node.height);
				}
			});
			canvas.width = maxx - minx +90;
			canvas.height = maxy - miny + 10;
		}

		/**
		 * 画节点
		 * @param node
		 */
		function drawNode(node) {
			ctx.strokeStyle = borderColor;

			if(node.id != null){
				if (node.status=='current') {
					ctx.fillStyle = currentStepColor;
				} else if (node.status=='history'){
					 ctx.fillStyle = historyStepColor;
				} else {
					 ctx.fillStyle = stepColor;
				}
				drawRect(node, node.width, node.height);
			}
			// 画文字
			var fy = node.y + (node.height - fontSize) / 2 + fontSize;
			var fx = node.x + node.width/2;

			ctx.textAlign="center";
			ctx.font = font;
			ctx.fillStyle = fontColor;

			if(node.id != null){
				// 已执行节点，画最后审批用户
				if(node.status == "history" || node.status == "current"){
					ctx.fillText(node.name, fx, fy-10);// 画结点名称
					var lytStrLatest=[];
					for(var i=lytStr.length-1;i>=0;i--){
						if(lytStrLatest.length == 0  || !contains(lytStrLatest,lytStr[i].id.split("->")[0]))
							lytStrLatest.push(lytStr[i]);
					}
					for(var j=0;j<lytStrLatest.length;j++){
						var tmp = lytStrLatest[j];
						if(tmp.id.split("->")[0] == node.id)
							if(tmp.tasklist != null && tmp.tasklist.length > 1){ //多人情况，只显示第一人，加“...”表示多人
								ctx.fillText("( "+tmp.tasklist[0].username+"... )",fx,fy+10);
								node.textX = fx - fontSize*(1.5 + tmp.tasklist[0].username.length/2); //计算多人情况下，鼠标浮动提示区域的X开始坐标
							}
							else if(tmp.tasklist != null){
								ctx.fillText("( "+tmp.tasklist[0].username+" )",fx,fy+10);
								node.textX = fx - fontSize*(1 + tmp.tasklist[0].username.length/2);//计算单人时鼠标浮动提示区域的X开始坐标
							}
						node.textY=fy; //浮动提示区域的Y开始坐标
					}
				}
				// 未执行节点
				else if(node.role != ""){
					ctx.fillText(node.name, fx, fy-10);// 画结点名称
					ctx.fillText("( "+node.role+" )",fx,fy+10); // 未执行结点 显示机构或者角色名称
				}
				// 未执行节点，但无显示机构或者角色名称可以显示
				else{
					ctx.fillText(node.name, fx, fy);// 既没有操作人又不含显示机构或者角色名称的情况下，将结点名称显示在中间
				}
			}
		}

		// 绑定事件
		function nodeOnclick() {
			// 鼠标浮动事件
			cvs.unbind("mousemove").mousemove(function(e) {
				$.each(xmlStr, function(id, node){
					if (!node.isHover) {
						if (isInTextRange(e, node)) {
							node.isHover = true;
							cvs.css("cursor", "pointer");
							moveInHandler(node);
						} else {
							node.isHover = false;
						}
					}
					else {
						if (!isInTextRange(e, node)) {
							node.isHover = false;
							cvs.css("cursor", "default");
							moveOutHandler();
						} else {
							node.isHover = true;
						}
					}
				});
			});
			// 节点点击事件
			cvs.unbind("click").click(function(e) {
				$.each(xmlStr, function(id, node){
					if (isInNodeRange(e, node)) {
						if( callBack ){
							callBack(node);
						}
					}
				});
			});
		}
		// 判断鼠标是否位于节点上方
		function isInNodeRange(e,cell){
			var x = e.pageX - cvs.offset().left,
			y = e.pageY - cvs.offset().top;
			return (x >= cell.x && x <= cell.x + cell.width && y >= cell.y && y <= cell.y + cell.height);
		}

		//判断鼠标是否位于文字上方
		function isInTextRange(e, cell) {
			var x = e.pageX - cvs.offset().left,
				y = e.pageY - cvs.offset().top;
			return (x >= cell.textX && x <= 2*cell.x + cell.width - cell.textX && y >= cell.textY && y <= cell.textY + fontSize);
		}
		// 浮动提示移入响应
		function moveInHandler(node){
			var nodeId = node.id;
			if(contains(lytStr,nodeId)) {
				var html = "<div id='myPop' class='popWin'>";
				var tsk = null;
				for(var i = lytStr.length - 1; i >= 0; i--){
					if(lytStr[i].id.split("->")[0] == nodeId){
						tsk = lytStr[i];
							break;
					}
				}
				if(tsk.tasklist == null)return;
				for(var j=0;tsk != null,j<tsk.tasklist.length;j++){
					html += "<div class='items' onclick='javascript:openUserInfoWin(this);'  userid='"+ tsk.tasklist[j].userid + "' nodeId='" + nodeId + "'>" + tsk.tasklist[j].username + "</div><br>";
				}

				html += "</div>";
				$(html).appendTo(document.body);
				showPop(event);
			}
		}
		function openUserInfoWin(obj){
			setTimeout(function(){
				$("#myPop").hide();
				$("#myPop").remove();},
			100);
			var nodeId = $(obj).attr("nodeId");

			xmlStr[nodeId].isHover = false;
			cvs.css("cursor", "default");
			if(itemOnClick){
				itemOnClick(obj);
			}
		}
		// 显示弹窗
		function showPop(evt){
			var light=$("#myPop");
		    var _event = evt ? evt : event;
			light.css('left',_event.clientX+$(this).scrollLeft());
			light.css('top',_event.clientY+$(this).scrollTop());
			light.show();
		}
		// 浮动提示移出
		function moveOutHandler(){
			setTimeout(function(){
				$("#myPop").hide();
				$("#myPop").remove();},
			100);

		}


		/**
		 * 画圆角方块
		 * @param p 坐标点
		 * @param w 宽度
		 * @param h 高度
		 * @param fill 是否填充
		 * @param stroke 是否画线
		 * @param drawShadow 是否画阴影
		 */
		function drawRect(p, w, h, fill, stroke, drawShadow) {
			fill = typeof(fill) == "undefined" ? true : fill;
			stroke = typeof(stroke) == "undefined" ? true : stroke;
			drawShadow = typeof(drawShadow) == "undefined" ? true : drawShadow;
			if (drawShadow) {
				var offset = shadowOffset;
				var oldStyle = ctx.fillStyle;
				ctx.fillStyle = shadwColor;
				drawRect({x: p.x + offset, y: p.y + offset}, w, h, true, false, false);
				ctx.fillStyle = oldStyle;
			}

			var x = p.x,
				y = p.y,
				r = 5; // 圆角半径
			if (w < 2 * r) {
				r = w / 2;
			}
			if (h < 2 * r) {
				r = h / 2;
			}
			ctx.beginPath();
			ctx.moveTo(x + r, y);
			ctx.lineTo(x + w - r, y);
			ctx.quadraticCurveTo(x + w, y, x + w, y + r);
			ctx.lineTo(x + w, y + h - r);
			ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
			ctx.lineTo(x + r, y + h);
			ctx.quadraticCurveTo(x, y + h, x, y + h - r);
			ctx.lineTo(x, y + r);
			ctx.quadraticCurveTo(x, y, x + r, y);
			ctx.closePath();
			if (stroke) {
				ctx.stroke();
			}
			if (fill) {
				ctx.fill();
			}
		}

		/**
		 * 画椭圆
		 * @param p 坐标点
		 * @param w 宽度
		 * @param h 高度
		 * @param fill 是否填充
		 * @param stroke 是否画线
		 * @param drawShadow 是否画阴影
		 */
		function drawEllipse(p, w, h, fill, stroke, drawShadow) {
			fill = typeof(fill) == "undefined" ? true : fill;
			stroke = typeof(stroke) == "undefined" ? true : stroke;
			drawShadow = typeof(drawShadow) == "undefined" ? true : drawShadow;
			if (drawShadow) {
				var offset = shadowOffset;
				var oldStyle = ctx.fillStyle;
				ctx.fillStyle = shadwColor;
				drawEllipse({x: p.x + offset, y: p.y + offset}, w, h, true, false, false);
				ctx.fillStyle = oldStyle;
			}
			var k = 0.5522848,
				a = w / 2,
				b = h / 2,
				ox = a * k, // 水平控制点偏移量
				oy = b * k, // 垂直控制点偏移量
				x = p.x + a, y = p.y + b;
			ctx.beginPath();
			// 从椭圆的左端点开始顺时针绘制四条三次贝塞尔曲线
			ctx.moveTo(x - a, y);
			ctx.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
			ctx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
			ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
			ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
			ctx.closePath();
			if (fill) {
				ctx.fill();
			}
			if (stroke) {
				ctx.stroke();
			}
		}

		function getCrossPoint(cell, p1, p2) {
			var x = p2.x,
				y = p2.y,
				dx = p2.x - p1.x,
				dy = p2.y - p1.y;
			if (dx == 0 && dy == 0) {
				return p2;
			}
			if (Math.abs(dy) > 0 && Math.abs(dx) / Math.abs(dy) < cell.width / cell.height) {
				var tan = dx / dy;
				if (p2.y < p1.y) {
					x += cell.height / 2 * tan;
					y += cell.height / 2;
				} else {
					x -= cell.height / 2 * tan;
					y -= cell.height / 2;
				}
			} else {
				var tan = Math.abs(dx) > 0 ? dy / dx : 1;
				if (p2.x < p1.x) {
					x += cell.width / 2;
					y += cell.width / 2 * tan;
				} else {
					x -= cell.width / 2;
					y -= cell.width / 2 * tan;
				}
			}
			return {x: x, y: y};
		}


		/**
		 * 画线
		 * @param p1
		 * @param p2
		 */
		function drawLine(p1, p2) {
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(p1.x, p1.y);
			ctx.lineTo(p2.x, p2.y);
			ctx.stroke();
		}

		/**
		 * 画箭头
		 * @param p1
		 * @param p2
		 */
		function drawArrow(p1, p2) {
			var
				awrad = Math.PI / 6, // 箭头角度（30度）
				arrowLen = 10,      // 箭头长度
				ap0 = toRelative(p1, p2), // 旋转源点（line.p1相对于line.p2的坐标）
				ap1 = rotateVec(ap0, awrad, arrowLen), // 第一端点（相对于line.p2的坐标）
				ap2 = rotateVec(ap0, -awrad, arrowLen); // 第二端点（相对于line.p2的坐标）

			ap1 = toAbsolute(ap1, p2);
			ap2 = toAbsolute(ap2, p2);

			drawLine(p2, ap1);
			drawLine(p2, ap2);
		}

		// 转换成相对坐标
		function toRelative(p, p0) {
			return {
				x: p.x - p0.x,
				y: p.y - p0.y
			};
		}

		// 转换回绝对坐标
		function toAbsolute(p, p0) {
			return {
				x: p.x + p0.x,
				y: p.y + p0.y
			};
		}

		/**
		 * 判断数组是否含有指定对象
		 * @param arr
		 * @param val
		 * @returns {Boolean}
		 */
		function contains(arr,val){
			for(var i = 0; i < arr.length; i++)
				if(arr[i].id.split("->")[0] == val)
					return true;
			return false;
		}

		/**
		 * 导入CSS
		 * @param url css相对路径
		 *//*
		function loadCss(url){
			var html = "<link type='text/css' href='"+ url +"' rel='stylesheet' />"
			$("head").append(html);
		}*/

		/**
		 * 矢量旋转函数
		 * @param p 坐标源点
		 * @param ang 旋转角
		 * @param newLen 新长度
		 * @returns {x,y}
		 */
		function rotateVec(p, ang, newLen) {
			var vx = p.x * Math.cos(ang) - p.y * Math.sin(ang);
			var vy = p.x * Math.sin(ang) + p.y * Math.cos(ang);
			var d = Math.sqrt(vx * vx + vy * vy);
			if (Math.abs(d) > 0) {
				vx = vx / d * newLen;
				vy = vy / d * newLen;
			}
			return {
				x : vx,
				y : vy
			};
		}

		/**
		 * 计算一点相对于圆心旋转后的坐标
		 * @param c 圆心
		 * @param p 点
		 * @param r 旋转弧度
		 */
		function rotate(c, p, r) {
			return {
				x: (p.x - c.x) * Math.cos(r) - (p.y - c.y) * Math.sin(r) + c.x,
				y: (p.y - c.y) * Math.cos(r) + (p.x - c.x) * sin(r) + c.y
			};
		}

		$.extend(this, {
			drawByData: drawByData,
			openUserInfoWin:openUserInfoWin
		});
	}

	window.drawByData = function(canvas, xmlStr, lytStr,isLocated, callBack,itemOnClick) {
		var wfj = new WfCanvasDraw(canvas, xmlStr, lytStr,isLocated, callBack,itemOnClick);
		wfj.drawByData();
		window.openUserInfoWin = function(obj){ wfj.openUserInfoWin(obj);}
	};

})();
