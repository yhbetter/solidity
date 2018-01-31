$(function () {
});

$('#words').tagEditor({
    placeholder: 'Enter tags ...',
    initialTags: [
        "她们",
        "把",
        "自己",
        "恋爱",
        "作为",
        "终极",
        "目标",
        "有了",
        "爱人",
        "便什么",
        "都",
        "不要了",
        "对社会",
        "作不了",
        "贡献",
        "人生",
        "价值",
        "最少"
    ]
    

});
$("#next").click(function () {
    var tags = $('#words').tagEditor('getTags')[0].tags;

    for (var i = 0; i < tags.length; i++) {
        console.log(tags[i]);
    }
});






