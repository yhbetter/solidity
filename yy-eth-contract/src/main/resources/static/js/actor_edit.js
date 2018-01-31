/**
 * Created by jack on 2016/12/5.
 */
$(function () {
    new AddDramaDialog().save();    //初始化艺人添加演艺信息的弹出框对象
    addRemoveActorPhotoListener();  //添加艺人的图片删除监听
    addRemoveActorVideoListener();  //添加艺人的视频删除监听
    addDeleteActorDramaListener();  //添加监听艺人的剧列表的删除按钮
    addSavePhotoActorPhotoParameterListener(); //添加保存图片参数监听
});

/**
 * 艺人演艺信息添加作品的对话框
 * @constructor
 */
var AddDramaDialog = function () {
    this.from = $('#addActorDramaDialog');
    this.form = $('#addActorDramaDialog form[id = "addDramaForm"]');
    this.saveBtb = $('#addActorDramaDialog button[name = "save"]');
}

/**
 * 艺人演出信息添加作品对话框的属性方法
 * @type {
 *  保存艺人信息
 * {save: AddDramaDialog.save}
 *}
 */
AddDramaDialog.prototype = {
    save: function () {
        var _this = this;
        _this.saveBtb.on('click', function () {
            //如果检查不通过,暂时不做检查
            // if (!check(_this.form)) {
            //     return;
            // }
            var drama = _this.form.serialize();
            $.post("/actor/drama/save", drama + "&_csrf=" + $('#csrf').val(),
                function (data) {
                    if (data.code == 0) {
                        var drama = data.data;
                        var tr = "<tr> <td>" + drama.dramaName + "</td> <td>" + drama.dramaType + "</td> <td>" + drama.role + "</td> <td>" + drama.roleDesc + "</td> <td>" + drama.directorName + "</td> <td hidden='hidden'>" + drama.dramaViewRating + "</td> <td>" + drama.palyedYearInt + "</td> <td>" + drama.cooperativeActor + "</td> <td>" +
                            "<button type='button' class='btn btn-warning deleteActorDramaBtn' dramaId = '" + drama.id + "'>删除</button> </td> </tr>"
                        $('#dramaTable').append(tr);
                        //每次添加完重新给删除按钮添加一次监听
                        addDeleteActorDramaListener();
                    } else {
                        alert(data.message);
                    }
                }
            );
            _this.from.modal('hide');
        });
        return _this;
    }
}

/**
 * 添加监听艺人的剧列表的删除按钮
 * 删除艺人的剧
 */
function addDeleteActorDramaListener() {
    $(".deleteActorDramaBtn").on('click', function () {
        var _this = $(this);
        var dramaId = $(this).attr("dramaId");
        $.post(
            "/actor/drama/delete",
            {
                dramaId: dramaId,
                _csrf: $('#csrf').val()
            },
            function (data) {
                if (data.code == 0) {
                    _this.parents("tr").remove();
                } else {
                    alert(data.message);
                }

            });
    });
}

/**
 * 初始化页面时间对象
 */
$("#birthdayInt").datetimepicker({
    startView: 4,
    format: 'yyyy',
    autoclose: true,
    todayBtn: false,
    keyboardNavigation: true,
    language: 'cn',
    minView: 4,
    maxView: 4
});

$("#graduationInt").datetimepicker({
    startView: 4,
    format: 'yyyy',
    autoclose: true,
    todayBtn: false,
    keyboardNavigation: true,
    language: 'cn',
    minView: 4,
    maxView: 4
});

$("#palyedYearInt").datetimepicker({
    startView: 4,
    format: 'yyyy',
    autoclose: true,
    todayBtn: false,
    keyboardNavigation: true,
    language: 'cn',
    minView: 4,
    maxView: 4
});

/**
 * 监听提交基本信息按钮
 * 提交基本信息
 */
$("#submitActorBaseInfoBtn").on('click', function () {
    var actor = $("#actorBaseInfoForm").serialize();
    $.post("/actor/saveBaseInfo", actor + '&_csrf=' + $('#csrf').val(),
        function (data) {
            if (data.code == 0) {
                toastr.success("保存成功")
                console.log(data);
                $(".actorId").attr("value", data.data.actorId)
            } else {
                toastr.error(data.msg);
            }
        }
    );
});

/**
 * 提交艺人的媒体任务
 */
