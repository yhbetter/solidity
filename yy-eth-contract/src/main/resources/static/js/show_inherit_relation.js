+(function($){
	clickEventlistener();
})($)

var searchVal = "";
function getRTreeData(showName){
	$.ajax({
//		url:'/show/themes?showId=137&type=0',
		url:'/gdi/show/inherit/relation?showName='+showName,
		type:'GET',
		dataType:'json',
		success:function(data){
			if(data.code==0){
				var tree = [];
				$.each(data.data,function(i,o){
					var parent = {};
					parent.text = o[0].showName;
					parent.showId = o[0].showId;
					var nodes = [];
					$.each(o,function(ii,oo){
						var son = {};
						son.text = oo.inheritShowName;
						son.nodes = [];
						son.showId = oo.inheritShowId;
						nodes.push(son);
					});
					parent.nodes = nodes;
					tree.push(parent);
				});
				$('#relation_tree').treeview({
					data: tree,
			        expandIcon: 'glyphicon glyphicon-chevron-right',
			        collapseIcon: 'glyphicon glyphicon-chevron-down',
			        onNodeSelected: function(event,data){
			        	var html = "<div id='handle_info_sid' data-val='"+data.showId+"' class='handle_info_div'>ShowId:"+data.showId+"</div>"+
			        	"<div id='handle_info_sname' data-val='"+data.text+"' class='handle_info_div'>剧名:"+data.text+"</div>";
			        	var btn = "";
			        	if(data.parentId==undefined||data.parentId=='undefined'){
			        		btn = "<button id='del_relation' type='button' style='width:100%;' data-type='all' class='btn btn-danger'>移除所有关系</button>";
			        	}else{
			        		btn = "<button id='del_relation' type='button' style='width:100%;' data-type='sub' class='btn btn-danger'>移除子关系</button>";
			        	}
			        	html += btn;
			        	$("#relation_handle").html(html);
			        	delRelationClickEvent();
			        }
				});
			}
		}
	})
}

function clickEventlistener(){
	$("#addBtn").on('click',function(){
		$("#showInheritRelationModal").modal('show');
	})
	
	$("#add_inherit_show_r").on('click',function(){
		var showName = $("#showName").val();
		var inheritShowName = $("#inheritShowName").val();
		
		if(!showName||!inheritShowName||!showName.trim()||!inheritShowName.trim()){
			toastr.error("必要参数不能为空");
		}else{
			$.ajax({
		        type:"GET",
		        url:"/gdi/show/inherit/relation/add",
		        data:{showName:showName, inheritShowName:inheritShowName},
		        success:function (data) {
		            if(data.code==0){
		            	$("#showInheritRelationModal").modal('hide');
		                toastr.success("添加成功");
		                getRTreeData(searchVal);
		                $("#showName").val("");
		                $("#inheritShowName").val("");
		            }else{
		            	toastr.error(data.msg);
		            }
		        }
		    });
		}
	})
	
	$("#searchBtn").on('click',function(){
		var searchName = $("#searchInput").val();
		if(!searchName||!searchName.trim()){
			toastr.error("搜索剧名不能为空!");
		}else{
			getRTreeData(searchName);
			searchVal = searchName;
		}
	});
}

function delRelationClickEvent(){
	$("#del_relation").on('click',function(){
		var showId = $("#handle_info_sid").attr("data-val");
		var type = $("#del_relation").attr("data-type");
		var showName = $("#handle_info_sname").attr("data-val");
		console.log(showId,type,showName);
		if(!showId){
			toastr.error("发生未知错误，未获取到删除操作的showId!")
			return;
		}
		if(confirm("是否要删除["+showName+"]剧集延续关系?")){
			$.ajax({
		        type:"GET",
		        url:"/gdi/show/inherit/relation/del",
		        data:{showId:showId, type:type},
		        success:function (data) {
		            if(data.code==0){
		            	$("#showInheritRelationModal").modal('hide');
		            	toastr.success("删除成功!");
		    			getRTreeData(searchVal);
		    			$("#relation_handle").html("");
		            }else{
		            	toastr.error(data.msg);
		            }
		        }
		    });
		}
	})
}