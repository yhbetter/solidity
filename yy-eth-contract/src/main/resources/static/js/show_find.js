var platforms = {
    "0": "多平台",
    "1": "腾讯视频",
    "2": "爱奇艺",
    "3": "优酷",
    "4": "土豆",
    "5": "搜狐视频",
    "6": "乐视视频",
    "7": "芒果TV",
    "8": "响巢看看",
    "9": "风行",
    "10": "56网",
    "11": "PPTV聚力",
    "12": "豆瓣电影",
    "13": "百度视频",
    "14": "360新闻",
    "15": "微博搜索",
    "16": "搜狗微信",
    "17": "官方微博",
    "18": "官方贴吧",
    "19": "百度视频搜索",
    "20": "微指数",
    "21": "淘米",
    "22": "酷米",
    "23": "A站",
    "24": "B站",
    "25": "百度知乎搜索",
    "100": "优酷土豆",
};

var vue = new Vue({
    el: '#body-main',
    data: {
        list: [],
        all: 0, //总页数
        cur: 1, //当前页码
    },
    computed: {
        indexs: function (index) {
            var left = 1;
            var right = this.all;
            var ar = [];
            if (this.all >= 11) {
                if (this.cur > 5 && this.cur < this.all - 4) {
                    left = this.cur - 5;
                    right = this.cur + 4;
                } else {
                    if (this.cur <= 5) {
                        left = 1;
                        right = 10;
                    } else {
                        right = this.all;
                        left = this.all - 9;
                    }
                }
            }
            while (left <= right) {
                ar.push(left);
                left++;
            }
            return ar;
        },
        showLast: function () {
            if (this.cur == this.all) {
                return false
            }
            return true
        },
        showFirst: function () {
            if (this.cur == 1) {
                return false
            }
            return true
        },
    },
    methods:{
        findList: function () {
            var code = $('#searchInput').val();
            var _this = this;
            $.get(
                "/show/list/" + code,
                function (data) {
                	if(data.code==0){
                		data = JSON.parse(data.data);
                        _this.list.splice(0, _this.list.length);
                        _this.all = 0;
                        _this.cur = 1;
                        for (var i = 0; i < data.length; i+=10){
                            _this.all ++;
                            var tableList = [];
                            for (var j = 0; j < 10 && i + j < data.length; j ++){
                                var show = data[i + j];
                                show.platform = platforms[show.platformId];
                                tableList.push(show);
                            }
                            _this.list.push(tableList);
                        }
                	}else{
                		alert(data.msg);
                	}
                }
            );
        },
        detailUrl: function (linkedId) {
            return "http://d.guduomedia.com/m/detail#show_id=" + linkedId;
        }
    }
});