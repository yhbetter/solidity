/**
 * examine show by system auto find！
 * @tag nothing
 */

//"use strict";
var csrf = $("#csrf").val();
$(function(){

var examine = new Examine(options);

});

/***
 * @param op
 * @constructor
 */
var Examine = function(op){
    this.grid = op.gridconfig;
    this.show = op.show;
    this.init();
    this.saveBtnEvent();
}
/**
 * @type {{init: Examine.init, buidGrid: Examine.buidGrid, statusDiv: Examine.statusDiv, searchInput: Examine.searchInput, searchBtn: Examine.searchBtn, search: Examine.search, btn: Examine.btn, checkForm: Examine.checkForm, showName: Examine.showName, getInfo: Examine.getInfo, sDetail: Examine.sDetail, isNotBlank: Examine.isNotBlank}}
 */
Examine.prototype = {

    init : function (){
        this.buidGrid();
        this.showName();
        this.searchBtn();
        this.statusDiv();
        this.categoryDiv();
        return this;
    },
    buidGrid : function(){
        var that = this;
        that.grid.grid.datagrid({
            url: that.grid.url,
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
            col: that.grid.col,
            onBefore: function() {
                //$eventsInfo.html( "Datagrid loading ..." );
                //$eventsArea.hide();
            },
            onRowData: function (data, num, $tr) {
                if ( 1 === data.checkedStatus || 2 === data.checkedStatus ) {
                    $tr.addClass( "success" );
                 }
                if ( null == data.releaseDate ) {
                    $tr.addClass( "info" );
                }
            },
            onComplete: function (){
                that.btn();
                //$eventsArea.show();
            },
            onData : function ( data ){

            },
            attr: {"class": "table table-bordered table-condensed"},
            sorter: "bootstrap",
            pager: "bootstrap",
            paramsDefault: {
                status:that.show.defaultStatus,
                name: "",
                platformId: "",
                category:that.show.defaultCategory,
                _csrf:$("#csrf").val()
            },
        });
    },
    statusDiv :function () {
        var that = this;
        var sdiv = $('.s-status-div');
        sdiv.find('a.list-group-item').on({
            click : function (){
                var $this = $(this);
                var sstatus = $this.attr('s-status');
                $this.siblings().removeClass('active');
                $this.addClass('active');
                that.show.defaultStatus = options.status[sstatus];
                that.search({'status':options.status[sstatus]})
            }
        });
    },
    categoryDiv :function () {
        var that = this;
        var cdiv = $('.s-category-div');
        cdiv.find('a.list-group-item').on({
            click : function (){
                var $this = $(this);
                var scate = $this.attr('s-category');
                $this.siblings().removeClass('active');
                $this.addClass('active');
                if(scate){
                	that.show.defaultCategory = scate;
                }
                that.search({'category':scate})
            }
        });
    },
    searchInput : function () {
        $('#searchInput').on({
            keypress: function(){
                if(event.keyCode == "13") {
                    that.search({'name':this.val()});
                }
            }
        })
    },
    searchBtn : function () {
        var that = this;
        $("#searchBtn").on({
            click: function(){
                that.search({'name':$('#searchInput').val()});
            }
        });
        return this;
    },
    search : function (sparam) {
    	var that = this;
    	var paramsDefault = {
            status:that.show.defaultStatus,
            name: "",
            platformId: "",
            category:that.show.defaultCategory
        }
        var $grid = this.grid.grid;
        $grid.datagrid("datagrid")._params.page = 1;
        $grid.datagrid("datagrid")._params.rows = 15;
        $grid.datagrid("datagrid")._params.status = this.isNotBlank(sparam.status)?sparam.status:paramsDefault.status;
        $grid.datagrid("datagrid")._params.name = this.isNotBlank(sparam.name)?sparam.name:paramsDefault.name;
        $grid.datagrid("datagrid")._params.category = this.isNotBlank(sparam.category)?sparam.category:paramsDefault.category;
        $grid.datagrid("datagrid")._params.platformId = this.isNotBlank(sparam.platformId)?sparam.platformId:paramsDefault.platformId;
        $grid.datagrid("datagrid")._params._csrf = $("#csrf").val();
        $grid.datagrid("fetch");
    },
    btn : function () {
        var that = this;
        /** 审核按钮 */
        $(".btn-examine").on({
            click: function(){
                var $this = $(this),
                    sId = $this.attr('sId'),
                    sName = $this.attr('sName'),
                    status = $this.attr('status'),
                    bId = $this.attr('bId'),
                    fn = $this.attr('fn');
                	cate = $this.attr('scate');
                //审核|忽略|查看
                if ( fn === 'examine' ){
                    that.sDetail(bId,sId,sName,status,fn);
                } else if(  fn === 'ignored'  ){
                    $.post('examine',{id:sId,name:sName,checkedStatus:options.status.ignored,category:cate,_csrf:csrf},function(response){
                        if( 'success' == response.code) {
                            alert("这部剧已经忽略处理");
                            that.search({});
                        } else {
                            alert(response.message);
                        }
                    });
                } else if( fn === 'check' ){
                    that.sDetail(bId,sId,sName,status,fn);
                }
            }
        })
    },
    saveBtnEvent : function(){
    	var that = this;
    	/** 审核功能 */
        $("#saveBtn").on({
            click: function(){
                var $btn = $(this).button('loading');
                if( !that.checkForm() ){
                    $btn.button('reset')
                    return false;
                }
                try {
                    $.post('examine',$('#showForm').serialize()+"&_csrf="+csrf,function(response){
                        if( 'success' == response.code) {
                            $('#myModal').modal('hide');
                            that.search({});
                        } else {
                            alert(response.message);
                        }
                    });
                } catch (e) {
                    console.error(e);
                    $btn.button('reset');
                }
                $btn.button('reset');
            }
        })
    },
    checkForm : function(){
        var pass = true;
        var $showName = $("#show_name");
        if(!this.isNotBlank($showName.val())){
            pass = false;
            $showName.focus();
            return pass;
        }
        return pass;
    },
    showName : function(){
        var that = this;
        $("#show_name").on({
            blur: function(){
                var $this = $(this),
                    value = $this.val(),
                    biId = $('#biShowId').val();
                $.ajaxSettings.async = false;
                that.getInfo(value,function(res){
                    if( null != res.id && 0 != res.id ){
                        $("#biShowId")
                            .val(res.id)
                            .attr('bi-name',res.name);
                        $("#releaseDate")
                            .val(undefined != res.releaseDate?new Date(res.releaseDate).format("yyyy-MM-dd"):"")
                            .attr('readonly','readonly');
                        $this.after('<span class="glyphicon glyphicon-ok form-control-feedback"></span>');
                    } else {
                        $this.after('<span class="glyphicon glyphicon-warning-sign form-control-feedback"></span>');
                    }
                });
            },
            keypress: function(){
                if(event.keyCode == "13") {
                    var $this = $(this),
                        value = $this.val(),
                        biId = $('#biShowId').val();
                        $.ajaxSettings.async = false;
                    that.getInfo(value,function(res){
                        if( null != res.id && 0 != res.id ){
                            $("#biShowId")
                                .val(res.id)
                                .attr('bi-name',res.name);
                            $("#releaseDate")
                                .val(undefined != res.releaseDate?new Date(res.releaseDate).format("yyyy-MM-dd"):"")
                                .attr('readonly','readonly');
                            $this.after('<span class="glyphicon glyphicon-ok form-control-feedback"></span>');
                        } else {
                            $this.after('<span class="glyphicon glyphicon-warning-sign form-control-feedback"></span>');
                        }
                    });
                }
            },
            input : function(){
                var $this = $(this),
                    $biShowId = $('#biShowId'),
                    $releaseDate = $('#releaseDate');
                $biShowId.val("").attr('bi-name','');
                $releaseDate.val("").removeAttr('readonly');
                $this.parent().find('span').remove();
            }
        })
    },
    getInfo :function(value,callBack){
        $.getJSON("bi/"+value,callBack);
    },
    sDetail : function (bid,sid,sname,status,fn) {
        clearForm($("#showForm"));
        var this_show = {};
        var this_show_class = "";//current show class

        $.getJSON('detail',{"name":sname,"id":sid},function(respData){

            $('#table-modal').empty();
            var pid = 0;
            var bId = [];
            var slength = 0;
            var data = {};

            $.each(respData, function(i,item){
                slength++;
                var show = [];
                var _bid = null != item.linkedId?item.linkedId:0;
                item.releaseDate = undefined != item.releaseDate?new Date(item.releaseDate).format("yyyy-MM-dd"):"";
                //任意一个非零非null pid 负值给它
                pid = (null != item.parentId ?item.parentId:pid);

                if ( -1 === bId.indexOf(_bid) ) {
                    bId.push(_bid);
                    if ( undefined === data._bid ) {
                        show.push(item);
                        data[_bid] = show;
                    } else {
                        data[_bid].push(item);
                    }
                } else if( 0 === bId.indexOf(_bid) ) {
                    data[_bid].push(item);
                }
            });

            var table = [];

            table.push('<table class="table table-bordered table-hover">');
            table.push('    <thead>');
            table.push('    <tr>');
            table.push('        <th>Link Id</th>');
            table.push('        <th>category</th>');
            table.push('        <th>releaseDate</th>');
            table.push('        <th>platform</th>');
            table.push('        <th>Name</th>');
            table.push('    </tr>');
            table.push('    </thead>');
            table.push('    <tbody>');

            $.each(data,function(j,s){
                var flag = 1;
                $.each(data[j],function(k,v){
                    //该条记录
                    if( sid==v.id ){
                        this_show = v;
                        this_show_class = options.class[Math.floor((Math.random()*options.class.length))];
                        table.push('    <tr id="show_'+sid+'" >');
                    }else {
                        this_show_class = "";
                        table.push('    <tr>');
                    };
                    if( 1===flag ){
                        table.push('        <td style="vertical-align:middle" rowspan="'+data[j].length+'" class="'+options.class[Math.floor((Math.random()*options.class.length))]+'">'+j+'</td>');
                    }
                    table.push('        <td class="'+this_show_class+'">'+v.category+'</td>');
                    table.push('        <td class="'+this_show_class+'">'+v.releaseDate+'</td>');
                    table.push('        <td class="'+this_show_class+'">'+v.platformCn+'</a></td>');
                    try{
                        table.push('        <td class="'+this_show_class+'"><a href="'+v.url+'" target="_Blank">'+v.name+'</a></td>');
                    }catch (e){
                        table.push('        <td class="'+this_show_class+'"><a href="javascript:;">'+v.name+'</a></td>');
                        console.error(e.message);
                    }
                    table.push('    </tr>');
                    flag++;
                });
            });
            table.push('    </tbody>');
            table.push('</table>');

            //填值
            $('#showForm').find("input").each(function(m,n){
                var $input = $(this),
                    key = $input.attr('name');
                $input.val(this_show[key]);
            });
            $('#showForm').find("select option").each(function(o,p){
            	var that = $(this);
            	var cate = that.attr("data-cate");
            	if(this_show['category']&&this_show['category']===cate){
            		that.siblings().removeAttr('selected');
            		that.attr('selected','selected');
            	}
            });
            
            //查看
            if ( 'check' === fn ) {
                $('#saveBtn').hide();

            }
            //父节点Id
            $("#merge").val(pid);
            //初始化
            $('#table-modal').append(table.join(''));
            $('#myModal').modal("show");
        });

    },
    isNotBlank : function (value) {
        return null != value && "" !== value && undefined != value ? true : false;
    }

}

