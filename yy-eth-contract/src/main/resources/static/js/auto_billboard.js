
var day = "";
var tab = "NETWORK_DRAMA";
var is_load_billboard = false;

if(hash.get("tab") != "" && hash.get("tab") != undefined){
    tab = hash.get("tab");
    hash.add({tab:tab});
    $('#content_list a[href="#'+tab+'"]').tab('show');
}else {
    hash.add({tab:tab});
}

$("#content_list .nav-tabs li a").click(function () {
    var category = $(this).attr("data-value");
    hash.add({tab:category});

});

if(hash.get("day") != "" && hash.get("day") != undefined){
    day = hash.get("day");
    $("#on_show_date").val(day);
    load_billboard(day);
}

$("#search_btn").click(function(){
    day = $("#on_show_date").val();
    hash.add({day:day});

    load_billboard(day);

});

function load_billboard(day) {


    $.ajax({
        type: 'GET',
        url: '/play_count/auto/'+day,
        success: function (data) {

            var total = data.TOTAL;
            var inc = data.INC;

            if(total.NETWORK_MOVIE != undefined){
                var total_network_movie = "";
                $.each(total.NETWORK_MOVIE,function(i,o){
                    var tr = "<tr><td>"+ (i+1)+"</td><td width='10'>"+ o.name+"</td><td >"+ o.playCount+"</td><td><a href='javascript:void(0)'  data-value='"+o.id+"'  >del</a> </td></tr>";
                    total_network_movie += tr;
                });
                $("#total_network_movie_table tbody").html(total_network_movie);
            }

            if(total.NETWORK_DRAMA != undefined){
                var total_network_drama = "";
                $.each(total.NETWORK_DRAMA,function(i,o){
                    var tr = "<tr><td>"+ (i+1)+"</td><td>"+ o.name+"</td><td>"+ o.playCount+"</td><td><a href='javascript:void(0)'  data-value='"+o.id+"'  >del</a> </td></tr>";
                    total_network_drama += tr;
                });
                $("#total_network_drama_table tbody").html(total_network_drama);
            }

            if(total.NETWORK_VARIETY != undefined){
                var total_network_zongyi = "";
                $.each(total.NETWORK_VARIETY,function(i,o){
                    var tr = "<tr><td>"+ (i+1)+"</td><td>"+ o.name+"</td><td>"+ o.playCount+"</td><td><a href='javascript:void(0)'  data-value='"+o.id+"'  >del</a> </td></tr>";
                    total_network_zongyi += tr;
                });
                $("#total_network_zongyi_table tbody").html(total_network_zongyi);
            }

            if(total.TV_DRAMA != undefined){
                var total_tv_drama = "";
                $.each(total.TV_DRAMA,function(i,o){
                    var tr = "<tr><td>"+ (i+1)+"</td><td>"+ o.name+"</td><td>"+ o.playCount+"</td><td><a href='javascript:void(0)'  data-value='"+o.id+"'  >del</a> </td></tr>";
                    total_tv_drama += tr;
                });
                $("#total_tv_drama_table tbody").html(total_tv_drama);
            }

            if(total.TV_VARIETY != undefined){
                var total_tv_zongyi = "";
                $.each(total.TV_VARIETY,function(i,o){
                    var tr = "<tr><td>"+ (i+1)+"</td><td>"+ o.name+"</td><td>"+ o.playCount+"</td><td><a href='javascript:void(0)'  data-value='"+o.id+"'  >del</a> </td></tr>";
                    total_tv_zongyi += tr;
                });
                $("#total_tv_zongyi_table tbody").html(total_tv_zongyi);
            }

            if(total.ANIME != undefined){
                var total_anime = "";
                $.each(total.ANIME,function(i,o){
                    var tr = "<tr><td>"+ (i+1)+"</td><td>"+ o.name+"</td><td>"+ o.playCount+"</td><td><a href='javascript:void(0)'  data-value='"+o.id+"'  >del</a> </td></tr>";
                    total_anime += tr;
                });
                $("#total_anime_table tbody").html(total_anime);
            }
            if(total.MOVIE != undefined){
                            var total_movie = "";
                            $.each(total.MOVIE,function(i,o){
                                var tr = "<tr><td>"+ (i+1)+"</td><td>"+ o.name+"</td><td>"+ o.playCount+"</td><td><a href='javascript:void(0)'  data-value='"+o.id+"'  >del</a> </td></tr>";
                                total_movie += tr;
                            });
                            $("#total_movie_table tbody").html(total_movie);
                        }




            if(inc.NETWORK_MOVIE != undefined){
                var inc_network_movie = "";
                $.each(inc.NETWORK_MOVIE,function(i,o){
                    var tr = "<tr><td>"+ (i+1)+"</td><td>"+ o.name+"</td><td>"+ o.playCount+"</td><td><a href='javascript:void(0)'  data-value='"+o.id+"'  >del</a> </td></tr>";
                    inc_network_movie += tr;
                });
                $("#inc_network_movie_table tbody").html(inc_network_movie);
            }

            if(inc.NETWORK_DRAMA != undefined){
                var inc_network_drama = "";
                $.each(inc.NETWORK_DRAMA,function(i,o){
                    var tr = "<tr><td>"+ (i+1)+"</td><td>"+ o.name+"</td><td>"+ o.playCount+"</td><td><a href='javascript:void(0)'  data-value='"+o.id+"'  >del</a> </td></tr>";
                    inc_network_drama += tr;
                });
                $("#inc_network_drama_table tbody").html(inc_network_drama);
            }

            if(inc.NETWORK_VARIETY != undefined){
                var inc_network_zongyi = "";
                $.each(inc.NETWORK_VARIETY,function(i,o){
                    var tr = "<tr><td>"+ (i+1)+"</td><td>"+ o.name+"</td><td>"+ o.playCount+"</td><td><a href='javascript:void(0)'  data-value='"+o.id+"'  >del</a> </td></tr>";
                    inc_network_zongyi += tr;
                });
                $("#inc_network_zongyi_table tbody").html(inc_network_zongyi);
            }

            if(inc.TV_DRAMA != undefined){
                var inc_tv_drama = "";
                $.each(inc.TV_DRAMA,function(i,o){
                    var tr = "<tr><td>"+ (i+1)+"</td><td>"+ o.name+"</td><td>"+ o.playCount+"</td><td><a href='javascript:void(0)'  data-value='"+o.id+"'  >del</a> </td></tr>";
                    inc_tv_drama += tr;
                });
                $("#inc_tv_drama_table tbody").html(inc_tv_drama);
            }

            if(inc.TV_VARIETY != undefined){
                var inc_tv_zongyi = "";
                $.each(inc.TV_VARIETY,function(i,o){
                    var tr = "<tr><td>"+ (i+1)+"</td><td>"+ o.name+"</td><td>"+ o.playCount+"</td><td><a href='javascript:void(0)'  data-value='"+o.id+"'  >del</a> </td></tr>";
                    inc_tv_zongyi += tr;
                });
                $("#inc_tv_zongyi_table tbody").html(inc_tv_zongyi);
            }

            if(inc.ANIME != undefined){
                var inc_anime = "";
                $.each(inc.ANIME,function(i,o){
                    var tr = "<tr><td>"+ (i+1)+"</td><td>"+ o.name+"</td><td>"+ o.playCount+"</td><td><a href='javascript:void(0)'  data-value='"+o.id+"'  >del</a> </td></tr>";
                    inc_anime += tr;
                });
                $("#inc_anime_table tbody").html(inc_anime);
            }
            if(inc.MOVIE != undefined){
                var inc_movie = "";
                $.each(inc.MOVIE,function(i,o){
                    var tr = "<tr><td>"+ (i+1)+"</td><td>"+ o.name+"</td><td>"+ o.playCount+"</td><td><a href='javascript:void(0)'  data-value='"+o.id+"'  >del</a> </td></tr>";
                    inc_movie += tr;
                });
                $("#inc_movie_table tbody").html(inc_movie);
            }


            $("#content_list").show();
            is_load_billboard = true;
        }
    });
}
$("#inc_network_movie_body a,#inc_network_drama_body a,#inc_network_zongyi_body a ,#inc_tv_drama_body a, #inc_tv_zongyi_body a, #inc_anime_body a, #inc_movie_body a ").live("click",function () {
    var id = $(this).attr("data-value");
    $.ajax({
        type: 'GET',
        url: '/play_count/toDeleteIncBillboard/' + id,
        success: function (data) {
            alert("已删除成功！");
            window.location.reload();
        }

    });
});

