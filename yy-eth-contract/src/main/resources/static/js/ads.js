
init();

function init() {
    var t_page = fetch(1);
    var options = {
        currentPage: 1,
        totalPages: t_page,
        onPageClicked: function(e,originalEvent,type,page){
            fetch(page);
        }
    };
    $('#page').bootstrapPaginator(options);
}

$("#content").on("click", ".url", function () {
    fetch_url($(this).text());
});

$("#content").on("click", ".tag", function () {
    var id = $(this).parent().attr("data-id");
    var dialog = new BootstrapDialog({
        title:"标记",
        message:function () {
            var html = "<input id='post_name' class='form-control' placeholder='请输入......' type='text' />";
            return html;
        },
        buttons: [{
            id: 'btn',
            label: '提交'
        }]
    });
    dialog.realize();
    var btn = dialog.getButton('btn');
    btn.click({'id': id}, function(event){
        var post_name = $(".modal-dialog #post_name").val();
        edit(post_name, event.data.id);
        dialog.close();
        init();
        // alert('Hi, ' + event.data.id + post_name);
    });
    dialog.open();
});

function fetch(page) {
    var size = 10;
    var total_page = 0;
    $.ajax({
        type:'GET',
        url:'/ads/page?page='+page+'&size=' + size,
        async:false,
        success:function(data){
            var html = "";
            data = JSON.parse(data);
            html +='<table class="table table-bordered"><tbody><tr><td>标签</td><td>平台</td><td>文件名称</td></tr>';
            $.each(data.list,function(i,o){
                html+='<tr><td data-id="'+o.id+'">'+ blank(o.name)+'</td>';
                html+='<td>'+ o.platformId+'</td>';
                html+='<td><a href="javascript:void(0);" class="url">'+ o.fileName+'</a></td>';
                html+='</tr>';
            });
            html+='</tbody></table>';
            $("#content").html(html);
            total_page = data.total_page;

        },
        error: function(XMLHttpRequest) {
            alert(XMLHttpRequest.status);
        }
    });
    return total_page;
}
function fetch_url(key) {
    var html = "";



    if(key.endWith(".mp4")) {
        html = "<video autoplay='autoplay' controls='controls' loop='loop' width='100%' src='" + fetch_url_ajax(key) + "'></video>";
    } else if(key.endWith(".jpg")){
        html = "<img width='100%' src='"+fetch_url_ajax(key)+"' />"
    }else if(key.endWith(".gif")){
        html = "<img width='100%' src='"+fetch_url_ajax(key)+"' />"
    }else if(key.endWith(".png")){
        html = "<img width='100%' src='"+fetch_url_ajax(key)+"' />"
    }else if(key.endWith(".swf")){
        html = "<embed width='100%' src='"+fetch_url_ajax(key)+"' ></embed>"
    }
    else if (key.startWith("http")) {
        // html = "<iframe width='100%' src='"+key+"'></iframe>"
        window.open(key,"_blank");
        return;
    } else {
        var videoObject = {
            logo: 'chplayer', //设置logo，非必须
            container: '#video',//“#”代表容器的ID，“.”或“”代表容器的class
            variable: 'player',//该属性必需设置，值等于下面的new chplayer()的对象
            video:fetch_url_ajax(key)//视频地址
        };
        var player=new chplayer(videoObject);
        BootstrapDialog.show({
            title:"info",
            message: function (dialog) {
                return $("#video").html();
            }
        });
        return;
    }
    BootstrapDialog.show({
        title:"info",
        message: function (dialog) {
            return html;
        }
    });
}

function fetch_url_ajax(key) {
    var url = "";
    $.ajax({
        type:'GET',
        url:'/ads/url?key=' + key,
        async:false,
        success:function(data){
            url = data;
        },
        error: function(XMLHttpRequest) {
            alert(XMLHttpRequest.status);
        }
    });
    return url;
}
function edit(name, id) {
    $.ajax({
        type:'GET',
        url:'/ads/edit?name=' + name + "&id=" + id,
        async:false,
        success:function(data){
        },
        error: function(XMLHttpRequest) {
            alert(XMLHttpRequest.status);
        }
    });
}



function blank(str) {
    if (str == "null" || str == undefined || str == "undefined") {
        return "<a href='javascript:void(0);' class='tag'>点击标记</a>";
    }else {
        return str;
    }
}















String.prototype.endWith=function(str){
    var reg=new RegExp(str+"$");
    return reg.test(this);
};
String.prototype.startWith=function(str){
    var reg=new RegExp("^"+str);
    return reg.test(this);
};


Date.prototype.format = function(format){
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    }

    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
}
/***
 * 清空表单
 */
function clearForm($form){
    $(':input',$form)
        .not(':button, :submit, :reset, :hidden')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');
    $form.find('span.form-control-feedback').remove();
    $form.find('#releaseDate').removeAttr('readonly');
}