var column = [{
    field: "id",
    title: "showId",
    sortable: true,
    attrHeader: {
        "style": "text-align: center;",
        "nowrap": "nowrap"
    }
}, {
    field: "name",
    title: "剧名",
    attrHeader: {
        "style": "text-align: center;",
        "nowrap": "nowrap"
    }
}, {
    field: "platformId",
    title: "平台",
    attrHeader: {
        //"width": "20%",
        "style": "text-align: center;",
        "nowrap": "nowrap"
    },
    render: function (data) {
        var platformStr = "";
        switch (data.value) {
            case 1:
                platformStr = "腾讯";
                break;
            case 2:
                platformStr = "爱奇艺";
                break;
            case 3:
                platformStr = "优酷";
                break;
            case 4:
                platformStr = "土豆";
                break;
            case 5:
                platformStr = "搜狐";
                break;
            case 6:
                platformStr = "乐视";
                break;
            case 7:
                platformStr = "芒果";
                break;
            case 8:
                platformStr = "响巢看看";
                break;
            case 9:
                platformStr = "风行";
                break;
            case 10:
                platformStr = "56网";
                break;
            case 11:
                platformStr = "PPTV";
                break;
            default:
                platformStr = "----";
                break;
        }
        return platformStr;
    }
}, {
    field: "code",
    title: "code",
    attrHeader: {
        "style": "text-align: center;",
        "nowrap": "nowrap"
    }
}, {
    field: "category",
    title: "分类",
    attrHeader: {
        "width": "12%",
        "style": "text-align: center;",
        "nowrap": "nowrap"
    }
}, {
    field: "releaseDate",
    title: "上线时间",
    sortable: true,
    attrHeader: {
        "width": "12%",
        "style": "text-align: center;",
        "nowrap": "nowrap"
    },
    render: function (data) {
        if ( null != data.value && undefined != data.value ) {
            return new Date(data.value).format("yyyy-MM-dd");
        } else {
            return "<span class='label label-default'>----</span>";
        }
    }
}, {
    field: "checkedStatus",
    title: "状态",
    attrHeader: {"style": "text-align: center;", "nowrap": "nowrap"},
    attr: {"style": "width:100px"},
    sortable: true,
    render: function (data) {
        var html = '';
        switch (data.value) {
            case 0:
                html = "<span class='label label-warning'>待审核</span>";
                break;
            case 1:
                html = "<span class='label label-primary'>已审核</span>";
                break;
            case 2:
                html = "<span class='label label-default'>忽略</span>";
                break;
            default:
                html = "<span class='label label-primary'>大概已审核</span>";
                break;
        }
        return html;
    },
}, {
    field: "status",
    title: "操作",
    attrHeader: {"style": "text-align: center;", "nowrap": "nowrap"},
    attr: {"style": "width:100px"},
    render: function (data) {
    	
        var html = '',
            row = data.row,
            _atg = 'sId="'+row.id+'" sName="'+row.name+'" status="'+row.checkedStatus+'" scate="'+row.category+'"';
        switch (row.checkedStatus) {
            case 0:
                html = '<button type="button" class="btn btn-warning btn-xs btn-examine" fn="examine" '+_atg+'>审核</button>'
                    +'&nbsp;&nbsp;<button type="button" class="btn btn-info btn-xs btn-examine" fn="ignored" '+_atg+'>忽略</button>';
                break;
            case 1:
                html = '<button type="button" class="btn btn-info btn-xs btn-examine" fn="check" '+_atg+'>查看</button>';
                break;
            case 2:
                html = '<button type="button" class="btn btn-info btn-xs btn-examine" fn="check" '+_atg+'>查看</button>';
                break;
        }
        return html;
    },
}];
var options = {
    gridconfig : {
        grid : $('#grid'),
        url :'checkPaging',
        col : column,
    },
    show : {
        examine : '',
        detail : 'detail/',
        defaultStatus : 0,
        defaultCategory : 'NETWORK_MOVIE'
    },
    class : [
        "active","success","warning","danger","info"
    ],
    status:{
        init : 0,
        passed : 1,
        ignored : 2,
    }
}

Date.prototype.format = function(format){
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    }

    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
}
/***
 * 清空表单
 */
function clearForm($form){
    $(':input',$form)
        .not(':button, :submit, :reset, :hidden')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');
    $form.find('span.form-control-feedback').remove();
    $form.find('#releaseDate').removeAttr('readonly');
}
