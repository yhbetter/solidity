var asix_text_color = "#888";
var asix_tick_length = 3;
var asix_line_color = "#ccc";
var asix_text_size = '.01rem';

var x_asix_margin = 8;
var y_asix_margin = 8;


nvmapp = new Vue({
    el: '#variety-month',
    data: {

        new_variety_first_vv:[],
        on_billboard_last_month_variety_count:0,
        diff_on_billboard_last_month_variety_count:"",
        on_billboard_last_month_variety_pc:0,
        diff_on_billboard_last_month_variety_pc:"",
        new_variety_pc_proportion:"",
        new_variety_pc:"",
        last_month_max_show_count_platform:"",
        last_month_max_play_count_platform:"",
        single_platform_count_pc_data:[],
        single_platform_pc_up_down_data:[],
        variety_theme_count_pc_text_data:[],
        data:{},
        platform_data:{},
        type_data:{},
        top10_Data:{}

    }
});



function networkVarietyMonthBaseData(data,on_billboard_variety_count_pc,new_variety_pc_distribution,on_billboard_last_month_platform_variety_count_pc,single_variety_platform_count_pc, variety_theme_count_pc,vatirty_last_month_date_by_platform,vatirty_about_theme_name,max_platform_in_variety_playcounts_top10) {
    nvmapp.data = data;
    nvmapp.platform_data=vatirty_last_month_date_by_platform;
    nvmapp.type_data=vatirty_about_theme_name;
    nvmapp.top10_Data=max_platform_in_variety_playcounts_top10;
    // 总体篇下面第一行数据
    var on_billboard_last_month_variety_count = on_billboard_variety_count_pc.show_count[on_billboard_variety_count_pc.show_count.length - 1];
    nvmapp.on_billboard_last_month_variety_count = on_billboard_last_month_variety_count;
    var yes_on_billboard_variety_count = on_billboard_variety_count_pc.show_count[on_billboard_variety_count_pc.show_count.length - 2];
    var diff_onb_count = (on_billboard_last_month_variety_count - yes_on_billboard_variety_count);
    if (diff_onb_count < 0) {
        nvmapp.diff_on_billboard_last_month_variety_count = "减少" + Math.abs(diff_onb_count);
    }else {
        nvmapp.diff_on_billboard_last_month_variety_count = "增加" + diff_onb_count;
    }
    // 总体篇下面第二行数据
    var on_billboard_last_month_variety_pc = on_billboard_variety_count_pc.play_count[on_billboard_variety_count_pc.play_count.length - 1];
    nvmapp.on_billboard_last_month_variety_pc = toThousands(on_billboard_last_month_variety_pc);
    var yes_on_billboard_variety_pc = on_billboard_variety_count_pc.play_count[on_billboard_variety_count_pc.play_count.length - 2];
    var diff_onb_pc = (on_billboard_last_month_variety_pc - yes_on_billboard_variety_pc);
    if (diff_onb_pc < 0) {
        nvmapp.diff_on_billboard_last_month_variety_pc = "减少" + toThousands(Math.abs(diff_onb_pc));
    }else {
        nvmapp.diff_on_billboard_last_month_variety_pc = "增加" + toThousands(diff_onb_pc);
    }
    // 在本月前台播放量占比
    var nvpcdpc1 = new_variety_pc_distribution.data[0].value;
    var nvpcdpc2 = new_variety_pc_distribution.data[1].value;
    nvmapp.new_variety_pc_proportion = (nvpcdpc1 / (nvpcdpc1 + nvpcdpc2) * 100).toFixed(2) + "%";
    nvmapp.new_variety_pc = toThousands(nvpcdpc1);

    //本月在播网综数量上，平台数量最多，前台播放量上，平台播放量居首位。
    var olpv_counts = on_billboard_last_month_platform_variety_count_pc.count_data.count;
    var olpv_counts_platform = on_billboard_last_month_platform_variety_count_pc.count_data.platform;
    var olpv_pcs = on_billboard_last_month_platform_variety_count_pc.pc_data.count;
    var olpv_pcs_platform = on_billboard_last_month_platform_variety_count_pc.pc_data.platform;

    var index_count = 0;
    var compare_count = 0;
    for (var i = 0; i < olpv_counts.length; i ++) {
        if(olpv_counts[i] >= compare_count){
            index_count = i;
            compare_count = olpv_counts[i];
        }
    }
    nvmapp.last_month_max_show_count_platform = olpv_counts_platform[index_count];

    var index_pc = 0;
    var compare_pc = 0;
    for (var i = 0; i < olpv_pcs.length; i ++) {
        if(olpv_pcs[i] >= compare_pc){
            index_pc = i;
            compare_pc = olpv_pcs[i];
        }
    }
    nvmapp.last_month_max_play_count_platform = olpv_pcs_platform[index_pc];

    // xx 本月在播综艺部，前台播放量
    var single_platform_count_pc_data = [];
    for (var i = 0; i < olpv_counts_platform.length; i ++) {
        var platform = olpv_counts_platform[i];
        if (platform == "多平台") {
            continue;
        }
        var item = {
            platform:platform,
            count:olpv_counts[i],
            pc:toThousands(olpv_pcs[i])
        }
        single_platform_count_pc_data.push(item);
    }
    nvmapp.single_platform_count_pc_data = single_platform_count_pc_data;


    // 腾讯视频前台播放量为xxx亿，较xxx月增幅/降幅xxx%；
    var single_platform_pc_up_down_data = [];
    var svpcp_platforms = single_variety_platform_count_pc.platform;
    var svpcp_play_counts = single_variety_platform_count_pc.play_count;
    var last_month_play_counts = svpcp_play_counts[svpcp_play_counts.length - 1];
    var yes_last_month_play_counts = svpcp_play_counts[svpcp_play_counts.length - 2];
    var yes_last_month = single_variety_platform_count_pc.month[single_variety_platform_count_pc.month.length - 2];
    for (var i = 0; i < svpcp_platforms.length; i ++) {

        var ylmpc = yes_last_month_play_counts[i];
        if (ylmpc <= 0){ ylmpc = 1; }

        if( last_month_play_counts[i] <= 0) { continue; }

        var up_down = "";
        var diff = last_month_play_counts[i] - ylmpc;
        if(diff < 0) {
            up_down = "降幅" + (Math.abs(diff) / ylmpc * 100).toFixed(2) + "%";
        }else {
            up_down = "增幅" + (Math.abs(diff) / ylmpc * 100).toFixed(2) + "%";
        }

        var i_item  = {
            yes_last_month:yes_last_month,
            platform:svpcp_platforms[i],
            pc:toThousands(last_month_play_counts[i]),
            up_down:up_down
        }
        single_platform_pc_up_down_data.push(i_item);
    }
    nvmapp.single_platform_pc_up_down_data = single_platform_pc_up_down_data;

    // variety_theme_count_pc
    // 腾讯视频前台播放量排名第一的网综类型是xxx，前台播放量为xxx亿；
    var variety_theme_count_pc_text_data = [];
    var variety_theme_count_pc_theme = variety_theme_count_pc.theme;
    var variety_theme_count_pc_platform = variety_theme_count_pc.platform;
    var variety_theme_count_pc_pc = variety_theme_count_pc.pc;

    for (var i = 0; i < variety_theme_count_pc_platform.length; i ++) {
        var platform = variety_theme_count_pc_platform[i];

        var vt_index = 0;
        var vt_compare_count = 0;
        for (var j = 0; j < variety_theme_count_pc_pc.length; j ++) {
            var c = variety_theme_count_pc_pc[j][i];
            if(c >= vt_compare_count){
                vt_compare_count = c;
                vt_index = j;
            }
        }
        var vt_item = {
            platform:platform,
            max_count_theme_name:variety_theme_count_pc_theme[vt_index],
            max_pc:toThousands(vt_compare_count)
        }
        variety_theme_count_pc_text_data.push(vt_item);
    }
    nvmapp.variety_theme_count_pc_text_data = variety_theme_count_pc_text_data;


}




