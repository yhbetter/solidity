var asix_text_color = "#888";
var asix_tick_length = 3;
var asix_line_color = "#ccc";
var asix_text_size = '.01rem';

var x_asix_margin = 8;
var y_asix_margin = 8;


// findShowCountAndPc(data.on_billboard_drama_count_pc,'drama_count_pc');
// findDramaOnOffBillboardCount(data.drama_on_off_billboard_count_pc);
// findDramaOnBillboardPc(data.drama_on_off_billboard_count_pc);
// findDramaTwoWeekPc(data.drama_two_week_pc);
// findDramaTwoWeekCount(data.drama_two_week_pc);

nwmapp = new Vue({
    el: '#network_drama',
    data: {
        base_data:{},
        last_week_on_billboard_count:0,
        yes_last_week_on_billboard_count_diff:"",
        last_week_on_billboard_pc:0,
        yes_last_week_on_billboard_pc_diff:"",
        single_program_info:[],
        many_platform_show_count:0,
        many_platform_play_count:0,
        single_platform_show_count:0,
        single_platform_play_count:0,
    }
});

function networkDramaWeekBaseData(base_data, on_billboard_drama_count_pc, network_drama_platform_count_pc) {
    nwmapp.base_data = base_data;
    //总体篇 第一行
    var last_week_on_billboard_count = on_billboard_drama_count_pc.show_count[on_billboard_drama_count_pc.show_count.length - 1];
    var yes_last_week_on_billboard_count = on_billboard_drama_count_pc.show_count[on_billboard_drama_count_pc.show_count.length - 2];
    nwmapp.last_week_on_billboard_count = last_week_on_billboard_count;
    var on_billboard_count_diff = last_week_on_billboard_count - yes_last_week_on_billboard_count;
    if(on_billboard_count_diff < 0) {
        nwmapp.yes_last_week_on_billboard_count_diff = "减少" + toThousands(Math.abs(on_billboard_count_diff));
    } else {
        nwmapp.yes_last_week_on_billboard_count_diff = "增加" + toThousands(Math.abs(on_billboard_count_diff));
    }
    //总体篇第二行
    var last_week_on_billboard_pc = on_billboard_drama_count_pc.play_count[on_billboard_drama_count_pc.play_count.length - 1];
    var yes_last_week_on_billboard_pc = on_billboard_drama_count_pc.play_count[on_billboard_drama_count_pc.play_count.length - 2];
    nwmapp.last_week_on_billboard_pc = toThousands(last_week_on_billboard_pc);
    var on_billboard_pc_diff = last_week_on_billboard_pc - yes_last_week_on_billboard_pc;
    if(on_billboard_pc_diff < 0) {
        nwmapp.yes_last_week_on_billboard_pc_diff = "减少" + toThousands(Math.abs(on_billboard_pc_diff));
    } else {
        nwmapp.yes_last_week_on_billboard_pc_diff = "增加" + toThousands(Math.abs(on_billboard_pc_diff));
    }

    // 节目篇，文本部分
    // 爱奇艺在播网剧xxx部，前台周播放量达xxx亿，较xxx周增加/减少xxx亿；
    var vdp_platforms = network_drama_platform_count_pc.platforms;
    var vdp_play_counts = network_drama_platform_count_pc.play_count;
    var vdp_show_counts = network_drama_platform_count_pc.show_count;
    var single_platform_show_count = 0;
    var single_platform_play_count = 0;
    var single_program_info = [];
    for( var i = 0; i < vdp_platforms.length; i ++) {
        if (i == 0) continue;
        single_platform_play_count += vdp_play_counts[1][i];
        single_platform_show_count += vdp_show_counts[1][i];
        var diff_week_play_count = vdp_play_counts[1][i] - vdp_play_counts[0][i];
        var wpc = "";
        if ( diff_week_play_count < 0) {
            wpc = "减少" + toThousands(Math.abs(diff_week_play_count));
        } else {
            wpc = "增加" + toThousands(Math.abs(diff_week_play_count));
        }
        var item = {
            platform_name : vdp_platforms[i],
            week_play_count : toThousands(vdp_play_counts[1][i]),
            show_count: vdp_show_counts[1][i],
            week_diff: wpc
        }
        single_program_info.push(item);

    }
    nwmapp.single_program_info = single_program_info;

    nwmapp.many_platform_show_count = network_drama_platform_count_pc.show_count[1][0];
    nwmapp.many_platform_play_count = toThousands(network_drama_platform_count_pc.play_count[1][0]);
    nwmapp.single_platform_show_count = single_platform_show_count;
    nwmapp.single_platform_play_count = toThousands(single_platform_play_count);

}



function networkDramaPlatformCount(data) {
    var dhd = echarts.init(document.getElementById('network_drama_platform_count'));
    var colors = ['#FC6E32', '#FFBC38', '#C6A479', '#F48195', '#FEE01F', '#56E284', '#6776EC', '#C1E59B', '#FFB9B9', '#B0369C', '#3A854C', '#D40A4B', '#5216DE', '#D8B98A'];
    dhd.showLoading({
        text: '玩命计算中',
        textColor: '#333'
    });
    mychart_option = {
        title: {
            text: data.show_count_title,
            left: 'center'
        },
        colors: colors ,
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },

        },
        legend: {
            bottom: 10,
            left: 'center',
            data:data.show_count_legend
        },
        xAxis: {
            data: data.platforms,
            type: 'category',
            axisPointer: {
                type: 'shadow'
            }
        },
        yAxis: [
            {
                splitLine: {
                    lineStyle: {
                        color: '#eee'
                    }
                },
                axisLabel: {
                    formatter: function (value) {
                        return toThousands(value);
                    }
                }
            }
        ],

        series: function () {
            var series = [];
            var item = {
                name: data.show_count_legend[0],
                type: 'bar',
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
                data: data.show_count[0]
            }
            series.push(item);

            var item2 = {
                name: data.show_count_legend[1],
                type: 'bar',
                // yAxisIndex: 1,
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
                data: data.show_count[1]
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


function networkDramaPlatformPc(data) {
    var dhd = echarts.init(document.getElementById('network_drama_platform_pc'));
    var colors = ['#FC6E32', '#FFBC38', '#C6A479', '#F48195', '#FEE01F', '#56E284', '#6776EC', '#C1E59B', '#FFB9B9', '#B0369C', '#3A854C', '#D40A4B', '#5216DE', '#D8B98A'];
    dhd.showLoading({
        text: '玩命计算中',
        textColor: '#333'
    });
    mychart_option = {
        title: {
            text: data.play_count_title,
            left: 'center'
        },
        colors: colors ,
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },

        },
        legend: {
            bottom: 10,
            left: 'center',
            data:data.play_count_legend
        },
        xAxis: {
            data: data.platforms,
            type: 'category',
            axisPointer: {
                type: 'shadow'
            }
        },
        yAxis: [
            {
                splitLine: {
                    lineStyle: {
                        color: '#eee'
                    }
                },
                axisLabel: {
                    formatter: function (value) {
                        return toThousands(value);
                    }
                }
            }
        ],

        series: function () {
            var series = [];
            var item = {
                name: data.play_count_legend[0],
                type: 'bar',
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
                data: data.play_count[0]
            }
            series.push(item);

            var item2 = {
                name: data.play_count_legend[1],
                type: 'bar',
                // yAxisIndex: 1,
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
                data: data.play_count[1]
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