var asix_text_color = "#888";
var asix_tick_length = 3;
var asix_line_color = "#ccc";
var asix_text_size = '.01rem';

var x_asix_margin = 8;
var y_asix_margin = 8;

var nvapp = new Vue({
    el: '#variety',
    data: {
        main_week: 0,
        new_network_variety_show_size: 0,
        new_shows:[],
        last_week_show_count:0,
        show_count_growth:"",
        last_week_play_count:0,
        play_count_growth:"",
        many_show_size:0,
        many_play_count:"",
        all_single_show_size:0,
        all_single_play_count:0,
        youku_show_size:0,
        youku_play_count:0,
        iqiyi_show_size:0,
        iqiyi_play_count:0,
        tengxun_show_size:0,
        tengxun_play_count:0,
        on_billboard_variety_week_billboard:[],
        week_shows:[],
    }
})

function networkVarietyBaseData(data,on_billboard_variety_count_pc,on_billboard_variety_two_week_diff) {



    nvapp.main_week = data.main_week;
    nvapp.new_network_variety_show_size = data.new_show_size;
    nvapp.new_shows = data.new_shows;

    var show_counts = on_billboard_variety_count_pc.show_count;
    var play_counts = on_billboard_variety_count_pc.play_count;

    var last_week_show_count = show_counts[show_counts.length - 1];
    nvapp.last_week_show_count = last_week_show_count;

    var show_count_growth = last_week_show_count - show_counts[show_counts.length - 2];
    if(show_count_growth < 0){
        nvapp.show_count_growth = "减少" + Math.abs(show_count_growth);
    }else {
        nvapp.show_count_growth = "增加" + Math.abs(show_count_growth);
    }

    var last_week_play_count = play_counts[play_counts.length - 1];
    nvapp.last_week_play_count = toThousands(last_week_play_count);

    var play_count_growth = last_week_play_count - play_counts[play_counts.length - 2];
    if(play_count_growth < 0){
        nvapp.play_count_growth = "减少" + toThousands(Math.abs(play_count_growth));
    }else {
        nvapp.play_count_growth = "增加" + toThousands(Math.abs(play_count_growth));
    }

    var last_week_show_count_pc = on_billboard_variety_two_week_diff.data[1];

    nvapp.many_show_size = last_week_show_count_pc.show_count[0];
    nvapp.many_play_count = toThousands(last_week_show_count_pc.play_count[0]);

    nvapp.tengxun_show_size = last_week_show_count_pc.show_count[1];
    nvapp.tengxun_play_count = toThousands(last_week_show_count_pc.play_count[1]);

    nvapp.iqiyi_show_size = last_week_show_count_pc.show_count[2];
    nvapp.iqiyi_play_count = toThousands(last_week_show_count_pc.play_count[2]);

    nvapp.youku_show_size = last_week_show_count_pc.show_count[3];
    nvapp.youku_play_count = toThousands(last_week_show_count_pc.play_count[3]);

    for(var i = 1; i<last_week_show_count_pc.show_count.length; i++ ){
        nvapp.all_single_show_size += last_week_show_count_pc.show_count[i];
    }
    var all_single_play_count = 0;
    for(var i = 1; i<last_week_show_count_pc.play_count.length; i++ ){
        all_single_play_count += last_week_show_count_pc.play_count[i];
    }
    nvapp.all_single_play_count = toThousands(all_single_play_count);

    nvapp.week_shows = data.week_shows;

}

function onBillboardVarietyWeekBillboard(data) {
    nvapp.on_billboard_variety_week_billboard = data;
}


function onBillboardVarietyTwoWeekDiff(data) {
    var dhd = echarts.init(document.getElementById("on_billboard_variety_two_week_diff"));
    var colors = ['#FC6E32', '#FFBC38', '#C6A479', '#F48195', '#FEE01F', '#56E284', '#6776EC', '#C1E59B', '#FFB9B9', '#B0369C', '#3A854C', '#D40A4B', '#5216DE', '#D8B98A'];
    dhd.showLoading({
        text: '玩命计算中',
        textColor: '#333'
    });
    mychart_option = {
        title: {
            text: "各平台网络综艺数量对比图",
            left: 'center'
        },
        colors: colors,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }

        },
        legend: {
            bottom: 10,
            left: 'center',
            data:[data.week[1], data.week[3]]
        },
        xAxis: {
            data: data.data[0].platform,
            type: 'category',
            axisPointer: {
                type: 'shadow'
            }
        },
        yAxis: [
            {
                type: 'value',
                splitLine: {
                    show: true,
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

            var item2 = {
                name: data.week[1],
                type: 'bar',
                barWidth: '30%',
                itemStyle: {
                    normal: {
                        color: colors[1]
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: function (a, b, c) {
                            return toThousands(a.data);
                        },
                    }
                },
                data: data.data[0].show_count
            }
            series.push(item2);

            var item4 = {
                name: data.week[3],
                type: 'bar',
                barWidth: '30%',
                itemStyle: {
                    normal: {
                        color: colors[3]
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: function (a, b, c) {
                            return toThousands(a.data);
                        },
                    }
                },
                data: data.data[1].show_count
            }
            series.push(item4);

            return series;
        }()
    };

    dhd.hideLoading();
    dhd.setOption(mychart_option);
    dhd.resize();
    $(window).on("resize", function () {
        dhd.resize();
    })
    // $("html").css({"position": "static", "overflow-y": "scroll"});
}

