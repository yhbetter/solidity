
$("#add_btn").click(function () {
    
    var name = $("#name").val();
    var wechatId = $("#wechatId").val();
    var originalId = $("#originalId").val();
    
    
    
    $.ajax({
        type: 'POST',
        url: '/wechat',
        data: {name: name, wechatId: wechatId, originalId:originalId,  _csrf: $("#csrf").val()},
        success: function (data) {
            if(data.code==0&&data.data=="SUCCESS"){
                window.location.reload();
            }else {
                alert(data.msg);
            }
        }
    });
});
























