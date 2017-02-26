var lang = 'en';

$(window).on('load', function () {
    $.getJSON("/data/locale.json", function (locale) {
        addLabels(locale);
    });

    $.getJSON("/data/sources.json", function (sources) {
        showSources(sources);

        $('.sources__search').on('keyup', function(event) {
            searchSources(event, sources);
        });
    });

});

function addLabels(locale) {
    for (var selector in locale[lang]) {
        $(selector).html(locale[lang][selector]);
    }
}

function showSources(sources) {
    var container = $('.sources');

    container.html('');

    $(sources).each(function(i, s) {
        var source = $('<div>').addClass('source'),
            countries,
            languages,
            spheres,
            examples,
            tags;

        $('<h4>').addClass('source__header').html(s['name_' + lang]).appendTo(source);
        $('<a>').addClass('source__link').attr('href', s['url']).html(s['url']).appendTo(source);
        $('<p>').addClass('source__description').html(s['description_' + lang]).appendTo(source);
        countries = $('<ul>').addClass('source__countries').appendTo(source);
        languages = $('<ul>').addClass('source__languages').appendTo(source);
        $('<span>').addClass('source__period').html(s['period']).appendTo(source);
        $('<span>').addClass('source__machine-readable_' + s['machine_readability']).appendTo(source);
        spheres = $('<ul>').addClass('source__spheres').appendTo(source);
        examples = $('<ul>').addClass('source__examples').appendTo(source);
        tags = $('<ul>').addClass('source__tags').appendTo(source);

        $(s['countries']).each(function (i, c) {
            $('<li>').addClass('source__country').html(c).appendTo(countries);
        });

        $(s['languages']).each(function (i, c) {
            $('<li>').addClass('source__language').html(c).appendTo(languages);
        });

        $(s['spheres']).each(function (i, c) {
            $('<li>').addClass('source__sphere').html(c).appendTo(spheres);
        });

        $(s['examples' + lang]).each(function (i, c) {
            $('<li>').addClass('source__example').html(c).appendTo(examples);
        });

        $(s['tags']).each(function (i, c) {
            $('<li>').addClass('source__tag').html(c).appendTo(tags);
        });

        container.append(source);
    });
}

function searchSources(event, sources) {
    query = event.target.value;
    if (query == '') {
        showSources(sources);
    } else {
        filteredSources = [];
        for (var i = 0; i < sources.length; i++) {
            var sourceString = JSON.stringify(sources[i]).toLowerCase();
            if (sourceString.indexOf(query) != -1) {
                filteredSources.push(sources[i])
            }
        }
        showSources(filteredSources);
    }
}