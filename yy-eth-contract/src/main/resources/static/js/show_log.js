/**
 * Created by yangtao on 16/7/20.
 */

$("#search").click(function () {

    var code = $("#code_text").val().trim();

    $.ajax({
        type:'GET',
        url:'/show/spider/info?name='+code,
        success:function(data){
        	if(data.code==0){
        		var html = "";
        		var t_total = 0;
        		var y_total = 0;
        		html +='<table class="table table-striped"><tbody><tr><td>名称</td><td>code</td><td>分类</td><td>上线时间</td><td>平台名称</td><td>增量</td><td>今日</td><td>昨日</td></tr>';
        		$.each(JSON.parse(data.data),function(i,o){
        			html+='<tr><td>'+ o.name+'</td>';
        			html+='<td>'+ o.code+'</td>';
        			html+='<td>'+ o.category+'</td>';
        			html+='<td>'+ o.release_date+'</td>';
        			html+='<td>'+ o.platform_name+'</td>';
        			html+='<td>'+ o.daily+'</td>';
        			html+='<td>'+ o.t_show_log+'</td>';
        			html+='<td>'+ o.y_show_log+'</td>';
        			html+='</tr>';
        			t_total += Number(o.t_play_count);
        			y_total += Number(o.y_play_count);
        		});
        		html+='<tr><td></td><td></td><td></td><td></td><td></td><td>'+(t_total - y_total)+'</td><td>'+t_total+'</td><td>'+y_total+'</td></tr>';
        		html+='</tbody></table>';
        		$("#data").html(html);
        	}else{
        		toastr.error(data.msg);
        	}
        },
        error: function(XMLHttpRequest) {
            alert(XMLHttpRequest.status);
        }
    });
});

function FormatDate (date) {
    return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes();
}
