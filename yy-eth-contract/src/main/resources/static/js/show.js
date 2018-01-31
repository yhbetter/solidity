
var show_name = hash.get("name");

if(show_name != "" && show_name != undefined){
    getShow(show_name);
}

$("#search").click(function () {
    var show_name = $("#show_name").val();
    if(show_name==""){
        alert("剧名不能为空");
        return;
    }
    getShow(show_name);
    hash.add({name:show_name});
});

$("#main_table button").live("click", function () {

    var code = $(this).attr("data-value");
    if(code != "" && code != undefined){
    	offline(code);
    }

});

function offline(code) {

    $.ajax({
        type: 'GET',
        url: '/dhshow/offline?code=' + code,
        success: function (data) {
            if("SUCCESS" == data){
                window.location.reload();
            }else{
            	alert(data);
            }
        }
    });
    
}

function getShow(name) {
    $.ajax({
        type:'GET',
        url:'/dhshow/list?name=' + name,
        success:function(data){

            if(data==""||data==null||data==undefined){
                alert("无此剧信息");
                return;
            }

            var html = "<tr><td>名称</td><td> 平台 </td> <td>标记删除</td> </tr>";

            $.each(data, function (i, o) {

                var del_html = "";

                if(o.deleted){
                    del_html = "<button class='btn btn-danger'>已删除</button>";
                }else {
                    del_html = "<button class='btn btn-default' data-value='" + o.code + "'>点击删除</button>";
                }

                html += "<tr> <td><a href='"+o.url+"' target='_blank'>"+o.name+"</a></td> <td>" + o.platform_name + "</td> <td>"+del_html+"</td> </tr>";
                
            });

            $("#main_table").html(html);
            
        }

    });
}
