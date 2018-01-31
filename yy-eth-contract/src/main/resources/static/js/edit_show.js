$('#product_company').selectpicker({});
$('#publish_company').selectpicker({});
$('#issu_company').selectpicker({});

var input_str = "";
var es_timeOut = "";
var current_company_input_pid = "";

$(".input-block-level").bind("propertychange input",function(event){   //添加input框事件
	input_str = $(this).val();
    clearTimeout(es_timeOut);
    //当前input项顶层id
	current_company_input_pid = $(this).parent().parent().parent().parent().attr("id");
    es_timeOut = setTimeout(function(){   //设置延后ajax请求
    	var id = current_company_input_pid.substring(0,current_company_input_pid.indexOf("_p"));
    	//选中的值与对应的选中的option索引
    	var that = $('#'+id);
  	    var optionsVal = that.val();
  	    var optionsHtml = "";
  	    var selected = [];
  	    //获取已全中的options索引数组
  	    $('#'+current_company_input_pid+' ul').children(".selected").each(function(i,l){
  	    	selected.push(parseInt(l.attributes.rel.value))
  	    })
  	    //转化为html文本。
  	    that.find("option").each(function(i,h){
  	    	if($.inArray(i,selected)!==-1){
  	    		//设置属性为选中
  	    		h.setAttribute('selected','true');
  	    		optionsHtml+=h.outerHTML;
  	    	}
  	    });
  	    if(input_str===""){
  	    	//默认显示已选择过的列表
  	    	that.empty();
  	    	that.append(optionsHtml);    
            //更新内容刷新到相应的位置
  	    	that.selectpicker('render');
  	    	that.selectpicker('refresh');
  	    }else{
  	    	$.ajax({
                type : 'GET',
                url : "/company/search/" + input_str,
                dateType : 'json',
                success: function(res){
	                var tempHtml = optionsHtml;
	              	if(res==null){
	              		return;
	              	}
	              	if(optionsVal!==null&&optionsVal!==undefined&&optionsVal.length!==0){
	              		//若异步请求到的数据已在已选择列表中则不再append进去，反之append
	              		$.each(res,function(i,n){
	              			//TODO ID是否在列表中
	              			if($.inArray(n.id+"",optionsVal)===-1){
	              				tempHtml += "<option value='"+n.id+"'>"+n.name+"</option>";
	                		}  
	                    });
	              	}else{
	              		$.each(res,function(i,n){
	              			tempHtml += "<option value='"+n.id+"'>"+n.name+"</option>";
	                    });
	              	}
	              	that.empty();
	              	that.append(tempHtml);    
                    //更新内容刷新到相应的位置
	              	that.selectpicker('render');
	              	that.selectpicker('refresh');
                }
           })
  	    }
     },700);
})

var searchName = hash.get("name");
var type = hash.get("type");

if(searchName != undefined){
    $(".load").show();
    if(type == "info"){
        search_content(searchName);
    }else {
        search_content(searchName);
    }
}

$("#search_btn").click(function(){

    $(".load").show();

    var showName = $("#searchBox").val();

    if(showName.trim() == ""){
    	toastr.warning("剧名不能为空!");
        return;
    }
    hash.add({name:showName});
    hash.add({type:"info"});
    search_content(showName);

});