$("#total_network_drama_body a,#total_network_movie_body a,#total_network_zongyi_body a, #total_tv_drama_body a, #total_tv_zongyi_body a,#total_anime_body a, #total_movie_body a").live("click",function(){
    var id = $(this).attr("data-value");
    $.ajax({
        type:'GET',
        url:'/play_count/toDeleteTotalBillboard/' + id,
        success:function(data){
            alert("已删除成功！");
            window.location.reload();
        }


    });
});




$("#total_network_drama_table a:first").click(function () {
    BootstrapDialog.show({
        title: '添加',
        message: function(dialog) {

            $("#add_category").val("NETWORK_DRAMA");
            $("#add_type").val("TOTAL");

            var content = $("#add_pc_div").html();
            return content;
        }
    });
});

$("#total_network_movie_table a:first").click(function () {
    BootstrapDialog.show({
        title: '添加',
        message: function(dialog) {

            $("#add_category").val("NETWORK_MOVIE");
            $("#add_type").val("TOTAL");

            var content = $("#add_pc_div").html();
            return content;
        }
    });
});
$("#total_network_zongyi_table a:first").click(function () {
    BootstrapDialog.show({
        title: '添加',
        message: function(dialog) {

            $("#add_category").val("NETWORK_VARIETY");
            $("#add_type").val("TOTAL");

            var content = $("#add_pc_div").html();
            return content;
        }
    });
});
$("#total_tv_drama_table a:first").click(function () {
    BootstrapDialog.show({
        title: '添加',
        message: function(dialog) {

            $("#add_category").val("TV_DRAMA");
            $("#add_type").val("TOTAL");

            var content = $("#add_pc_div").html();
            return content;
        }
    });
});
$("#total_tv_zongyi_table a:first").click(function () {
    BootstrapDialog.show({
        title: '添加',
        message: function(dialog) {

            $("#add_category").val("TV_VARIETY");
            $("#add_type").val("TOTAL");

            var content = $("#add_pc_div").html();
            return content;
        }
    });
});
$("#total_anime_table a:first").click(function () {
    BootstrapDialog.show({
        title: '添加',
        message: function(dialog) {

            $("#add_category").val("ANIME");
            $("#add_type").val("TOTAL");

            var content = $("#add_pc_div").html();
            return content;
        }
    });
});
$("#total_movie_table a:first").click(function () {
    BootstrapDialog.show({
        title: '添加',
        message: function(dialog) {

            $("#add_category").val("MOVIE");
            $("#add_type").val("TOTAL");

            var content = $("#add_pc_div").html();
            return content;
        }
    });
});

