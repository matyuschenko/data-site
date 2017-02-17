$(window).on('load', function () {
    $.getJSON("/data/sources.json", function (sources) {
        showSources(sources);
    })
})

function showSources(sources) {
    var container = $('.sources');
    $(sources).each(function(i, s) {
        var source = $('div').html(s['description_eng']);
        container.append(source);
    });
}