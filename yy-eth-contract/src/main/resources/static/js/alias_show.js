/**
 * alias show by system auto find！
 * @tag nothing
 */

//"use strict";
var csrf = $("#csrf").val();
$(function () {
    var aliasModel = new AliasModel(options);
});

/***
 * @param op
 * @constructor
 */
var AliasModel = function (op) {
    this.grid = op.gridconfig;
    this.show = op.show;
    this.init();
}
/**
 * init
 */
AliasModel.prototype = {

    init: function () {
        this.buidGrid();
        this.searchBtn();
        return this;
    },
    buidGrid: function () {
        var that = this;
        that.grid.grid.datagrid({
            url: that.grid.url,
            data: false,
            autoload: true,
            parse: function (data) {
                if ($.type(data) === 'string') {
                    return JSON.parse(data);
                } else {
                    var d = {};
                    d.data = data;
                    d.total = 0;
                    return d;
                }
            },
            remoteSort: true,
            idField: 'relevanceId',
            rownumbers: false,
            col: that.grid.col,
            onRowData: function (data, num, $tr) {
            	$($tr).attr("style","text-align:center;");
            },
            attr: {"class": "table table-bordered table-condensed"},
            sorter: "bootstrap",
            pager: "bootstrap",
            paramsDefault: {
                name: "",
                _csrf: $("#csrf").val()
            }
        });
    },
    searchInput: function () {
        $('#searchInput').on({
            keypress: function () {
                if (event.keyCode == "13") {
                    that.search({'name': this.val()});
                }
            }
        })
    },
    searchBtn: function () {
        var that = this;
        $("#searchBtn").on({
            click: function () {
                that.search({'name': $('#searchInput').val()});
            }
        });
        return this;
    },
    search: function (sparam) {
        var $grid = this.grid.grid;
        $grid.datagrid("datagrid")._params.name = this.isNotBlank(sparam.name) ? sparam.name : "";
        $grid.datagrid("datagrid")._params._csrf = $("#csrf").val();
        $grid.datagrid("fetch");
    },
    isNotBlank: function (value) {
        return null != value && "" !== value && undefined != value ? true : false;
    }

}