$("#inc_network_drama_table a:first").click(function () {
    BootstrapDialog.show({
        title: '添加',
        message: function(dialog) {

            $("#add_category").val("NETWORK_DRAMA");
            $("#add_type").val("INC");

            var content = $("#add_pc_div").html();
            return content;
        }
    });
});
$("#inc_network_movie_table a:first").click(function () {
    BootstrapDialog.show({
        title: '添加',
        message: function(dialog) {

            $("#add_category").val("NETWORK_MOVIE");
            $("#add_type").val("INC");

            var content = $("#add_pc_div").html();
            return content;
        }
    });
});
$("#inc_network_zongyi_table a:first").click(function () {
    BootstrapDialog.show({
        title: '添加',
        message: function(dialog) {

            $("#add_category").val("NETWORK_VARIETY");
            $("#add_type").val("INC");

            var content = $("#add_pc_div").html();
            return content;
        }
    });
});
$("#inc_tv_drama_table a:first").click(function () {
    BootstrapDialog.show({
        title: '添加',
        message: function(dialog) {

            $("#add_category").val("TV_DRAMA");
            $("#add_type").val("INC");

            var content = $("#add_pc_div").html();
            return content;
        }
    });
});
$("#inc_tv_zongyi_table a:first").click(function () {
    BootstrapDialog.show({
        title: '添加',
        message: function(dialog) {

            $("#add_category").val("TV_VARIETY");
            $("#add_type").val("INC");

            var content = $("#add_pc_div").html();
            return content;
        }
    });
});
$("#inc_anime_table a:first").click(function () {
    BootstrapDialog.show({
        title: '添加',
        message: function(dialog) {

            $("#add_category").val("ANIME");
            $("#add_type").val("INC");

            var content = $("#add_pc_div").html();
            return content;
        }
    });
});
$("#inc_movie_table a:first").click(function () {
    BootstrapDialog.show({
        title: '添加',
        message: function(dialog) {

            $("#add_category").val("MOVIE");
            $("#add_type").val("INC");

            var content = $("#add_pc_div").html();
            return content;
        }
    });
});