function newVarietyFirstVV(data) {

    nvmapp.new_variety_first_vv = data;

}



function varietyThemePc(data) {

    var dhd = echarts.init(document.getElementById("variety_theme_pc"));
    var colors = ['#FC6E32', '#FFBC38', '#C6A479', '#F48195', '#FEE01F', '#56E284', '#6776EC', '#C1E59B', '#FFB9B9', '#B0369C', '#3A854C', '#D40A4B', '#5216DE', '#D8B98A'];
    dhd.showLoading({
        text: '玩命计算中',
        textColor: '#333'
    });
    mychart_option = {
        title: {
            text: data.pc_title,
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
            data:data.theme
        },
        xAxis: {
            data: data.platform,
            type: 'category',
            axisPointer: {
                type: 'shadow'
            }
        },
        yAxis: [
            {
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

        series: function () {
            var series = [];
            $.each(data.pc, function (i, o) {
                var item = {
                    name: data.theme[i],
                    type: 'bar',
                    stack:"播放量",
                    itemStyle: {
                        normal: {
                            color: colors[i]
                        }
                    },
                    // label: {
                    //     normal: {
                    //         show: true,
                    //         position: 'top',
                    //         formatter: function (a, b, c) {
                    //             return toThousands(a.data);
                    //         },
                    //     }
                    // },
                    data: o
                }
                series.push(item);
            });


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

function varietyThemeCount(data) {

    var dhd = echarts.init(document.getElementById("variety_theme_count"));
    var colors = ['#FC6E32', '#FFBC38', '#C6A479', '#F48195', '#FEE01F', '#56E284', '#6776EC', '#C1E59B', '#FFB9B9', '#B0369C', '#3A854C', '#D40A4B', '#5216DE', '#D8B98A'];
    dhd.showLoading({
        text: '玩命计算中',
        textColor: '#333'
    });
    mychart_option = {
        title: {
            text: data.count_title,
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
            data:data.theme
        },
        xAxis: {
            data: data.platform,
            type: 'category',
            axisPointer: {
                type: 'shadow'
            }
        },
        yAxis: [
            {
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

        series: function () {
            var series = [];
            $.each(data.count, function (i, o) {
                var item = {
                    name: data.theme[i],
                    type: 'bar',
                    stack:"播放量",
                    itemStyle: {
                        normal: {
                            color: colors[i]
                        }
                    },
                    // label: {
                    //     normal: {
                    //         show: true,
                    //         position: 'top',
                    //         formatter: function (a, b, c) {
                    //             return toThousands(a.data);
                    //         },
                    //     }
                    // },
                    data: o
                }
                series.push(item);
            });


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

function singleVarietyPlatformPc(data) {
    var dhd = echarts.init(document.getElementById("single_variety_platform_pc"));
    var colors = ['#FC6E32', '#FFBC38', '#C6A479', '#F48195', '#FEE01F', '#56E284', '#6776EC', '#C1E59B', '#FFB9B9', '#B0369C', '#3A854C', '#D40A4B', '#5216DE', '#D8B98A'];
    dhd.showLoading({
        text: '玩命计算中',
        textColor: '#333'
    });
    mychart_option = {
        title: {
            text: "近12个月各独播平台当月在播节目播放量对比",
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
                var totalVal = 0;

                rs += '<div style=\"text-align:left;\">';
                for (var i = 0; i < a.length; i++) {
                    totalVal += a[i].value;
                    if (i == 0) {
                        rs += a[i].name + "<br/>";
                    }
                    rs += "<div style='text-align:left!important;margin-top:5px;margin-right:4px;float:left;width:12px;height:12px;border-radius:50%; background-color:" + a[i].color + "'></div>"
                    rs += a[i].seriesName + ":" + toThousands(a[i].value) + "<br/>";

                }
                if(a.length > 1){
                    rs += "<p>总计："+toThousands(totalVal)+"</p>";
                }

                rs += "</div>";
                return rs;
            }
        },
        legend: {
            bottom: 10,
            left: 'center',
            data:data.month
        },
        xAxis: {
            data: data.platform,
            type: 'category',
            axisPointer: {
                type: 'shadow'
            }
        },
        yAxis: [
            {
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

        series: function () {
            var series = [];
            $.each(data.play_count, function (i, o) {
                var item = {
                    name: data.month[i],
                    type: 'bar',
                    stack:"播放量",
                    itemStyle: {
                        normal: {
                            color: colors[i]
                        }
                    },
                    // label: {
                    //     normal: {
                    //         show: true,
                    //         position: 'top',
                    //         formatter: function (a, b, c) {
                    //             console.log(a)
                    //             var totalVal=0;
                    //             for (var i = 0; i < a.length; i++) {
                    //                 totalVal += a[i].value;
                    //             }
                    //             return toThousands(totalVal);
                    //         },
                    //     }
                    // },
                    data: o
                }
                series.push(item);
            });


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

function singleVarietyPlatformCount(data) {

    var dhd = echarts.init(document.getElementById("single_variety_platform_count"));
    var colors = ['#FC6E32', '#FFBC38', '#C6A479', '#F48195', '#FEE01F', '#56E284', '#6776EC', '#C1E59B', '#FFB9B9', '#B0369C', '#3A854C', '#D40A4B', '#5216DE', '#D8B98A'];
    dhd.showLoading({
        text: '玩命计算中',
        textColor: '#333'
    });
    mychart_option = {
        title: {
            text: "近12个月各独播平台当月在播节目数量对比",
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
            data:data.month
        },
        xAxis: {
            data: data.platform,
            type: 'category',
            axisPointer: {
                type: 'shadow'
            }
        },
        yAxis: [
            {
                type: 'value'
            }

        ],

        series: function () {
            var series = [];
            $.each(data.show_count, function (i, o) {
                var item = {
                    name: data.month[i],
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: colors[i]
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
                    data: o
                }
                series.push(item);
            });


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

function onBillboardLastMonthVarietyPc(data) {
    var dhd = echarts.init(document.getElementById("on_billboard_last_month_variety_pc"));
    var colors = ['#FC6E32', '#FFBC38', '#C6A479', '#F48195', '#FEE01F', '#56E284', '#6776EC', '#C1E59B', '#FFB9B9', '#B0369C', '#3A854C', '#D40A4B', '#5216DE', '#D8B98A'];
    dhd.showLoading({
        text: '玩命计算中',
        textColor: '#333'
    });
    mychart_option = {
        title: {
            text: data.pc_title,
            left: 'center'
        },
        colors: colors,

        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'

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
        xAxis : [
            {
                type : 'category',
                data : data.pc_data.platform,
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis : [
            {
                type : 'value',
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
                name: '播放量',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: colors[0],

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
                data: data.pc_data.count
            }
            series.push(item);


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

function onBillboardLastMonthVarietyCount(data) {
    var dhd = echarts.init(document.getElementById("on_billboard_last_month_variety_count"));
    var colors = ['#FC6E32', '#FFBC38', '#C6A479', '#F48195', '#FEE01F', '#56E284', '#6776EC', '#C1E59B', '#FFB9B9', '#B0369C', '#3A854C', '#D40A4B', '#5216DE', '#D8B98A'];
    dhd.showLoading({
        text: '玩命计算中',
        textColor: '#333'
    });
    mychart_option = {
        title: {
            text: data.count_title,
            left: 'center'
        },
        colors: colors,

        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        xAxis : [
            {
                type : 'category',
                data : data.count_data.platform,
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis : [
            {
                type : 'value',

            }
        ],
        series: function () {
            var series = [];
            var item = {
                name: '数量',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: colors[0],

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
                data: data.count_data.count
            }
            series.push(item);


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


function newVarietyPcDistribution(data) {
    var dhd = echarts.init(document.getElementById("new_variety_pc_distribution"));
    var colors = ['#FC6E32', '#FFBC38', '#C6A479', '#F48195', '#FEE01F', '#56E284', '#6776EC', '#C1E59B', '#FFB9B9', '#B0369C', '#3A854C', '#D40A4B', '#5216DE', '#D8B98A'];
    dhd.showLoading({
        text: '玩命计算中',
        textColor: '#333'
    });
    mychart_option = {
        title: {
            text: data.title,
            left: 'center'
        },
        colors: colors,

        tooltip : {
            trigger: 'item',
            // formatter: "{a} <br/>{b} : {c} ({d}%)"
            formatter: function(a,b,c,d) {
                var seriesName="";
                seriesName=a.seriesName;
                var value="";
                value=a.data.value;
                var name="";
                name=a.data.name;
                var percent="";
                percent=a.percent;
                return seriesName+"<br/>"+name+":"+toThousands(value)+"("+percent+"%)";
                }
        },


        series: function () {
            var series = [];


            var item = {
                name: '播放量',
                type:'pie',
                selectedMode: 'single',
                radius: [0, '50%'],
                itemStyle: {
                    normal: {
                        color: colors[0]
                    }
                },
                label: {
                    normal: {
                        show:true,
                        position:'outside',
                        formatter: '{b}  {d}%  ',
                    }
                },
                labelLine: {
                    normal: {
                        show:false
                    }
                },
                data: []
            };

            var d = [];
            pc_data1 = data.data;
            for(var i=0;i<pc_data1.length;i++){
                pd = pc_data1[i];
                var data_item = {
                    value: pd.value,
                    name: pd.name,
                    itemStyle: {
                        normal: {
                            color: colors[i]
                        }
                    }
                };
                d.push(data_item);
            }
            item.data = d;

            series.push(item);


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
