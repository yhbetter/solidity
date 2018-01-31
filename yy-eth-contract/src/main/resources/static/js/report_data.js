var asix_text_color = "#888";
var asix_tick_length = 3;
var asix_line_color = "#ccc";
var asix_text_size = '.01rem';

var x_asix_margin = 8;
var y_asix_margin = 8;

// getEachPlayNum(1);

$("#search_btn").click(function () {
    var category = $("#category").val();
    var type = $("#type").val();

    $(".char").css("height", "0px");

    if("NETWORK_DRAMA" == category){
        if(type == "WEEK") {
            $("#network_drama").show();
            $("#two_week_show_count_pc").css("height","400px");
            $("#drama_count_pc").css("height","400px");
            $("#network_drama_platform_count").css("height","400px");
            $("#network_drama_platform_pc").css("height","400px");

            $.ajax({
                type: 'GET',
                url: '/report_data/find?category=NETWORK_DRAMA&type=WEEK',
                async: false,
                success: function (data) {
                    networkDramaWeekBaseData(data.drama_base_data,data.on_billboard_drama_count_pc, data.network_drama_platform_count_pc);
                    findShowCountAndPc(data.on_billboard_drama_count_pc,'drama_count_pc');
                    findShowCountAndPc(data.drama_base_data.two_week_show_count_pc,'two_week_show_count_pc');
                    networkDramaPlatformCount(data.network_drama_platform_count_pc);
                    networkDramaPlatformPc(data.network_drama_platform_count_pc);
                }
            });
        }else if(type == "MONTH") {
            $("#drama-month").show();
            $("#new_drama_month_count_pc").css("height","400px");
            $("#on_billboard_drama_count_pc").css("height","400px");
            $("#single_and_many_count").css("height","400px");
            $("#platform_month_drama_counts_contrast").css("height","400px");
            $("#platform_month_drama_pc_contrast").css("height","400px");
            $("#new_drama_type_pc").css("height","400px");
            $("#new_drama_plot_pc").css("height","400px");

            $.ajax({
                type: 'GET',
                url: '/report_data/find?category=NETWORK_DRAMA&type=MONTH',
                async: false,
                success: function (data) {
                    networkDramaMonthBaseData(data.drama_last_month_data,data.drama_last_month_data_by_platform,data.drama_about_themename);
                    newDramaShowCountAndPc(data.new_drama_count_pc);
                    onBillboardDramaCountsAndPc(data.on_billboard_drama_counts_and_pc);
                    newDramaFirstTable(data.new_drama_first_table);
                    singleAndManyCount(data.single_and_many_platfrom_counts);
                    ereryPlatformPlaycountsTop1(data.every_platform_playcounts_top1);
                }
            });
        }
    } else if ("NETWORK_VARIETY" == category) {
        if (type == "WEEK") {
            $("#variety").show();
            $("#variety_count_pc").css("height", "400px");
            $("#on_billboard_variety_two_week_diff").css("height", "400px");
            $("#on_billboard_variety_two_week_diff_pc").css("height", "400px");
            $.ajax({
                type: 'GET',
                url: '/report_data/find?category=NETWORK_VARIETY&type=WEEK',
                async: false,
                success: function (data) {
                    findShowCountAndPc(data.on_billboard_variety_count_pc, 'variety_count_pc');
                    onBillboardVarietyTwoWeekDiff(data.on_billboard_variety_two_week_diff);
                    onBillboardVarietyTwoWeekDiffPc(data.on_billboard_variety_two_week_diff);
                    onBillboardVarietyWeekBillboard(data.on_billboard_variety_week_billboard);
                    networkVarietyBaseData(data.variety_base_data, data.on_billboard_variety_count_pc, data.on_billboard_variety_two_week_diff);

                }
            });
        } else if (type == "MONTH") {
            $("#variety-month").show();

            $("#variety_month_count_pc").css("height", "400px");
            $("#new_variety_pc_distribution").css("height", "400px");
            $("#on_billboard_last_month_variety_count").css("height", "400px");
            $("#on_billboard_last_month_variety_pc").css("height", "400px");
            $("#single_variety_platform_count").css("height", "400px");
            $("#single_variety_platform_pc").css("height", "400px");
            $("#variety_theme_count").css("height", "400px");
            $("#variety_theme_pc").css("height", "400px");

            $.ajax({
                type: 'GET',
                url: '/report_data/find?category=NETWORK_VARIETY&type=MONTH',
                async: false,
                success: function (data) {
                    networkVarietyMonthBaseData(data.variety_last_month_date,data.on_billboard_variety_count_pc,data.new_variety_pc_distribution,data.on_billboard_last_month_variety_count_pc,data.single_variety_platform_count_pc, data.variety_theme_count_pc,data.vatirty_last_month_date_by_platform,data.vatirty_about_theme_name,data.max_platform_in_variety_playcounts_top10);
                    findShowCountAndPc(data.on_billboard_variety_count_pc, 'variety_month_count_pc');
                    newVarietyPcDistribution(data.new_variety_pc_distribution);
                    newVarietyFirstVV(data.new_variety_first_vv);
                    onBillboardLastMonthVarietyCount(data.on_billboard_last_month_variety_count_pc);
                    onBillboardLastMonthVarietyPc(data.on_billboard_last_month_variety_count_pc);
                    singleVarietyPlatformCount(data.single_variety_platform_count_pc);
                    singleVarietyPlatformPc(data.single_variety_platform_count_pc);
                    varietyThemeCount(data.variety_theme_count_pc);
                    varietyThemePc(data.variety_theme_count_pc);


                }
            });
        }
    } else if( category == "NETWORK_MOVIE") {
        if (type = "WEEK"){
            $("#network-movie-week").show();
            $("#iqiyi_week_alone_first_vv").css("height", "400px");
            $("#youku_week_alone_first_vv").css("height", "400px");
            $("#tengxun_week_alone_first_vv").css("height", "400px");
            $("#many_week_alone_first_vv").css("height", "400px");
            $("#net_Movie_Playcount_Top10").css("height","400px");
            $.ajax({
                type: 'GET',
                url: '/report_data/find?category=NETWORK_MOVIE&type=WEEK',
                async: false,
                success: function (data) {
                    networkMovieBaseData(data.network_movie_base_data);
                    weekAloneFirstVV(data.iqiyi_first_vv, 'iqiyi_week_alone_first_vv',0);
                    weekAloneFirstVV(data.youku_first_vv, 'youku_week_alone_first_vv',1);
                    weekAloneFirstVV(data.tengxun_first_vv, 'tengxun_week_alone_first_vv',3);
                    weekAloneFirstVV(data.many_first_vv, 'many_week_alone_first_vv',5);
                }
            });

        } else if (type == "MONTH") {

        }
    }
});


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