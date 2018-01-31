/**
 * Created by jack on 2017/2/4.
 */

var updateActorPriorityDialog;

$(function () {
    /** 初始化分页表格 */
    var actorGrid = ActorGrid();
    updateActorPriorityDialog = new UpdateActorPriorityDialog().save();
});

var UpdateActorPriorityDialog = function () {
    this.from = $('#updateActorPriorityDialog');
    this.form = $('#updateActorPriorityDialog form[id = "updateActorForm"]')
    this.actorId = $('#updateActorPriorityDialog input[id=actorId]');
    this.actorName = $('#updateActorPriorityDialog input[id=actorName]');
    this.priority = $('#updateActorPriorityDialog input[id=priority]');
    this.saveBtb = $('#updateActorPriorityDialog button[name = "save"]')
}

UpdateActorPriorityDialog.prototype = {
    save: function () {
        var _this = this;
        _this.saveBtb.on('click', function () {
            var actorRecommend = _this.form.serialize();
            $.post("/actor/updateActorPriority", actorRecommend + "&_csrf=" + $('#csrf').val(),
                function (data) {
                    if (data.code == 0) {
                        acsearch({'name': '', 'page': $("#grid").datagrid("datagrid")._params.page});
                    } else {
                        alert(data.message);
                    }
                }
            );
            _this.from.modal('hide');
        });
        return _this;
    }
}

var ActorGrid = function () {
    $("#grid").datagrid({
        url: '/actor/actorRecommendList',
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
}, {
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
            '<span class="label label-info" data-toggle="modal" data-target="#updateActorPriorityDialog" onclick="actorInfo('+data.row.actorId+',\''+data.row.name+'\','+data.row.priority +')">修改</span>' +
            '&nbsp;&nbsp;' +
            '<span class="label label-danger" onclick="deleteActor(' + data.row.actorId + ')">移除推荐</span>'
        return html;
    }
}];

function deleteActor(id) {
    var r = confirm("是否确认取消推荐该艺人，id:" + id );
    if (r == true){
        $.get(
            "/actor/cancelActorRecommend",
            {
                actorId: id
            },
            function (data) {
                if (data.code == 0) {
                    acsearch({'name': '', 'page': $("#grid").datagrid("datagrid")._params.page});
                }else{
                    alert('删除失败');
                }
            });
    }
}

function actorInfo(actorId, actorName, priority) {
    clearForm();
    $('#actorId').val(actorId);
    $('#actorName').val(actorName);
    $('#priority').val(priority);
}

/***
 * clear form
 * @param $form form 对象，也可以是任意的块元素(block element)div...
 * @param fn  自定义执行函数
 * @exmple
 *  clearForm($(form),function () {
 *      alert("1");
 *  })
 */
function clearForm ($form,fn){
    $(':input',$form)
        .not(':button, :submit, :reset, :hidden')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');
    if ( 'function' === typeof (fn) ) {
        fn();
    }
    return true;
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
