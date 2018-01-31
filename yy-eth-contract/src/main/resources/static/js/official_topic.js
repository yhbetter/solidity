
var app = new Vue({

    el: "#app",
    data: function () {
        return {
            ots: []
        }
    },
    methods: {
        search: function () {
            var showName = $("#show_name").val();

            find_official_topic(showName);
        },
        update: function (id) {
            var word = find_official_topic_by_id(id);
            $("#id").attr("value",word.id);
            $("#showId").attr("value",word.showId);
            $("#name").attr("value",word.name);
            $("#followCount").attr("value",word.followCount);
            $("#readCount").attr("value",word.readCount);
            $("#discussCount").attr("value",word.discussCount);

            BootstrapDialog.show({
                message:$("#insert_update_div").html(),
                buttons:[{
                    label:"提交",
                    action:function (self) {
                        insert_update();
                        self.close();
                    }
                }]
            });

        },
        add: function () {
            clean_insert_update_div();
            var showId = hash.get("showId");
            var keyword = hash.get("keyword");
            $("#showId").attr("value", showId);
            BootstrapDialog.show({
                message:$("#insert_update_div").html(),
                buttons:[{
                    label:"提交",
                    action:function (self) {

                        insert_update();
                        self.close();
                    }
                }]
            });


        },
        del: function (id) {
            del_opinion_words(id);
        }
    }
});

function clean_insert_update_div() {
    $("#id").attr("value", "");
    $("#showId").attr("value", "");
    $("#name").attr("value", "");
    $("#followCount").attr("value", "");
    $("#readCount").attr("value", "");
    $("#discussCount").attr("value", "");
}

function find_official_topic(keyword) {

    if (keyword == ""){
        BootstrapDialog.alert("名称不可为空");
        return;
    }
    hash.add({keyword:keyword});

    if(keyword != "general"){
        $.ajax({
            type: 'GET',
            url: '/show/' + keyword,
            async: false,
            success: function (data) {
                var arr = data.data;
                if(arr.length == 0){
                    BootstrapDialog.alert("您查询的剧不存在");
                    return;
                }
                $.each(arr, function (i, o) {
                    hash.add({showId:o.id});
                });
            }
        });
    }

    $.ajax({
        type: 'GET',
        url: '/official_topic/show_name/' + keyword,
        async: false,
        success: function (data) {

            if(data.msg != undefined){
                BootstrapDialog.alert(data.msg);
            }else {
                app.ots = (eval(data));
            }
            $("#official_topic_div").show();
        }
    });
}

function find_official_topic_by_id(id) {
    var resp;
    $.ajax({
        type: 'GET',
        url: '/official_topic/id/' + id,
        async:false,
        success: function (data) {

            if(data.msg != undefined){
                BootstrapDialog.alert(data.msg);
            }else {
                // data = JSON.parse(data);
                resp = data;
            }
        }
    });
    return resp;
}


function del_opinion_words(id) {
    $.ajax({
        type: 'GET',
        url: '/official_topic/del/id/' + id,
        success: function (data) {

            if("SUCCESS" == data.msg){
                find_official_topic(hash.get("keyword"));
            }else{
                BootstrapDialog.alert("删除失败: " + data.msg);
            }
        }
    });
}

function insert_update() {

    var k = hash.get("keyword");
    var l = hash.get("showId");

    if(k == null || k == undefined || k == "undefined" || l == null || l == undefined || l == "undefined"){
        BootstrapDialog.alert("请刷新重试");
        return false;
    }


    var id = $(".bootstrap-dialog-body #id").attr("value");
    var showId = $(".bootstrap-dialog-body #showId").attr("value");
    var name = $(".bootstrap-dialog-body #name").attr("value");
    var followCount = $(".bootstrap-dialog-body #followCount").attr("value");
    var readCount = $(".bootstrap-dialog-body #readCount").attr("value");
    var discussCount = $(".bootstrap-dialog-body #discussCount").attr("value");


    $.ajax({
        type: 'POST',
        url: '/official_topic',
        // contentType:"application/json",
        data: {id:id,showId:showId,name:name,followCount:followCount,readCount:readCount,discussCount:discussCount, _csrf:$("#csrf").val()},
        success: function (data) {
            find_official_topic(hash.get("keyword"));
        }
    });
}