function onBillboardVarietyTwoWeekDiffPc(data) {
    var dhd = echarts.init(document.getElementById("on_billboard_variety_two_week_diff_pc"));
    var colors = ['#FC6E32', '#FFBC38', '#C6A479', '#F48195', '#FEE01F', '#56E284', '#6776EC', '#C1E59B', '#FFB9B9', '#B0369C', '#3A854C', '#D40A4B', '#5216DE', '#D8B98A'];
    dhd.showLoading({
        text: '玩命计算中',
        textColor: '#333'
    });
    mychart_option = {
        title: {
            text: "各平台网络综艺播放量对比图",
            left: 'center'
        },
        colors: colors,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }

        },
        legend: {
            bottom: 10,
            left: 'center',
            data:[data.week[0], data.week[2]]
        },
        xAxis: {
            data: data.data[0].platform,
            type: 'category',
            axisPointer: {
                type: 'shadow'
            }
        },
        yAxis: [
            {
                type: 'value',
                show: true,
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

        series: function () {
            var series = [];
            var item = {
                name: data.week[0],
                type: 'bar',
                barWidth: '30%',
                itemStyle: {
                    normal: {
                        color: colors[0]
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: function (a, b, c) {
                            return toThousands(a.data);
                        },
                    }
                },
                data: data.data[0].play_count
            }
            series.push(item);

            var item3 = {
                name: data.week[2],
                type: 'bar',
                barWidth: '30%',
                itemStyle: {
                    normal: {
                        color: colors[2]
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: function (a, b, c) {
                            return toThousands(a.data);
                        },
                    }
                },
                data: data.data[1].play_count
            }
            series.push(item3);

            return series;
        }()
    };

    dhd.hideLoading();
    dhd.setOption(mychart_option);
    dhd.resize();
    $(window).on("resize", function () {
        dhd.resize();
    })
    // $("html").css({"position": "static", "overflow-y": "scroll"});
}

function findShowCountAndPc(data, id) {

    var dhd = echarts.init(document.getElementById(id));
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
                    data:['剧数量','播放量']
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
                        name: "剧数量",
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
                        name: "播放量",
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
                        name: '剧数量',
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: colors[0]
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        data: data.show_count
                    }
                    series.push(item);

                    var item2 = {
                        name: '播放量',
                        type: 'bar',
                        barWidth: '60%',
                        yAxisIndex: 1,
                        itemStyle: {
                            normal: {
                                color: colors[1]
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'inside',
                                color: "#EE1200",
                                formatter: function (a, b, c) {
                                    return toThousandsNo(a.data);
                                },
                            }
                        },
                        data: data.play_count
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




function toThousands(num) {
    if (num == undefined || num == null || num == 0) {
        return '0';
    }
    if (num > 100000000) {
        return parseFloat(num / 100000000).toFixed(1) + "亿";
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
    //正则是真不好看懂啊
    // return (num || 0).toString().replace(/(\d)(?=(?:\d{4})+$)/g, '$1,');
}
function toThousandsNo(num) {
    if (num == undefined || num == null || num == 0) {
        return '0';
    }
    if (num > 100000000) {
        return parseFloat(num / 100000000).toFixed(1) ;
    }
    if (num > 9999999) {
        var newNum = parseFloat(num / 10000000).toFixed(1);
        return newNum.toString() ;
    }

    //如果是1万及以上，去掉后面的，加上万
    if (num > 9999) {
        var newNum = parseFloat(num / 10000).toFixed(1);
        return newNum.toString() ;
    } else {
        return num.toString();
    }
    //正则是真不好看懂啊
    // return (num || 0).toString().replace(/(\d)(?=(?:\d{4})+$)/g, '$1,');
}