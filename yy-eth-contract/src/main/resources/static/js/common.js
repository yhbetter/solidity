/**
 * Created by xiaoyun on 2016/10/9.
 */
function date_format(date, fmt) {

    if (date.getFullYear() == 1970) {
        return "";
    }

    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
        "H+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[date.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

function getCategory(category) {
    if (category == "NETWORK_MOVIE") {
        return "网络大电影";
    } else if (category == "NETWORK_DRAMA") {
        return "网络剧";
    } else if (category == "NETWORK_VARIETY") {
        return "网络综艺";
    } else if (category == "TV_DRAMA") {
        return "电视剧";
    } else if (category == "TV_VARIETY") {
        return "电视综艺";
    } else if (category == "MOVIE") {
        return "院线电影";
    } else if (category == "DOCUMENTARY") {
    	return "纪录片";
    }
    else {
        return category;
    }
}

function getAdaptedFrom(adapted) {
    if (adapted == "ANIME") {
        return "动漫";
    } else if (adapted == "FICTION") {
        return "小说";
    } else if (adapted == "COMIC_BOOK") {
        return "漫画";
    } else if (adapted == "GAME") {
        return "游戏";
    } else {
        return adapted;
    }
}

function getClassify(classify) {
    if (classify == "WECHAT_ARTICLE") {
        return "微信文章";
    } else if (classify == "HAOSOU_INDEX") {
        return "360指数";
    } else if (classify == "BAIDU_INDEX") {
        return "百度指数";
    } else if (classify == "TOUTIAO") {
        return "头条";
    } else if (classify == "WEIBO_INDEX") {
        return "微博指数";
    } else if (classify == "WECHAT_INDEX") {
        return "微信指数";
    } else if (classify == "BAIDU_VIDEO") {
        return "百度视频搜索";
    } else if (classify == "HAOSOU_NEWS") {
        return "360新闻搜索";
    } else if (classify == "BAIDU_TIEBA") {
        return "百度贴吧";
    } else if (classify == "BAIDU_NEWS") {
        return "百度新闻";
    } else if (classify == "WEIBO_SEARCH") {
        return "微博搜索";
    } else if (classify == "SOUGOUWECHAT_SEARCH") {
        return "搜狗微信搜索";
    }
    else {
        return classify;
    }
}


function to_black(value) {
    if (value == null || value == "null" || value == undefined) {
        return "";
    } else {
        return value;
    }
}