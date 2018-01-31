function myCheck() {
    	//双重校验
        var showName = $("#showName").val().trim();
        var category = $("#categorySelect").val().trim();
        var time = $("#releaseDate").val();
        if(!showName){
        	toastr.warning("剧名不能为空!");
        	return false;
        }
        if(!category){
        	toastr.warning("分类选项不能为空！");
        	return false;
        }
        if(!time) {
        	toastr.warning("上线日期不能为空！");
            return false;
        }
        return validateCnSymbol(showName);
    };
    function ValidateValue(textbox) {
        var textboxvalue = textbox.value;
        var index = textboxvalue.length - 1;

        var s = textbox.value.charAt(index);
        var reg = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/;
        if(reg.test(s)){
//            toastr.warning("不允许输入中文符号");
            s = textboxvalue.substring(0, index);
            textbox.value = s;
        }
    };
    function validateCnSymbol(str){
    	var reg = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/;
    	for(var i=0;i<str.length;i++){
    		var s = str.charAt(i);
    		if(reg.test(s)){
    			toastr.warning("["+str+"]中含有中文字符("+s+"),请删除后再提交!");
    			return false;
    		}
    	}
    	return true;
    }