function search_content(showName){
    $.ajax({
        type: 'GET',
        url: '/show/search?showName=' + showName,
        success: function (data) {
            sessionStorage.setItem("gd_show_list",data.data);
            
            var tbody = "";
            $("#info_div .table tbody").html(tbody);
            $.each(data.data,function(i,o){
                var tr = "<tr>" +
                    '<td><img style="height: 100px;" src = "'+ to_black(o.coverImgUrl)+'" /></td>'+
                    "<td>"+ o.name+"</td>"+
                    '<td data-value="'+ o.category+'">'+ getCategory(o.category)+'</td>'+
                    "<td>"+ to_black(o.director)+"</td>"+
                    "<td>"+ date_format(new Date(o.releaseDate),'yyyy-MM-dd')+"</td>"+
                    "<td>"+ o.platforms+"</td>"+
                    "<td>"+ to_black(o.duration)+"</td>"+
                    "<td>"+ to_black(o.episode)+"</td>"+

                    "<td>"+ to_black(o.type)+"</td>"+
                    "<td>"+ to_black(o.intro)+"</td>"+
                    "<td>"+ to_black(o.releaseStatus)+"</td>"+
                    // '<td><button id="edit_btn" data-value= "'+ o.id+'" class="btn btn-default" > 基本信息修改 </button></td>'+
                    '<td><button data-value= "'+ o.id+'" class="btn btn-info data_btn" tag='+i+'> 修 改 </button></td>'+
                    '<td><button data-value="'+o.name+'" class="btn btn-info timeLog_btn">分时查询</button></td>'+
                    '<td><button data-value="'+o.name+'" class="btn btn-info timeRepair_btn">分时修复</button></td>'+
                    "<td style='display: none' class='show_actors'>"+ to_black(o.actors)+"</td>"+
                    "</tr>";
                tbody += tr;
            });
            $("#info_div .table tbody").html(tbody);
            $(".load").hide();
            $("#add_bi_show_btn").show();
            $("#info_div").show();
            tableBtnEvent(data);
            /**跳转到分时查询、分时数据修复*/
            toTimeLogPage();
        },
        error:function () {

        }
    });
}

function toTimeLogPage() {
    /**分时查询*/
    $(".timeLog_btn").on("click",function(){
        var showName = $(this).attr("data-value");
        window.location.href = "/play_count/time#name="+showName;
    });

     /**分时数据修复*/
    $(".timeRepair_btn").on({
        click:function() {
            var showName = $(this).attr("data-value");
            window.location.href = "/play_count/repair#name="+showName;
        }
    });
}

function tableBtnEvent (data){
    $(".data_btn").on("click",function () {
        var showId = $(this).attr("data-value");
        var tag = $(this).attr("tag");
        data = data.data[tag];
        hash.add({type:"job"});
        $("#showId").val(showId);
        var category = data.category;
        showJobs(showId);
        showCompanyShowRelation(showId);
        initTaskCheck(showId,$("#csrf").val());
        showThemeTree(showId, category);
        getCheckedTags(showId);
        addSubmitShowThemeBtnListener(showId, category);
        var cover_img_url = $(this).parent().prev().prev().prev().prev().prev().prev().prev().prev().prev().prev().prev().children().attr("src");
        var name = $(this).parent().prev().prev().prev().prev().prev().prev().prev().prev().prev().prev().html();
        var category = $(this).parent().prev().prev().prev().prev().prev().prev().prev().prev().prev().attr("data-value");
        var director = $(this).parent().prev().prev().prev().prev().prev().prev().prev().prev().html();
        var release_date = $(this).parent().prev().prev().prev().prev().prev().prev().prev().html();
        var platforms = $(this).parent().prev().prev().prev().prev().prev().prev().html();
        var duration = $(this).parent().prev().prev().prev().prev().prev().html();
        var episode = $(this).parent().prev().prev().prev().prev().html();
        var type = $(this).parent().prev().prev().prev().html();
        var intro = $(this).parent().prev().prev().text();
        var releaseStatus = $(this).parent().prev().text();
        var actors = $(this).parent().parent().find('.show_actors').text();

        $("#release_date").val(release_date);
        $("#platforms").val(platforms);
        $("#category").val(category);
        $("#madeInSelf").val(data.madeInSelf);
        $("#adaptedStatus").val(to_black(data.adaptedStatus));
        $("#adaptedFrom").val(to_black(data.adaptedFrom));
        $("#adaptedWorksName").val(to_black(data.adaptedWorksName));
        $("#name").val(name);
        $("#id").val($(this).attr("data-value"));
        $("#intro").val(to_black(intro));
        $("#type").val(to_black(type));
        $("#duration").val(to_black(duration));
        $("#episode").val(to_black(episode));
        $("#cover_img_url_i").val(to_black(cover_img_url));
        $("#cover_img_url").attr("src",to_black(cover_img_url));
        $("#director").val(to_black(director));
        $("#release_status").val(to_black(releaseStatus));
        $("#actors").val(actors);
        
        $("#premiere_date").val(data.premiereDate?date_format(new Date(data.premiereDate),'yyyy-MM-dd'):"");
        $("#premiere_tv_station").val(to_black(data.premiereTvStation));
        $("#over_date").val(data.overDate?date_format(new Date(data.overDate),'yyyy-MM-dd'):"");
        $("#online_station").val(to_black(data.onlineStation));
        $("#script_writer").val(to_black(data.scriptWriter));
        $("#publisher").val(to_black(data.publisher));
        $("#executiveProducer").val(to_black(data.executiveProducer));
        $("#producer").val(to_black(data.producer));
        $("#offline_date").val(data.offlineDate?date_format(new Date(data.offlineDate),'yyyy-MM-dd'):"");

        $("#search_div").hide();
        $("#info_div").hide();
        $("#edit_div").show();
        $("#gd-main-body").show();//todo 只需用这一个div控制
        findShowActor(showId);

    });
}

