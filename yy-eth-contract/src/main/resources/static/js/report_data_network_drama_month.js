var asix_text_color = "#888";
var asix_tick_length = 3;
var asix_line_color = "#ccc";
var asix_text_size = '.01rem';

var x_asix_margin = 8;
var y_asix_margin = 8;




nwmapp = new Vue({
    el: '#drama-month',
    data: {
        last_month_data:{},
        platform_data:{},
        type_data:{},
        new_drama_first_table:[],
        erery_platform_playcounts_top1:[]
    }

});

function networkDramaMonthBaseData(drama_last_month_data,drama_last_month_data_by_platform,drama_about_themename) {
    //1.2.5行数据
    nwmapp.last_month_data=drama_last_month_data;
    //3行数据
    nwmapp.platform_data=drama_last_month_data_by_platform;
    //4行数据
    nwmapp.type_data=drama_about_themename;
}
function onBillboardDramaCountsAndPc(data) {

    var dhd = echarts.init(document.getElementById("on_billboard_drama_count_pc"));
    var colors = ['#67edfc', '#FFBC38', '#C6A479', '#F48195', '#FEE01F', '#56E284', '#6776EC', '#C1E59B', '#FFB9B9', '#B0369C', '#3A854C', '#D40A4B', '#5216DE', '#D8B98A'];
    dhd.showLoading({
        text: '玩命计算中',
        textColor: '#333'
    });
    mychart_option = {
        title: {
            text: data.title,
            padding: 5,
            left: 'center'
        },
        colors: colors,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(a) {
                var rs = "";
                rs += '<div style=\"text-align:left;\">';
                for (var i = 0; i < a.length; i++) {

                    if (i == 0) {
                        rs += a[i].name + "<br/>";
                    }
                    rs += "<div style='text-align:left!important;margin-top:5px;margin-right:4px;float:left;width:12px;height:12px;border-radius:50%; background-color:" + a[i].color + "'></div>"
                    rs += a[i].seriesName + ":" + toThousands(a[i].value) + "<br/>";
                }
                rs += "</div>";
                return rs;
            }
        },
        legend: {
            bottom: 10,
            left: 'center',
            data:['播放量','剧数量']
        },
        xAxis: {
            data: data.x_data,
            type: 'category',
            axisPointer: {
                type: 'shadow'
            }
        },
        yAxis: [
            {
                name: "播放量",
                type: 'value',
                splitLine: {
                    lineStyle: {
                        color: '#eee'
                    }
                },
                axisLabel: {
                    formatter: function (value) {
                        return toThousands(value);
                    },
                    textStyle: {
                        color: asix_text_color,
                        fontSize: asix_text_size
                    },
                    margin: y_asix_margin
                }
            },
            {
                name: "剧数量",
                type: 'value',
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: '#eee'
                    }
                },
                axisLabel: {
                    formatter: function (value) {
                        return toThousands(value);
                    },
                    textStyle: {
                        color: asix_text_color,
                        fontSize: asix_text_size
                    },
                    margin: y_asix_margin
                }
            },
        ],

        series: function () {
            var series = [];
            var item = {
                name: '播放量',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: colors[6]
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                data: data.play_count
            }
            series.push(item);

            var item2 = {
                name: '剧数量',
                type: 'bar',
                barWidth: '60%',
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        color: colors[5]
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'inside',
                        color: "#97eea2",
                        formatter: function (a, b, c) {
                            return toThousandsNo(a.data);
                        },
                    }
                },
                data: data.show_count
            }
            series.push(item2);

            return series;
        }()
    };

    dhd.hideLoading();
    dhd.setOption(mychart_option);
    dhd.resize();
    $(window).on("resize", function () {
        dhd.resize();
    })
    $("html").css({"position": "static", "overflow-y": "scroll"});
}