$("#addActorTaskBtn").on('click', function () {
    var platformUrl = $('#tackUrlInput').val();
    $.get("/actor/addUrl", {
        url: encodeURIComponent(platformUrl),
        actorId: $('#actorId').val()
    }, function (data) {
        if (data.code == 0) {
            toastr.success("添加成功");
            var _html = [];
            _html.push('<tr>');
            _html.push('<td>' + "媒体指数" + '</td>');
            _html.push('<td>' + platformUrl + '</td>');
            _html.push('<td>' + UnixToDate(new Date()) + '</td>');
            _html.push('</tr>');
            $('#mediaTaskTable').append(_html.join(''));
        } else {
        	if(data.extra!=null&&data.extra.example!=null){
        		if(confirm(data.msg)){
        			var s = "<div><p style='color:red;'>您录入的Url :"+$("#tackUrlInput").val()+"</p></div><table style='width:100%;' border='1'><tr><td style='width:10%;'>任务</td><td style='width:20%;'>任务范围</td><td>模版url</td></tr>";
        			$.each(data.extra.example,function(i,o){
        				s += "<tr><td style='width:10%;'>"+o.desc+"</td><td style='width:20%;word-break:break-all;white-space:normal;'>"+o.range+"</td><td style='word-break:break-all;white-space:normal;text-align:left;'><a href="+o.exampleUrl+">"+o.exampleUrl+"</a></td></tr>";
        			})
        			s += "</table>";
        			$("#exampleUrlBody").html(s);
        			$("#exampleUrl").modal('show');
        		}
        	}else{
        		toastr.error(data.msg);
            }
        }
    });
});

/**
 * 初始化媒体任务
 */
$.get("/actor/mediaTaskList", {actorId: $("#actorId").val()}, function (data) {
    if (data.code == 0) {
        var actorMediaList = data.data;
        for (var i = 0; i < actorMediaList.length; i++) {
            var media = actorMediaList[i];
            var _html = [];
            _html.push('<tr>');
            _html.push('<td>' + media.platformName + '</td>');
            _html.push('<td>' + media.url + '</td>');
            _html.push('<td>' + UnixToDate(new Date(media.updatedAt)) + '</td>');
            _html.push('</tr>');
            $('#mediaTaskTable').append(_html.join(''));
        }
    } else {
        alert("获取媒体任务失败");
    }
});

/**
 * 添加艺人演艺信息提价按钮的监听时间
 */
$("#submitActorPerformingInfoBtn").on('click', function () {
    var performingInfo = $("#actorPerformingInfoForm").serialize();
    $.post("/actor/saveActorPerformingInfo", performingInfo + '&_csrf=' + $('#csrf').val(),
        function (data) {
            if (data.code == 0) {
                alert("成功")
            } else {
                alert(data.message);
            }
        }
    );
});

/**
 * 保存艺人联系信息
 */
$("#submitActorContactInfo").on('click', function () {
    var contactInfo = $("#actorContactInfoForm").serialize();
    $.post("/actor/saveContactInfo", contactInfo + '&_csrf=' + $('#csrf').val(),
        function (data) {
            if (data.code == 0) {
                alert("修改成功");
            } else {
                alert(data.message);
            }
        });
})

/**
 * 初始化艺人标签信息View
 */
var $checkableTree;
$.get("/actor/tags", {actorId: $("#actorId").val()}, function (data) {
    $checkableTree = $('#treeview-checkable').treeview({
        data: data,
        showIcon: false,
        showCheckbox: true,
        onNodeChecked: function (event, node) {
            checkedTags.push(node.text);
            resetTagsOut(checkedTags);
        },
        onNodeUnchecked: function (event, node) {
            checkedTags.splice(checkedTags.indexOf(node.text),1);
            resetTagsOut(checkedTags);
        }
    });
});

/**
 * 初始化已选择标签
 */
var checkedTags = [];
$.get("/actor/checkedTags",{actorId: $("#actorId").val()},function (data) {
    if (data.code == 0){
        checkedTags = data.data;
        resetTagsOut(checkedTags);
    }
});

/**
 * 绘制已选择标签
 * @param checkedTags
 */
function resetTagsOut(checkedTags) {
    $("#checkableOut").empty();
    var _html = [];
    for (var i = 0; i < checkedTags.length; i++){
        _html.push('<p>' + checkedTags[i] +'</p>')
    }
    $("#checkableOut").append(_html.join(''));
}

/**
 * 添加艺人提交标签按钮监听
 */
$('#submitActorTagBtn').on('click', function () {
    var actorTagOList = $('#treeview-checkable').treeview('getChecked');
    var tid = [];
    var actorId = $("#actorId").val();
    for (var i = 0; i < actorTagOList.length; i++) {
        tid.push(actorTagOList[i].tagId);
    }
    $.post("/actor/saveActorTag",
        {
            tagIds: tid.join(","),
            actorId: actorId,
            _csrf: $('#csrf').val()

        },
        function (data) {
            alert(data.message);
        });
});

var ActorSelectTag = function (tagId, actorId) {
    this.tagId = tagId;
    this.actorId = actorId;
}