/**
 * 初始化题材信息View
 */
function showThemeTree(showId, category) {
    var $checkableTree;
    var ttype = 0;
    if(category == 'TV_VARIETY' || category == 'NETWORK_VARIETY'){
    	ttype = 1;
    }else if(category == 'NETWORK_MOVIE'){
    	ttype = 2;
    }
    $.get("/show/themes", {showId: showId, type : ttype}, function (data) {
        $checkableTree = $('#treeview-checkable').treeview({
            data: data,
            showIcon: false,
            showCheckbox: true,
            onNodeChecked: function (event, node) {
                checkedTags.push(node.text);
                resetTagsOut(checkedTags);
            },
            onNodeUnchecked: function (event, node) {
                checkedTags.splice(checkedTags.indexOf(node.text),1);
                resetTagsOut(checkedTags);
            }
        });
    });
}

/**
 * 初始化已选择标签
 */
var checkedTags = [];
function getCheckedTags(showId) {
    $.get("/show/checkedTags",{showId: showId},function (data) {
        if (data.code == 0){
            checkedTags = data.data;
            resetTagsOut(checkedTags);
        }
    });
}

/**
 * 添加艺人提交标签按钮监听
 */
function addSubmitShowThemeBtnListener(showId, category) {
    $('#submitShowThemeBtn').on('click', function () {
        var themeList = $('#treeview-checkable').treeview('getChecked');
        var tid = [];
        for (var i = 0; i < themeList.length; i++) {
            tid.push(themeList[i].tagId);

        }
        $.post("/show/saveTheme",
            {
                tagIds: tid.join(","),
                showId: showId,
                _csrf: $('#csrf').val()

            },
            function (data) {
            if (data.code == 0){
                toastr.info(data.message);
            }else {
                toastr.error(data.message);
            }});
    });
}


/**
 * 绘制已选择标签
 * @param checkedTags
 */
function resetTagsOut(checkedTags) {
    $("#checkableOut").empty();
    var _html = [];
    for (var i = 0; i < checkedTags.length; i++){
        _html.push('<p>' + checkedTags[i] +'</p>')
    }
    $("#checkableOut").append(_html.join(''));
}


