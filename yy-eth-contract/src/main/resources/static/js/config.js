


$("#update_on_show_date").click(function () {
    
    var on_show_date = $("#on_show_date").val();

    $.ajax({
        type: "GET",
        url: "/common/on_show_date?onShowDate=" + on_show_date ,
        success: function (data) {
            if(data == ""){
                BootstrapDialog.show({
                    message:"修改成功"
                });
            }else {
                BootstrapDialog.show({
                    message:data
                });
            }
        }
    });
    
});







