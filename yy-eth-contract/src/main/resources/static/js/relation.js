
var csrf = $("#csrf").val();

// zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
var setting = {
    view: {
        addHoverDom: addHoverDom,
        removeHoverDom: removeHoverDom,
        selectedMulti: false
    },
    check: {
        enable: false
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    edit: {
        enable: true
    },
    async: {
        enable: true,
        url: "/relation/node",
        autoParam: ["id", "category"],
        type: "get"
    },
    callback: {
        onRename: zTreeOnRename,
        onRemove: zTreeOnRemove,
        beforeAsync: zTreeBeforeAsync
    }
};
var zNodes = [
    {
        id:0,
        name:"网络剧",
        category:"NETWORK_DRAMA_PARENT",
        isParent:true
    },
    {
        id:0,
        name:"网络大电影",
        category:"NETWORK_MOVIE_PARENT",
        isParent:true
    },
    {
        id:0,
        name:"网络综艺",
        category:"NETWORK_VARIETY_PARENT",
        isParent:true
    },
    {
        id:0,
        name:"电视剧",
        category:"TV_DRAMA_PARENT",
        isParent:true
    },
    {
        id:0,
        name:"国漫",
        category:"ANIME_PARENT",
        isParent:true
    }
];

var zTreeObj;

$(document).ready(function(){
    zTreeObj = $.fn.zTree.init($("#tree"), setting, zNodes);
});

var newCount = 1;
function addHoverDom(treeId, treeNode) {

    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='add node' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $("#addBtn_"+treeNode.tId);

    if (btn) btn.bind("click", function(){
        if(treeNode.level == 1){
            alert("不允许在此处添加");
            return false;
        }
        if(treeNode.level >= 4 && (treeNode.category == "ACTOR" || treeNode.category == "DIRECTOR")){
            alert("不允许继续添加");
            return false;
        }
        if(treeNode.category != "ACTOR" && treeNode.category != "DIRECTOR"){
            if(treeNode.level >= 3){
                alert("不允许继续添加");
                return false;
            }
        }

        var zTree = $.fn.zTree.getZTreeObj("tree");
        var tempNodeName = treeNode.name + (newCount++);

        var relation = $.parseJSON(addNode(tempNodeName,treeNode.category,treeNode.id, treeNode.pId));
        var node = {id:relation.id, pId:treeNode.id, name:tempNodeName, isParent:true, category:treeNode.category.replace("_PARENT","") };
        zTree.addNodes(treeNode, node);
        zTree.refresh();
        // return false;
    });
}

function addNode(name, category, categoryId, pid) {
    var relation;
    if(pid == null){
        pid = 0;
    }
    $.ajax({
        type: 'POST',
        url: '/relation/node',
        data: {name: name, category: category, id: categoryId, parentId: pid, _csrf: csrf},
        async: false,
        success: function (data) {
            relation = data;
        }
    });
    return relation;
}

function removeHoverDom(treeId, treeNode) {
    $("#addBtn_"+treeNode.tId).unbind().remove();
}

function zTreeOnRename(event, treeId, treeNode, isCancel) {

    $.ajax({
        type: 'PUT',
        url: '/relation/node',
        data: {name: treeNode.name, id: treeNode.id, _csrf: csrf},
        async: false,
        success: function (relation) {
            return relation;
        }
    });

}

function zTreeOnRemove(event, treeId, treeNode) {
    delNode(treeNode.id);
    console.log(treeNode.tId + ", " + treeNode.name);
}

function zTreeBeforeAsync(treeId, treeNode) {
    if(treeNode.id == undefined){
        alert("id 加载失败,请刷新");
        return false;
    }
}


function delNode(id) {
    $.ajax({
        type: 'POST',
        url: '/relation/node/del/' + id,
        data: {_csrf: csrf},
        async: false,
        success: function (data) {
        }
    });
}