function showCompanyShowRelation(showId){
	var proCompanySelect = $("#product_company");
	var pubCompanySelect = $("#publish_company");
	var issuCompanySelect = $("#issu_company");
	$.ajax({
        type: 'GET',
        url: '/company/search/csrelation/' + showId,
        success: function (data) {
        	if(data.productCompany!=null&&data.productCompany.length>0){
        		var tempHtml = "";
        		$.each(data.productCompany,function(i,n){
        			tempHtml += "<option value='"+n.id+"' selected='true'>"+n.name+"</option>";
        		})
        		proCompanySelect.empty();
        		proCompanySelect.append(tempHtml);    
                //更新内容刷新到相应的位置
        		proCompanySelect.selectpicker('render');
        		proCompanySelect.selectpicker('refresh');
        	}
        	if(data.publishCompany!=null&&data.publishCompany.length>0){
        		var tempHtml = "";
        		$.each(data.publishCompany,function(i,n){
        			tempHtml += "<option value='"+n.id+"' selected='true'>"+n.name+"</option>";
        		})
        		pubCompanySelect.empty();
        		pubCompanySelect.append(tempHtml);    
                //更新内容刷新到相应的位置
        		pubCompanySelect.selectpicker('render');
        		pubCompanySelect.selectpicker('refresh');
        	}
        	if(data.issuCompany!=null&&data.issuCompany.length>0){
        		var tempHtml = "";
        		$.each(data.issuCompany,function(i,n){
        			tempHtml += "<option value='"+n.id+"' selected='true'>"+n.name+"</option>";
        		})
        		issuCompanySelect.empty();
        		issuCompanySelect.append(tempHtml);    
                //更新内容刷新到相应的位置
        		issuCompanySelect.selectpicker('render');
        		issuCompanySelect.selectpicker('refresh');
        	}
        },
        error:function () {

        }
    });
}

function showJobs(linkedId) {

    $("#search_div").hide();
    $("#info_div").hide();
    $("#edit_div").hide();
    $("#gd-main-body").hide();//todo 只需用这一个div控制
    $("#add_spider_div").show();
    $("#data_div").show();

    $.ajax({
        type: 'GET',
        url: '/show/jobs?linkedId=' + linkedId,
        success: function (data) {
        	var tbody = "";
        	if(data.code == 0){
        		for(var key in data.data){
        			if(key==='tiebaAlias'){
        				var alias = data.data[key][0];
        				if(alias!==undefined&&alias!=null){
        					var div = "<div class='col-md-4 column'><img src='/img/tieba.png'/></div>"
        						+"<div id='tieba_alias' class='col-md-6 column'><a href='javascript:;' data-pk='"+alias.id+"' data-name='alias'>"+alias.alias+"</a></div>"
        						+"<div class='col-md-2 column'><a target='_blank' href='https://tieba.baidu.com/f?ie=utf-8&kw="+alias.alias+"'><span class='glyphicon glyphicon-link' style='color: rgb(70, 60, 43);'></span></a></div>"
        						$("#edit_alias").html(div);
        					InitAliasEditEvent();
        					$("#data_div .panel-footer").show();
        				}
        			}else{
        				var platform = key;
        				var url;
        				try{
        					url = data.data[key][0].url;
        				}catch (err){
        					toastr.error("可能是网络问题,任务信息没有加载到,请稍后重试");
        					return;
        				}
        				
        				var tr = '<tr>' +
        				'<td>'+platform+'</td>' +
        				'<td><a href="'+url+'" target="_blank">'+url+'</a></td>' +
        				'<td width="10"></td>' +
        				'</tr>';
        				tbody += tr;
        			}
                }
        	}else{
        		toastr.error(data.msg);
            }
            $("#data_div tbody").html(tbody);
        },
        error:function () {
        	toastr.error("任务加载失败");
            $("#data_div").hide();
        }
    });
}

var InitAliasEditEvent = function(){
	$("#tieba_alias a").editable({
        url: '/alias/updateone',
        params: function(params) {
            params.id = params.pk;
            params[params.name] = params.value;
            params._csrf = $('#csrf').val();
            return params;
        },
        validate: function(value) {
            if($.trim(value) == '') {
                return '不能为空';
            }
        },
        success: function(response, newValue) {
        	if(response.code==0){
        		$("#edit_alias a:eq(1)").attr("href","https://tieba.baidu.com/f?ie=utf-8&kw="+newValue)
        	}else{
        		toastr.error(response.msg);
        	}
        }
    });
}

/**
 * 添加url
 */
