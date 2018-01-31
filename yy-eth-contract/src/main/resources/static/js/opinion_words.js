
var app = new Vue({

    el: "#app",
    data: function () {
        return {
            ows: []
        }
    },
    methods: {
        search: function () {
            var showName = $("#show_name").val();

            find_opinion_words(showName);
        },
        search_general: function () {
            find_opinion_words("general");
        },
        update: function (id) {
            var word = find_opinion_word_by_id(id);
            $("#ow_id").attr("value",word.id);
            $("#linkedId").attr("value",word.linkedId);
            $("#category").attr("value",word.category);
            $("#subject").attr("value",word.subject);
            $("#episode").attr("value",word.episode);
            $("#epi").attr("value",word.epi);
            $("#roleName").attr("value",word.roleName);
            $("#relatedKeyword").attr("value",word.relatedKeyword);

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
            var linkedId = hash.get("linkedId");
            var keyword = hash.get("keyword");
            $("#linkedId").attr("value", linkedId);
            $("#keyword").attr("value", keyword);
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
    $("#ow_id").attr("value", "");
    $("#linkedId").attr("value", "");
    $("#category").attr("value", "");
    $("#subject").attr("value", "");
    $("#episode").attr("value", "");
    $("#epi").attr("value", "");
    $("#roleName").attr("value", "");
    $("#relatedKeyword").attr("value", "");
}

function find_opinion_words(keyword) {

    if (keyword == ""){
        BootstrapDialog.alert("名称不可为空");
        return;
    }
    hash.add({keyword:keyword});
    if(keyword == "general"){
        hash.add({linkedId:0});
    }
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
                    hash.add({linkedId:o.id});
                });
            }
        });
    }

    $.ajax({
        type: 'GET',
        url: '/opinion_words/keyword/' + keyword,
        async: false,
        success: function (data) {

            if(data.msg != undefined){
                BootstrapDialog.alert(data.msg);
            }else {
                app.ows = (eval(data));
            }
            $("#opinion_words_div").show();
        }
    });
}

function find_opinion_word_by_id(id) {
    var resp;
    $.ajax({
        type: 'GET',
        url: '/opinion_words/id/' + id,
        async:false,
        success: function (data) {

            if(data.msg != undefined){
                BootstrapDialog.alert(data.msg);
            }else {
                data = JSON.parse(data);
                resp = data;
            }
        }
    });
    return resp;
}

function del_opinion_words(id) {
    $.ajax({
        type: 'GET',
        url: '/opinion_words/del/id/' + id,
        success: function (data) {

            if("SUCCESS" == data){
                find_opinion_words(hash.get("keyword"));
            }else{
                BootstrapDialog.alert("删除失败");
            }
        }
    });
}

function insert_update() {

    var k = hash.get("keyword");
    var l = hash.get("linkedId");

    if(k == null || k == undefined || k == "undefined" || l == null || l == undefined || l == "undefined"){
        BootstrapDialog.alert("请刷新重试");
        return false;
    }


    var id = $(".bootstrap-dialog-body #ow_id").attr("value");
    var linkedId = $(".bootstrap-dialog-body #linkedId").attr("value");
    var category = $(".bootstrap-dialog-body #category").attr("value");
    var keyword = $(".bootstrap-dialog-body #keyword").attr("value");
    var subject = $(".bootstrap-dialog-body #subject").attr("value");
    var epi = $(".bootstrap-dialog-body #epi").attr("value");
    var episode = $(".bootstrap-dialog-body #episode").attr("value");
    var roleName = $(".bootstrap-dialog-body #roleName").attr("value");
    var relatedKeyword = $(".bootstrap-dialog-body #relatedKeyword").attr("value");

    if(keyword == "general"){
        keyword = "";
    }

    $.ajax({
        type: 'POST',
        url: '/opinion_words',
        // contentType:"application/json",
        data: {id:id,keyword:keyword,linkedId:linkedId,category:category,subject:subject,episode:episode,epi:epi,roleName:roleName,relatedKeyword:relatedKeyword, _csrf:$("#csrf").val()},
        success: function (data) {
            find_opinion_words(hash.get("keyword"));
        }
    });
}