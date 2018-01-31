$(function () {
	/** 初始化艺人金榜 **/
	var billboard = get_billboard();
    /** 初始化分页表格 */
    var gdiActorGrid = gdiActorListGrid();
    /** 初始化查询按钮功能 */
    var initSearchBtn = InitSearchBtn();
    /** 初始化搜索框*/
    var searchInput = SearchInput();

    var dateInputEvent = InitDateInputChange();

    var exportClick = exportEvent();
});
var InitSearchBtn = function () {
    $("#searchBtn").on('click', function () {
        acsearch({'name': $('#searchInput').val(), 'day':$('#gdiActorDateInput').val(),'page': 1});
    });
}
var exportEvent = function () {
    $("#exportBtn").on('click', function () {
        var day = $("#gdiActorDateInput").val();
        if(!day){
            toastr.error("出榜日期不能为空!");
            return;
        }
        if(confirm("是否要导出"+day+"艺人指数至金榜?")){
            $.get("/billboard/gdi_actor/export?day="+day,
                function (data) {
                    if (data.code == 0) {
                        window.location.reload();
                    }else{
                        toastr.error(data.msg);
                    }
                });
        }
    });
}
var SearchInput = function () {
    $('#searchInput').on({
        keypress: function () {
            if (event.keyCode == "13") {
                acsearch({'name': $('#searchInput').val(),'day':$('#gdiActorDateInput').val(), 'page': 1});
            }
            return true
        }
    })
}
var nowGoldBillboardDay = "";
var InitDateInputChange = function(){
	$("#dateInput").on('change',function(){
		var v = $("#dateInput").val();
		if(v&&v!=nowGoldBillboardDay){
			get_billboard();
			nowGoldBillboardDay = v;
		}
	})
}
var InitGoldBillboardEditEvent = function(){
	$("#gold_billboard_div tbody a").editable({
        url: '/billboard/actor_gold/edit',
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
        	if(response.code==0){
        		get_billboard();
        	}else{
        		toastr.error(response.msg);
        	}
        }
    });
}

var gdiActorListGrid = function () {
    $("#grid").datagrid({
        url: '/billboard/gdi_actor/list',
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
        	$("#grid tbody tr").each(function(i,o){
        		var tr = $(o);
        		var id = tr.find("td:eq(0)").text();
    			var td2 = tr.find("td:eq(3)");
    			td2.html("<a href='javascript:;' data-pk='"+id+"' data-name='gdi'>"+td2.text()+"</a>");
        	})
        	$("#grid tbody a").editable({
                url: '/billboard/gdi_actor/edit',
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
                	if(response.code==0){
                		acsearch({'name': $('#searchInput').val(), 'day':$('#gdiActorDateInput').val(),'page': 1});
                	}else{
                		toastr.error(response.msg);
                	}
                }
            });
        },
        onData: function (data) {
        	var day = $('#gdiActorDateInput').val();
        	if(!day||day!=data.day){
        		$('#gdiActorDateInput').val(data.day);
        	}
        },
        attr: {"class": "table table-bordered table-condensed"},
        sorter: "bootstrap",
        pager: "bootstrap",
        paramsDefault: {
            name: "",
            day:"",
            rows:20,
            _csrf: $("#csrf").val()
        },
    });
}

function get_billboard(){

    var day = $("#dateInput").val();
    
    $.ajax({
        type: 'GET',
        url: '/billboard/actor_gold/list',
        data:{day:day},
        success: function (data) {
        	if(data.code == 0){
        		var tbd = $("#gold_billboard_div .table tbody");
        		var html = "";
        		tbd.html(html);
        		if(data.extra&&!day){
        			$("#dateInput").val(data.extra.day);
        			nowGoldBillboardDay = data.extra.day;
        		}
                $.each(data.data,function(i,o){
                    rise_url = "/img/equals.png";
                    if(Number(o.rise) > 0){
                        rise_url = "/img/up.png";
                    }else if(Number(o.rise) < 0){
                        rise_url = "/img/down.png";
                    }

                    var tr = '<tr class="billboard_tr">' +
                        '<td class="billboard_order"><span class="order">'+ (Number(o.ordinal) < 10 ? "0":"")+ o.ordinal+'</span></td>'+
                        '<td><img style="width: 12px;height: 12px;" src="'+rise_url+'">'+( Math.abs(Number(o.rise)) == 0 ? "" : Math.abs(Number(o.rise)) )+'</td>'+
                        '<td>'+ o.actorName+'</td>' +
                        '<td>'+ o.showName+'</td>' +
                        '<td><a href="javascript:;" data-pk="'+o.id+'" data-name="index">'+o.index+'</a></td>' +
                        '<td><span data-value="'+ o.id+'" data-aname="'+o.actorName+'" class="glyphicon glyphicon-remove del" style="display: none;"></span></td>' + 
                        '</tr>';
                    html += tr;
                });
                if(html != ''){
                	html += "<tr><td colspan='6'><button class='add_new_billboard_item'>添  加</button></td></tr>";
                	tbd.html(html);
                	InitGoldBillboardEditEvent();//榜单金榜编辑事件
                	InitAddItemClickEvent();;//榜单添加按钮事件
                }
        	}else{
        		toastr.error(data.msg);
        	}
        }
    });
};

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
    $grid.datagrid("datagrid")._params.rows = 20;
    $grid.datagrid("datagrid")._params.name = param.name;
    $grid.datagrid("datagrid")._params.day = param.day;
    $grid.datagrid("datagrid")._params._csrf = $("#csrf").val();
    $grid.datagrid("fetch");
}