$("#add_btn").click(function () {
	
    $("#add_btn").attr({"disabled":"disabled"});

    var showId = $("#showId").val();
    var url = encodeURIComponent($("#url").val());
    if(showId == "" || url.trim() == ""){
    	toastr.warning("必要参数不能为空!");
        $("#add_btn").removeAttr("disabled");
        return;
    }

    $.ajax({
        type: 'GET',
        url: '/show/add_url',
        data:{showId:showId,url:url},
        success: function (data) {

            if(data.code == 0){

                var tr = '<tr><td>'+data.data+'</td><td>'+url+' </td></tr>';

                $("#data_div tbody").after(tr);

                $("#add_btn").removeAttr("disabled");
                $("#url").val("");

            }else{
            	if(data.extra!=null&&data.extra.example!=null){
            		if(confirm(data.msg)){
            			var s = "<div><p style='color:red;'>您录入的Url :"+$("#url").val()+"</p></div><table style='width:100%;' border='1'><tr><td style='width:10%;'>任务</td><td style='width:20%;'>任务范围</td><td>模版url</td></tr>";
            			$.each(data.extra.example,function(i,o){
            				s += "<tr><td style='width:10%;'>"+o.desc+"</td><td style='width:20%;word-break:break-all;white-space:normal;'>"+o.range+"</td><td style='word-break:break-all;white-space:normal;text-align:left;'><a href="+o.exampleUrl+">"+o.exampleUrl+"</a></td></tr>";
            			})
            			s += "</table>";
            			$("#exampleUrlBody").html(s);
            			$("#exampleUrl").modal('show');
            		}
            	}else{
            		toastr.error(data.msg)
            	}
                $("#add_btn").removeAttr("disabled");
            }
        },error:function () {
        	toastr.error("添加任务请求发生异常!");
        }
    });
});


$("#data_div tbody td a").on("click",function () {
	toastr.info($(this).next().html());
});


$("#add_bi_show_btn").click(function () {
    window.location.href = "/show/add";
});



$("#release_date,#offline_date,#premiere_date,#over_date").datetimepicker({
    format: 'yyyy-mm-dd',
    autoclose: true,
    todayBtn: true,
    keyboardNavigation:true,
    language:'cn',minView:2
});

/***
 * 文件上传
 */
+(function () {

    var FileInput = function () {
        var oFile = new Object();
        //初始化fileinput控件（第一次初始化）
        oFile.Init = function (ctrlName, uploadUrl) {
            var $file = $('#' + ctrlName);
            //初始化上传控件的样式
            $file.fileinput({
                language: 'zh', //设置语言
                uploadUrl: uploadUrl, //上传的地址
                allowedFileExtensions: ['jpg', 'gif', 'png', 'jpeg'],//接收的文件后缀
                showUpload: true, //是否显示上传按钮
                showCaption: false,//是否显示标题
                browseClass: "btn btn-primary", //按钮样式
                //dropZoneEnabled: false,//是否显示拖拽区域
                //minImageWidth: 50, //图片的最小宽度
                //minImageHeight: 50,//图片的最小高度
                //maxImageWidth: 1000,//图片的最大宽度
                //maxImageHeight: 1000,//图片的最大高度
                //maxFileSize: 0,//单位为kb，如果为0表示不限制文件大小
                //minFileCount: 0,
                maxFileCount: 10, //表示允许同时上传的最大文件个数
                enctype: 'multipart/form-data',
                validateInitialCount: true,
                previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
                msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
            });
            //导入文件上传完成之后的事件
            $file.on("fileuploaded", function (event, data, previewId, index) {

                if (data == undefined) {
                	toastr.error("上传未知错误，请联系枫博");
                    return;
                }
                var url = data.response.url
                $("#cover_img_url_i").val(url);
                $("#cover_img_url").attr("src",url);
                if(url.indexOf("http://") == -1){//错误
                	toastr.error("error！"+url);
                }else {
                    //alert("上传成功！");
                    console.info("上传成功！")
                    $("#fileModal").modal("hide");
                }
            });
        }
        return oFile;
    };

    var oFileInput = new FileInput();
    oFileInput.Init("gd-file", "/parameterUpload?_csrf=" + $('#csrf').val());
})();

