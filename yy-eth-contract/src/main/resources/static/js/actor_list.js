/**
 * Created by jack on 2016/12/1.
 */

$(function () {
    /** 初始化分页表格 */
    var actorGrid = ActorGrid();
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
var ActorGrid = function () {
    $("#grid").datagrid({
        url: '/actor/get',
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
    field: "actorId",
    title: "actorId",
    sortable: true,
    attrHeader: {
        "style": "text-align: center;",
        "nowrap": "nowrap"
    }
}, {
    field: "name",
    title: "姓名",
    attrHeader: {
        "width": "8%",
        "style": "text-align: center;",
        "nowrap": "nowrap"
    }
}, {
    field: "gender",
    title: "性别",
    attrHeader: {
        "width": "6%",
        "style": "text-align: center;",
        "nowrap": "nowrap"
    },
    render: function (data) {
        var platformStr = "";
        switch (data.value) {
            case 0:
                platformStr = "男";
                break;
            case 1:
                platformStr = "女";
                break;
        }
        return platformStr;
    }
}, {
    field: "birthday",
    title: "生日",
    sortable: true,
    attrHeader: {
        "width": "12%",
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
    field: "height",
    title: "身高(CM)",
    attrHeader: {
        "width": "8%",
        "style": "text-align: center;",
        "nowrap": "nowrap"
    }
}, {
    field: "weight",
    title: "体重(KG)",
    attrHeader: {
        "width": "8%",
        "style": "text-align: center;",
        "nowrap": "nowrap"
    }
}, {
    field: "city",
    title: "现居地",
    attrHeader: {
        "width": "8%",
        "style": "text-align: center;",
        "nowrap": "nowrap"
    }
}, {
    field: "hometown",
    title: "成长地",
    attrHeader: {
        "width": "8%",
        "style": "text-align: center;",
        "nowrap": "nowrap"
    }
}, {
    field: "school",
    title: "毕业院校",
    attrHeader: {
        "width": "12%",
        "style": "text-align: center;",
        "nowrap": "nowrap"
    }
},
    //暂时不显示毕业年份
    // {
    // field: "graduationDate",
    // title: "毕业时间",
    // sortable: true,
    // attrHeader: {
    //     "width": "12%",
    //     "style": "text-align: center;",
    //     "nowrap": "nowrap"
    // },
    // render: function (data) {
    //     if (null != data.value && undefined != data.value) {
    //         return new Date(data.value).format("yyyy-MM-dd");
    //     } else {
    //         return "<span class='label label-default'>----</span>";
    //     }
    // }
    // },
    {
    field: "phoneNumber",
    title: "手机号",
    attrHeader: {
        "width": "12%",
        "style": "text-align: center;",
        "nowrap": "nowrap"
    }
}, {
    title: "操作",
    attrHeader: {"style": "text-align: center;", "nowrap": "nowrap"},
    render: function (data) {
        var row = data.row;
        var html =
            '<span class="label label-info"><a href="/actor/edit_show/' + data.row.actorId + '"  target="_blank">Info</a></span>' +
            '&nbsp;&nbsp;' +
            '<span class="label label-danger" onclick="deleteActor(' + data.row.actorId + ')">Delete</span>'+
            '&nbsp;&nbsp;' +
            '<span class="label label-success" onclick="recommendActor(' + data.row.actorId + ')">Recommend</span>';

        return html;
    },
}];

function deleteActor(id) {
    var r = confirm("是否确认删除该艺人，id:" + id );
    if (r == true){
        $.post(
            "/actor/delete",
            {
                id: id,
                _csrf: $("#csrf").val()
            },
            function (data, status) {
                if (data.code == 0) {
                    acsearch({'name': $('#searchInput').val(), 'page': $("#grid").datagrid("datagrid")._params.page});
                }else{
                    alert('删除失败');
                }
            });
    }
}

function recommendActor(id) {
    $.post(
        "/actor/recommend",
        {
            actorId: id,
            _csrf: $("#csrf").val()
        },
        function (data) {
            if (data.code == 0) {
                alert('添加推荐成功');
            }else{
                alert('添加推荐失败');
            }
        });
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