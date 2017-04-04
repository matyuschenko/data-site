var lang;
var locale;

$(window).on('load', function () {
    var thanksMessage;

    $.getJSON("/data/locale.json", function (data) {

        locale = data;

        lang = QueryString.lang in locale ? QueryString.lang : 'en';

        if(window.location.hash && window.location.hash.substring(1) == 'success') {
            thanksMessage = lang == 'en' ? 'Thanks for your message!' : 'Спасибо за сообщение!';
            alert(thanksMessage);
            // window.location.replace('/?lang=' + lang);
        }

        if (lang != 'en') {
            addLabels(locale);
        }
    });

    $.getJSON("/data/sources.json", function (sources) {
        showSources(sources, locale);

        $('.sources__search').on('input', function() {
            var query = this.value.toLowerCase();
            searchSources(query, sources);
        });
    });

    popupsBehavior();

    $('.controls__icon_active').on('mouseover', function() {
        $(this).removeClass('controls__icon_active');
    });

});

function addLabels(locale) {
    for (var selector in locale[lang]['labels']) {
        $(selector).html(locale[lang]['labels'][selector]);
    }
    for (var selector in locale[lang]['placeholders']) {
        $(selector).attr('placeholder', locale[lang]['placeholders'][selector]);
    }
    document.title = locale[lang]['title'];
    $('meta[name=description]').attr('content', locale[lang]['description']);
}

function showSources(sources) {
    var container = $('.sources');

    container.html('');

    $(sources).each(function(i, s) {
        var source = $('<div>').addClass('source'),
            source__left,
            source__right,
            countries,
            languages,
            spheres,
            examples,
            tags;

        if (s['name_' + lang] == '' || s['description_' + lang] == '') {
            return;
        }

        source__left = $('<div>').addClass('source__left').appendTo(source);
        source__right = $('<div>').addClass('source__right').appendTo(source);

        $('<h3>').addClass('source__header').html(s['name_' + lang]).appendTo(source__left);
        countries = $('<ul>').addClass('source__countries').appendTo(source__left);
        $('<a>').addClass('source__link').attr({
            href: s['url'],
            target: '_blank'
        }).html(s['url']).appendTo(source__left);
        $('<p>').addClass('source__description').html(s['description_' + lang]).appendTo(source__left);
        $('<span>').addClass('source__period').html(s['period']).appendTo(source__left);
        $('<span>').addClass('source__machine-readable_' + s['machine_readability']).appendTo(source__left);
        spheres = $('<ul>').addClass('source__spheres').appendTo(source__left);

        examples = $('<ul>').addClass('source__examples').appendTo(source__right);
        tags = $('<ul>').addClass('source__tags').appendTo(source__right);

        $(s['countries'].split(';')).each(function (i, c) {
            var flag = $('<li>').addClass('source__country').appendTo(countries);

            $('<img>').attr({
                src: '/i/flag-' + c + '.png',
                alt: c,
                class: 'source__flag',
                title: locale[lang]['countries'][c]
            }).appendTo(flag);
        });

        $(s['spheres'].split(';')).each(function (i, c) {
            $('<li>').addClass('source__sphere').html(c).appendTo(spheres);
        });

        $('<p>').addClass('examples__label').html(locale[lang]['examples'] + ':').appendTo(examples);
        $(s['examples_' + lang].split(';')).each(function (i, c) {
            $('<li>').addClass('source__example').html(c).appendTo(examples);
        });

        $(s['tags'].split(';')).each(function (i, c) {
            $('<li>').addClass('source__tag').html(c).appendTo(tags);
        });

        container.append(source);
    });
}

function searchSources(query, sources) {
    var filteredSources;
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

function popupsBehavior() {
    $('.controls__control').on('click', function () {
        var buttonType = this.classList[1].split('controls__control_')[1];
        $('.popup-window_' + buttonType).toggleClass('popup-window_active');
    });

    $('.popup-window__background').on('click', function () {
        $('.popup-window').removeClass('popup-window_active');
    })
}

var QueryString = function () {
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
}();