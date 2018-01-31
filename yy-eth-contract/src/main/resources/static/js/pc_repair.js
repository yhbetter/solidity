$("#search").click(function () {

    var showId = $("#showIdValue").val();
    var start_day = $("#start_day").val();
    var end_day = $("#end_day").val();
    if(!start_day){
    	alert("日期不能为空");
    	return;
    }
    $.ajax({
        type:'GET',
        url:'/play_count/times?showId='+showId+'&startDate='+start_day+'&endDate='+end_day,
        success:function(data){
            var html = "";
            for(var key in data.data) {
                html +=
                    '<div class="col-md-4">' +
                    '<table class="table">' +
                    '<thead>' +
                    '<tr>' +
                    '<td colspan="3">' + key + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td width="60">日期</td>' +
                    '<td>播放量</td>' +
                    '<td>操作</td>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>' +
                    '<tr>';

                var d = data.data[key];

                $.each(d, function (j, n) {

                    html +=
                        '<td>' + FormatDate(new Date(n.crawledAt)) + '</td>' +
                        '<td>' +
                        '<input type="text" class="form-control" value="' + (n.playCount == null ? "" : n.playCount) + '" />' +
                        '<input type="hidden" name="show_id" value="' + n.showId + '" />' +
                        '<input type="hidden" name="platform_id" value="' + n.platformId + '" />' +
                        '<input type="hidden" name="crawled_at" value="' + n.crawledAt + '" />' +
                        '<input type="hidden" name="category" value="' + n.category + '" />' +
                        '</td>' +
                        '<td><button class="btn btn-default" data-value="' + n.id + '">更新</button></td>' +
                        '</tr>';

                });
                html +=
                    '</tbody>' +
                    '</table>' +
                    '</div>';
            }

            $("#data").html(html);
        },
        error: function(XMLHttpRequest) {
            alert(XMLHttpRequest.status);
        }
    });
});

//调用lol的播放量修复接口
$("#autorepair").click(function () {

    var showId = $("#showIdValue").val();
    var category = $("#showCategoryValue").val();
    var day = $("#day").val();
    if(!day){
    	alert("日期不能为空");
    	return;
    }
    if(!category){
    	alert("未获取到该剧类别,无法维护~")
    	return;
    }
    if(confirm("确认要执行该操作?  --- (ps:非技术人员勿点)")){
    	$.ajax({
            type:'GET',
            url:'/play_count/autorepair?category='+category+'&showId='+showId+'&day='+day,
            success:function(data){
            	if("SUCCESS" == data){
                    BootstrapDialog.alert("一键修复操作已执行,请查询刷新");
                }else{
                	BootstrapDialog.alert(data);
                }
            },
            error: function(XMLHttpRequest) {
                alert(XMLHttpRequest.status);
            }
        });
    }
});

$("#data button").live("click",function () {
    var $inputs = $(this).parent().prev().children();
    var playCount = $($inputs[0]).val();
    var showId = $($inputs[1]).val();
    var platformId = $($inputs[2]).val();
    var crawledAt = $($inputs[3]).val();
    var category = $($inputs[4]).val();
    if(playCount.trim() == ""){
        alert("干啥呢");
        return;
    }

    $.ajax({
        type: 'GET',
        url: '/play_count/modify',
        // contentType: "application/json",
        data: {playCount:playCount,showId:showId,platformId:platformId,crawledAt:crawledAt,category:category},
        success: function (data) {
            if(data.code==0&&data.data=="SUCCESS"){
                BootstrapDialog.alert("更新成功");
            }else{
                alert(data.msg);
            }
        }
    });

});


function FormatDate (date) {
    return date.getHours()+":"+date.getMinutes();
}

//created by gsw 2017年2月8日17:50:45
$(".validateName").on({
    blur: function(){
    	getShowByName2()
    }
});

function getShowByName2() {
    var $this = $(".validateName");
    var name = $this.val();
    $.ajax({
        type: 'GET',
        url: '/play_count/getShowByName2',
        data: {name: name},
        success: function (data) {
            if (data.data!=null && data.data!=undefined) {
                if(data.data=='SUCCESS') {
                        return;
                }
                $('.mymodal').empty();
                var jsonData = data.data;
                var html = '';
                $.each(jsonData, function (key, value) {
                    var array = [];
                    array.push('<div class="radio">');
                    array.push('<label>');
                    array.push('<input type="radio" name="radiosName" class="optionsRadios"  value="' + value.id + '"/>&nbsp;&nbsp;&nbsp;&nbsp;');
                    array.push('<span class="showName">' + value.name + '</span>&nbsp;&nbsp;&nbsp;&nbsp;');
                    array.push('<span id="showType'+value.id+'">' + value.category + '</span>&nbsp;&nbsp;&nbsp;&nbsp;');
                    array.push('<span>' + value.platforms + '</span>&nbsp;&nbsp;&nbsp;&nbsp;');
                    array.push('<span>' + value.director + '</span>');
                    array.push('</label>');
                    array.push('</div>');

                    html += array.join("");
                });
                $('#mymodal').append(html);
                getIdValue();
                $('#myModal').modal();
            }else if(data.dataOne!=null && data.dataOne!=undefined) {
                var jsonData = data.dataOne;
                var idText = jsonData[0].id;
                var category = jsonData[0].category;
                $("#showIdValue").val(idText);
                $("#showCategoryValue").val(category);
            }
        }, error: function () {
            alert("请求失败!");
        }
    });
}

//点击模态框获取对应的值
var getIdValue=function(){
    $(".optionsRadios").on({
        click:function(){
            var $this  =$(this);
            var idText = $this.val();
            var category = $("#showType"+idText).text();
            $("#showIdValue").val(idText);
            $("#showCategoryValue").val(category)
        }
    });
}

$(function(){
    //获取当前URL中的参数值
    var name=hash.get("name");
    if(''!=name &&undefined!=name &&""!=name) {
        $("#name").val(name);
        getShowByName2();
    }
});