function newDramaShowCountAndPc(data) {

    var dhd = echarts.init(document.getElementById("new_drama_month_count_pc"));
    var colors = ['#FC6E32', '#FFBC38', '#C6A479', '#F48195', '#FEE01F', '#56E284', '#6776EC', '#C1E59B', '#FFB9B9', '#B0369C', '#3A854C', '#D40A4B', '#5216DE', '#D8B98A'];
    dhd.showLoading({
        text: '玩命计算中',
        textColor: '#333'
    });
    mychart_option = {
        title: {
            text: data.title,
            padding: 5,
            left: 'center'
        },
        colors: colors,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(a) {
                var rs = "";
                rs += '<div style=\"text-align:left;\">';
                for (var i = 0; i < a.length; i++) {

                    if (i == 0) {
                        rs += a[i].name + "<br/>";
                    }
                    rs += "<div style='text-align:left!important;margin-top:5px;margin-right:4px;float:left;width:12px;height:12px;border-radius:50%; background-color:" + a[i].color + "'></div>"
                    rs += a[i].seriesName + ":" + toThousands(a[i].value) + "<br/>";
                }
                rs += "</div>";
                return rs;
            }
        },
        legend: {
            bottom: 10,
            left: 'center',
            data:['播放量','剧数量']
        },
        xAxis: {
            data: data.x_data,
            type: 'category',
            axisPointer: {
                type: 'shadow'
            }
        },
        yAxis: [
            {
                name: "播放量",
                type: 'value',
                splitLine: {
                    lineStyle: {
                        color: '#eee'
                    }
                },
                axisLabel: {
                    formatter: function (value) {
                        return toThousands(value);
                    },
                    textStyle: {
                        color: asix_text_color,
                        fontSize: asix_text_size
                    },
                    margin: y_asix_margin
                }
            },
            {
                name: "剧数量",
                type: 'value',
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: '#eee'
                    }
                },
                axisLabel: {
                    formatter: function (value) {
                        return toThousands(value);
                    },
                    textStyle: {
                        color: asix_text_color,
                        fontSize: asix_text_size
                    },
                    margin: y_asix_margin
                }
            },
        ],

        series: function () {
            var series = [];
            var item = {
                name: '播放量',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: colors[9]
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                data: data.play_count
            }
            series.push(item);

            var item2 = {
                name: '剧数量',
                type: 'bar',
                barWidth: '60%',
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        color: colors[3]
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'inside',
                        color: "#97eea2",
                        formatter: function (a, b, c) {
                            return toThousandsNo(a.data);
                        },
                    }
                },
                data: data.show_count
            }
            series.push(item2);

            return series;
        }()
    };

    dhd.hideLoading();
    dhd.setOption(mychart_option);
    dhd.resize();
    $(window).on("resize", function () {
        dhd.resize();
    })
    $("html").css({"position": "static", "overflow-y": "scroll"});
}
function newDramaFirstTable(data) {
    nwmapp.new_drama_first_table=data;
}

function singleAndManyCount(data) {
    var dhd = echarts.init(document.getElementById("single_and_many_count"));
    var colors = ['#FC6E32', '#FFBC38', '#C6A479', '#F48195', '#FEE01F', '#56E284', '#6776EC', '#C1E59B', '#FFB9B9', '#B0369C', '#3A854C', '#D40A4B', '#5216DE', '#D8B98A'];
    dhd.showLoading({
        text: '玩命计算中',
        textColor: '#333'
    });
    mychart_option = {
        title : {
            text: data.title,
            padding: 5,
            left: 'center'
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            bottom: 10,
            left: 'center',
            data:['独播','多平台']
        },

        calculable : true,
        xAxis : [
            {
                data: data.monthList,
                type: 'category',
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis : [
            {
                name: "数量",
                type: 'value',
                splitLine: {
                    lineStyle: {
                        color: '#eee'
                    }
                },
                axisLabel: {
                    formatter: function (value) {
                        return toThousands(value);
                    },
                    textStyle: {
                        color: asix_text_color,
                        fontSize: asix_text_size
                    },
                    margin: y_asix_margin
                }
            }
        ],
        series : [
            {
                name:'独播',
                type:'bar',
                data:data.singlePlatformShowCounts,
                itemStyle: {
                    normal: {
                        color: colors[1]
                    }
                },
            },
            {
                name:'多平台',
                type:'bar',
                data:data.manyPlatformShowCounts,
                itemStyle: {
                    normal: {
                        color: colors[3]
                    }
                },
            }
        ]
    };


    dhd.hideLoading();
    dhd.setOption(mychart_option);
    dhd.resize();
    $(window).on("resize", function () {
        dhd.resize();
    })
    $("html").css({"position": "static", "overflow-y": "scroll"});
}
function ereryPlatformPlaycountsTop1(data) {
    nwmapp.erery_platform_playcounts_top1=data;
}