var initTaskCheck = function (sid,csrf){
    "use strict";

    var task = {
        class : {
            uncheck:'label label-default',
            check:'label label-success'
        },
        status : {
            none : 2,
            exist : 1,
            init : 0
        },
        platform : {
            12 : '豆瓣',
            17 : '微博',
            18 : '贴吧'
        }
    };

    var saveRSP = function (sid,pid,status,fn){
        $.post('/rsp/add',{sid:sid,pid:pid,status:status,_csrf:csrf},function(response){
            if ( 'function' === typeof fn){
                fn(response);
            }
        });
    }

    var getRSP = function (sid,fn){
        $.getJSON('/rsp/getbysid/'+sid,{},function(response){
            if ( 'function' === typeof fn){
                fn(response);
            }
        });
    }

    var buidTr = function (rss) {
        return function (){
            return '<tr data-toggle="tooltip" data-placement="top" title="'+rss.platformCn+'">'
                +'    <td>'+(undefined !== task.platform[rss.pid]?task.platform[rss.pid]:rss.platformEn)+'</td>'
                +'    <td gd-sid="'+rss.sid+'" gd-pid="'+rss.pid+'">'
                +'        <span class="'+(rss.statusEn === "init"?task.class.check:task.class.uncheck)+'" gd-status="init" style="cursor: pointer">init</span>'
                +'        <span class="'+(rss.statusEn === "exist"?task.class.check:task.class.uncheck)+'" gd-status="exist" style="cursor: pointer">exist</span>'
                +'        <span class="'+(rss.statusEn === "none"?task.class.check:task.class.uncheck)+'" gd-status="none" style="cursor: pointer">none</span>'
                +'    </td>'
                +'</tr>';
        }();
    }

    var initEvent = function () {
        $('table.gd-check-task').find('td').find('span').on('click',function(){
            var $span = $(this),
                _calss = $span.attr("class"),
                sid = $span.parent('td').attr("gd-sid"),
                pid = $span.parent('td').attr("gd-pid"),
                status = $span.attr("gd-status");
            if (status === task.status.enter) {
            }
            saveRSP(sid,pid,task.status[status],function(data){
                if (data != null) {
                    $span.siblings().removeClass().addClass(task.class.uncheck);
                    $span.addClass(task.class.check);
                } else {
                	toastr.error("fail!");
                }
            })
        })
    }

    $.when (
        getRSP(sid,function (data){
            if (data != null) {
                var trs = "";
                $.each(data,function(i,item){
                    trs = trs + buidTr(item);
                })
                $(".gd-check-task tr:first").nextAll().remove();
                $(".gd-check-task").append(trs);
                initEvent();
            } else {
            	toastr.error("error buidPage!");
            }
        })
    ).done (
        console.info("init table success")
    );
};

function findShowActor(showId) {

    $.ajax({
        type: 'GET',
        url: '/actor/show/relation',
        data: {showId: showId},
        success: function (data) {

            var html = "";
            var sortHtml = "";
            $.each(data.data, function (i, o) {

                html += "<tr>" +
                    "<td>"+o.sequence+"</td>" +
                    "<td>"+o.actorName+"</td>" +
                    "<td>"+o.roles+"</td>" +
                    "<td><select class='form-control'>" +
                    "   <option " + ( o.category == "GENERAL" ? "selected=\"selected\"": "" ) + " value='GENERAL'>一般演员</option>" +
                    "   <option "+ ( o.category == "HERO" ? "selected=\"selected\"": "" ) + " value='HERO'>男一号</option>" +
                    "   <option "+ ( o.category == "HEROINE" ? "selected=\"selected\"": "" ) + " value='HEROINE'>女一号</option>" +
                    "   <option "+ ( o.category == "LEAD_ACTOR" ? "selected=\"selected\"": "" ) + " value='LEAD_ACTOR'>主要演员</option>" +
                    "</select></td>" +
                    "<td><button id='' class='btn-default btn show_platform_edit' data-value='"+o.id+"'>修改</button></td>" +
                    "</tr>";

                sortHtml += "<li data-id='" + o.id + "' >" + o.actorName + "</li>"
            });
            $(".gd-actor-task").append(html);

        }
    });
}

