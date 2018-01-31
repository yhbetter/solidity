/**
 * Created by jack on 2017/2/21.
 */
var actorListDialog;
$(function () {
    $("form").validate();
});

$("#day").datetimepicker({
    format: 'yyyy-mm-dd',
    autoclose: true,
    todayBtn: true,
    keyboardNavigation: true,
    language: 'cn', minView: 2
});

var nameInput;
$(".check_name").blur(function () {
    var _this = $(this);
    nameInput = _this;
    var actorName = $(this).val();
    if(actorName==""||actorName==null){
        return;
    }
    $.ajax({
        type: 'get',
        url: '/actor/queries/' + actorName,
        success: function (data) {
            if(data.code!=undefined){
                alert(actorName+"未找到！请先录入")
            }else if (data.length == 1){
                var actorId = data[0].actorId;
                _this.parent().parent().find('.actor_id').val(actorId);
            }else{
                actorListDialog = new ActorListDialog();
                actorListDialog.init(data);
                actorListDialog.that.modal('show');
            }
        }
    })
});

var ActorListDialog  = function () {
    this.that = $('#select_actor_dialog');
    this.addBtn = $('.add_btn');
    this.listTable = $('#actor_list_table');
};

ActorListDialog.prototype = {
    init : function (data) {
        this.listTable.html('');
        for (var i = 0; i < data.length; i++) {
            var actor = data[i];
            var gender = "男";
            if (actor.gender == 1) {
                gender = "女";
            }
            var html = [];
            html.push('<tr class="form-group">');
            html.push('<td class="col-sm-2 actor_id">' + actor.actorId + '</td>');
            html.push('<td class="col-sm-2"><a href="/actor/edit_show/' + actor.actorId + '" target="_blank">' + actor.name + '</a></td>');
            html.push('<td class="col-sm-2">' + gender + '</td>');
            html.push('<td class="col-sm-2">' + actor.birthdayInt + '</td>');
            html.push('<td class="col-sm-2"><button class="btn btn-primary btn-sm add_actor">添加</button></td>');
            html.push('</tr>');
            this.listTable.append(html.join());
            this.listener();
        }
    },
    listener : function () {
        $('.add_actor').on('click', function () {
            var _this = $(this);
            var actorId = _this.parent().parent().find('.actor_id').text();
            nameInput.parent().parent().find('.actor_id').val(actorId);
            actorListDialog.that.modal('hide');
        });
    }
}

