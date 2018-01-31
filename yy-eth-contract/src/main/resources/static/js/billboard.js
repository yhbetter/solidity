
//默认选中日播与网络剧
$("#type_ul li:eq(0)").addClass("type_ul_active").addClass("color","white");

$("#category_ul li:eq(0)").addClass("category_ul_active");




var day = date_format(new Date(new Date().getTime() -24*60*60*1000),"yyyy-MM-dd");
$("#day").val(day);

var type = "inc";
var category = "NETWORK_DRAMA";

get_billboard();

$("#type_ul li").click(function () {
    $(this).siblings().removeClass("type_ul_active");
    $(this).addClass("type_ul_active");
    type = $(this).attr("data-value");
    console.log(type);
    get_billboard();
});

$("#category_ul li").click(function () {
    $(this).siblings().removeClass("category_ul_active");
    $(this).addClass("category_ul_active");
    category = $(this).attr("data-value");
    console.log(category);
    get_billboard();
});

$("#day").change(function () {
    day = $("#day").val();
    get_billboard();
});


function get_billboard(){

    // return;

    if(day == "" || category == "" || type == ""){
        alert("请补全搜索参数");
        return;
    }

    $.ajax({
        type: 'GET',
        url: '/play_count/search',
        data:{day:day,category:category,type:type},
        success: function (data) {

            var html = "";
            $(".table tbody").html(html);

            $.each(data,function(i,o){

                rise_url = "/img/equals.png";
                if(Number(o.rise) > 0){
                    rise_url = "/img/up.png";
                }else if(Number(o.rise) < 0){
                    rise_url = "/img/down.png";
                }

                var tr = '<tr>' +
                    '<td><span class="order">'+ (Number(o.ordinal) < 10 ? "0":"")+ o.ordinal+'</span></td>'+
                    '<td><img style="width: 12px;height: 12px;" src="'+rise_url+'">'+( Math.abs(Number(o.rise)) == 0 ? "" : Math.abs(Number(o.rise)) )+'</td>'+
                    '<td>'+ o.name+'</td>' +
                    '<td><img style="width: 25px;height: 25px;" src="'+ o.platformImgUrl+'"/></td>' +
                    '<td>'+ o.counter+'</td>' +
                    '<td><a data-value="'+ o.id+'" class="del" style="display: none;">x</a></td>' +
                    '</tr>';
                html += tr;
            });
            if(html != ''){
                html += "<tr><td colspan='6'><button class='add_new_billboard_item'>添  加</button></td></tr>";
                $(".table tbody").html(html);
                $("#billboard_div").show();
            }

        },
        error: function() {
            console.log("error");
        }
    });
};

$(".del").live("click",function () {
    var id = $(this).attr("data-value");
    BootstrapDialog.show({
        message: '您确认要删除该榜单项吗?',
        buttons: [{
            label: '确定',
            cssClass: 'btn-primary',
            action: function(dialogItself){
                //确认进行删除
                $.ajax({
                    type:"GET",
                    url:"/billboard/del/"+type+"/"+id,
                    success:function (data) {
                        if(data.code==0){
                        	dialogItself.close();
                        	get_billboard();
                        	setTimeout(function(){
                        		if(confirm("是否从临时榜单中选择一项补充进正式榜单?")){
                            		var s = "<div><h2>"+day+" 临时榜单</h2></div><table style='width:100%;' border='1'><tr><td>排名</td><td>名称</td><td>播放量</td><td>操作</td></tr>";
                        			$.each(data.data,function(i,o){
                        				s += "<tr id='tb_"+o.id+"'><td>"+o.ordinal+"</td><td>"+o.name+"</td><td>"+o.playCount+"</td><td><span class='label label-success' onclick='put_away("+ o.id + ")'>上榜</span></td></tr>";
                        			})
                        			s += "</table>";
                        			$("#billboardReplenishBody").html(s);
                        			$("#billboardReplenishBody td").attr("style","text-align:center;line-height:2em;")
                        			$("#billboard-replenish").modal('show');
                            	}
                        	},200)
                        }else {
                            toastr.error(data.msg);
                        }
                    },
                    error:function () {
                        console.log("error");
                    }
                });
                
            }
        }, {
            label: '取消',
            action: function(dialogItself){
                dialogItself.close();
            }
        }]
    });

});

$("#allow_del").click(function () {
    $(".del").show();
});

$(".add_new_billboard_item").live("click",function () {
    BootstrapDialog.show({
        title:"添加",
        message: '名称:<input id="pc_name" type="text" class="form-control" />播放量:<input id="pc_count" type="text" class="form-control" /><button class="btn-default" id="post_item"> 提 交 </button>'

    });
});

$(".bootstrap-dialog-body #post_item").live("click",function () {
    var name = $(".bootstrap-dialog-body #pc_name").val();
    var pc = $(".bootstrap-dialog-body #pc_count").val();
    add_item_requeset(name,pc,".bootstrap-dialog");
});

function put_away(id){
	if(id){
		var name = $("#tb_"+id+" td:eq(1)").text();
		var pc = $("#tb_"+id+" td:eq(2)").text();
		if(confirm("是否将 ->["+name+"] ->播放量:["+pc+"] 补充进正式式榜单?")){
			add_item_requeset(name,pc,"#billboard-replenish");
		}
	}else{
		toastr.warning("id不能为空");
	}
}

function add_item_requeset(name,pc,handleModal){
	if(name&&pc&&handleModal){
		$.ajax({
	        type:"GET",
	        url:"/billboard/item",
	        data:{type:type, category:category, name:name, count:pc, day:day},
	        success:function (data) {
	            if(data.code==0){
	            	$(handleModal).modal("hide");
	                toastr.success("添加成功");
	                get_billboard();
	            }else{
	            	toastr.error(data.msg);
	            }
	        },
	        error:function () {

	        }
	    });
	}else{
		toastr.warning("剧名或播放量不能为空");
	}
}



