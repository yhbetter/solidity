// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('graph'));

var asix_tick_length = 3;
var asix_text_size = '.01rem';
var colors = ['#FC6E32', '#FFBC38', '#99D1C5', '#F48195', '#FEE01F', '#56E284', '#6776EC', '#C1E59B', '#FFB9B9', '#B0369C', '#3A854C', '#D40A4B', '#5216DE', '#FA8F3A'];
var asix_text_color = "#888";
var asix_line_color = "#ccc";
var x_asix_margin = 8;
var y_asix_margin = 8;

var graphData ={};//曲线图数据全局对象
var current_platform = "";

$("#search").click(function(){
	refresh();
})

var refresh = function(){
	var showName = $("#showName").val();
	var start = $("#startTime").val();
	var end = $("#endTime").val();
	
	if(showName.trim()==""){
		toastr.warning("剧名不能为空");
		return;
	}
	if(!start){
		toastr.warning("开始时间不能为空");
		return;
	}
	if(!end){
		toastr.warning("结束时间不能为空");
		return;
	}
	
	//全局变量初始化
	$("#btn-area").html("");
	$("#data").html("");
	graphData = {};
	current_platform = "";
	myChart.clear();
	
	myChart.showLoading();
	$.ajax({
		type:'GET',
		url:'/comment/total/times?name='+showName+'&start='+start+'&end='+end,
		dateType:'json',
		success:function(res){
			if(res.code==0){
				// 指定图表的配置项和数据
				graphData = res.data;
				current_platform = res.data.platforms[0];
				var options = getGraph(current_platform);
				var html = "";
				var dataHtml = "";
				$.each(res.data.platforms,function(i,o){
					if(i==0){
						html += "<button id='"+o+"' type='button' class='btn btn-success' onclick='changePlatform("+o+")'>"+o+"</button>";
					}else{
						html += "<button id='"+o+"' type='button' class='btn btn-default' onclick='changePlatform("+o+")'>"+o+"</button>";
					}
					var d = res.data[o];
					$.each(d.times,function (j, n) {
						var cc = d.counts[j];
						var cid = d.ids[j];
                        if(j == 0){
                        	dataHtml +='<div class="col-md-2"><table class="table table-striped" style="text-align:center"><thead><tr ><td colspan="2">'+ o +'</td></tr></thead><tbody><tr><td>日期</td><td>评论量</td></tr>';
                        }
                        dataHtml+='<td class="crawled_at">'+ FormatDate(new Date(n))+'</td>';
                        dataHtml+='<td style="width:65%;"><input data-id="'+cid+'" type="text" class="form-control" data-cc="'+cc+'" value="' + cc + '" /></td>';
                        dataHtml+='</tr>';
                    });
					dataHtml+='</tbody></table></div>';
				})
				$("#btn-area").html(html);
				myChart.setOption(options);
				myChart.hideLoading();
				$("#data").html(dataHtml);
			}else{
				toastr.error(res.msg);
				myChart.hideLoading();
			}
		}
	})
}

var changePlatform = function(platform){
	platform = $(platform).attr("id");
	if(platform){
		//样式切换
		$("#"+current_platform).attr("class","btn btn-default");
		current_platform = platform;
		$("#"+current_platform).attr("class","btn btn-success");
		var options = getGraph(current_platform);
		myChart.setOption(options);
	}else{
		toastr.error("参数不能为空");
	}
}

var getGraph = function(platform) {
	return{
		colors: colors,
		tooltip: {
		    trigger: 'axis',
		    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
		        type: 'line',       // 默认为直线，可选为：'line' | 'shadow'
		        lineStyle: {
		            color: colors[parseInt(8 * Math.random())]//'#999'
		        }
		    }
		},
		xAxis: {
		    data: graphData[platform].times,
		    //name: '日期',
		    inverse: false,
		    silent: true,
		    boundaryGap: false,//间隙
		    splitLine: {show: false},
		    splitArea: {show: false},
		    axisLabel: {
		        textStyle: {
		            color: asix_text_color,
		            fontSize: asix_text_size
		        },
		        margin: x_asix_margin
		    },
		    axisTick: {
		        length: asix_tick_length,
		        lineStyle: {
		            color: asix_line_color
		        }
		    },
		    axisLine: {
		        onZero: true,
		        lineStyle: {
		            color: asix_line_color
		        }
		    },
		},
		yAxis: [
		    {
		        type: 'value',
		        scale: true,
		        show: true,
		        axisLabel: {
		            formatter: function (value) {
		                return toThousands(value);
		            },
		            textStyle: {
		                color: asix_text_color,
		                fontSize: asix_text_size
		            },
		            margin: y_asix_margin
		        },
		        axisTick: {
		            length: asix_tick_length,
		            lineStyle: {
		                color: asix_line_color
		            }
		        },
		        splitLine: {
		            show: false,
		            lineStyle: {
		                color: '#eee'
		            }
		        },
		        axisLine: {
		            lineStyle: {
		                color: asix_line_color
		            }
		        },
		    }
		],
		grid: {
		    left: 60,
		    bottom: 30,
		    right: 40,
		    top: 30
		},
		series: function () {
		    var series = [];
		    if(!platform) {
		        return series;
		    }
	        var item = {
	            name: platform,
	            smooth: true,
	            symbol: "circle",
	            stack: 'one',
	            type: 'line',
	            areaStyle: {
	                normal: {
	                    color: colors[parseInt(8 * Math.random())],
	                    opacity:0.5
	                }
	            },
	            lineStyle: {
	                normal: {
	                    color: colors[parseInt(8 * Math.random())]
	                }
	            },
	            center: ['50%', '50%'],
	            itemStyle: {
	                normal: {
	                    color: colors[parseInt(8 * Math.random())],
	                    borderWidth: 0
	                }
	            },
	            data: graphData[platform].counts
	        }
	        series.push(item);
		    return series;
		}()
	};
};

$("#data input").live("blur",function () {
	var that = $(this);
    var cid = that.attr("data-id");
    var preCount = that.attr("data-cc");
    var nowCount = that.val();
    if(nowCount.trim() == ""){
        toastr.warning("修改值不能为空!");
        return;
    }
    if(nowCount!=preCount){
    	BootstrapDialog.confirm("是否要将评论量["+preCount+"]->["+nowCount+"]?",function(res){
    		if(res){
			    $.ajax({
			        type: 'GET',
			        url: '/comment/total/times/modify',
			        //contentType: "application/json",
			        data: {commentId:cid,count:nowCount},
			        success: function (data) {
			            if(data.code==0){
			            	refresh();
			                //toastr.success("更新成功");
			            }else{
			            	toastr.error(data.msg);
			            }
			        }
			    });
			    that.attr("data-cc",nowCount);
    		}else{
    			that.val(preCount);
    		}
    	})
    }


});

var toThousands = function(num) {
    if (num == undefined || num == null || num == 0) {
        return '0';
    }
    if (num > 9999999) {
        var newNum = parseFloat(num / 10000000).toFixed(1);
        return newNum.toString() + '千万';
    }
    //如果是1万及以上，去掉后面的，加上万
    if (num > 9999) {
        var newNum = parseFloat(num / 10000).toFixed(1);
        return newNum.toString() + '万';
    } else {
        return num.toString();
    }
}

function FormatDate (date) {
	//date.getFullYear()+"-"+
    return (date.getMonth()+1)+"-"+date.getDate();
}