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

$(".search-btn").click(function(){
	
	var showName = $("#showName").val();
	var start = $("#startTime").val();
	var end = $("#endTime").val();
	var type = $(this).attr("data-type");
	
	if(showName.trim()==""){
		toastr.warning("剧名或Code不能为空");
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
	graphData = {};
	current_platform = "";
	myChart.clear();
	
	myChart.showLoading();
	$.ajax({
		type:'GET',
		url:'/play_count/spider/pcexact?type='+type+'&name='+showName+'&start='+start+'&end='+end,
		dateType:'json',
		success:function(res){
			if(res.code==0){
				// 指定图表的配置项和数据
				graphData = res.data;
				if(res.data.platforms.length==0){
					toastr.error("未找到相关数据!");
					myChart.hideLoading();
					return;
				}
				current_platform = res.data.platforms[0];
				var options = getGraph(current_platform);
				var html = "";
				$.each(res.data.platforms,function(i,o){
					if(i==0){
						html += "<button id='"+o+"' type='button' class='btn btn-success' onclick='changePlatform("+o+")'>"+o+"</button>";
					}else{
						html += "<button id='"+o+"' type='button' class='btn btn-default' onclick='changePlatform("+o+")'>"+o+"</button>";
					}
				})
				$("#btn-area").html(html);
				myChart.setOption(options);
				myChart.hideLoading();
			}else{
				toastr.error(res.msg);
				myChart.hideLoading();
			}
		}
	})
})

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
	            data: graphData[platform].playcounts
	        }
	        series.push(item);
		    return series;
		}()
	};
};

//var getGraph2 = function(data){
////	var time = [];
////	$.each(data.times,function(i,o){
////		time.push(o.substring(11,o.length))
////	})
//	return {
//			colors: colors,
//			tooltip: {
//			    trigger: 'axis',
//			    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
//			        type: 'line',       // 默认为直线，可选为：'line' | 'shadow'
//			        lineStyle: {
//			            color: colors[parseInt(8 * Math.random())]//'#999'
//			        }
//			    }
//			},
//		    legend: {
//		        data: data.platforms,
//		        align: 'left'
//		    },
//		    dataZoom: [
//		   			{
//		   			id: 'dataZoomPhone',
//		   			type: 'inside',
//		   			show: true,
//		   			"start": 0,
//		   			"end": 30,
//		   			handleSize: 8
//		   			},
//		   			{
//		   			id: 'dataZoomPc',
//		   			type: 'slider',
//		   			"show": false,
//		   			"height": 30,
//		   			"xAxisIndex": [0],
//		   			bottom:0,
//		   			"start": 0,
//		   			"end": 30,
//		   			}
//		   	],
//		    toolbox: {
//		        // y: 'bottom',
//		        feature: {
//		            magicType: {
//		                type: ['stack', 'tiled']
//		            },
//		            saveAsImage: {
//		                pixelRatio: 2
//		            }
//		        }
//		    },
//		    tooltip: {},
//		    xAxis: {
//		        data: data.times,
//		        silent: false,
//		        splitLine: {
//		            show: false
//		        }
//		    },
//		    yAxis: [
//			    {
//			        type: 'value',
//			        scale: true,
//			        show: true,
//			        //min: 0,
//			        axisLabel: {
//			            formatter: function (value) {
//			                return toThousands(value);
//			            },
//			            textStyle: {
//			                color: asix_text_color,
//			                fontSize: asix_text_size
//			            },
//			            margin: y_asix_margin
//			        },
//			        axisTick: {
//			            length: asix_tick_length,
//			            lineStyle: {
//			                color: asix_line_color
//			            }
//			        },
//			        splitLine: {
//			            show: false,
//			            lineStyle: {
//			                color: '#eee'
//			            }
//			        },
//			        axisLine: {
//			            lineStyle: {
//			                color: asix_line_color
//			            }
//			        },
//			    }
//			],
//		    series: function(){
//		    	var series = [];
//			    if(!data.platforms) {
//			        return series;
//			    }
//			    for (var i in data.platforms) {
//			    	var p = data.platforms[i];
//			    	var item = {
//		    			name: p,
//				        type: 'bar',
//				        data: data.playCount[p],
//				        animationDelay: function (idx) {
//				            return idx * 10;
//				        }
//			    	}
//			    	series.push(item);
//			    }
//			    return series;
//		    }()
//		};
//}

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
    // return (num || 0).toString().replace(/(\d)(?=(?:\d{4})+$)/g, '$1,');
}