var column = [{
    field: "id",
    title: "ID",
    //sortable: true,
    attrHeader: {
        "nowrap": "nowrap"
    }
},{
    field: "actorName",
    title: "姓名",
    attrHeader: {
        "nowrap": "nowrap"
    }
},{
    field: "showName",
    title: "剧名",
    attrHeader: {
        "nowrap": "nowrap"
    }
},{
    field: "gdi",
    title: "艺人指数",
    //sortable: true,
    attrHeader: {
        "nowrap": "nowrap"
    }
},{
    title: "操作",
    attrHeader: {"nowrap": "nowrap"},
    render: function (data) {
        var row = data.row;
        var html = '<span class="label label-success" id='+row.id+' style="cursor:pointer;" data-actorName="'+row.actorName+'" data-showName="'+row.showName+'" onclick="showBaseData('+row.id+',' + row.actorId + ','+row.day+')">基础数据</span>';
        return html;
    }
}];

function showBaseData(id,actorId,time) {
    var actorName = $("#"+id).attr("data-actorName");
    var showName = $("#"+id).attr("data-showName");
    $.get("/billboard/gdi_actor_base/find?actorId="+actorId+"&time="+time,
    function (data) {
        if (data.code == 0) {
            var s = "<div><p style='color:#268cff;'>"+actorName+"--"+showName+"</p></div><table style='width:100%;' border='1'><tr><td></td><td>基础数据</td></tr>";
            $.each(data.data,function(i,o){
                s += "<tr><td>"+i+"</td><td>"+(i=="day"?date_format(new Date(o),'yyyy-MM-dd'):o)+"</td></tr>";
            })
            s += "</table>";
            $("#gdiBaseDataBody").html(s);
            $("#gdiBaseDataModal").modal('show');
        }else{
            toastr.error(data.msg);
        }
    });
}

$("#allow_del").click(function () {
    $(".del").show();
    var delClick = InitDelSpanClickEvent();
});
var InitDelSpanClickEvent = function(){
	$(".del").on("click",function () {
	    var id = $(this).attr("data-value");
	    var aname = $(this).attr("data-aname");
	    if(confirm('您确认要将['+aname+']移除艺人金榜吗?')){
	    	//确认进行删除
            $.ajax({
                type:"GET",
                url:"/billboard/actor_gold/del/"+id,
                success:function (data) {
                    if(data.code==0){
                    	get_billboard();
                    }else {
                        toastr.error(data.msg);
                    }
                }
            });
	    }
	});
}

var InitAddItemClickEvent = function(){
	$(".add_new_billboard_item").on("click",function () {
		var html = '演员名称:<input id="add_actor_name" type="text" class="form-control" required="required"/>'+
			'剧名:<input id="add_show_name" type="text" class="form-control" required="required"/>'+
			'指数值:<input id="add_index_value" type="number" class="form-control" required="required"/>'+
			'<button class="btn-default" id="post_item"> 提 交 </button>'
		$("#actorGoldAddBody").html(html);
		InitAddItemPostEvent();
		$("#actorGoldAddModal").modal('show');
	});
}
var InitAddItemPostEvent = function(){
	$("#actorGoldAddModal #post_item").on("click",function () {
	    var actorName = $("#actorGoldAddModal #add_actor_name").val();
	    var showName = $("#actorGoldAddModal #add_show_name").val();
	    var index = $("#actorGoldAddModal #add_index_value").val();
	    var day = $("#dateInput").val();
	    if(actorName&&showName&&index&&day){
			$.ajax({
		        type:"GET",
		        url:"/billboard/actor_gold/add",
		        data:{actorName:actorName, showName:showName, index:index, day:day},
		        success:function (data) {
		            if(data.code==0){
		            	$("#actorGoldAddModal").modal('hide');
		                toastr.success("添加成功");
		                get_billboard();
		            }else{
		            	toastr.error(data.msg);
		            }
		        }
		    });
		}else{
			toastr.warning("必要参数或上榜日期不能为空");
		}
	});
}