var column = [{
    field: "relevanceId",
    title: "showId",
    sortable: true,
    attrHeader: {
        "style": "text-align: center;width:15%;",
        "nowrap": "nowrap"
    }
}, {
    field: "showName",
    title: "剧名",
    attrHeader: {
        "style": "text-align: center;width:65%;",
        "nowrap": "nowrap"
    }
}, {
    field: "status",
    title: "操作",
    attrHeader: {"style": "text-align: center;", "nowrap": "nowrap"},
    attr: {"style": "width:20%"},
    render: function (data) {
        var html = '',
            row = data.row,
            aliases = JSON.stringify(row.aliases),
            rkeywords = JSON.stringify(row.relationKeywords);
            // _iracc = " data_id" + aliases.id + " data_relevanceId" + aliases.relevanceId + " data_alias" + aliases.alias + " data_classify" + aliases.classify + " data_category" + aliases.category,
            // html = '<button type="button" class="btn btn-info btn-xs btn-alias"' + _iracc + ' >别名</button>';
            html += '<button type="button" class="btn btn-info btn-xs btn-alias"  onclick=' + 'alertAlias(' + JSON.stringify(aliases).replace(/\s/g, '&nbsp;') + ',1)' + '>别名</button>';
            html += '<button type="button" class="btn btn-success btn-xs btn-alias"  onclick=' + 'alertAlias(' + JSON.stringify(rkeywords).replace(/\s/g, '&nbsp;') + ',2)' + '>相关关键词</button>';
        return html;
    }
}];
var options = {
    gridconfig: {
        grid: $('#grid'),
        url: 'list/showName',
        col: column,
    },
    show: {
        aliasModel: '',
        detail: 'detail/',
        defaultStatus: 0
    },
    class: [
        "active", "success", "warning", "danger", "info"
    ],
    status: {
        init: 0,
        passed: 1,
        ignored: 2,
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

function alertAlias(data,type) {//type-1 别名 tpe-2 相关关键词
	$("#saveBtn").attr('data-type',type);
	if(type==1){
		$("#myModalLabel").text("别名");
	}else{
		$("#myModalLabel").text("相关关键词");
	}
    var aliases = JSON.parse(data);

    var this_show = {};
    var this_show_class = "";//current show class

    $('#table-modal').empty();
    var pid = 0;
    var bId = [];
    var slength = 0;
    var data = {};

    $.each(aliases, function (i, item) {
        slength++;
        var show = [];
        var _bid = null != item.relevanceId ? item.relevanceId : 0;
        //任意一个非零非null pid 负值给它
        pid = (null != item.relevanceId ? item.relevanceId : pid);
        if (-1 === bId.indexOf(_bid)) {
            bId.push(_bid);
            if (undefined === data._bid) {
                show.push(item);
                data[_bid] = show;
            } else {
                data[_bid].push(item);
            }
        } else if (0 === bId.indexOf(_bid)) {
            data[_bid].push(item);
        }
    })
    var table = [];
    table.push('<table class="table table-bordered table-hover" id = "aliasTable">');
    table.push('    <thead>');
    table.push('    <tr>');
    table.push('        <th hidden>Id</th>');
    if(type==1){
    	table.push('        <th>别名</th>');
    }else{
    	table.push('        <th>相关关键词</th>');
    }
    table.push('        <th>分类</th>');
    if(type==1){
    	table.push('        <th>类别</th>');
    }
    table.push('        <th hidden >type</th>');
    table.push('    </tr>');
    table.push('    </thead>');
    table.push('    <tbody>');

    $.each(data, function (j, s) {
        var flag = 1;
        $.each(data[j], function (k, v) {
            //该条记录
            this_show = v;
            this_show_class = options.class[Math.floor((Math.random() * options.class.length))];
            table.push('    <tr id="show_' + pid + '" >');
            table.push('        <td hidden class="' + this_show_class + '">' + v.id + '</td>');
            table.push('        <td class="' + this_show_class + '"><input class="form-control" id="alias_'+v.id+'"  value="' + (type==1?v.alias:v.relationWords) + '"></td>');

            table.push('        <td class="' + this_show_class + '">' + getClassify(v.classify) + '</td>');
            if(type==1){
            	table.push('        <td class="' + this_show_class + '">' + getCategory( v.category) + '</a></td>');
            }
            table.push('        <td hidden class="' + this_show_class + '">' + v.type + '</a></td>');
            table.push('    </tr>');
            flag++;
        });
    });
    table.push('    </tbody>');
    table.push('</table>');

    //初始化
    $('#table-modal').append(table.join(''));
    $('#myModal').modal("show");

}



/** 提交更改alias*/
$("#saveBtn").on({
    click: function () {
    	var type = $(this).attr('data-type');
        var tableInfo = "";
        var data = [];
        var url = type==1?('/alias/update?_csrf='+csrf):('/alias/rkeyword/update?_csrf='+csrf);
        var headers = type==1?['id','alias','classify','category']:['id','relationWords','classify'];
        var tableObj = document.getElementById("aliasTable");
        for (var i = 1; i < tableObj.rows.length; i++) { //遍历Table的所有Row
            var tableRow = tableObj.rows[i];
            var rowData = {};
            for (var j = 0; j < tableObj.rows[i].cells.length; j++) { //遍历Row中的每一列
                switch (j) {
                    case 0:
                       var  thisId = tableObj.rows[i].cells[j].innerText
                        rowData[ headers[j] ] = tableRow.cells[j].innerText;
                        break;
                    case 1:
                        rowData[ headers[j] ] = (document.getElementById("alias_"+thisId).value);
                        break;
                    case 2:
                        rowData[ headers[j] ] = tableRow.cells[j].innerText; //获取Table中单元格的内容
                        break;
                    case 3:
                        rowData[ headers[j] ] = tableRow.cells[j].innerText; //获取Table中单元格的内容
                        break;
                    default:
                        break;
                }
            }
            data.push(rowData);
        }
        //发送更改请求
        $.ajax({
            type : 'post',
            url : url,
            data : JSON.stringify(data),
            dataType:"json",
            contentType:"application/json",
            success : function(data){
                if (data.code == 0){
                    //alert("更改成功");
                    $('#myModal').modal("hide");
                    window.location.reload();
                }else{
                    alert(data.msg);
                }
                return;
            },
            error : function(){
                alert("网络错误，请举手");
            }
        });
    }
})


/***
 * 清空表单
 */
function clearForm($form) {
    $(':input', $form)
        .not(':button, :submit, :reset, :hidden')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');
    $form.find('span.form-control-feedback').remove();
    $form.find('#releaseDate').removeAttr('readonly');
}
