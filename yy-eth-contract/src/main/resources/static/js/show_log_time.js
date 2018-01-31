/**
 * Created by yangtao on 16/7/20.
 */

$(".alert").hide();

$("#search").click(function () {
    var showId = $("#showIdValue").val();
    var showName = $("#name").val();
    var startDate = $("#startDate").val();
    var endDate = $("#endDate").val();
    if(!startDate||!endDate){
    	toastr.warning("日期不能为空");
    	return;
    }
    if(!showId){
        toastr.error("未找到剧名为 ["+showName+"] 的相关信息，请输入全名");
        return;
    }
    $.ajax({
        type:'GET',
        url:'/play_count/times?showId='+showId+'&startDate='+startDate+'&endDate='+endDate,
        success:function(data){
            if(data.code==0){
                var html = "";
                for(var key in data.data){
                    var d = data.data[key];

                    $.each(d,function (j, n) {
                        if(j == 0){
                            html +='<div class="col-md-3"><table class="table table-striped" style="text-align:center"><thead><tr ><td colspan="2">'+ key +'</td></tr></thead><tbody><tr><td>播放量</td><td>抓取时间</td></tr>';
                        }
                        html+='<td>'+ (n.playCount == null ? "" : n.playCount) +'</td>';
                        html+='<td class="crawled_at">'+ FormatDate(new Date(n.crawledAt))+'</td>';
                        html+='</tr>';
                    });
                    html+='</tbody></table></div>';

                }

                $("#data").html(html);
            }else{
                toastr.error(data.msg);
            }
        }
    });
});

$(".crawled_at").live("click",function () {
    var html = "";
    var total_pc = 0;
    var click_crawled_at = $(this).text();
    $.each($("#data table"),function (i, table) {
        var platform_name = $(table).find("thead").text();
        $.each($(table).find("tr"),function (i, tr) {
            var crawled_at = $(tr).find(".crawled_at").text();

            if(click_crawled_at == crawled_at){
                var play_count = $(tr).find("td:first").text();
                html += platform_name + ": " +  play_count + "  ";
                total_pc += Number(play_count);
            }
            // console.log($(tr).text());
        });
    });
    html += " 合计:" + total_pc;
    $(".alert").html(html);
    $(".alert").show();
});


function FormatDate (date) {
    return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes();
}

$(".validateName").on({
    blur: function(){
    	getShowByName2();
    }
});

function getShowByName2() {
    var $this = $(".validateName");
    var name = $this.val().trim();
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
                    array.push('<span class="showType">' + value.category + '</span>&nbsp;&nbsp;&nbsp;&nbsp;');
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
                $("#showIdValue").val(idText);
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
			$("#showIdValue").val(idText);
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