/**
 * 检查表单中的元素
 * @param $form
 * @returns {boolean}
 */
function check($form) {
    var tag = true;
    $form.find('input').each(function (i, input) {
        var _$input = $(input);
        if (_$input.val().trim() == '') {
            _$input.focus();
            tag = false;
            return tag;
        }
    })
    return tag;
}

$(function () {
    //获取token
    $.ajax({
        url: '/QiNiu/upLoadToken',
        type: 'GET',
        async: false,//这里应设置为同步的方式
        success: function (data) {
            token = data;
        }
    });
    //实例化七牛uploader
    var signleIds = ['addPrimaryImageUrlBtn', 'addHeaderImageUrlBtn', 'addPhotoUrlBtn', 'addVideoUrlBtn'];
    var uploader1 = getQiNiuUploader(signleIds);
});


/**
 * 获取七牛上传的实例
 * @param uploadIds 上传按钮的id或id array
 * @param multi 是否多文件上传
 */
var fileType = 0;
var fileButton;
var token;
function getQiNiuUploader(uploadIds) {
    var qiniu = new QiniuJsSDK();
    var uploader = qiniu.uploader({
        runtimes: 'html5,flash,html4',    //上传模式,依次退化
        browse_button: uploadIds,   //上传选择的点选按钮，**必需**
        uptoken: token, //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        domain: 'http://static.yiren.guduomedia.com/',   //bucket 域名，下载资源时用到，**必需**
        get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
        container: 'collapseFour',           //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '400mb',           //最大文件体积限制
        flash_swf_url: '/js/plupload/Moxie.swf',  //引入flash,相对路径
        max_retries: 3,                   //上传失败最大重试次数
        chunk_size: '4mb',                //分块上传时，每片的体积
        auto_start: true,//选择文件后自动上传，若关闭需要自己绑定事件触发上传
        multi_selection: false,//单选模式
        init: {
            'BeforeUpload': function (up, file) {
                //显示进度条
                fileButton.parent().children(".progress").css("visibility", "visible");
            },
            'FileUploaded': function (up, file, info) {
                $(fileButton).parent().children(".progress").css("visibility", "hidden");
                var domain = up.getOption('domain');
                var res = $.parseJSON(info);
                var url = domain + res.key;
                console.log(url);
                switch (fileType) {
                    case 0:
                        savePrimaryImage(url);
                        break;
                    case 1:
                        saveHeaderImage(url);
                        break;
                    case 2:
                        savePhoto(url, res.w, res.h);
                        break;
                    case 3:
                        saveVideo(url);
                        break;
                }
            },
            'Error': function (up, err, errTip) {
                console.log("error");
                fileButton.parent().children(".progress").css("visibility", "hidden");
                //上传出错时,处理相关的事情
                fileButton.parent().children(".msg").html("上传失败");
            },
            'Key': function (up, file) {
                var keyword = "";
                $.ajax({
                    url: '/QiNiu/uuid',
                    type: 'GET',
                    async: false,//这里应设置为同步的方式
                    success: function (data) {
                        var ext = Qiniu.getFileExtension(file.name);
                        keyword = data + '.' + ext;
                    },
                    cache: false
                });
                return keyword;
            }
        }
    });
    return uploader;
}


/**
 * 保存主图
 */
function savePrimaryImage(url) {
    $.post("/actor/resetPrimaryImage",
        {
            primaryImageUrl: url,
            actorId: $("#actorId").val(),
            _csrf: $('#csrf').val()
        },
        function (data) {
            if (data.code == 0) {
                $("#primaryImageView").attr('src', url + '?imageView2/1/w/150/');
            } else {
                alert(data.message);
            }
        });
}

/**
 * 保存头像
 */
function saveHeaderImage(url) {
    $.post("/actor/resetHeadImage",
        {
            deadImageUrl: url,
            actorId: $("#actorId").val(),
            _csrf: $('#csrf').val()
        },
        function (data) {
            if (data.code == 0) {
                $("#addHeaderImageView").attr('src', url + '?imageView2/1/w/150/');
            } else {
                alert(data.message);
            }
        });
}

/**
 * 保存图片
 */