$(".gd-actor-task ").on( "click", ".show_platform_edit", function () {
    var id = $(this).attr("data-value");
    var category = $(this).parent().parent().find("option:selected").val();
    $.ajax({
        type: 'GET',
        url: '/actor/show/relation/edit',
        data: {id: id, category: category},
        success: function (data) {
            if(data == ""){
                alert("修改成功!");
            } else {
                alert(data.msg);
            }
        }
    });
});


(function(){
    $.extend({
        Vaild : function(_this){
            if ($(_this).data("require") === 'require'){
                $(_this).popover("destroy");
                if (!$(_this).val().trim()){
                    $(_this).parent().addClass("has-error").removeClass("has-success");
                    $(_this).data("toogle", "top").data("placement", "top").data("container", "body").data("content", "该项必填!").popover({"trigger":"manual"}).popover("show");
                    $(_this).focus();
                    return false;
                } if( !!$(_this).data("vaild")){
                    $(_this).popover("destroy");
                    var pattern = new RegExp($(_this).data("vaild"));
                    if( pattern.test( $(_this).val() ) ){
                        $(_this).parent().removeClass("has-error").addClass("has-success");
                        $(_this).popover("destroy");
                    }else{
                        $(_this).parent().addClass("has-error").removeClass("has-success");
                        $(_this).data("toogle", "top").data("placement", "top").data("container", "body").data("content", $(_this).data("errmsg")).popover({"trigger":"manual"}).popover("show");
                        $(_this).focus();
                        return false;
                    }
                }else{
                    $(_this).parent().removeClass("has-error").addClass("has-success");
                }
            } else {
                $(_this).popover("destroy");
                if( !!$(_this).data("vaild") && !!$(_this).val().trim()){
                    var pattern = new RegExp($(_this).data("vaild"));
                    if( pattern.test( $(_this).val() ) ){
                        $(_this).parent().removeClass("has-error").addClass("has-success");
                        $(_this).popover("destroy");
                    }else{
                        $(_this).parent().addClass("has-error").removeClass("has-success");
                        $(_this).data("toogle", "top").data("placement", "top").data("container", "body").data("content", $(_this).data("errmsg")).popover({"trigger":"manual"}).popover("show");
                        $(_this).focus();
                        return false;
                    }
                }else{
                    $(_this).parent().removeClass("has-error").addClass("has-success");
                }

            /*if( !!$(_this).data("vaild")){
                var pattern = new RegExp($(_this).data("vaild"));
                if( pattern.test( $(_this).val() ) ){
                    $(_this).parent().removeClass("has-error").addClass("has-success");
                    $(_this).popover("destroy");
                }else{
                    $(_this).parent().addClass("has-error").removeClass("has-success");
                    $(_this).data("toogle", "top").data("placement", "top").data("container", "body").data("content", $(_this).data("errmsg")).popover({"trigger":"manual"}).popover("show");
                    $(_this).focus();
                    return false;
                }
            }else{
                $(_this).parent().addClass("has-success");
            }*/
            return true;
            }
        }
    });
    $.fn.extend({
        Vaild : function(){
            $(this).each(function(index, _this){
                $(_this).submit(function(){
                    var checkResult = true;
                    for(var i = 0 ; i < _this.length; i++ ){
                        checkResult = $.Vaild(_this[i]) && checkResult;
                    }
                    return checkResult;
                });
                for(var i = 0 ; i < _this.length; i++ ){
                    $(_this[i]).blur(function(){
                        $.Vaild(this);
                    });
                }
            });
        }
    });

    $("form").Vaild();
}());