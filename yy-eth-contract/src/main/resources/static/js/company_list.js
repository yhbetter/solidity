$(function () {
    /** 初始化分页表格 */
    var companyGrid = CompanyGrid();
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
var CompanyGrid = function () {
    $("#grid").datagrid({
        url: '/company/get',
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
            //$eventsInfo.html( "Datagrid loading ..." );
            //$eventsArea.hide();
        },
        onRowData: function (data, num, $tr) {
        },
        onComplete: function () {
        	$("#grid tr").each(function(){
        		var text = $(this).children("td:eq(2)").text();
        		if(text&&text.length>=20){
            		$(this).children("td:eq(2)").text(text.trim().substring(0,20)+"...");
        		}
        	})
            // that.btn();
            //$eventsArea.show();
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
    title: "id",
    sortable: true,
    attrHeader: {
    	"width": "5%",
        "style": "text-align: center;",
        "nowrap": "nowrap"
    }
}, {
    field: "name",
    title: "名称",
    attrHeader: {
        "width": "30%",
        "style": "text-align: center;",
        "nowrap": "nowrap"
    }
}, {
    field: "desc",
    title: "简介",
    attrHeader: {
        "width": "30%",
        "style": "text-align: center;",
        "nowrap": "nowrap"
    }
},{
    field: "location",
    title: "公司驻地",
    attrHeader: {
        "width": "10%",
        "style": "text-align: center;",
        "nowrap": "nowrap"
    }
}, {
    field: "setDate",
    title: "成立日期",
    sortable: true,
    attrHeader: {
        "width": "10%",
        "style": "text-align: center;",
        "nowrap": "nowrap"
    },
    render: function (data) {
        if (null != data.value && undefined != data.value) {
            return new Date(data.value).format("yyyy-MM-dd");
        } else {
            return "<span class='label label-default'>----</span>";
        }
    }
}, {
    field: "officialUrl",
    title: "官方网址",
    attrHeader: {
        "width": "16%",
        "style": "text-align: center;",
        "nowrap": "nowrap"
    }
}, {
    title: "操作",
    attrHeader: {"style": "text-align: center;", "nowrap": "nowrap"},
    render: function (data) {
        var row = data.row;
        var html =
            '<span class="label label-info"><a href="/company/add?companyId=' + data.row.id + '">Info</a></span>' +
            '&nbsp;&nbsp;';
        if(data.row.status==0){
        	html += '<span class="label label-danger" onclick="handleCompany(' + data.row.id + ',-1)">Delete</span>'
        }else{
        	html += '<span class="label label-success" onclick="handleCompany(' + data.row.id + ',0)">Recover</span>'
        }
        return html;
    },
}];

function handleCompany(id,status) {
	var handleTips = status == 0 ? '恢复':'删除'
    if (confirm("是否确认"+handleTips+"该公司")){
        $.get("/company/status/modify?id="+id+"&status="+status,
        function (data) {
            if (data.code == 0) {
                window.location.reload();
            }else{
            	alert(data.msg);
            }
        });
    }
}

Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}