function savePhoto(url, w, h) {

    $.post("/actor/addPhoto", {
        actorId: $("#actorId").val(),
        photoUrl: url,
        photoWeight: w,
        photoHeight: h,
        _csrf: $('#csrf').val(),
        photoType: "",
        shootingYear: ""
    }, function (data) {
        if (data.code == 0) {
            var _html = [];
            _html.push('<div class="col-xs-6 col-md-3">');
            _html.push('<a class="glyphicon glyphicon-remove gd-actor-photo-remove" role="menuitem" tabindex="-1"></a>')
            _html.push('<a href="' + url + '" class="thumbnail"  target="_blank" fileId = "' + data.data.id + '">');
            _html.push('<img data-src="holder.js/100%x180" alt="..." src="' + url + '?imageView2/1/w/150/"/>');
            _html.push('</a>');
            _html.push('<div style="padding-left:0px;">');
            _html.push('<input class="w" style="padding:1px;" placeholder="w" value="'+w+'"/>');
            _html.push('<input class="h" style="padding:1px;" placeholder="h" value="'+h+'"/>');
            _html.push('<button th:attr="photoId=${photo.id}" class="btn-primary save-photo-parameter"type="button" style="border:0px; padding:inherit; width:60px; height:25px; margin-top:5px;"> Done </button>');
            _html.push('</div>');
            _html.push('</div>');
            $('.gd-actor-photo').append(_html.join(''));
            addRemoveActorPhotoListener();
            addSavePhotoActorPhotoParameterListener();
        } else {
            alert(data.message);
        }
    });

}

/**
 * 保存视频
 */
function saveVideo(url) {

    $.post("/actor/addVideo", {
        actorId: $("#actorId").val(),
        videoUrl: url,
        cover: url + "?vframe/png/offset/5/imageView2/1/w/375/h/210",
        _csrf: $('#csrf').val(),
        shootingYear: ""
    }, function (data) {
        if (data.code == 0) {
            var _html = [];
            _html.push('<div class="col-xs-6 col-md-3">');
            _html.push('<a class="glyphicon glyphicon-remove gd-actor-video-remove" role="menuitem" tabindex="-1"></a>')
            _html.push('<a href="' + url + '" class="thumbnail" target="_blank" fileId = "' + data.data.id + '">');
            _html.push('<img data-src="holder.js/100%x180" alt="..." src="' + url + '?vframe/png/offset/5/imageView2/1/w/375/h/210"/>');
            _html.push('</a>');
            _html.push('</div>');
            $('.gd-actor-video').append(_html.join(''));
            addRemoveActorVideoListener();
        } else {
            alert(data.message);
        }
    });

}

/***
 * 添加图片删除监听
 */
function addRemoveActorPhotoListener() {
    $('.gd-actor-photo-remove').on('click', function () {
        var _this = $(this),
            fileId = _this.next('a').attr('fileId');
        $.post('/actor/removePhoto', {photoId: fileId, _csrf: $('#csrf').val()},
            function (data) {
                if (data.code == 0) {
                    _this.parent().remove();
                } else {
                    alert(data.message);
                }
            });
    });
}

/**
 * 添加保存图片参数监听
 */
function addSavePhotoActorPhotoParameterListener() {
    $('.save-photo-parameter').on('click', function () {
        var _this = $(this);
        var photoId = _this.attr('photoId');
        var width = _this.parent().find('.w').val();
        var height = _this.parent().find('.h').val();
        $.post('/actor/photoParameter',{
            photoId:photoId,
            width:width,
            height:height,
            _csrf: $('#csrf').val()
        },function (data) {

        });
    });
}

/***
 * 添加视频删除监听
 */
function addRemoveActorVideoListener() {
    $('.gd-actor-video-remove').on({
        click: function () {
            var _this = $(this),
                fileId = _this.next('a').attr('fileId');
            $.post('/actor/removeVideo', {videoId: fileId, _csrf: $('#csrf').val()},
                function (data) {
                    if (data.code == 0) {
                        _this.parent().remove();
                    } else {
                        alert(data.message);
                    }
                });
        }
    });
}

/***
 * 文件分类
 */
$('.file-type').on({
    click: function () {
        var _this = $(this),
            title = _this.text();
        _this.parent().siblings().removeClass('active');
        _this.parent().addClass('active').parent().parent('div').find('button').text(title);
    }
});

/**
 * 主图
 */
$('#addPrimaryImageUrlBtn').on('click', function () {
    fileType = 0;
    fileButton = $('#addPrimaryImageUrlBtn');
});

/**
 * 头像
 */
$('#addHeaderImageUrlBtn').on('click', function () {
    fileType = 1;
    fileButton = $('#addHeaderImageUrlBtn');
});

/**
 * 图片
 */
$('#addPhotoUrlBtn').on('click', function () {
    fileType = 2;
    fileButton = $('#addPhotoUrlBtn');
});

/**
 * 视频
 */
$('#addVideoUrlBtn').on('click', function () {
    fileType = 3;
    fileButton = $('#addVideoUrlBtn');
});

function UnixToDate(now) {
    var year = now.getYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    return year + 1900 + "-" + month + "-" + date + "   " + hour + ":" + minute + ":" + second;
}
