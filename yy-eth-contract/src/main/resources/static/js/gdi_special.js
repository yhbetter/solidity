$(function () {
    /** 初始化分页表格 */
    var actorSpecialGrid = actorGdiSpecialGrid();
    /** 初始化查询按钮功能 */
    var initSearchBtn = InitSearchBtn();
    /** 初始化搜索框*/
    var searchInput = SearchInput();

});
var InitSearchBtn = function () {
    $("#searchBtn").on('click', function () {
        acsearch({'name': $('#searchInput').val(), 'page': 1});
    });
}
var SearchInput = function () {
    $('#searchInput').on({
        keypress: function () {
            if (event.keyCode == "13") {
                acsearch({'name': $('#searchInput').val(), 'page': 1});
            }
            return true
        }
    })
}
var actorGdiSpecialGrid = function () {
    $("#grid").datagrid({
        url: '/gdi/speciallist/get',
        data: false,
        autoload: true,
        paramsMapping: {
            page: "page",
            paging: "rows",
        },
        parse: function (data) {
            if ($.type(data) === 'string') {
                return JSON.parse(data);
            } else {
                return data;
            }
        },
        remoteSort: true,
        idField: 'id',
        rownumbers: true,
        col: column,
        onBefore: function () {
        },
        onRowData: function (data, num, $tr) {
        	$($tr).attr("style","text-align:center;");
        },
        onComplete: function () {
        	$("tbody tr").each(function(i,o){
        		var tr = $(o);
        		var id = tr.find("td:eq(0)").text();
    			var td3 = tr.find("td:eq(3)");
    			td3.html("<a href='javascript:;' data-pk='"+id+"' data-name='recalcNum'>"+td3.text()+"</a>");
        	})
        	$("tbody a").editable({
                url: '/gdi/speciallist/edit',
                params: function(params) {
                    params.id = params.pk;
                    params[params.name] = params.value;
                    params._csrf = getCsrf();
                    return params;
                },
                validate: function(value) {
                    if($.trim(value) == '') {
                        return '不能为空';
                    }
                },
                success: function(response, newValue) {
                	if(response.code!=0){
                		toastr.error(response.msg);
                	}
                }
            });
        },
        onData: function (data) {
        },
        attr: {"class": "table table-bordered table-condensed"},
        sorter: "bootstrap",
        pager: "bootstrap",
        paramsDefault: {
            name: "",
            _csrf: $("#csrf").val()
        },
    });
}

function getCsrf() {
    return $('#csrf').val();
}

/***
 * 公共可配置参数，查询方法
 * @param param
 */
var acsearch = function (param) {
    var $grid = $("#grid");
    $grid.datagrid("datagrid")._params.page = param.page;
    $grid.datagrid("datagrid")._params.rows = 15;
    $grid.datagrid("datagrid")._params.name = param.name;
    $grid.datagrid("datagrid")._params._csrf = $("#csrf").val();
    $grid.datagrid("fetch");
}


var column = [{
    field: "id",
    title: "ID",
    sortable: true,
    attrHeader: {
    	"style": "text-align: center;",
        "nowrap": "nowrap"
    }
}, {
    field: "relevanceName",
    title: "名称",
    attrHeader: {
    	"style": "text-align: center;",
        "nowrap": "nowrap"
    }
}, {
    field: "type",
    title: "类型",
    attrHeader: {
    	"style": "text-align: center;",
        "nowrap": "nowrap"
    },
    render:function(data){
    	return data.row.type==0?'影视剧':'艺人';
    }
},{
    field: "recalcNum",
    title: "处理值",
    attrHeader: {
    	"style": "text-align: center;",
        "nowrap": "nowrap"
    }
},{
  title: "状态",
  attrHeader: {"style": "text-align: center;","nowrap": "nowrap","width":"18%"},
  render: function (data) {
      var row = data.row;
      var html = '';
      if(data.row.status==0){
    	  html += '<span class="label label-success" style="cursor:pointer;" id='+data.row.id+' data-status="0" data-name="'+data.row.relevanceName+'" onclick="editSpecialListStatus(' + data.row.id + ')">正常</span>';
      }else{
    	  html += '<span class="label label-danger" style="cursor:pointer;" id='+data.row.id+' data-status="-1" data-name="'+data.row.relevanceName+'" onclick="editSpecialListStatus(' + data.row.id + ')">黑名单</span>';
      }
      return html;
  }
}];


function editSpecialListStatus(id) {
	var status = $("#"+id).attr("data-status");
	if(!status){
		toastr.warning("未从列表中获取到该条记录的ID");
		return;
	}
	var newStatus = status == 0 ? -1 : 0;
	var handle = status==0?'加入黑名单':'移出黑名单'
	var handleInfo = "是否确认将"+$("#"+id).attr("data-name")+handle+"?";
    if (confirm(handleInfo)){
        $.get("/gdi/speciallist/edit?id="+id+"&status="+newStatus,
        function (data) {
            if (data.code == 0) {
                window.location.reload();
            }else{
            	toastr.error(data.msg);
            }
        });
    }
}

$("#add_special_list").click(function(){
	var name = $("#specialName").val();
	var type = $("#specialType").val();
	if(!name||!name.trim()){
		toastr.error("名称不能为空");
		return;
	}
	
	$.get("/gdi/speciallist/add?name="+name+"&type="+type,
	function(data){
		if(data.code == 0){
			window.location.reload();
		}else{
			toastr.error(data.msg);
		}
	});
})