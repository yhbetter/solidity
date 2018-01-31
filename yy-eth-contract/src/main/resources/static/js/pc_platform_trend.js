// 基于准备好的dom，初始化echarts实例
var myChart = {};

var asix_tick_length = 3;
var asix_text_size = '.01rem';
var colors = ['#FC6E32', '#FFBC38', '#99D1C5', '#F48195', '#FEE01F', '#56E284', '#6776EC', '#C1E59B', '#FFB9B9', '#B0369C', '#3A854C', '#D40A4B', '#5216DE', '#FA8F3A'];
var asix_text_color = "#888";
var asix_line_color = "#ccc";
var x_asix_margin = 8;
var y_asix_margin = 8;

var graphData ={};//曲线图数据全局对象
var options = {};
var loadingDataLock = false;

+(function($){
	myChart = echarts.init(document.getElementById('graph'));
	options = {
		defaultCategory:'NETWORK_DRAMA',
		defaultPlatform:1,
		currentCategory:null,
		currentPlatform:null
	}
	getData(options.defaultCategory,options.defaultPlatform);
	changeCategoryEvent();
})($)

function changeCategoryEvent(){
	$(".btn-group button").on('click',function(){
		if(loadingDataLock){
			toastr.info("正在加载数据中!请稍后~")
			return;
		}
		var btn = $(this);
		var val = btn.attr('data-val');
		if(isNaN(val)){
			btn.siblings().attr('class','btn btn-default');
			btn.attr('class','btn btn-success');
			getData(val,options.currentPlatform);
		}else{
			btn.siblings().attr('class','btn btn-default');
			btn.attr('class','btn btn-info');
			getData(options.currentCategory,val);
		}
	})
}

function getData(category,platform){
	if(category.trim()==""){
		toastr.warning("类型不能为空");
		return;
	}
	if(!platform){
		toastr.warning("平台不能为空");
		return;
	}
	
	myChart.clear();
	myChart.showLoading();
	
	var dataKey = category+":"+platform;
	if(!graphData[dataKey]){
		loadingDataLock = true;
		$.ajax({
			type:'GET',
			url:'/play_count/platform/trend?category='+category+'&platformId='+platform,
			dateType:'json',
			timeout:30000,
			success:function(res){
				if(res.code==0){
					// 指定图表的配置项和数据
					graphData[dataKey] = res.data;
					var graph_options = getGraph(dataKey);
					myChart.setOption(graph_options);
					myChart.hideLoading();
					fillTable(dataKey);
					
					options.currentCategory = category;
					options.currentPlatform = platform;
				}else{
					toastr.error(res.msg);
					myChart.hideLoading();
				}
				loadingDataLock = false;
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				toastr.error(XMLHttpRequest.status+":"+textStatus);
				loadingDataLock = false;
			}
		})
	}else{
		var graph_options = getGraph(dataKey);
		myChart.setOption(graph_options);
		myChart.hideLoading();
		fillTable(dataKey);
		
		options.currentCategory = category;
		options.currentPlatform = platform;
	}
}

var getGraph = function(dataKey) {
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
		    data: graphData[dataKey].dates,
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
		    if(!graphData[dataKey].datas) {
		        return series;
		    }
		    $.each(graphData[dataKey].datas,function(i,o){
		    	var item = {
		            name: i,
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
		            data: o
		        }
		        series.push(item);
		    })
		    return series;
		}()
	};
};

var fillTable = function(dataKey){
	var html = '';
	$.each(graphData[dataKey].dates,function(i,o){
		var neg = graphData[dataKey].datas.neg;
		var pos = graphData[dataKey].datas.pos;
		html += '<tr><td>'+o+'</td><td>'+pos[i]+'</td><td>'+neg[i]+'</td></tr>';
	})
	if(html){
		$("#graph-data-tab tbody").html(html);
	}
}

var toThousands = function(num) {
    if (num == undefined || num == null || num == 0) {
        return '0';
    }
    if (num > 9999999||num < -9999999) {
        var newNum = parseFloat(num / 10000000).toFixed(1);
        return newNum.toString() + '千万';
    }
    //如果是1万及以上，去掉后面的，加上万
    if (num > 9999||num<-9999) {
        var newNum = parseFloat(num / 10000).toFixed(1);
        return newNum.toString() + '万';
    } else {
        return num.toString();
    }
    // return (num || 0).toString().replace(/(\d)(?=(?:\d{4})+$)/g, '$1,');
}

