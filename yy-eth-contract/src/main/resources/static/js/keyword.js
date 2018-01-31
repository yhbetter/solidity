var IS_ALL_GREATEST = false;
var open_handle_key_id = 0;
var app = new Vue({

    el:"#app",
    data: function() {
        return {
            kws: []
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
                        $("#alert_tips").show();
                    }
                }
            });
        },
        search_all_greatest:function () {
            IS_ALL_GREATEST = true;
            all_greatest_keywords();
        },
        add_keyword:function () {
            BootstrapDialog.show({
                title:"添加关键字",
                message:function () {
                    return $("#add_keyword_div").html();
                },
                buttons: [{
                    label: ' 提 交 ',
                    action: function(dialogItself){
                        var linked_id = $("#linked_id").val();
                        var keyword = $(".bootstrap-dialog-message #keyword").val();
                        save_or_update_keyword(linked_id,keyword,0);
                        dialogItself.close();
                    }
                }]
            });
        },
        del_keyword:function (id) {
            var linked_id = $("#linked_id").val();
            if(confirm("是否要删除此标签?")){
            	$.ajax({
            		type: 'GET',
            		url: '/keyword/del/id/' + id + "/linked_id/" + linked_id ,
            		success: function (data) {
            			if("SUCCESS" == data){
            				// BootstrapDialog.alert("删除成功!");
            				find_keywords();
            			}else{
            				BootstrapDialog.alert("删除失败!");
            			}
            		}
            	});
            }
        },
        greatest:function (linked_id, keyword, greatest) {
            var linked_id = $("#linked_id").val();
            if(linked_id == null || linked_id == "" || linked_id == undefined || linked_id == "undefined"){
                if(!IS_ALL_GREATEST){
                    alert("linked_id: " + linked_id);
                    return;
                }
            }
            if(greatest == "1"){
                save_or_update_keyword(linked_id,keyword,0);
            }else {
                save_or_update_keyword(linked_id,keyword,1);
            }
        },
        greatest_color:function (greatest) {
            if(greatest == "1"){
                return "background:#A4BE86";
            }
        },
        greatest_star_color:function(greatest){
        	if(greatest == "1"){
        		return "color:#FFFF00";
        	}
        },
        tagChange:function(id,handle){
        	//handle 1:打开操作栏 2:关闭操作栏
        	var that = $('#'+id);
        	if(open_handle_key_id!=0){
        		var thatOpen = $('#'+open_handle_key_id);
        		changeTag(thatOpen,2);
        		setTimeout(function(){
        			changeTag(that,handle);
        			open_handle_key_id=id;
        		},50)
        	}else{
        		changeTag(that,handle);
    			open_handle_key_id=id;
        	}
        },
        edit_related_keyword:function (id,keyword,related_keyword) {
            BootstrapDialog.show({
                title:"修改相关关键词",
                message:function () {
                    html='<div id="edit_realted_keyword_div">'+
                    	'<label>关键词:</label>'+
                        '<input type="text" id="e_keyword" class="form-control" readonly="readonly" value="'+keyword+'"/><br />'+
                        '<label>相关关键词:</label>'+
                        '<input type="text" id="e_rkeyword" class="form-control " data-before="'+related_keyword+'" value="'+related_keyword+'"/><br /></div>'
                    return html;
                },
                buttons: [{
                    label: ' 提 交 ',
                    action: function(dialogItself){
                        var linked_id = $("#linked_id").val();
                        var keyword = $("#e_keyword").val();
                        var rkeyword = $("#e_rkeyword").val();
                        var before = $("#e_rkeyword").attr("data-before");
                        if(rkeyword!==before){
                        	save_or_update_keyword(linked_id,keyword,-1,rkeyword);
                        	console.log("save");
                        }
                        dialogItself.close();
                    }
                }]
            });
        },
    }
});

function find_keywords() {
    var linked_id = $("#linked_id").val();
    $.ajax({
        type: 'GET',
        url: '/keyword/linked_id/' + linked_id,
        success: function (data) {
            app.kws = (eval(data));
        }
    });
}
function all_greatest_keywords() {
    $.ajax({
        type: 'GET',
        url: '/keyword/greatest/all',
        success: function (data) {
            app.kws = (eval(data));
        }
    });
    
}

function changeTag(that,handle){
	if(handle==1){
		that.animate({
			opacity:'0'
		},200,function(){
			that.hide();
			that.next().show();
			that.next().animate({
				opacity:'1'
			},200);
		})
	}else{
		that.next().animate({
			opacity:'0'
		},200,function(){
			that.next().hide();
			that.show();
			that.animate({
				opacity:'1'
			},200);
		})
	}
}


function save_or_update_keyword(linked_id, keyword, greatest,related_keyword) {
    var csrf = $("#csrf").val();
    $.ajax({
        type: 'POST',
        url: '/keyword/save',
        data:{keyword:keyword,linkedId:linked_id,greatest:greatest,relatedKeyword:related_keyword,_csrf:csrf},
        success:function (data) {
            if(IS_ALL_GREATEST){
                all_greatest_keywords();
            }else {
                find_keywords();
            }
        }
    });
}

