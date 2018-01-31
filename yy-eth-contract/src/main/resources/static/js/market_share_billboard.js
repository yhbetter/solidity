var app = new Vue({

    el:"#app",
    data: function() {
        return {
            msb: []
        }
    },
    mounted:function() {
        this.$nextTick(function () {
            find_msb();
            $("#search_btn").click();
        })
    },
    methods:{
        search:function () {
            find_msb();
            this.$nextTick(function(){
                init_ratio_edit();
            })
        },
        update:function (id, ratio) {

            $("#update_id").val(id);
            $("#ratio_num").val(ratio);
            BootstrapDialog.show({
                title:"修改",
                message:$("#input_div").html()
            });
        }

    }
});

function find_msb() {

    var day = $("#search_day").val();

    var category = $("#search_category").val();
    console.log(category);
    if($.trim(day) == ""){
        day = hash.get("day");
    }
    if(day == undefined || day == "undefined"){
        day = get_yesterday();
        console.log(day);
    }


    hash.add({"day":day});
    $("#search_day").val(day);
    $.ajax({
        type: 'GET',
        url: '/billboard/market_share_billboard?day=' + day + '&category=' + category,
        async: false,
        success: function (data) {

            app.msb = data;

        }
    });
}

function  init_ratio_edit(){

    $("table a").editable({
        url: '/billboard/edit_market_share',
        params: function(params) {
            params.id = params.pk;
            params.ratio = params.value;
            params._csrf = $('#csrf').val();
            return params;
        },
        validate: function(value) {
            if($.trim(value) == '') {
                return '不能为空';
            }
        },
        success: function(response, newValue) {
            window.location.reload();
        }
    });
}

function get_yesterday() {
    var day = new Date();
    day.setTime(day.getTime()-24*60*60*1000);
    return day.getFullYear()+"-" + (day.getMonth()+1) + "-" + day.getDate();
}