//tag :http://vitalets.github.io/x-editable/docs.html
+(function($){

    'use strict';
    Date.prototype.format = function(format){
        var o = {
            "M+" : this.getMonth()+1, //month
            "d+" : this.getDate(), //day
            "h+" : this.getHours(), //hour
            "m+" : this.getMinutes(), //minute
            "s+" : this.getSeconds(), //second
            "q+" : Math.floor((this.getMonth()+3)/3), //quarter
            "S" : this.getMilliseconds() //millisecond
        }

        if(/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }

        for(var k in o) {
            if(new RegExp("("+ k +")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
            }
        }
        return format;
    }

    var r = {
        defalutDay : new Date().format('yyyy-MM-dd'),
        rowclass : ['noclass','success','active','warning','danger','info'],
        draw : function(){
            this.redList()
                .dateInit()
                .btnInit()
                .commentInit();
            return this;
        },
        redList : function(day,category){
            var that = this;
            day = day||that.getBeforDate().format('yyyy-MM-dd');
            category = category || that.getCategory();
            $.get('/billboard/redlist?day='+day+'&category='+category).done(function(data){
                if (!data.status) {
                    data = _.sortBy(data, function(t){
                        return -t.index;
                    });
                    that.makeTable(data);
                }
            })
            return this;
        },
        makeTable : function(data){
            var that = this;
            var html = [];
            $.each(data,function(i,t){
                var day = t.day,
                    index = t.index,
                    ordinal = t.ordinal,
                    platform = t.platform,
                    rise = t.rise,
                    showName = t.showName;
                html.push([
                    '<tr class='+that.rowclass[parseInt(6 * Math.random())]+'>',
                    '    <td>'+ordinal+'</td>',
                    '    <td><a href="javascript:;" class="g-edit-table" data-pk="'+t.id+'" data-type="text" data-name="index" data-title="指数">'+index+'</a></td>',
                    '    <td>'+platform+'</td>',
                    '    <td>'+rise+'</td>',
                    '    <td>'+showName+'</td>',
                    '</tr>'
                ]);
            })
            $(".g-tbody").empty().append(html.join(''));
            that.tableUp.edited();
        },
        dateElement : $("#searchInput"),
        dateInit : function () {
            this.dateElement.datetimepicker({
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayBtn: true,
                keyboardNavigation: true,
                language: 'cn', minView: 2,
                todayHighlight: true,
                startDate: '-7d',
                endDate: '+0d'
            });
            this.setDate();
            return this;
        },
        setDate : function (date) {
            this.dateElement.val(this.getBeforDate().format('yyyy-MM-dd'));
            return this.dateElement;
        },
        btnInit : function() {
            var that = this;
            $("#searchBtn").click(function(){
                that.redList(that.getDay(),that.getCategory())
            });
            return this;
        },
        commentInit : function(){
            return this;
        },
        tableUp : {
            edited : function() {
                var that = this;
                $("#redList .g-edit-table").editable({
                    url: 'redlist',
                    params: function(params) {
                        //originally params contain pk, name and value
                        //params.day = that.getDay();
                        params.id = params.pk;
                        params[params.name] = params.value;
                        params._csrf = getCsrf();
                        return params;
                    },
                    validate: function(value) {
                        if($.trim(value) == '') {
                            return 'This field is required';
                        }
                    },
                    success: function(response, newValue) {
                        if(!response.success) return response.msg;
                    }
                });
            }
        },
        getDay : function () {
            return $('#searchInput').val();
        },
        getCategory : function () {
        	return $("#categorySelect").val();
        },
        getBeforDate : function () {
            var curDate = new Date();
            var preDate = new Date(curDate.getTime() - 24*60*60*1000);  //前一天
            return preDate;
        },
        getAfterDate : function () {
            var curDate = new Date();
            var nextDate = new Date(curDate.getTime() + 24*60*60*1000);
            return nextDate;
        }
    }


    function getCsrf() {
        return $('#csrf').val();
    }
    
    var CategoryMap = {
        'NETWORK_DRAMA' : '网络剧',
        'NETWORK_MOVIE' : '网络大电影',
        'NETWORK_VARIETY' : '网络综艺',
        'TV_VARIETY' : '电视综艺',
        'TV_DRAMA' : '电视剧',
        'ANIME' : '动漫'
    }

    var GDI = {
        girdElement : $('#gdiGrid'),
        dateElement : $("#searchGdiDate"),
        searchNameElement : $('#searchName'),
        grid : function(){
            var that = this;
            this.girdElement.datagrid({
                url: '/gdi/paging',
                data: false,
                autoload: true,
                paramsMapping: {
                    page: "page",
                    paging: "rows",
                },
                parse: function (data) {
                    if ($.type(data) === 'string') {
                        return JSON.parse(data);
                    } else {
                        data.data = data.content;
                        data.total = data.totalElements;
                        return data;
                    }
                },
                remoteSort: true,
                idField: 'id',
                rownumbers: true,
                col: gdiColums(),
                onBefore: function() {
                    //$eventsInfo.html( "Datagrid loading ..." );
                    //$eventsArea.hide();
                },
                onRowData: function (data, num, $tr) {
                    if ( num <= 9) {
                        $tr.addClass( "warning" );
                    }
                    var query = $('#gdiGrid').datagrid('datagrid')._params.name;
                    var res = data.name;
                    data.tname = that.highlighter(res,query);
                    //$tr.find('td:eq(1)').html(that.highlighter(res,query));
                },
                onComplete: function (){
                    //$eventsArea.show();
                    $("#gdiList tr").each(function(i,o){
                        var tr = $(o);
                        var id = tr.find("td:eq(0)").text();
                        var td2 = tr.find("td:eq(2)");
                        td2.html("<a href='javascript:;' class='g-edit-table' data-pk='"+id+"' data-name='newGdi'>"+td2.text()+"</a>");
                    })
                    $("#gdiList a.g-edit-table").editable({
                        url: '/gdi/',
                        params: function(params) {
                            params.id = params.pk;
                            params[params.name] = params.value;
                            params._csrf = getCsrf();
                            return params;
                        },
                        validate: function(value) {
                            if($.trim(value) == '') {
                                return '不能为空';
                            }
                        },
                        success: function(response, newValue) {
                            if(!!response.code){
                                toastr.error(response.msg);
                            }
                            if (response.gdi == newValue) {
                                toastr.info("success");
                            }
                        }
                    });
                    bindShowBaseDataEvent();
                },
                onData : function (){

                },
                attr: {"class": "table table-bordered table-condensed"},
                sorter: "bootstrap",
                pager: "bootstrap",
                paramsDefault: {
                    name: "",
                    day: that.getBeforDate().format('yyyy-MM-dd'),
                    category:"NETWORK_DRAMA",
                    rows:30,
                    _csrf:getCsrf()
                },
            });
            return this;
        },
        dateInit : function () {
            this.dateElement.datetimepicker({
                format: 'yyyy-mm-dd',
                autoclose: true,
                todayBtn: true,
                keyboardNavigation: true,
                language: 'cn', minView: 2,
                todayHighlight: true,
                startDate: '-7d',
                endDate: '+0d'
            });
            this.setDate();
            return this;
        },
        setDate : function (date) {
            this.dateElement.val(this.getBeforDate().format('yyyy-MM-dd'));
            // this.dateElement.datepicker('setDate',new Date());
            return this.dateElement;
        },
        searchBtn : function () {
            var that = this;
            $("#searchGdiBtn").on({
                click: function(){
                    that.search({
                        'name' : that.searchNameElement.val(),
                        'day' : that.dateElement.val()
                    });
                }
            });
            return this;
        },
        guess : function () {
            var that = this;
            $('#searchName').autocomplete({
                delay: 700,
                source: function (query, process) {
                    var value = this.$element.val();
                    that.search({name:value})
                },
                formatItem: function (item) {
                    return item;
                },
                setValue: function (item) {
                    return {'data-value': item, 'real-value': item};
                }
            });
        },
        highlighter: function (item,query) {
            var that = this
            query = query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
            return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<strong style="color:#369;">' + match + '</strong>'
            })
        },
        search : function (sparam) {
            var $grid = this.girdElement.datagrid("datagrid");
            $grid._params.page = 1;
            $grid._params.rows = 20;
            $grid._params.name = sparam.name||this.searchNameElement.val();
            $grid._params.category = sparam.category||this.defaultCategory();
            $grid._params.day = sparam.day||this.dateElement.val();
            $grid._params._csrf = $("#csrf").val();
            $grid._params.query = sparam.query||'';
            this.girdElement.datagrid("fetch");
            return this;
        },
        getBeforDate : function () {
            var curDate = new Date();
            var preDate = new Date(curDate.getTime() - 24*60*60*1000);  //前一天
            return preDate;
        },
        getAfterDate : function () {
            var curDate = new Date();
            var nextDate = new Date(curDate.getTime() + 24*60*60*1000);
            return nextDate;
        },
        defaultCategory : function () {
            return $('div.category span.label-success').data('category');
        },
        category : function () {
            var that = this;
            $('div.category span.label').on({
                click : function () {
                    var $span = $(this);
                    var category = $span.data('category');
                    $span.siblings().removeClass('label-success').addClass('label-default')
                    $span.addClass('label-success')
                    that.search({
                        'category' : category
                    })
                }
            });
            return this;
        }
    }

    function gdiColums() {
        return [{
            field: "id",
            title: "Id",
            attrHeader: {
                "style": "text-align: center;",
                "nowrap": "nowrap"
            }
        }, {
            field: "tname",
            title: "Name",
            attrHeader: {
                "style": "text-align: center;",
                "nowrap": "nowrap"
            }
        }, 
        {
            field: "newGdi",
            title: "newGDI",
            sortable: true,
            attrHeader: {
                "class": "g-edit-table",
                "style": "text-align: center;",
                "nowrap": "nowrap"
            }
        }, {
            field: "rank",
            title: "Rank",
            sortable: true,
            attrHeader: {
                "style": "text-align: center;",
                "nowrap": "nowrap"
            }
        },{
            field: "category",
            title: "Category",
            attrHeader: {
                "class": "g-edit-table",
                "style": "text-align: center;",
                "nowrap": "nowrap"
            },
            render: function (data) {
                return CategoryMap[data.value];
            }
        }, {
            field: "topRank",
            title: "TopRank",
            sortable: true,
            attrHeader: {
                "class": "g-edit-table",
                "style": "text-align: center;",
                "nowrap": "nowrap"
            }
        }, 
        {
            field: "topGdi",
            title: "TopGdi",
            sortable: true,
            attrHeader: {
                "class": "g-edit-table",
                "style": "text-align: center;",
                "nowrap": "nowrap"
            }
        }, 
        {
            title: "操作",
            attrHeader: {"nowrap": "nowrap"},
            render: function (data) {
                var row = data.row;
                var html = '<span class="label label-success showBaseData" style="cursor:pointer" data-showName="'+row.name+'" data-showId="'+row.showId+'" data-day="'+row.day+'">基础数据</span>';
                return html;
            }
        }];
    };
    
    function bindShowBaseDataEvent(){
    	$(".showBaseData").on({
        	click:function(){
        		var showField = {
        			'playCountIncrease':'播放量',
        			'vipPlayCount':'vip播放量',
    				'baiduSearchIndex':'百度指数',
    				'weiboDataIndex':'微指数',
    				'doubanGradeIndex':'豆瓣评分',
    				'doubanComment':'豆瓣评论',
    				'wechatArticleNum':'微信文章数',
    				'commentCountIncrease':'评论增量',
    				'barrageIncrease':'弹幕增量',
    				'gdiSum':'新指数'
        		}
        		var that = $(this);
        		var showName = that.attr("data-showName");
        		var showId = that.attr("data-showId");
        		var day = that.attr("data-day");
        		if(!showId||!day){
        			toastr.warning("参数异常!请检查");
        			return;
        		}
        	    $.get("/billboard/gdi_show_base/find?showId="+showId+"&day="+day,
        	    function (data) {
        	        if (data.code == 0) {
        	        	console.log(data)
        	            var s = "<div><p style='color:#268cff;'>"+showName+"</p></div><table style='width:100%;' border='1'><tr><td>字段</td><td>字段值</td></tr>";
        	            var newGidSum = '';
        	        	$.each(data.data,function(i,o){
        	        		if(i==='gdiSum'){
        	        			newGidSum = "<tr><td>"+showField[i]+"</td><td style='color:red;'><em>"+o+"</em></td></tr>"
        	        		}else if(showField[i]){
        	            		s += "<tr><td>"+showField[i]+"</td><td>"+o+"</td></tr>";
        	            	}
        	            })
        	            s += newGidSum;
        	            s += "</table>";
        	            $("#gdiBaseDataBody").html(s);
        	            $("#gdiBaseDataBody td").css("text-align","center");
        	            $("#gdiBaseDataModal").modal('show');
        	        }else{
        	            toastr.error(data.msg);
        	        }
        	    });
        	}
        })
    }

    var  Toolkit = {
        element : $("div.toolkit"),
        handle : function () {
            var that = this;
            that.element.find('a').on({
                click : function () {
                    var $a = $(this);
                    if ($a.hasClass('redlist')){
                    	console.log("redlist");
//                        that.redlist($a);
                    }
                    if ($a.hasClass('refresh')){
                        that.refresh($a);
                    }
                    if($a.hasClass('gdiconfig')){
                    	that.gdiConfig($a);
                    }
                }
            });
            return this;
        },
        refresh : function ($a) {
        	r.redList().setDate();
        	GDI.search({name:''}).setDate();
        },
        gdiConfig : function ($a) {
        	$.get('/gdi/config/get?type=1').done(function (data) {
        		if(data.code==0){
        			var table = [];
        		    table.push('<table class="table table-bordered table-hover" id = "gdiConfigTable">');
        		    table.push('    <thead>');
        		    table.push('    <tr>');
        		    table.push('        <th>字段</th>');
        		    table.push('        <th>字段值</th>');
        		    table.push('    </tr>');
        		    table.push('    </thead>');
        		    table.push('    <tbody>');
        		    var aclass = ["active", "success", "warning", "danger", "info"];
        		    var this_show_class = "active";
        		    $.each(data.data, function (i, o) {
    		            //该条记录
    		            this_show_class = aclass[Math.floor((Math.random() * aclass.length))];
    		            if(i==='type'||i==='id'){
    		            	table.push('    <tr hidden>');
    		            }else{
    		            	table.push('    <tr>');
    		            }
    		            table.push('        <td class="' + this_show_class + '">' + i + '</td>');
    		            table.push('        <td class="' + this_show_class + '"><input class="form-control" data-pk="'+i+'" type="number" value="' + o + '"></td>');
    		            table.push('    </tr>');
        		    });
        		    table.push('    </tbody>');
        		    table.push('</table>');

        		    //初始化
                    $("#gdiConfigBody").html(table.join(''));
                    $("#gdiConfigModal").modal('show');
        		}else{
        			toastr.error(data.msg);
        		}
            })
        },
        redlist : function ($a) {
            var that = this;
            $.get('/gdi/top?top='+30).done(function (data) {
                var html = [];
                $.each(data,function(i,t){
                    var day = t.day,
                        index = t.index,
                        ordinal = t.ordinal,
                        platform = t.platform,
                        rise = t.rise,
                        showName = t.showName,
                        showId = t.showId;
                    html.push([
                        '<tr class="warning">',
                        '    <td>'+index+'</td>',
                        '    <td>'+ordinal+'</td>',
                        '    <td><a href="javascript:;" class="edit-table" data-pk="" data-type="text" data-name="platform" data-title="平台">'+platform+'</td>',
                        '    <td><a href="javascript:;" class="edit-table" data-pk="" data-type="text" data-name="rise" data-title="升降">'+rise+'</td>',
                        '    <td><a href="javascript:;" class="edit-table" data-pk="" data-type="text" data-name="showName" data-title="剧名">'+showName+'</a></td>',
                        '    <td style="display:none;">'+showId+'</td>',
                        '</tr>'
                    ]);
                })
                $("#table-modal .tbody").empty().append(html.join(''));
                that.edited();
                $('#myModal').modal("show");
            }).fail(function (data,res,c) {
                toastr.error(res,data.responseText)
            });
        },
        edited : function() {
            var that = this;
            $("#table-modal .edit-table").editable({
                params: function(params) {
                    params.id = params.pk;
                    params[params.name] = params.value;
                    params._csrf = getCsrf();
                    return params;
                },
                validate: function(value) {
                    if($.trim(value) == '') {
                        return 'This field is required';
                    }
                },
                success: function(response, newValue) {
                }
            });
        },
        export : function () {
            var that = this;
            $("#myModal a.export").click(function () {
                var datas = that.getAllTable();
                if (!datas) {
                    toastr.error('可能出了一点小问题，Table 没有获取到任何值，请联系技术!');
                    return false;
                }
                $.post('/billboard/redlists',{'redlists' : JSON.stringify(datas)})
                    .done(function (data,status,a) {
                        $('#myModal').modal("hide");
                        if(!data || data.length <= 1){
                            toastr.info('请确认是否已经存在榜单！');
                        } else if (typeof data === 'object') {
                            toastr.info("success");
                        } else {
                            window.alert(data)
                        }
                        r.redList().setDate();
                    })
                    .then(function (a,b,c) {
                    })
                    .catch(function (a,b,c) {
                    })
                    .fail(function (data,res,c) {
                        toastr.error(res,data.responseText)
                    });

            });
        },
        tdMap : {
            0 : 'index',
            1 : 'ordinal',
            2 : 'platform',
            3 : 'rise',
            4 : 'showName',
            5 : 'showId'
        },
        getAllTable : function () {
            var  that = this;
            var data = [];
            $('#table-modal .tbody').find('tr').each(function (i,tr) {
                var $tr = $(tr);
                var tr = {};
                $tr.find('td').each(function (j,td) {
                    var $td = $(td);
                    tr[that.tdMap[j]] = $td.text();

                })
                data.push(tr);
            })
            return data;
        }

    }

    r.draw();
    GDI.grid()
        .dateInit()
        .searchBtn()
        .category()
        .guess();

    Toolkit.handle()
        .export();
}(jQuery,function () {
    $(document).ajaxSend(function(elm, xhr, s){
        if (s.type == "POST") {
            xhr.setRequestHeader('x-csrf-token', $('#csrf').val());
        }
    });
    $("#saveBtn").on({
    	click:function(){
    		var rowData = {};
    		var hasErr = false;
    		$("#gdiConfigBody input").each(function(k,v){
    			if(!hasErr){
    				var field = $(v).attr("data-pk");
    				var value = $(v).val();
    				if(!value||isNaN(value)){
    					toastr.error("字段"+field+"非法，请检查!");
    					hasErr = true;
    				}
    				rowData[field] = value;
    			}
    		})
    		if(!hasErr){
    			$.ajax({
    				type : 'get',
    				url : '/gdi/config/update',
    				data : rowData,
    				dataType:"json",
    				contentType:"application/json",
    				success : function(data){
    					if (data.code == 0){
    						toastr.success("更改成功");
    						$('#gdiConfigModal').modal("hide");
    					}else{
    						toastr.error(data.msg);
    					}
    					return;
    				},error : function(){
    					toastr.error("网络错误，请举手");
    				}
    			});
    		}
    	}
    })
}()));


