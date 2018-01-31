
find_ads();

var app = new Vue({

    el:"#app",
    data: function() {
        return {
            ads: []
        }
    },
    methods:{
        search:function () {
            IS_ALL_GREATEST = false;
            var showName = $("#show_name").val();
            $.ajax({
                type: 'GET',
                url: '/show/' + showName,
                success: function (data) {

                    var dataArr = eval(data.data);

                    if(dataArr.length == 1){
                        var linked_id = dataArr[0].id;
                        $("#linked_id").val(linked_id);
                        find_keywords();
                        $("#add_keyword").show();
                    }
                }
            });
        },
        add_ad:function () {
            BootstrapDialog.show({
                title:"添加广告过滤词",
                message:function () {
                    return $("#add_keyword_div").html();
                },
                buttons: [{
                    label: ' 提 交 ',
                    action: function(dialogItself){
                        var keyword = $(".bootstrap-dialog-message #keyword").val();
                        save(keyword);
                        dialogItself.close();
                    }
                }]
            });
        },
        del_ad:function (id) {
            $.ajax({
                type: 'GET',
                url: '/wechat/ad/del/' + id ,
                success: function (data) {
                    if("SUCCESS" == data.data){
                        find_ads();
                    }else{
                        BootstrapDialog.alert("删除失败!");
                    }
                }
            });
        }
    }
});

function find_ads() {
    $.ajax({
        type: 'GET',
        url: '/wechat/ads',
        success: function (data) {
            app.ads = (eval(data.data));
        }
    });
}


function save(keyword) {
    $.ajax({
        type: 'GET',
        url: '/wechat/ad/add/' + keyword,
        success:function (data) {

            find_ads();
        }
    });
}

