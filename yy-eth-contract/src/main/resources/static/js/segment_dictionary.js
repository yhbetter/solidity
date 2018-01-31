/**
 * Created by jack on 2017/6/5.
 */


var updatePriorityDialog;

$(function () {
    /** 初始化分页表格 */
    SegmentGrid();
    /** 初始化查询按钮功能 */
    InitSearchBtn();
    updatePriorityDialog = new UpdatePriorityDialog().save();
});

var InitSearchBtn = function () {
    $("#searchBtn").on('click', function () {
        acsearch({'word': $('#searchInput').val(), 'page': 1});
    });
}

var UpdatePriorityDialog = function () {
    this.from = $('#updatePriorityDialog');
    this.form = $('#updatePriorityDialog form[id = "updateForm"]');
    this.id = $('#updatePriorityDialog input[id=id]');
    this.word = $('#updatePriorityDialog input[id=word]');
    this.nature = $('#updatePriorityDialog input[id=nature]');
    this.frequency = $('#updatePriorityDialog input[id=frequency]');
    this.saveBtb = $('#updatePriorityDialog button[name = "save"]')
}

UpdatePriorityDialog.prototype = {
    save: function () {
        var _this = this;
        _this.saveBtb.on('click', function () {
            var form = _this.form.serialize();
            $.post("/SegmentDictionary/update", form + "&_csrf=" + $('#csrf').val(),
                function (data) {
                    if ($.type(data) === 'string') {
                        data = JSON.parse(data);
                    }
                    if (data.code == 0) {
                        acsearch({'word': '', 'page': $("#grid").datagrid("datagrid")._params.page});
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

var SegmentGrid = function () {

    $("#grid").datagrid({
        url: '/SegmentDictionary/list',
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
        }
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
    $grid.datagrid("datagrid")._params.word = param.word;
    $grid.datagrid("datagrid")._params._csrf = $("#csrf").val();
    $grid.datagrid("fetch");
};

var column = [{
    field: "id",
    title: "id",
    sortable: true,
    attrHeader: {
        "style": "text-align: center;",
        "nowrap": "nowrap"
    }
}, {
    field: "word",
    title: "word",
    attrHeader: {

        "style": "text-align: center;",
        "nowrap": "nowrap"
    }
}, {
    field: "nature",
    title: "nature",
    attrHeader: {

        "style": "text-align: center;",
        "nowrap": "nowrap"
    }
}, {
    field: "frequency",
    title: "frequency",
    attrHeader: {

        "style": "text-align: center;",
        "nowrap": "nowrap"
    }
}, {
    field: "hasModified",
    title: "hasModified",
    attrHeader: {

        "style": "text-align: center;",
        "nowrap": "nowrap"
    }
}, {
    title: "操作",
    attrHeader: {"style": "text-align: center;", "nowrap": "nowrap"},
    render: function (data) {
        var html = '<span class="label label-info" data-toggle="modal" data-target="#updatePriorityDialog" onclick="updateInfo(' + data.row.id + ',\'' + data.row.word + '\',\'' + data.row.nature + '\',' + data.row.frequency + ')">修改</span>'+
            '&nbsp;&nbsp;' +
            '<span class="label label-danger" onclick="deleteR(' + data.row.id + ')">删除</span>';
        return html;
    }
}];

function updateInfo(id, word, nature, frequency) {
    $('#id').val(id);
    $('#word').val(word);
    $('#nature').val(nature);
    $('#frequency').val(frequency);
}

function deleteR(id) {
    var r = confirm("是否确认删除，id:" + id );
    if (r == true){
        $.post(
            "/SegmentDictionary/delete",
            {
                id: id,
                _csrf: $("#csrf").val()
            },
            function (data, status) {
                data = JSON.parse(data);
                if (data.code == 0) {
                    acsearch({'name': $('#searchInput').val(), 'page': $("#grid").datagrid("datagrid")._params.page});
                }else{
                    alert('删除失败');
                }
            });
    }
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
function clearForm() {
    $('#id').val('');
    $('#word').val('');
    $('#nature').val('');
    $('#frequency').val('');
    return true;
}