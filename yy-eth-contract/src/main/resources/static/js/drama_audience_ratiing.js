$(function () {
	/** 初始化艺人金榜 **/
	var list = get_list();

    var dateInputEvent = InitDateInputChange();
    
    var addDateInputEvent = InitAddDateInputChange();
});
var nowListDay = "";
var InitDateInputChange = function(){
	$("#dateInput").on('change',function(){
		var v = $("#dateInput").val();
		if(v&&v!=nowListDay){
			get_list();
			nowListDay = v;
		}
	})
}
var InitAddDateInputChange = function(){
	$("#addDateInput").on('change',function(){
		var v = $("#addDateInput").val();
		if(v){
			window.location.href="/drama/audience_ratiing?day="+v;
		}
	})
}
var InitGoldBillboardEditEvent = function(){
	$("#audience_ratiing_div tbody a").editable({
        url: '/drama/audience_ratiing/edit',
        params: function(params) {
            params.id = params.pk;
            params[params.name] = params.value;
            params._csrf = getCsrf();
            return params;
        },
        validate: function(value) {
            if($.trim(value) == '') {
                return '不能为空';
            }
        },
        success: function(response, newValue) {
        	if(response.code==0){
        		get_list();
        	}else{
        		toastr.error(response.msg);
        	}
        }
    });
}
function get_list(){

	day = $("#dateInput").val();
    
    $.ajax({
        type: 'GET',
        url: '/drama/audience_ratiing/list',
        data:{day:day},
        success: function (data) {
        	if(data.code == 0){
        		var tbd = $("#audience_ratiing_div .table tbody");
        		var html = "";
        		tbd.html(html);
        		if(data.extra&&!day){
        			$("#dateInput").val(data.extra.day);
        		}
                $.each(data.data,function(i,o){
                    var tr = '<tr class="billboard_tr">' +
                        '<td class="billboard_order"><span class="order">'+ (Number(i+1) < 10 ? "0":"")+ (i+1)+'</span></td>'+
                        '<td>'+ o.showName+'</td>' +
                        '<td>'+ o.tvStation+'</td>' +
                        '<td><a href="javascript:;" data-pk="'+o.id+'" data-name="audienceRatiing">'+o.audienceRatiing+'</a></td>' +
                        '</tr>';
                    html += tr;
                });
                if(html != ''){
                	tbd.html(html);
                	InitGoldBillboardEditEvent();//编辑事件
                }
        	}else{
        		toastr.error(data.msg);
        	}
        }
    });
};
function getCsrf() {
    return $('#csrf').val();
}
function handleData(t){
	var that = $(t);
	var handle = that.attr("data-value");
	if(handle==="1"){
		var append = that.parent().parent().prop("outerHTML");
		$("#add_data").append(append);
	}else{
		if(that.parent().parent().siblings().length!=0){
			that.parent().parent().remove();
		}else{
			toastr.warning("禁止移除掉最后一列信息!");
		}
	}
}

$("#submit_btn").click(function () {
	var datalist=[];
	var day = $("#addDateInput").val();
	if(!day){
		toastr.error("录入时间不能为空!");
		return;
	}
    $("#add_data tr").each(function(i,o){
    	var data = {};
    	data['day']=day;
    	var haveVal = true;
    	$(o).find("td").each(function(x,t){
    		var obj = $(t);
    		if(x==0){
    			var showId = obj.children().val();
    			var showName = obj.children().find("option:selected").text();
    			data['showId']=showId;
    			data['showName']=showName;
    		}else if(x==1){
    			var tvId = obj.children().val();
    			var tvStation = obj.children().find("option:selected").text();
    			data['tvId']=tvId;
    			data['tvStation']=tvStation;
    		}else if(x==2){
    			var key = obj.children().attr("data-name");
    			var val = obj.children().val();
    			if(!val){
    				haveVal = false;
    			}
    			data[key]=val;
    		}
    	})
    	if(haveVal){
    		datalist.push(data);
    	}
    })
    var isRequest = false;
    if(datalist.length>0&&!isRequest){
    	$.ajax({
			type: 'post',
			url: '/drama/add_audience_ratiing?_csrf='+getCsrf(),
			async: true,
			contentType:'application/json',
			dataType: "json",
			data: JSON.stringify(datalist)
		}).done(function(data) {
			if(data && data.code !== 100){
				$("#dateInput").val(day);
				get_list();
				$("#add_data tr:eq(0)").siblings().remove();
			}else{
				toastr.error(res.msg);
			}
			isRequest = false;
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
		});
    }
});