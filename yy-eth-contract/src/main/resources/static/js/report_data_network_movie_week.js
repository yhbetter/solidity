var asix_text_color = "#888";
var asix_tick_length = 3;
var asix_line_color = "#ccc";
var asix_text_size = '.01rem';

var x_asix_margin = 8;
var y_asix_margin = 8;


var nmapp = new Vue({

    el: '#network-movie-week',
    data: {
        base_data:{},
    }


});

function networkMovieBaseData(data) {
    nmapp.base_data = data;
}


function weekAloneFirstVV(data, id, colo) {
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
            }

        },
        legend: {
            bottom: 10,
            left: 'center',
            data:['新增数量','首日前台播放量(万)']
        },
        xAxis: {
            data: data.week,
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
            },
            {
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
                name: '首日前台播放量(万)',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: colors[colo]
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

                data: data.play_count
            }
            series.push(item);

            var item2 = {
                name: '新增数量',
                type: 'bar',
                yAxisIndex: 1,
                barWidth: '60%',
                itemStyle: {
                    normal: {
                        color: colors[colo+1]
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