$("#add_new_pc").live("click",function () {

    if(day.trim() == ""){
        alert("刷新试一下吧!");
        return ;
    }

    var category = $(".bootstrap-dialog-body #add_category").val();
    var type = $(".bootstrap-dialog-body #add_type").val();
    var name = $(".bootstrap-dialog-body #add_show_name").val();
    var play_count = $(".bootstrap-dialog-body #add_play_count").val();


    $.ajax({
        type:"POST",
        url:"/play_count/auto",
        data:{name:name,category:category,type:type,playCount:play_count,day:day,_csrf:$("#csrf").val()},
        datatype: "json",
        success:function(data){
            window.location.reload();
        },
        error: function(){
            alert("error");
        }
    });

});


$("#export").click(function () {
    
    // BootstrapDialog.show({
    //     message:"敬请期待 O(∩_∩)O~~"
    // });
    // return;
    
    if(!is_load_billboard){
        BootstrapDialog.show({
            message:"请先进行搜索,确认自动榜单数据无误后,再进行导出到正式对外的榜单中"
        });
        return;
    }else {

        BootstrapDialog.show({
            title:"导出到正式榜单中",
            message:function(){

                var content = $("#export_div").html();
                return content;
            }
        });
    }
});

$(".bootstrap-dialog-message #to_export").live("click" , function () {

    $(".bootstrap-dialog-message #to_export").hide();
    
    var day = $("#on_show_date").val();
    var type = $(".bootstrap-dialog-message #export_type").val();
    var category = $(".bootstrap-dialog-message #export_category").val();
    var topNum = $(".bootstrap-dialog-message #top_num").val();
    if(day == "" || type == "" || category == "" || topNum.trim() == "" ||
        day == undefined || type == undefined || category == undefined || topNum.trim() == undefined
    ){
        BootstrapDialog.show({
            message:"弄啥赖"
        });
        return;
    }
    $.ajax({
        type:"GET",
        url:"/play_count/export_official_billboard?type="+type+"&category="+category+"&day="+day+"&topNum="+topNum,
        success:function(data){
            if(data == ""){
                BootstrapDialog.show({
                    message:"导出成功 O(∩_∩)O~~"
                });
                $(".bootstrap-dialog-message #to_export").show();
            }else {
                BootstrapDialog.show({
                    message:data
                });
            }
        },
        error: function(){
            alert("error");
        }
    });

});

$("#exportAll").live("click" , function () {

    var day = $("#on_show_date").val();
    if(day == "" || day == undefined){
        BootstrapDialog.show({
            message:"弄啥赖"
        });
        return;
    }
    $.ajax({
        type:"GET",
        url:"/play_count/export_official_billboard_all?day=" +day,
        success:function(data){
            if(data == ""){
                BootstrapDialog.show({
                    message:"导出成功 O(∩_∩)O~~"
                });
                $(".bootstrap-dialog-message #exportAll").show();
            }else {
                BootstrapDialog.show({
                    message:data
                });
            }
        },
        error: function(){
            alert("error");
        }
    });

});










